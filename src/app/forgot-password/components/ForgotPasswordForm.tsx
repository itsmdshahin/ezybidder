'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type ForgotPasswordStep = 'email' | 'verification' | 'reset' | 'success';

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      console.log('Password reset requested for:', email);
      setSuccess(`Reset instructions sent to ${email}`);
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!verificationCode.trim() || verificationCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit code');
      }

      // Simulate API call
      console.log('Verification code verified:', verificationCode);
      setSuccess('');
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call
      console.log('Password reset for:', email);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Email
  if (step === 'email') {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Password Reset</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm flex items-start gap-2">
            <Icon name="ExclamationTriangleIcon" size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <Icon 
              name="EnvelopeIcon" 
              size={20} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Icon name="PaperAirplaneIcon" size={20} />
              Send Reset Code
            </>
          )}
        </button>
      </form>
    );
  }

  // Step 2: Verification
  if (step === 'verification') {
    return (
      <form onSubmit={handleVerificationSubmit} className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Verify Your Email</h2>
          <p className="text-sm text-muted-foreground">
            Check your email for a 6-digit code
          </p>
        </div>

        {success && (
          <div className="p-3 rounded-md bg-success/10 border border-success/20 text-success text-sm flex items-start gap-2">
            <Icon name="CheckCircleIcon" size={20} className="flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm flex items-start gap-2">
            <Icon name="ExclamationTriangleIcon" size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="000000"
            className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground text-center text-lg font-mono placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Icon name="CheckIcon" size={20} />
              Verify Code
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep('email');
            setVerificationCode('');
            setError('');
            setSuccess('');
          }}
          className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Use different email
        </button>
      </form>
    );
  }

  // Step 3: Reset Password
  if (step === 'reset') {
    return (
      <form onSubmit={handlePasswordReset} className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Create New Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter a new password for your account
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm flex items-start gap-2">
            <Icon name="ExclamationTriangleIcon" size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showPassword ? (
                <Icon name="EyeSlashIcon" size={20} />
              ) : (
                <Icon name="EyeIcon" size={20} />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">At least 8 characters</p>
        </div>

        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <Icon name="EyeSlashIcon" size={20} />
              ) : (
                <Icon name="EyeIcon" size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <Icon name="LockClosedIcon" size={20} />
              Reset Password
            </>
          )}
        </button>
      </form>
    );
  }

  // Step 4: Success
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 border border-success/20 mb-4">
        <Icon name="CheckCircleIcon" size={32} className="text-success" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Password Reset Successful</h2>
      <p className="text-muted-foreground">
        Your password has been updated. You can now sign in with your new password.
      </p>
      <a
        href="/login"
        className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
      >
        Return to Login
      </a>
    </div>
  );
}
