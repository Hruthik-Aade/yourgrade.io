import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
            <h1>Terms of Service</h1>
            <p className="lead">
              Welcome to yourgrade.io. By accessing or using our application,
              you agree to be bound by these terms and conditions.
            </p>

            <h2>1. Use of Service</h2>
            <p>
              yourgrade.io is provided for personal, non-commercial use to
              calculate and track academic grades. You agree not to use the service
              for any illegal or unauthorized purpose.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              You are responsible for safeguarding your account and for any
              activities or actions under your account. We are not liable for any
              loss or damage arising from your failure to comply with this
              security obligation.
            </p>

            <h2>3. Data Accuracy</h2>
            <p>
              While we strive for accuracy, the calculations provided by
              yourgrade.io are for informational purposes only and are not a
              substitute for official university transcripts. We are not
              responsible for any inaccuracies or discrepancies.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of yourgrade.io and its
              licensors.
            </p>

            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior
              notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall yourgrade.io, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use, goodwill,
              or other intangible losses.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will provide notice of any changes by
              posting the new Terms of Service on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us.
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
