
import { FileDigit, ScanText, TableProperties, Calculator } from 'lucide-react';
import { FeatureCard } from './feature-card';

const features = [
  {
    icon: <FileDigit className="size-6" />,
    title: 'Instant Result Processing',
    description:
      'The official transcript can take weeks to process. We provide immediate clarity by converting your raw subject marks into standard credit-based GPA metrics the moment results are live.',
    image: {
      src: '/images/Result_Processing.jpg',
      alt: 'GPA Calculation Interface',
      hint: 'dashboard analytics'
    },
  },
  {
    icon: <ScanText className="size-6" />,
    title: 'Portal-Ready Imports',
    description:
      'Designed for university portals. Simply copy the raw text table from your result page or upload a screenshot, and our engine parses the disjointed data into a structured academic record.',
    image: {
      src: '/images/Portal-Ready_Imports.jpg',
      alt: 'AI Import Dialog',
      hint: 'AI data'
    },
  },
  {
    icon: <TableProperties className="size-6" />,
    title: 'Cumulative Data Management',
    description:
      'Universities often wipe provisional results for the next semester. Store your history securely here to maintain an accurate, running CGPA calculation across your entire degree.',
    image: {
      src: '/images/Cumulative_Data_Management.jpg',
      alt: 'Semester Management',
      hint: 'editing data'
    },
  },
  {
    icon: <Calculator className="size-6" />,
    title: 'Transparent GPA Calculation',
    description:
      "We use the standard weighted average formula for both GPA and CGPA. This is the sum of your credit-weighted grade points divided by the sum of your credits.",
    // The image prop is removed and we use the customComponent prop instead.
    customComponent: 'gpaFormula' as const,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
      
      <div className="container space-y-16">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Don't wait for the <br />
            <span className="text-primary">official transcript</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We provide the computational layer that university portals miss. 
            Get the insights you need to apply for internships and placements 
            without waiting for administrative processing.
          </p>
        </div>
        
        <div className="grid gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              // Card 0: False (Left-Right)
              // Card 1: True  (Right-Left)
              // Card 2: False (Left-Right)
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
