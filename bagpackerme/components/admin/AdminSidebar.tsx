'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { logoutAdmin } from '@/lib/auth';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
  { icon: '🧳', label: 'Packages', href: '/admin/packages' },
  { icon: '✍️', label: 'Blog Posts', href: '/admin/blog' },
  { icon: '📬', label: 'Enquiries', href: '/admin/enquiries' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <aside
      className="fixed top-0 left-0 h-full w-[240px] flex flex-col z-40"
      style={{ backgroundColor: '#285056' }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <Logo variant="light" className="scale-90 origin-left" />
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/10 mb-4" />

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group relative"
              style={{
                color: isActive ? '#C1EA00' : 'rgba(255,255,255,0.75)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #C1EA00' : '3px solid transparent',
                marginLeft: isActive ? '0' : '0',
              }}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span
                className="transition-colors"
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-4 pb-6 pt-4 border-t border-white/10">
        {user && (
          <div className="mb-3 px-2">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Signed in as</p>
            <p className="text-xs text-white/70 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
