import type { Semester, Subject, SubjectStatus } from '@/lib/types';

export const getGradeDetails = (
  marks: number
): { gradePoint: number; letterGrade: string; status: SubjectStatus } => {
  if (marks >= 90 && marks <= 100)
    return { gradePoint: 10, letterGrade: 'A++', status: 'PASS' };
  if (marks >= 80 && marks < 90)
    return { gradePoint: 9, letterGrade: 'A+', status: 'PASS' };
  if (marks >= 70 && marks < 80)
    return { gradePoint: 8, letterGrade: 'B++', status: 'PASS' };
  if (marks >= 60 && marks < 70)
    return { gradePoint: 7, letterGrade: 'B+', status: 'PASS' };
  if (marks >= 50 && marks < 60)
    return { gradePoint: 6, letterGrade: 'C', status: 'PASS' };
  return { gradePoint: 0, letterGrade: 'RA', status: 'RA' };
};

export const processSubject = (
  subject: Omit<Subject, 'id' | 'gradePoint' | 'letterGrade'> & { id?: string }
): Subject => {
  let gradePoint = 0;
  let letterGrade = '-';
  let finalStatus = subject.status;

  if (subject.marks !== undefined && subject.marks !== null) {
    const details = getGradeDetails(subject.marks);
    gradePoint = details.gradePoint;
    letterGrade = details.letterGrade;
    if (details.status === 'RA') {
      finalStatus = 'RA';
    } else {
      finalStatus = 'PASS';
    }
  }

  if (finalStatus !== 'PASS') {
    gradePoint = 0;
  }

  return {
    id: subject.id || crypto.randomUUID(),
    name: subject.name,
    credits: subject.credits,
    marks: subject.marks,
    status: finalStatus,
    gradePoint: gradePoint,
    letterGrade: letterGrade,
  };
};

export const calculateGpa = (subjects: Subject[]): number => {
  const includedSubjects = subjects.filter(s => s.status === 'PASS');
  if (includedSubjects.length === 0) return 0;

  const totalCredits = includedSubjects.reduce((acc, s) => acc + s.credits, 0);
  if (totalCredits === 0) return 0;

  const totalScore = includedSubjects.reduce(
    (acc, s) => acc + s.credits * s.gradePoint,
    0
  );

  return parseFloat((totalScore / totalCredits).toFixed(2));
};

export const calculateCgpa = (semesters: Semester[]): number => {
  const allSubjects = semesters.flatMap(sem => sem.subjects);
  return calculateGpa(allSubjects);
};

export const getDegreeClassification = (
  cgpa: number
): { classification: string; awarded: boolean } => {
  if (cgpa >= 9.0)
    return { classification: 'First Class – Exemplary', awarded: true };
  if (cgpa >= 7.5)
    return { classification: 'First Class with Distinction', awarded: true };
  if (cgpa >= 6.0) return { classification: 'First Class', awarded: true };
  if (cgpa >= 5.0) return { classification: 'Second Class', awarded: true };
  return { classification: 'Not Awarded', awarded: false };
};
