'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'buyer' | 'seller' | 'workshop';
  agreeToTerms: boolean;
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return 'Please enter your full name';
    if (!formData.email.trim()) return 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeToTerms) return 'Please agree to the Terms of Service';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const validationError = validateForm();
      if (validationError) throw new Error(validationError);

      // sign up with supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      }, {
        // send confirmation email — supabase will handle based on your settings
      });

      if (signUpError) throw signUpError;

      // If user returned immediately, create profile row (if your profiles table exists)
      const user = data.user;
      if (user) {
        const profile = {
          id: user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: formData.userType,
          created_at: new Date().toISOString(),
        };

        // create profile row in 'profiles' table using anon key
        // NOTE: If RLS policies block anon inserts, create a server route that uses service role key.
        const { error: profileError } = await supabase.from('profiles').upsert(profile);

        if (profileError) {
          console.warn('Could not upsert profile with anon key. Consider creating profile via server-side route using service key.', profileError.message);
        }
      }

      // You may want to ask user to confirm email if confirm email is enabled
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm flex items-start gap-2">
          <Icon name="ExclamationTriangleIcon" size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* form fields unchanged, same markup as before, using handleChange and formData */}
      {/* (to save space, reuse your existing JSX here — keep same inputs and names) */}

      {/* ... (keep the same inputs you already have — firstName, lastName, email, password, confirmPassword, userType, agreeToTerms) */}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">First Name</label>
          <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">Last Name</label>
          <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
        <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground" />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
        <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground" />
        <div className="mt-1 text-xs text-muted-foreground">At least 8 characters</div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground" />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="w-4 h-4 border border-border rounded bg-input" />
        <span className="text-sm text-muted-foreground">I agree to the Terms of Service</span>
      </label>

      <button type="submit" disabled={isLoading} className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md">
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
