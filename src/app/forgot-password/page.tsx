import type { Metadata } from 'next';
import Link from 'next/link';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - EzyBidder',
  description: 'Reset your EzyBidder account password securely.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-xl font-bold text-primary-foreground">EB</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">EzyBidder</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-card border border-border rounded-lg shadow-md p-8">
          <ForgotPasswordForm />

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
              Back to login
            </Link>
            <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
