import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="size-6 text-primary" />
            <span className="font-bold">yourgrade.io</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Back to App
          </Link>
        </div>
      </header>
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto max-w-4xl py-12 md:py-20">
          <div className="prose prose-lg dark:prose-invert mx-auto rounded-lg border bg-background p-8 shadow-sm lg:p-12">
            <h1>Privacy Policy</h1>
            <p className="lead">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you
              create an account, enter academic data, or contact us. This may
              include:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email address, and
                password.
              </li>
              <li>
                <strong>Academic Data:</strong> Semester details, subject names,
                credits, and marks that you voluntarily provide.
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and
              provide you with the features and functionality of the service,
              including:
            </p>
            <ul>
              <li>To calculate and display your GPA and CGPA.</li>
              <li>To allow you to track your academic performance over time.</li>
              <li>To respond to your comments, questions, and requests.</li>
            </ul>

            <h2>3. Data Security and Storage</h2>
            <p>
              All your academic data is stored securely in your own isolated
              database space, protected by Firebase Security Rules. Only you, the
              authenticated user, have access to read or modify your data. We do
              not share or sell your personal data.
            </p>

            <h2>4. AI Data Processing</h2>
            <p>
              When you use our AI import feature, the text or image you provide
              is sent to a third-party AI service (such as Google Gemini) for
              processing. This data is used solely to extract academic information
              and is not stored or used to train AI models.
            </p>
            
            <h2>5. Your Choices</h2>
            <p>
              You can access, modify, or delete your academic data at any time
              through the application's dashboard. You may also delete your entire
              account, which will permanently remove all associated data.
            </p>

            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us.
            </p>
            <p>
              <em>Last updated: {new Date().toLocaleDateString()}</em>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
