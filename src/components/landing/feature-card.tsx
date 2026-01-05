
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  image?: { // Image is now optional
    src: string;
    alt: string;
    hint: string;
  };
  formula?: {
    numerator: string;
    denominator: string;
  };
  customComponent?: 'gpaFormula'; // New prop to identify the special card
  reverse?: boolean;
};

// Custom component for the detailed GPA formula
const GpaFormulaComponent = () => {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted/50 p-6 flex flex-col items-center justify-center text-foreground shadow-sm transition-all duration-500 group-hover:shadow-md md:w-1/2">
      <div className="w-full max-w-sm space-y-4 font-mono text-center">
        {/* GPA Formula */}
        <div className="flex items-center justify-center gap-2">
          <div className="text-lg font-bold text-primary">
            (CGPA/GPA)
          </div>
          <div className="text-lg text-muted-foreground">=</div>
          <div className="flex flex-col items-center justify-center text-sm">
            <div className="border-b-2 border-foreground px-2 pb-1 flex items-center gap-2">
                <span className="text-lg">Σ</span>
                <span>(Credits<sub className="text-xs">i</sub> × Grade Points<sub className="text-xs">i</sub>)</span>
            </div>
            <div className="pt-1 flex items-center gap-2">
                <span className="text-lg">Σ</span>
                <span>(Total Credits<sub className="text-xs">i</sub>)</span>
            </div>
          </div>
        </div>
      </div>
       <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/5" />
    </div>
  );
};


export function FeatureCard({
  icon,
  title,
  description,
  image,
  formula,
  customComponent,
  reverse = false,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card/80 to-card/40 p-1 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20',
        'backdrop-blur-sm'
      )}
    >
      <div 
        className={cn(
          "flex flex-col gap-8 rounded-[1.4rem] bg-card/40 p-6 md:items-center md:gap-12 md:p-10",
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        )}
      >
        
        {/* Text Section */}
        <div className="flex w-full flex-col justify-center space-y-5 md:w-1/2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-foreground/90">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
             {/* This formula display is kept for cards that might still use it */}
            {formula && (
              <div className="flex items-center gap-4 rounded-lg border bg-background/50 p-4 font-mono text-sm shadow-inner md:text-base">
                <span className="font-bold text-primary">GPA</span>
                <span className="text-muted-foreground">=</span>
                <div className="flex flex-col items-center">
                  <span className="border-b pb-2 px-2 text-center text-foreground">{formula.numerator}</span>
                  <span className="pt-2 px-2 text-center text-foreground">{formula.denominator}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Conditional Rendering: Image or Custom Formula Component */}
        {customComponent === 'gpaFormula' ? (
          <GpaFormulaComponent />
        ) : image ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted/50 shadow-sm transition-all duration-500 group-hover:shadow-md md:w-1/2">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              data-ai-hint={image.hint}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/5" />
          </div>
        ) : null}

      </div>
    </div>
  );
}
