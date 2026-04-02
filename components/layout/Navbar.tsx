'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Destinations', href: '/packages' },
    { name: 'Journal', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

export function Navbar() {
    const [menuState, setMenuState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close menu on navigation
    useEffect(() => {
        setMenuState(false);
    }, [pathname]);

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed top-0 left-0 z-[100] w-full px-2 group">
                <div className={cn('mx-auto mt-4 max-w-6xl px-6 transition-all duration-300 lg:px-8', isScrolled && 'bg-[#285056]/90 max-w-4xl rounded-full border border-white/10 backdrop-blur-lg shadow-lg')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between lg:w-auto items-center">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Image
                                    src="/logo_text.webp"
                                    alt="BagPackerMe Logo"
                                    width={180}
                                    height={40}
                                    priority
                                    className="h-7 sm:h-8 w-auto object-contain relative z-20"
                                />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 block cursor-pointer p-2.5 lg:hidden text-white hover:text-[#C1EA00] transition-colors">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-body">
                                {menuItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block duration-150 transition-colors font-medium",
                                                    isActive || (!isScrolled && pathname === '/') ? "text-[#C1EA00]" : (isScrolled ? "text-white hover:text-[#C1EA00]" : "text-white drop-shadow-md hover:text-[#C1EA00]")
                                                )}>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className="bg-[#285056] group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base font-body">
                                    {menuItems.map((item, index) => {
                                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                        return (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "block duration-150 transition-colors",
                                                        isActive ? "text-[#C1EA00] font-bold" : "text-white/80 hover:text-[#C1EA00]"
                                                    )}>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-[#C1EA00] text-[#285056] hover:bg-[#C1EA00]/90 rounded-full px-6 w-full sm:w-auto font-semibold">
                                    <Link href="/contact">
                                        <span>Book Now</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
