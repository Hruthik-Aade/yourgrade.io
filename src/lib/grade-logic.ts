import type { Semester, Subject, SubjectStatus } from '@/lib/types';

const DEFAULT_MAX_MARKS = 100;

type SubjectInput = Omit<Subject, 'id' | 'gradePoint' | 'letterGrade'> &
  Partial<Pick<Subject, 'id' | 'gradePoint' | 'letterGrade'>>;

const normaliseMaxMarks = (maxMarks?: number | null): number => {
  return typeof maxMarks === 'number' && Number.isFinite(maxMarks) && maxMarks > 0
    ? maxMarks
    : DEFAULT_MAX_MARKS;
};

const normaliseToPercentage = (marks: number, maxMarks?: number | null): number => {
  const safeMaxMarks = normaliseMaxMarks(maxMarks);
  const percentage = (marks / safeMaxMarks) * 100;
  return Math.max(0, Math.min(100, percentage));
};

export const getGradeDetails = (
  marks: number,
  maxMarks: number = DEFAULT_MAX_MARKS
): { gradePoint: number; letterGrade: string; status: SubjectStatus } => {
  const percentage = normaliseToPercentage(marks, maxMarks);

  if (percentage >= 90)
    return { gradePoint: 10, letterGrade: 'A++', status: 'PASS' };
  if (percentage >= 80)
    return { gradePoint: 9, letterGrade: 'A+', status: 'PASS' };
  if (percentage >= 70)
    return { gradePoint: 8, letterGrade: 'B++', status: 'PASS' };
  if (percentage >= 60)
    return { gradePoint: 7, letterGrade: 'B+', status: 'PASS' };
  if (percentage >= 50)
    return { gradePoint: 6, letterGrade: 'C', status: 'PASS' };
  return { gradePoint: 0, letterGrade: 'RA', status: 'RA' };
};

export const processSubject = (
  subject: SubjectInput
): Subject => {
  const hasMarks = subject.marks !== undefined && subject.marks !== null;
  const hasExplicitMaxMarks =
    typeof subject.maxMarks === 'number' &&
    Number.isFinite(subject.maxMarks) &&
    subject.maxMarks > 0;
  const maxMarks = normaliseMaxMarks(subject.maxMarks);
  const storedMaxMarks = hasExplicitMaxMarks
    ? subject.maxMarks
    : hasMarks
      ? DEFAULT_MAX_MARKS
      : undefined;
  const hasOfficialGradePoint =
    typeof subject.gradePoint === 'number' && Number.isFinite(subject.gradePoint);
  const hasOfficialLetterGrade =
    typeof subject.letterGrade === 'string' && subject.letterGrade.trim().length > 0;
  let gradePoint = hasOfficialGradePoint ? subject.gradePoint! : 0;
  let letterGrade = hasOfficialLetterGrade ? subject.letterGrade!.trim() : '-';
  let finalStatus = subject.status;

  if (hasMarks) {
    const marks = subject.marks as number;
    const details = getGradeDetails(marks, maxMarks);
    if (!hasOfficialGradePoint) {
      gradePoint = details.gradePoint;
    }
    if (!hasOfficialLetterGrade) {
      letterGrade =
        finalStatus === 'PASS' && details.status === 'RA'
          ? 'P'
          : details.letterGrade;
    }
  }

  if (finalStatus !== 'PASS') {
    gradePoint = 0;
    if (!hasOfficialLetterGrade) {
      letterGrade = finalStatus === 'RA' ? 'RA' : '-';
    }
  }

  return {
    id: subject.id || crypto.randomUUID(),
    name: subject.name,
    credits: subject.credits,
    marks: subject.marks,
    maxMarks: storedMaxMarks,
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
