
import { useState } from 'react';
import type { Semester, Subject } from '@/lib/types';
import type { useStudentData } from '@/hooks/use-student-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { AddSubjectForm } from './add-subject-form';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SemesterViewProps = {
  semester: Semester;
  studentData: ReturnType<typeof useStudentData>;
};

const statusDescriptions: Record<string, string> = {
    PASS: 'Pass',
    RA: 'Re-appear',
    AAA: 'Absent',
    W: 'Withdrawn',
    ABS: 'Absent',
};

export function SemesterView({ semester, studentData }: SemesterViewProps) {
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditSemOpen, setIsEditSemOpen] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState(semester.name);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
    setDropdownOpen(null); // Close dropdown when opening dialog
  };

  const handleAddNew = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const handleDeleteSemester = () => {
    studentData.deleteSemester(semester.id);
  };

  const handleUpdateSemesterName = () => {
    if (newSemesterName.trim() && newSemesterName.trim() !== semester.name) {
      studentData.updateSemesterName(semester.id, newSemesterName.trim());
    }
    setIsEditSemOpen(false);
  };

  // Helper for Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200";
      case 'RA': return "bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-200";
      case 'ABS': return "bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 border-orange-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <TooltipProvider>
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="overflow-hidden rounded-t-xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40%] font-semibold">Subject</TableHead>
              <TableHead className="w-[10%] text-center font-semibold">Credits</TableHead>
              <TableHead className="w-[10%] text-center font-semibold">Marks</TableHead>
              <TableHead className="w-[15%] text-center font-semibold">Status</TableHead>
              <TableHead className="w-[10%] text-center font-semibold">Grade</TableHead>
              <TableHead className="w-[10%] text-center font-semibold">Points</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semester.subjects.length > 0 ? (
              semester.subjects.map(subject => (
                <TableRow key={subject.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">
                    {subject.name}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {subject.credits}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {subject.marks ?? '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                            variant="outline"
                            className={cn("cursor-default px-2.5 py-0.5 font-medium border", getStatusColor(subject.status))}
                            >
                            {subject.status}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{statusDescriptions[subject.status] ?? 'Unknown Status'}</p>
                        </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    {subject.letterGrade}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {subject.gradePoint}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu 
                      open={dropdownOpen === subject.id} 
                      onOpenChange={(open) => setDropdownOpen(open ? subject.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(subject)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Subject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={e => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the subject "{subject.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => studentData.deleteSubject(semester.id, subject.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No subjects added yet. Click "Add Subject" to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between bg-muted/5">
        
        {/* Actions Left */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleAddNew} size="sm" className="shadow-sm">
            <Plus className="mr-2 size-4" /> Add Subject
          </Button>

           <Dialog open={isEditSemOpen} onOpenChange={setIsEditSemOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setNewSemesterName(semester.name)}>
                  Rename Semester
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Rename Semester</DialogTitle>
                  <DialogDescription>
                    Update the display name for this semester.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                    value={newSemesterName}
                    onChange={(e) => setNewSemesterName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateSemesterName()}
                    placeholder="e.g. Semester 2"
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleUpdateSemesterName}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                Delete Semester
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Semester?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete 
                  <strong> {semester.name} </strong> and all subject data associated with it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSemester} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* GPA Result Right */}
        <div className="flex items-center gap-4 rounded-lg border bg-background px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">Semester GPA</span>
          <div className="h-8 w-px bg-border" />
          <span className={cn(
              "text-2xl font-bold tracking-tight",
              semester.gpa >= 9 ? "text-emerald-600" : 
              semester.gpa >= 7 ? "text-blue-600" : "text-foreground"
          )}>
            {semester.gpa.toFixed(2)}
          </span>
        </div>

      </div>
      <AddSubjectForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        studentData={studentData}
        semesterId={semester.id}
        editingSubject={editingSubject}
      />
    </div>
    </TooltipProvider>
  );
}

