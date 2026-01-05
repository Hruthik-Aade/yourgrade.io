"use client";

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import type { useStudentData } from '@/hooks/use-student-data';
import { SemesterView } from './semester-view';
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
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AiImportDialog } from './ai-import-dialog';
import { cn } from '@/lib/utils';

type GpaCalculatorProps = {
  studentData: ReturnType<typeof useStudentData>;
};

export function GpaCalculator({ studentData }: GpaCalculatorProps) {
  const [newSemesterName, setNewSemesterName] = useState('');
  const [isAddSemDialogOpen, setIsAddSemDialogOpen] = useState(false);
  const [isAiImportOpen, setIsAiImportOpen] = useState(false);

  const handleAddSemester = () => {
    if (newSemesterName.trim()) {
      studentData.addSemester(newSemesterName.trim());
      setNewSemesterName('');
      setIsAddSemDialogOpen(false);
    }
  };

  const defaultTab = studentData.semesters.length > 0 ? studentData.semesters[0].id : '';

  return (
    <Card className="flex min-h-[500px] flex-col border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>
              Academic Terms
            </CardTitle>
            <CardDescription>
              Manage your semester records and subject scores.
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button 
                variant="outline" 
                onClick={() => setIsAiImportOpen(true)}
                className="group border-primary/20 hover:border-primary/50 hover:bg-primary/5"
            >
              <Sparkles className="mr-2 size-4 text-primary transition-transform group-hover:scale-110" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent font-medium">
                AI Import
              </span>
            </Button>

            <Dialog open={isAddSemDialogOpen} onOpenChange={setIsAddSemDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="shadow-sm">
                  <Plus className="mr-2 size-4" />
                  Add Semester
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Semester</DialogTitle>
                  <DialogDescription>
                    Give your semester a distinct name (e.g., "Fall 2024" or "Semester 4").
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                    placeholder="e.g. Semester 1"
                    value={newSemesterName}
                    onChange={e => setNewSemesterName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSemester()}
                    className="col-span-3"
                    />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddSemester}>Next</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {studentData.semesters.length > 0 ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <div className="border-b px-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0 text-muted-foreground">
                    {studentData.semesters.map(semester => (
                    <TabsTrigger 
                        key={semester.id} 
                        value={semester.id}
                        className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-foreground"
                    >
                        {semester.name}
                    </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
            </div>
            
            <div className="p-4 sm:p-6">
                {studentData.semesters.map(semester => (
                <TabsContent key={semester.id} value={semester.id} className="mt-0 space-y-4">
                    <SemesterView semester={semester} studentData={studentData} />
                </TabsContent>
                ))}
            </div>
          </Tabs>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
                <BookOpen className="size-10 text-muted-foreground/50" />
            </div>
            <div className="max-w-md space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">No Semesters Added Yet</h3>
                <p className="text-muted-foreground">
                    Your academic journey starts here. Add your first semester manually or use our AI to import results from your portal instantly.
                </p>
            </div>
            <Button onClick={() => setIsAddSemDialogOpen(true)} className="mt-4" size="lg">
                <Plus className="mr-2 size-4" />
                Start by Adding a Semester
            </Button>
          </div>
        )}
      </CardContent>
      <AiImportDialog isOpen={isAiImportOpen} setIsOpen={setIsAiImportOpen} studentData={studentData} />
    </Card>
  );
}
