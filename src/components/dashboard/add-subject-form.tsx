"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { useStudentData } from '@/hooks/use-student-data';
import type { Subject, SubjectStatus } from '@/lib/types';

// Schema remains consistent with your logic
const subjectSchema = z
  .object({
    name: z.string().min(1, 'Subject name is required.'),
    credits: z.coerce.number().min(1, 'Credits must be at least 1.'),
    marks: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.coerce.number().min(0).max(100).optional()
    ),
    status: z.enum(['PASS', 'RA', 'AAA', 'W', 'ABS']),
  })
  .refine(
    (data) => {
      if (
        data.status === 'PASS' &&
        (data.marks === undefined || data.marks === null)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Marks are required when status is PASS.',
      path: ['marks'],
    }
  );

type AddSubjectFormProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  studentData: ReturnType<typeof useStudentData>;
  semesterId: string;
  editingSubject: Subject | null;
};

const statuses: SubjectStatus[] = ['PASS', 'RA', 'AAA', 'W', 'ABS'];

export function AddSubjectForm({
  isOpen,
  setIsOpen,
  studentData,
  semesterId,
  editingSubject,
}: AddSubjectFormProps) {
  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      credits: 3, // Changed default to 3 (common standard)
      marks: undefined,
      status: 'PASS',
    },
  });

  const status = form.watch('status');
  const marks = form.watch('marks');

  // Clear marks if status changes from PASS
  useEffect(() => {
    if (status !== 'PASS' && marks !== undefined) {
      form.setValue('marks', undefined);
    }
  }, [status, marks, form]);

  // Reset form when dialog opens or editingSubject changes
  useEffect(() => {
    if (isOpen) {
      if (editingSubject) {
        form.reset({
          name: editingSubject.name,
          credits: editingSubject.credits,
          marks: editingSubject.marks,
          status: editingSubject.status,
        });
      } else {
        form.reset({
          name: '',
          credits: 3,
          marks: undefined,
          status: 'PASS',
        });
      }
    }
  }, [editingSubject, form, isOpen]);

  function onSubmit(values: z.infer<typeof subjectSchema>) {
    const subjectData = {
      ...values,
      marks: status === 'PASS' ? values.marks : undefined,
    };
    if (editingSubject) {
      studentData.updateSubject(semesterId, editingSubject.id, subjectData);
    } else {
      studentData.addSubject(semesterId, subjectData);
    }
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingSubject ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
          <DialogDescription>
            Enter the subject details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
            
            {/* Subject Name - Full Width */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS101 - Data Structures" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Split Row: Credits & Status */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Marks - Conditional Render */}
            {status === 'PASS' && (
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <FormLabel>Marks Obtained (0-100)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 85"
                        min={0}
                        max={100}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSubject ? 'Update Subject' : 'Add Subject'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
