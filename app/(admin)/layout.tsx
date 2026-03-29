'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { ThemeProvider } from '@/app/providers';

const PUBLIC_PATHS = ['/admin/login'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));

  useEffect(() => {
    if (!loading && !user && !isPublicPath) {
      router.replace('/admin/login');
    }
  }, [user, loading, isPublicPath, router]);

  // Public paths (login) — render without sidebar or auth guard
  if (isPublicPath) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-500 font-sans">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden">
        {/* Fixed Sidebar */}
      <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {/* Main Content */}
      <main className="flex-1 lg:ml-[240px] min-h-screen bg-[#F7F9FA] dark:bg-[#1A1625] relative flex flex-col w-full max-w-full">
        <AdminTopBar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <div className="flex-1 p-[16px] lg:p-[32px] overflow-x-hidden">
          {children}
        </div>
      </main>
      </div>
    </ThemeProvider>
  );
}
