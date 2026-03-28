'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu } from 'lucide-react';

interface AdminTopBarProps {
  onMenuClick?: () => void;
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const firstName = user?.email?.split('@')[0]?.replace(/\./g, ' ') ?? 'Admin';

  const segments = pathname.split('/').filter(Boolean);
  const title = segments[segments.length - 1] 
    ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)
    : 'Admin';
  const breadcrumb = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');

  return (
    <div className="sticky top-0 h-[64px] bg-[#FFFFFF] border-b border-[#E9F5F7] px-[16px] lg:px-[32px] flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#4a5568] hover:text-[#221E2A] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-[18px] font-semibold text-[#221E2A] leading-tight">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center text-[#718096] font-body text-[13px] mr-4">
          {breadcrumb}
        </div>
        
        {/* Search */}
        <div className="relative w-[200px] sm:w-[280px] hidden md:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-[36px] pl-10 pr-4 rounded-[4px] border border-[rgba(34,30,42,0.12)] bg-white font-body text-[14px] text-[#221E2A] focus:border-[#285056] focus:ring-[3px] focus:ring-[rgba(40,80,86,0.10)] outline-none transition-all placeholder:text-[#718096]" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" strokeWidth={2} />
        </div>
        
        {/* Notification Bell */}
        <button className="relative text-[#4a5568] hover:text-[#221E2A] transition-colors">
          <Bell className="w-[20px] h-[20px]" strokeWidth={2} />
          {/* Example notification badge */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Avatar */}
        <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#FFFFFF] text-[13px] font-medium bg-[#285056] shrink-0 uppercase ml-2">
          {firstName.substring(0, 2)}
        </div>
      </div>
    </div>
  );
}
