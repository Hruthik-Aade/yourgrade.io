
"use client";

import { useStudentData } from '@/hooks/use-student-data';
import { useUser } from '@/firebase';
import {
  ClassificationCard,
  CgpaCard,
  CreditsCard,
} from '@/components/dashboard/cgpa-summary';
import { GpaCalculator } from '@/components/dashboard/gpa-calculator';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const studentData = useStudentData();
  const { user } = useUser();

  // Get the first name for a personalized greeting
  const firstName = user?.displayName?.split(' ')[0] || 'Student';

  if (studentData.isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
        </h2>
        <p className="text-muted-foreground">
            Here is an overview of your academic performance.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CgpaCard cgpa={studentData.cgpa} />
        <ClassificationCard cgpa={studentData.cgpa} />
        <CreditsCard subjects={studentData.allSubjects} />
      </div>

      {/* Main Content: GPA Calculator taking full width */}
      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <GpaCalculator studentData={studentData} />
        </div>
      </div>

    </div>
  );
}
