'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Icons } from '@/components/icons';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If finished loading and no user is found, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  // Loading / Splash Screen
  if (isUserLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Brand Logo */}
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icons.logo className="size-8 text-primary" />
          </div>

          {/* Loading Indicator */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold tracking-tight text-lg">yourgrade.io</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Verifying session...</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // If we have a user, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // Return null while redirecting to prevent flashing protected content
  return null;
}
