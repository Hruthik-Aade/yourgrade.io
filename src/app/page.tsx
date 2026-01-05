'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { FeaturesSection } from '@/components/landing/features-section';
import { AboutMeSection } from '@/components/landing/about-me-section';
import { ArrowRight, BarChart3 } from 'lucide-react';

function HeaderNav() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) return <div className="h-9 w-24 animate-pulse rounded bg-muted" />;

  return (
    <nav className="flex items-center gap-3">
      {user ? (
        <Button asChild variant="default" size="sm" className="rounded-full px-6 shadow-sm hover:shadow-md transition-all">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" className="rounded-full px-6 shadow-sm hover:shadow-md transition-all" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </nav>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/10">
              <Icons.logo className="size-5" />
            </div>
            <span className="font-bold tracking-tight">yourgrade.io</span>
          </Link>
          <HeaderNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          {/* Decorative background grid */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500/20 opacity-20 blur-[100px]" />
          </div>

          <div className="container flex flex-col items-center gap-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-muted/50 hover:border-primary/30">
              <span className="flex items-center gap-1 text-muted-foreground">
                <BarChart3 className="size-3 text-primary" /> 
                Professional Grade Analytics
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              Results are out. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Is your GPA missing?
              </span>
            </h1>

            <p className="max-w-[46rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              University portals often release raw grades without the final calculations. 
              We bridge the gap. Instantly convert your provisional results into 
              accurate GPA and CGPA metrics before the official transcript arrives.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105" asChild>
                <Link href="/signup">
                  Calculate Now <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-muted/80" asChild>
                <Link href="#features">How it works</Link>
              </Button>
            </div>

            {/* Dashboard Preview Image */}
            <div className="mt-16 w-full max-w-5xl px-4 md:px-0">
              <div className="group relative aspect-video overflow-hidden rounded-xl border bg-muted/50 shadow-2xl shadow-indigo-500/10 lg:rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
                <Image
                  src="/images/main.jpg"
                  alt="Dashboard Analytics View"
                  data-ai-hint="dashboard analytics"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                {/* Glass sheen effect */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 dark:ring-white/5 rounded-xl lg:rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <AboutMeSection />
      </main>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-muted p-1">
               <Icons.logo className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} yourgrade.io. Academic analytics platform.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
