'use client';

import { useAuth } from '@/hooks/useAuth';
import { logoutAdmin } from '@/lib/auth';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const firstName = user?.email?.split('@')[0]?.replace(/\./g, ' ') ?? 'Admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const segments = pathname.split('/').filter(Boolean);
  const title = segments[segments.length - 1] 
    ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
    : 'Admin';

  return (
    <div className="sticky top-0 h-[64px] bg-[#FFFFFF] dark:bg-[#1A1625] border-b border-[#E9F5F7] dark:border-[rgba(255,255,255,0.06)] px-[16px] lg:px-[32px] flex items-center justify-between z-30 transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#4a5568] dark:text-[#A0AEC0] hover:text-[#221E2A] dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-[18px] font-semibold text-[#221E2A] dark:text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Search */}
        <div className="relative w-[200px] sm:w-[280px] hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-[36px] pl-10 pr-4 rounded-[4px] border border-[rgba(34,30,42,0.12)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[rgba(255,255,255,0.05)] font-body text-[14px] text-[#221E2A] dark:text-white focus:border-[#285056] dark:focus:border-[rgba(255,255,255,0.3)] focus:ring-[3px] focus:ring-[rgba(40,80,86,0.10)] dark:focus:ring-[rgba(255,255,255,0.05)] outline-none transition-all placeholder:text-[#718096] dark:placeholder:text-[rgba(255,255,255,0.4)]" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096] dark:text-[rgba(255,255,255,0.4)]" strokeWidth={2} />
        </div>
        
        {/* Theme Toggle */}
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative text-[#4a5568] dark:text-[rgba(255,255,255,0.7)] hover:text-[#221E2A] dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Moon className="w-[20px] h-[20px]" strokeWidth={2} /> : <Sun className="w-[20px] h-[20px]" strokeWidth={2} />}
          </button>
        )}

        {/* Avatar / Logout */}
        <button 
          onClick={handleLogout}
          title="Logout"
          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#FFFFFF] text-[13px] font-medium bg-[#285056] shrink-0 uppercase ml-2 hover:bg-[#1a3539] transition-colors cursor-pointer ring-offset-2 hover:ring-2 ring-[#285056] dark:ring-offset-[#1A1625]"
        >
          {firstName.substring(0, 2)}
        </button>
      </div>
    </div>
  );
}
