"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Semester, Subject } from '@/lib/types';
import { calculateGpa, calculateCgpa, processSubject } from '@/lib/grade-logic';
import { 
  useCollection, 
  useFirestore, 
  useUser, 
  addDocumentNonBlocking, 
  deleteDocumentNonBlocking, 
  updateDocumentNonBlocking,
  useMemoFirebase
} from '@/firebase';
import { 
  collection, 
  doc, 
  writeBatch, 
  onSnapshot, 
  addDoc, 
  getDocs, 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useStudentData() {
  const firestore = useFirestore();
  const { user } = useUser();

  // 1. Fetch Semesters (Parent Collection)
  const semestersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'semesters');
  }, [firestore, user]);

  const { 
    data: semestersData, 
    isLoading: isSemestersLoading 
  } = useCollection<Omit<Semester, 'subjects' | 'gpa'>>(semestersQuery);

  // 2. Manage Subjects (Sub-collections)
  const [subjectsBySemester, setSubjectsBySemester] = useState<Record<string, Subject[]>>({});
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);

  useEffect(() => {
    if (!user || isSemestersLoading || !semestersData) {
      if(!user && !isSemestersLoading) {
        setIsSubjectsLoading(false);
      }
      return;
    }

    if (semestersData.length === 0) {
      setSubjectsBySemester({});
      setIsSubjectsLoading(false);
      return;
    }

    setIsSubjectsLoading(true);
    
    const unsubscribes: (() => void)[] = [];
    const loadingStatus: Record<string, boolean> = {};
    semestersData.forEach(s => loadingStatus[s.id] = true);

    semestersData.forEach(semester => {
      const subjectsCollection = collection(firestore, 'users', user.uid, 'semesters', semester.id, 'subjects');
      
      const unsubscribe = onSnapshot(
        subjectsCollection, 
        (snapshot) => {
          const semesterSubjects = snapshot.docs.map(d => processSubject({ ...d.data(), id: d.id } as Subject));
          
          setSubjectsBySemester(prev => ({
            ...prev,
            [semester.id]: semesterSubjects,
          }));

          if (loadingStatus[semester.id]) {
            loadingStatus[semester.id] = false;
            if (Object.values(loadingStatus).every(v => v === false)) {
              setIsSubjectsLoading(false);
            }
          }
        }, 
        (error) => {
          console.error(`Error fetching subjects for ${semester.id}:`, error);
          
          const permError = new FirestorePermissionError({
            operation: 'list',
            path: subjectsCollection.path
          });
          errorEmitter.emit('permission-error', permError);
          
          if (loadingStatus[semester.id]) {
            loadingStatus[semester.id] = false;
            if (Object.values(loadingStatus).every(v => v === false)) {
              setIsSubjectsLoading(false);
            }
          }
        }
      );

      unsubscribes.push(unsubscribe);
    });

    return () => {
        unsubscribes.forEach(unsub => unsub());
    }
  }, [semestersData, isSemestersLoading, firestore, user]);


  // --- CRUD Operations ---

  const addSemester = async (name: string, returnDoc: boolean = false) => {
    if (!user) return;
    const semestersCollection = collection(firestore, 'users', user.uid, 'semesters');
    const newDocRef = await addDoc(semestersCollection, { 
      name,
      createdAt: new Date().toISOString() 
    });
    
    if (returnDoc) {
      return { id: newDocRef.id, name };
    }
  };

  const updateSemesterName = (semesterId: string, name: string) => {
    if (!user) return;
    const semesterDoc = doc(firestore, 'users', user.uid, 'semesters', semesterId);
    updateDocumentNonBlocking(semesterDoc, { name });
  };

  const addSubject = (
    semesterId: string,
    subjectData: Omit<Subject, 'id' | 'gradePoint' | 'letterGrade'>
  ) => {
    if (!user) return;
    const subjectsCollection = collection(firestore, 'users', user.uid, 'semesters', semesterId, 'subjects');
    const processed = processSubject(subjectData);
    
    const dataToSave = {
      name: processed.name,
      credits: processed.credits,
      status: processed.status,
      gradePoint: processed.gradePoint,
      letterGrade: processed.letterGrade,
      marks: processed.marks ?? null,
    };

    addDocumentNonBlocking(subjectsCollection, dataToSave);
  };

  const updateSubject = (
    semesterId: string,
    subjectId: string,
    subjectData: Omit<Subject, 'id' | 'gradePoint' | 'letterGrade'>
  ) => {
    if (!user) return;
    const subjectDoc = doc(firestore, 'users', user.uid, 'semesters', semesterId, 'subjects', subjectId);
    const processed = processSubject({ ...subjectData, id: subjectId });
    
    const dataToSave = {
      name: processed.name,
      credits: processed.credits,
      status: processed.status,
      gradePoint: processed.gradePoint,
      letterGrade: processed.letterGrade,
      marks: processed.marks ?? null,
    };

    updateDocumentNonBlocking(subjectDoc, dataToSave);
  };

  const deleteSubject = (semesterId: string, subjectId: string) => {
    if (!user) return;
    const subjectDoc = doc(firestore, 'users', user.uid, 'semesters', semesterId, 'subjects', subjectId);
    deleteDocumentNonBlocking(subjectDoc);
  };

  const deleteSemester = async (semesterId: string) => {
    if (!user) return;
    
    const batch = writeBatch(firestore);
    const semesterDoc = doc(firestore, 'users', user.uid, 'semesters', semesterId);
    const subjectsCollection = collection(firestore, 'users', user.uid, 'semesters', semesterId, 'subjects');
    
    try {
      const subjectsSnapshot = await getDocs(subjectsCollection);
      subjectsSnapshot.forEach(subjectDoc => {
        batch.delete(subjectDoc.ref);
      });

      batch.delete(semesterDoc);
      await batch.commit();
    } catch (err: any) {
      console.error("Failed to delete semester", err);
      if (err.code === 'permission-denied') {
        const permError = new FirestorePermissionError({
          operation: 'delete',
          path: semesterDoc.path
        });
        errorEmitter.emit('permission-error', permError);
      }
    }
  };

  // --- Data Enrichment ---

  const enrichedSemesters = useMemo(() => {
    if (!semestersData) return [];

    const semestersWithSubjects = semestersData
      .map(sem => {
        const subjects = subjectsBySemester[sem.id] || [];
        return {
          ...sem,
          subjects,
          gpa: calculateGpa(subjects),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

      // This logic was causing the re-render loop. Removing it and relying on component unmounts for cleanup.
      /*
      const existingSemesterIds = new Set(semestersData.map(s => s.id));
      setSubjectsBySemester(current => {
        const nextState = { ...current };
        Object.keys(nextState).forEach(semId => {
          if (!existingSemesterIds.has(semId)) {
            delete nextState[semId];
          }
        });
        return nextState;
      });
      */

      return semestersWithSubjects;

  }, [semestersData, subjectsBySemester]);

  const cgpa = useMemo(() => calculateCgpa(enrichedSemesters), [enrichedSemesters]);
  const allSubjects = useMemo(() => enrichedSemesters.flatMap(s => s.subjects), [enrichedSemesters]);
  
  const isLoading = isSemestersLoading || isSubjectsLoading;

  return {
    semesters: enrichedSemesters,
    cgpa,
    allSubjects,
    addSemester,
    updateSemesterName,
    addSubject,
    updateSubject,
    deleteSubject,
    deleteSemester,
    isLoading,
  };
}
