import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - EzyBidder',
  description: 'Sign in to your EzyBidder account to access auctions, list vehicles, and manage your profile.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-xl font-bold text-primary-foreground">EB</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">EzyBidder</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg shadow-md p-8">
          <LoginForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-border rounded-md shadow-sm bg-card text-foreground hover:bg-muted transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.946 0-2.153-1.207-2.153-2.153s1.207-2.153 2.153-2.153c.946 0 2.153 1.207 2.153 2.153s-1.207 2.153-2.153 2.153zm0 1.384c1.022 0 1.853.831 1.853 1.853s-.831 1.853-1.853 1.853-1.853-.831-1.853-1.853.831-1.853 1.853-1.853zm0 7.691c-1.666 0-3.897-.617-3.897-2.468 0-1.505 1.039-2.397 2.549-2.397 1.294 0 2.616.811 3.596.811 1.526 0 2.529-.854 2.529-2.042 0-2.05-3.582-3.776-6.937-3.776-4.285 0-7.76 2.571-7.76 7.431 0 4.53 3.543 7.776 7.975 7.776 2.763 0 4.409-.49 5.766-1.551v-2.3c-1.219 1.49-2.521 1.6-4.768 1.6z" />
              </svg>
            </button>
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-border rounded-md shadow-sm bg-card text-foreground hover:bg-muted transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.855v3.418h5.405c-0.29,1.48-2.044,4.334-5.405,4.334c-3.254,0-5.921-2.671-5.921-5.98 c0-3.309,2.667-5.98,5.921-5.98c1.86,0,3.107,0.79,3.797,1.469l2.758-2.653c-1.66-1.537-3.814-2.471-6.555-2.471 C6.949,1.391,2,6.284,2,12c0,5.716,4.949,10.609,10.545,10.609c6.084,0,10.13-4.27,10.13-10.29c0-0.706-0.09-1.451-0.213-2.091 H12.545z" />
              </svg>
            </button>
          </div>

          {/* Footer Links */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
