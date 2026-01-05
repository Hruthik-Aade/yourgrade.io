import type { ReactNode } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
        <DashboardHeader />
        
        <main className="flex-1">
          {/* Constrain width for large screens so content doesn't stretch too far */}
          <div className="container mx-auto max-w-screen-2xl p-4 md:p-6 lg:p-8 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
