'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#120F1C]">
      <div className="bg-white dark:bg-[#1A1625] w-full max-w-[400px] rounded-2xl shadow-lg border border-gray-100 dark:border-[rgba(255,255,255,0.06)] p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8 dark:invert opacity-90">
          <Logo variant="dark" />
        </div>

        {/* Heading */}
        <h1
          className="text-2xl font-bold text-center mb-1 text-teal-900 dark:text-white font-heading"
        >
          Admin Login
        </h1>
        <p className="text-gray-400 dark:text-[rgba(255,255,255,0.6)] text-sm text-center mb-8">
          Sign in to manage BagPackerMe
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-[rgba(255,255,255,0.7)] mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="bagpackerme.world@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(255,255,255,0.02)] text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none transition-all focus:border-teal-900 dark:focus:border-[#C1EA00] focus:ring-1 focus:ring-teal-900 dark:focus:ring-[#C1EA00]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-[rgba(255,255,255,0.7)] mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(255,255,255,0.02)] text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none transition-all focus:border-teal-900 dark:focus:border-[#C1EA00] focus:ring-1 focus:ring-teal-900 dark:focus:ring-[#C1EA00]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-lg px-4 py-2.5">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 bg-lime-500 text-teal-950"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>Sign In →</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
