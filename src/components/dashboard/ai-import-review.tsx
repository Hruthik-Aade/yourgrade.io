'use client';

import { useState } from 'react';
import type { ExtractedSubject } from '@/ai/flows/extract-semester-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Subject } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

const STATUS_OPTIONS: Subject['status'][] = ['PASS', 'RA', 'AAA', 'W', 'ABS'];

type AiImportReviewProps = {
  subjects: ExtractedSubject[];
  onImport: (
    semesterName: string,
    subjects: ExtractedSubject[]
  ) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
};

export function AiImportReview({
  subjects,
  onImport,
  onCancel,
  isLoading,
}: AiImportReviewProps) {
  const [semesterName, setSemesterName] = useState('');
  const [editedSubjects, setEditedSubjects] =
    useState<ExtractedSubject[]>(subjects);
  const [showInfoPopup, setShowInfoPopup] = useState(true);

  const handleSubjectChange = (
    index: number,
    field: keyof ExtractedSubject,
    value: string | number | undefined
  ) => {
    const newSubjects = [...editedSubjects];
    // @ts-ignore
    newSubjects[index][field] = value;
    setEditedSubjects(newSubjects);
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = editedSubjects.filter((_, i) => i !== index);
    setEditedSubjects(newSubjects);
  };

  const handleImportClick = () => {
    if (semesterName.trim()) {
      onImport(semesterName.trim(), editedSubjects);
    }
  };

  return (
    <div className="relative flex h-full flex-col gap-4 animate-in fade-in">
      {/* 1. Header Input */}
      <div className="flex-none space-y-2">
        <Label htmlFor="semester-name" className="text-base font-semibold">
          Name this Semester
        </Label>
        <Input
          id="semester-name"
          placeholder="e.g. Semester 4"
          value={semesterName}
          onChange={(e) => setSemesterName(e.target.value)}
          className="h-11 text-lg"
          disabled={isLoading}
          autoFocus
        />
      </div>

      {/* 2. Sleek Floating Pill Popup */}
      {showInfoPopup && (
        <div className="absolute top-16 left-1/2 z-20 w-max max-w-[90%] -translate-x-1/2 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-full bg-foreground/95 px-4 py-2.5 text-sm font-medium text-background shadow-2xl backdrop-blur-md sm:px-5">
            <Sparkles className="size-4 flex-shrink-0 text-yellow-400 fill-yellow-400" />
            <span className="truncate">
              Found{' '}
              <span className="underline decoration-yellow-400/50 underline-offset-2">
                {editedSubjects.length} subjects
              </span>
              . Review below.
            </span>
            <div className="ml-2 h-4 w-px bg-background/20" />
            <button
                onClick={() => setShowInfoPopup(false)}
                className="ml-1 text-xs font-bold hover:text-primary-foreground/80"
            >
                OK
            </button>
            </div>
      </div>
      )}

      {/* 3. Results Container - This now takes up the remaining space and scrolls internally */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            {/* Desktop: Table view (hidden on small screens) */}
            <Table className="hidden min-w-[600px] sm:table">
              <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px] pl-6">Subject Name</TableHead>
                  <TableHead className="w-[80px] text-center">Credits</TableHead>
                  <TableHead className="w-[120px] text-center">Status</TableHead>
                  <TableHead className="w-[80px] text-center">Marks</TableHead>
                  <TableHead className="w-[50px] pr-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedSubjects.map((subject, index) => (
                  <TableRow
                    key={index}
                    className="group border-b-border/50 hover:bg-muted/30"
                  >
                    <TableCell className="pl-6 py-2">
                      <Input
                        value={subject.name}
                        onChange={(e) =>
                          handleSubjectChange(index, 'name', e.target.value)
                        }
                        disabled={isLoading}
                        className="h-9 min-w-[200px] border-transparent bg-transparent font-medium shadow-none hover:bg-muted focus-visible:bg-background focus-visible:ring-1 focus-visible:border-input"
                        placeholder="Subject Name"
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        value={subject.credits}
                        onChange={(e) =>
                          handleSubjectChange(
                            index,
                            'credits',
                            Number(e.target.value)
                          )
                        }
                        disabled={isLoading}
                        className="h-9 w-16 border-transparent bg-transparent text-center shadow-none hover:bg-muted focus-visible:bg-background focus-visible:ring-1 focus-visible:border-input"
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <Select
                        value={subject.status}
                        onValueChange={(val: Subject['status']) =>
                          handleSubjectChange(index, 'status', val)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger
                          className={cn(
                            'mx-auto h-9 w-24 border-transparent bg-transparent font-semibold shadow-none hover:bg-muted focus:ring-1 focus:ring-ring',
                            subject.status === 'PASS'
                              ? 'text-green-600'
                              : 'text-destructive'
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        value={subject.marks ?? ''}
                        onChange={(e) =>
                          handleSubjectChange(
                            index,
                            'marks',
                            e.target.value === ''
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        placeholder="-"
                        disabled={isLoading || subject.status !== 'PASS'}
                        className="h-9 w-16 border-transparent bg-transparent text-center shadow-none hover:bg-muted focus-visible:bg-background focus-visible:ring-1 focus-visible:border-input"
                      />
                    </TableCell>
                    <TableCell className="py-2 pr-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSubject(index)}
                        disabled={isLoading}
                        className="h-8 w-8 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Mobile: Card list view (visible on small screens) */}
            <div className="grid gap-4 sm:hidden px-1 py-1">
              {editedSubjects.map((subject, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-4 space-y-4">
                    {/* Subject Name */}
                    <div className="space-y-1">
                      <Label htmlFor={`name-${index}`}>Subject Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        disabled={isLoading}
                        className="h-10 text-base"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Credits */}
                      <div className="space-y-1">
                        <Label htmlFor={`credits-${index}`}>Credits</Label>
                        <Input
                          id={`credits-${index}`}
                          type="number"
                          value={subject.credits}
                          onChange={(e) => handleSubjectChange(index, 'credits', Number(e.target.value))}
                          disabled={isLoading}
                          className="h-10 text-center text-base"
                        />
                      </div>

                      {/* Status */}
                      <div className="space-y-1">
                        <Label htmlFor={`status-${index}`}>Status</Label>
                        <Select
                          value={subject.status}
                          onValueChange={(val: Subject['status']) => handleSubjectChange(index, 'status', val)}
                          disabled={isLoading}
                        >
                          <SelectTrigger id={`status-${index}`} className={cn(
                              'h-10 text-base',
                              subject.status === 'PASS' ? 'text-green-600' : 'text-destructive'
                          )}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Marks (Conditional) */}
                    {subject.status === 'PASS' && (
                        <div className="space-y-1 animate-in fade-in duration-300">
                            <Label htmlFor={`marks-${index}`}>Marks</Label>
                            <Input
                                id={`marks-${index}`}
                                type="number"
                                value={subject.marks ?? ''}
                                onChange={(e) => handleSubjectChange(index, 'marks', e.target.value === '' ? undefined : Number(e.target.value))}
                                disabled={isLoading}
                                placeholder="Required"
                                className="h-10 text-base"
                            />
                        </div>
                    )}
                  </CardContent>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubject(index)}
                    disabled={isLoading}
                    className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {editedSubjects.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground p-8">
                <p className="text-sm">No subjects remaining.</p>
                <Button variant="link" size="sm" onClick={onCancel}>
                    Start Over
                </Button>
                </div>
            )}
        </ScrollArea>
      </div>

      {/* 4. Footer */}
      <div className="flex flex-none flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-24"
        >
          Back
        </Button>
        <Button
          onClick={handleImportClick}
          disabled={
            isLoading || !semesterName.trim() || editedSubjects.length === 0
          }
          className="w-full shadow-lg shadow-primary/20 sm:w-auto"
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 size-4" />
          )}
          Confirm &amp; Import
        </Button>
      </div>
    </div>
  );
}

    