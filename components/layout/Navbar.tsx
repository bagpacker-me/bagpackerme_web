'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const menuItems = [
    { name: 'Destinations', href: '/packages' },
    { name: 'Journal', href: '/blog' },
    { name: 'About Us', href: '/about' },
]

export function Navbar() {
    const [menuState, setMenuState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
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
                <div className={cn(
                    'mx-auto mt-4 max-w-6xl px-6 transition-all duration-500 lg:px-8',
                    isScrolled && 'bg-teal/95 max-w-4xl rounded-full border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(40,80,86,0.30)]'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between lg:w-auto items-center">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                                <Image
                                    src="/logo_w.webp"
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
                                className="relative z-20 block cursor-pointer p-2.5 lg:hidden text-white hover:text-lime transition-colors">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        {/* Desktop Nav Links — centered with animated indicator */}
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-body">
                                {menuItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                    return (
                                        <li key={index} className="relative">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block py-1 duration-150 transition-colors font-medium",
                                                    isActive
                                                        ? "text-lime"
                                                        : "text-white/90 drop-shadow-md hover:text-white"
                                                )}>
                                                <span>{item.name}</span>
                                            </Link>
                                            {/* Animated lime underline for active link */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-active-indicator"
                                                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-lime rounded-full"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Mobile Drawer + Desktop CTA */}
                        <div className="bg-teal group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
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
                                                        isActive ? "text-lime font-bold" : "text-white/80 hover:text-white"
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
                                    className="bg-lime text-teal hover:bg-lime/90 hover:shadow-[0_4px_20px_rgba(193,234,0,0.35)] rounded-full px-6 w-full sm:w-auto font-bold font-display tracking-wide transition-all duration-200">
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
