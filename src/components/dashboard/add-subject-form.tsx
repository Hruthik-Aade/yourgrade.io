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
    credits: z.coerce.number().min(0, 'Credits cannot be negative.'),
    maxMarks: z.coerce
      .number()
      .min(1, 'Max marks must be at least 1.')
      .max(1000, 'Max marks must be 1,000 or less.'),
    marks: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.coerce.number().min(0).max(1000).optional()
    ),
    status: z.enum(['PASS', 'RA', 'AAA', 'W', 'ABS']),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === 'PASS' &&
      data.credits > 0 &&
      (data.marks === undefined || data.marks === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Marks are required for credit-bearing PASS subjects.',
        path: ['marks'],
      });
    }

    if (data.marks !== undefined && data.marks > data.maxMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Marks cannot be greater than max marks.',
        path: ['marks'],
      });
    }
  });

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
      maxMarks: 100,
      marks: undefined,
      status: 'PASS',
    },
  });

  const status = form.watch('status');
  const marks = form.watch('marks');
  const maxMarks = form.watch('maxMarks');

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
          maxMarks: editingSubject.maxMarks ?? 100,
          marks: editingSubject.marks ?? undefined,
          status: editingSubject.status,
        });
      } else {
        form.reset({
          name: '',
          credits: 3,
          maxMarks: 100,
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

            {/* Split Row: Credits, max marks, and status */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Marks</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={1000} {...field} />
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
                      value={field.value}
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
                    <FormLabel>Marks Obtained</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={maxMarks === 50 ? 'e.g., 42' : 'e.g., 85'}
                        min={0}
                        max={maxMarks || 100}
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
