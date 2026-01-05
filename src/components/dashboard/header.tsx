"use client";

import { Icons } from '@/components/icons';
import Link from 'next/link';
import { UserProfile } from './user-profile';
import { usePathname } from 'next/navigation';
import { Slash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const pathname = usePathname();
  
  // Simple logic to generate a title based on the path
  // e.g., "/dashboard/semesters" -> ["Dashboard", "Semesters"]
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      {/* Mobile: Logo (Visible only on small screens) */}
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <Icons.logo className="size-6 text-primary" />
        <span className="font-bold">yourgrade.io</span>
      </Link>

      {/* Desktop: Breadcrumbs (Hidden on mobile) */}
      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <Link 
            href="/" 
            className="flex items-center hover:text-foreground transition-colors"
        >
            <Icons.logo className="mr-2 size-4" />
            yourgrade.io
        </Link>
        
        {segments.map((segment) => (
          <div key={segment} className="flex items-center">
            <Slash className="mx-2 size-3 text-muted-foreground/50" />
            <span className="capitalize text-foreground font-medium">
              {segment}
            </span>
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Optional: Add a 'Feedback' or 'Help' button here */}
        <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
          <Link href="/feedback">Feedback</Link>
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border/50 hidden sm:block" />
        
        <UserProfile />
      </div>
    </header>
  );
}
