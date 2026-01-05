
'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, KeyRound, Trash2, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { doc, writeBatch, collection, getDocs } from 'firebase/firestore';

export function UserProfile() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const getInitials = () => {
    if (!user || !user.displayName) return null; // Return null when no name
    const names = user.displayName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Check your inbox',
        description: `We've sent a password reset link to ${user.email}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Delivery Failed',
        description: 'Could not send the reset email. Please try again later.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
  
    try {
      // 1. Delete all user data from Firestore
      const batch = writeBatch(firestore);
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const semestersCollectionRef = collection(userDocRef, 'semesters');
      const semestersSnapshot = await getDocs(semestersCollectionRef);

      for (const semesterDoc of semestersSnapshot.docs) {
        const subjectsCollectionRef = collection(semesterDoc.ref, 'subjects');
        const subjectsSnapshot = await getDocs(subjectsCollectionRef);
        subjectsSnapshot.forEach(subjectDoc => {
          batch.delete(subjectDoc.ref);
        });
        batch.delete(semesterDoc.ref);
      }
      
      batch.delete(userDocRef);
      await batch.commit();
      
      // 2. Delete Auth User
      await deleteUser(user);

      toast({
        title: 'Account Deleted',
        description: 'We are sorry to see you go. Your data has been removed.',
      });

      router.push('/');

    } catch (error: any) {
      console.error("Account deletion failed:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.code === 'auth/requires-recent-login'
          ? 'Security Check: Please log out and log back in to verify it is you.'
          : 'An unexpected error occurred.',
      });
      setIsDeleting(false);
    }
  };

  const initials = getInitials();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage
              src={user?.photoURL ?? ''}
              alt={user?.displayName ?? 'User'}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials ? initials : <User className="size-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none truncate">
              {user?.displayName ?? 'Student'}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" disabled>
                <User className="mr-2 size-4" />
                <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetPassword} className="cursor-pointer">
                <KeyRound className="mr-2 size-4" />
                <span>Change Password</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              className="text-destructive focus:text-destructive cursor-pointer group"
            >
              <Trash2 className="mr-2 size-4 group-hover:text-destructive" />
              <span>Delete Account</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all calculated GPAs. 
                <br /><br />
                <span className="font-semibold text-destructive">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount} 
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                disabled={isDeleting}
              >
                {isDeleting ? (
                    <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Deleting...
                    </>
                ) : (
                    'Delete Permanently'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-muted-foreground focus:text-foreground">
          <LogOut className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
