export type SubjectStatus = 'PASS' | 'RA' | 'AAA' | 'W' | 'ABS';

export type Subject = {
  id: string;
  name: string;
  credits: number;
  marks?: number;
  status: SubjectStatus;
  gradePoint: number;
  letterGrade: string;
};

export type Semester = {
  id: string;
  name: string;
  subjects: Subject[];
  gpa: number;
};
