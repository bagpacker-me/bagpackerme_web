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
                className="fixed top-0 left-0 z-[100] w-full px-4 group transition-all duration-300 pointer-events-none">
                <div className={cn(
                    'mx-auto mt-4 max-w-6xl transition-all duration-500 pointer-events-auto',
                    isScrolled ? 'bg-teal/85 max-w-4xl rounded-full border border-white/10 backdrop-blur-xl shadow-card-teal-hover px-6' : 'bg-transparent px-4'
                )}>
                    <div className="relative flex items-center justify-between py-4">
                        <Link
                            href="/"
                            aria-label="home"
                            className="flex items-center space-x-2 transition-opacity hover:opacity-80 z-50">
                            <Image
                                src="/logo_w.webp"
                                alt="BagPackerMe Logo"
                                width={160}
                                height={32}
                                priority
                                className="h-6 sm:h-8 w-auto object-contain"
                            />
                        </Link>

                        {/* Desktop Nav Links — Centered */}
                        <div className="absolute inset-x-0 mx-auto hidden w-fit lg:block">
                            <ul className="flex items-center gap-8 text-sm font-body">
                                {menuItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                    return (
                                        <li key={index} className="relative group/link">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block py-2 transition-colors font-medium tracking-wide uppercase text-xs",
                                                    isActive
                                                        ? "text-lime drop-shadow-[0_0_8px_rgba(193,234,0,0.5)]"
                                                        : "text-white/80 hover:text-white"
                                                )}>
                                                <span>{item.name}</span>
                                            </Link>
                                            {/* Hover indicator */}
                                            <div className={cn("absolute -bottom-1 left-0 h-[2px] bg-lime transition-all duration-300", isActive ? "w-full" : "w-0 group-hover/link:w-full")} />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Desktop CTA & Mobile Toggle */}
                        <div className="flex items-center gap-4 z-50">
                            <Button
                                asChild
                                size="sm"
                                className="hidden lg:inline-flex bg-lime text-teal hover:bg-lime/90 rounded-full px-6 font-bold font-display tracking-widest uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lime-sm">
                                <Link href="/contact">Book Now</Link>
                            </Button>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative block lg:hidden p-2 text-white hover:text-lime transition-colors">
                                <Menu className={cn("size-7 transition-all duration-300", menuState ? "rotate-180 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100")} />
                                <X className={cn("size-7 transition-all duration-300", menuState ? "rotate-0 scale-100 opacity-100" : "-rotate-180 scale-0 opacity-0 absolute")} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Overlay */}
                <div className={cn(
                    "fixed inset-0 top-[76px] bg-void/90 backdrop-blur-xl transition-all duration-300 lg:hidden pointer-events-auto",
                    menuState ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}>
                    <div className="flex flex-col h-full p-8 border-t border-white/10">
                        <ul className="flex flex-col gap-6 text-xl font-display font-medium uppercase tracking-widest mt-8">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "block py-2 transition-colors",
                                                isActive ? "text-lime" : "text-white/80 hover:text-white"
                                            )}>
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="mt-12">
                            <Button
                                asChild
                                size="lg"
                                className="w-full bg-lime text-teal hover:bg-lime/90 rounded-full font-bold font-display tracking-widest uppercase transition-all duration-300 hover:shadow-glow-lime">
                                <Link href="/contact">Book Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
