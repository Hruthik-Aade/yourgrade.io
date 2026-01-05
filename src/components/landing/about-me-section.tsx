'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Linkedin, Mail, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutMeSection() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32 bg-muted/20">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-primary/5 to-blue-500/5 blur-[100px]" />

      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Bridging the <span className="text-primary">Data Gap</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In many universities, there is a critical delay between the release of raw examination marks and the issuance of the official GPA/CGPA.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                This waiting period creates ambiguity for students preparing for placements and internships. 
                <strong>YourGrade.io</strong> was engineered to eliminate this uncertainty. By standardizing the calculation logic used by the university, we empower students to derive accurate academic metrics instantly—turning raw data into actionable insights.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full" asChild>
                  <Link href="https://github.com/Hruthik-Aade" target="_blank" aria-label="GitHub">
                    <Github className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" asChild>
                  <Link href="https://www.linkedin.com/in/hruthik-chandra-aade/" target="_blank" aria-label="LinkedIn">
                    <Linkedin className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" asChild>
                  <Link href="mailto:hruthikchandra.aade@gmail.com" aria-label="Email">
                    <Mail className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="h-px w-12 bg-border sm:h-8 sm:w-px" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Aade Hruthik Chandra</span>
                <span className="text-xs text-muted-foreground">Lead Developer & Founder</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-lg" />
            
            <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/50 p-2 backdrop-blur-sm shadow-2xl">
              <div className="relative aspect-[4/5] w-[300px] overflow-hidden rounded-[1.5rem] bg-muted md:w-[350px]">
                <Image
                  src="/images/developer.jpeg" 
                  alt="Aade Hruthik Chandra"
                  fill
                  unoptimized
                  data-ai-hint="portrait person"
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
                
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Aade Hruthik Chandra</p>
                      <p className="text-xs text-white/70">Security Analyst</p>
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md">
                      <Code className="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
