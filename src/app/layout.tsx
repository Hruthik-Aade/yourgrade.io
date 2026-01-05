
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
// import { FirebaseErrorListener } from '@/components/firebase-error-listener'; // TODO: Uncomment this after creating the file
import { cn } from '@/lib/utils';

// Optimize Font Loading
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | yourgrade.io',
    default: 'yourgrade.io - Intelligent Academic Tracking',
  },
  description:
    'The modern academic tracking platform. Calculate GPA, analyze performance, and import results instantly with AI.',
  keywords: ['GPA Calculator', 'CGPA', 'Student Dashboard', 'University Results', 'Grade Tracker'],
  authors: [{ name: 'yourgrade.io' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/10 selection:text-primary",
          inter.variable
        )}
      >
        <FirebaseClientProvider>
          {/* Global Error Listener:
            Catches 'permission-denied' from Firestore.
            TODO: Create 'src/components/firebase-error-listener.tsx' and then uncomment the line below.
          */}
          {/* <FirebaseErrorListener /> */}
          
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
