'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { logoutAdmin } from '@/lib/auth';
import {
  LayoutDashboard,
  BarChart3,
  MapPinned,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Users,
  Mail,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { icon: MapPinned, label: 'Packages', href: '/admin/packages' },
      { icon: FileText, label: 'Blog Posts', href: '/admin/blog' },
      { icon: ImageIcon, label: 'Gallery', href: '/admin/gallery' },
    ],
  },
  {
    title: 'BOOKINGS',
    items: [
      { icon: MessageSquare, label: 'Enquiries', href: '/admin/enquiries', badge: 0 },
      { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
      { icon: Users, label: 'Customers', href: '/admin/customers' },
      { icon: Mail, label: 'Newsletter', href: '/admin/newsletter' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { icon: Settings, label: 'Site Settings', href: '/admin/settings' },
    ],
  },
];

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };



  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={onClose} 
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-[100vh] w-[240px] flex flex-col z-50 border-r border-[#ffffff10] overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: 'linear-gradient(180deg, #285056 0%, #1e3d42 100%)' }}
      >
        {/* Logo Area */}
        <div className="flex-shrink-0 h-[64px] px-[24px] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <Logo variant="light" className="scale-[0.6] lg:scale-75 origin-left" />
          {/* Close button on mobile */}
          <button 
            className="lg:hidden w-11 h-11 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

      {/* Nav Sections */}
      <nav className="flex-1 py-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-2 border-t border-[rgba(255,255,255,0.08)] first:border-t-0">
            <div className="font-display text-[9px] tracking-[0.2em] font-normal uppercase text-[rgba(255,255,255,0.35)] px-[24px] pt-[24px] pb-[8px]">
              {section.title}
            </div>
            <ul>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center h-[44px] px-[24px] group border-l-[3px] transition-colors ${
                        isActive
                          ? 'bg-[rgba(255,255,255,0.1)] text-[#FFFFFF] border-[#C1EA00]'
                          : 'bg-transparent text-[rgba(255,255,255,0.7)] border-transparent hover:bg-[rgba(255,255,255,0.08)] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <item.icon
                        className={`w-[18px] h-[18px] mr-[10px] shrink-0 transition-colors ${
                          isActive ? 'text-[#C1EA00]' : 'text-[rgba(255,255,255,0.6)] group-hover:text-white'
                        }`}
                        strokeWidth={2}
                      />
                      <span className="font-display text-[12px] font-semibold tracking-[0.1em] uppercase flex-1">
                        {item.label}
                      </span>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="ml-auto bg-[#C1EA00] text-[#221E2A] font-display text-[10px] font-bold py-[1px] px-[6px] rounded-full leading-none">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Area */}
      <div className="flex-shrink-0 border-t border-[rgba(255,255,255,0.08)] p-[16px_24px]">
        {user && (
          <div className="flex items-center gap-3 mb-[12px]">
            <div className="flex-1 min-w-0">
              <p className="font-body text-[12px] text-[rgba(255,255,255,0.6)] truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 -ml-2 font-body text-[13px] text-[#ffffff66] hover:text-[#ef4444] transition-colors group"
          aria-label="Log out"
        >
          <LogOut className="w-4 h-4 group-hover:text-[#ef4444]" />
          Log out
        </button>
      </div>
    </aside>
  </>
  );
}
