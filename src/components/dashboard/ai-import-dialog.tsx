
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Upload, FileCheck2, ScanText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  extractSemesterData,
  type ExtractedSubject,
} from '@/ai/flows/extract-semester-data';
import type { useStudentData } from '@/hooks/use-student-data';
import { AiImportReview } from './ai-import-review';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';

type AiImportDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  studentData: ReturnType<typeof useStudentData>;
};

export function AiImportDialog({
  isOpen,
  setIsOpen,
  studentData,
}: AiImportDialogProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedSubjects, setExtractedSubjects] = useState<
    ExtractedSubject[] | null
  >(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setExtractedSubjects(null);
    let result;

    try {
      if (activeTab === 'text') {
        if (!textInput.trim()) {
          toast({ variant: 'destructive', title: 'Input Required', description: 'Please paste some text.' });
          setIsLoading(false);
          return;
        }
        result = await extractSemesterData({ text: textInput });
      } else {
        if (!file) {
          toast({ variant: 'destructive', title: 'File Required', description: 'Please upload an image.' });
          setIsLoading(false);
          return;
        }

        const options = { maxSizeMB: 0.9, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const photoDataUri = await fileToDataUri(compressedFile);
        result = await extractSemesterData({ photoDataUri });
      }

      if (result.error) {
        toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
      } else if (result.subjects && result.subjects.length > 0) {
        setExtractedSubjects(result.subjects);
      } else {
        toast({ title: 'No Data Found', description: 'AI could not find any subjects.' });
      }

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong.' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setTextInput('');
      setFile(null);
      setExtractedSubjects(null);
      setIsLoading(false);
      setActiveTab('text');
    }, 300);
  };

  const handleImport = async (semesterName: string, subjects: ExtractedSubject[]) => {
    setIsLoading(true);
    try {
      const newSemester = await studentData.addSemester(semesterName, true);
      if (!newSemester || !newSemester.id) throw new Error('Failed to create semester.');
      
      const subjectPromises = subjects.map(subject => studentData.addSubject(newSemester.id, subject));
      await Promise.all(subjectPromises);

      toast({ title: 'Import Successful', description: `Added ${subjects.length} subjects to ${semesterName}.` });
      handleClose();

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* DYNAMIC SIZING:
         - If Extracting (Review Mode): max-w-4xl (Wide for table)
         - If Uploading (Input Mode): max-w-lg (Narrow for focus)
         - max-h-[95vh]: Prevents modal from ever going off-screen vertically
      */}
      <DialogContent 
        className={cn(
            "transition-all duration-300 ease-in-out gap-0 overflow-hidden flex flex-col max-h-[95vh]", 
            extractedSubjects ? "max-w-[95vw] sm:max-w-4xl h-[80vh] sm:h-auto" : "max-w-[95vw] sm:max-w-lg"
        )}
      >
        <DialogHeader className="px-6 pt-6 pb-2 space-y-2 flex-none">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {extractedSubjects ? <Sparkles className="size-5 text-primary" /> : <ScanText className="size-5" />}
            {extractedSubjects ? 'Review & Edit Results' : 'Import with AI'}
          </DialogTitle>
          <DialogDescription>
            {extractedSubjects 
                ? 'The AI has analyzed your data. Please verify the results below before importing.' 
                : 'Upload a grade sheet or paste text. We will format it for you.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
            {extractedSubjects ? (
            <AiImportReview
                subjects={extractedSubjects}
                onImport={handleImport}
                onCancel={() => setExtractedSubjects(null)}
                isLoading={isLoading}
            />
            ) : (
            <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                    <TabsTrigger value="image">Upload Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                    <Textarea
                        placeholder="Paste your semester results here..."
                        className="h-48 resize-none text-base"
                        value={textInput}
                        onChange={e => setTextInput(e.target.value)}
                        disabled={isLoading}
                    />
                </TabsContent>
                <TabsContent value="image" className="mt-4">
                    <div className={cn(
                        "flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                        file ? "border-primary/20 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                    )}>
                    {file ? (
                        <div className="flex flex-col items-center gap-3 p-4 text-center animate-in fade-in zoom-in-95">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                                <FileCheck2 className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setFile(null)}>
                                Remove File
                            </Button>
                        </div>
                    ) : (
                        <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                            </div>
                            <Input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
                        </label>
                    )}
                    </div>
                </TabsContent>
                </Tabs>
            </div>
            )}
        </div>

        {/* Footer only shows in the initial upload step. The Review component has its own buttons. */}
        {!extractedSubjects && (
             <DialogFooter className="px-6 pb-6 pt-2 flex-none">
                <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 size-4" />
                            Analyze Data
                        </>
                    )}
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
