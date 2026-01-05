
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDegreeClassification } from '@/lib/grade-logic';
import type { Subject } from '@/lib/types';
import { Award, CheckCircle2, GraduationCap, Layers, TrendingUp, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- CGPA Card ---
export function CgpaCard({ cgpa }: { cgpa: number }) {
  // Determine color based on CGPA score (assuming 10.0 scale)
  const getColor = (score: number) => {
    if (score >= 9) return "text-emerald-500"; // Excellent
    if (score >= 8) return "text-blue-500";    // Very Good
    if (score >= 7) return "text-yellow-500";  // Good
    return "text-orange-500";                  // Needs Work
  };

  return (
    <Card className="relative overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between font-medium">
          <span>Overall CGPA</span>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <TrendingUp className="size-4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-4xl font-bold tracking-tight", getColor(cgpa))}>
            {cgpa.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">/ 10.0</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
            Cumulative Grade Point Average
        </p>
      </CardContent>
    </Card>
  );
}

// --- Classification Card ---
export function ClassificationCard({ cgpa }: { cgpa: number }) {
  const { classification, awarded } = getDegreeClassification(cgpa);
  
  return (
    <Card className="flex flex-col border-border/50 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between font-medium">
          <span>Degree Class</span>
          <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
            <Award className="size-4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-end gap-3">
        <div>
          <CardTitle className="text-2xl font-bold leading-none tracking-tight">
            {classification}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Current standing</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={awarded ? "default" : "secondary"} 
            className={cn(
              "pl-1 pr-2.5 py-1", 
              awarded ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200" : ""
            )}
          >
            {awarded ? (
              <CheckCircle2 className="mr-1.5 size-3.5" />
            ) : (
              <XCircle className="mr-1.5 size-3.5" />
            )}
            {awarded ? 'Eligible for Award' : 'In Progress'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Credits Card ---
export function CreditsCard({ subjects }: { subjects: Subject[] }) {
  const totalCredits = subjects
    .filter(s => s.status === 'PASS')
    .reduce((acc, s) => acc + s.credits, 0);

  return (
    <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between font-medium">
          <span>Total Credits</span>
          <div className="rounded-full bg-violet-500/10 p-2 text-violet-500">
             <Layers className="size-4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            {totalCredits}
          </span>
          <span className="text-sm text-muted-foreground">credits earned</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="size-3" />
            <span>Successful completions</span>
        </div>
      </CardContent>
    </Card>
  );
}
