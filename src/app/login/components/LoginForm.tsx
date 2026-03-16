'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Optionally set sessionStorage copy for UI convenience (not required)
      sessionStorage.setItem('user', JSON.stringify(data.user ?? {}));

      // Redirect to dashboard or previous page
      router.push('/user-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm flex items-start gap-2">
          <Icon name="ExclamationTriangleIcon" size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground"
          />
          <Icon name="EnvelopeIcon" size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-border rounded-md bg-input text-foreground"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <Icon name="EyeSlashIcon" size={20} /> : <Icon name="EyeIcon" size={20} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 border border-border rounded"
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
        </label>
        <a href="/forgot-password" className="text-sm font-medium text-primary">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2"
      >
        {isLoading ? (<><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />Signing in...</>)
                   : (<><Icon name="ArrowRightIcon" size={20} />Sign in</>)}
      </button>
    </form>
  );
}
