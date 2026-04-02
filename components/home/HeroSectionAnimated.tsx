import React from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSectionAnimated() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden bg-[#221E2A] text-[#E9F5F7] min-h-screen">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(189,90%,48%,.08)_0,hsla(189,90%,48%,.02)_50%,hsla(189,90%,48%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(189,90%,48%,.06)_0,hsla(189,90%,48%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(74,100%,46%,.04)_0,hsla(74,100%,46%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring' as const,
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20 opacity-30">
                            <img
                                src="https://images.unsplash.com/photo-1542104068-0fc6c81ce2fb?q=80&w=3276&auto=format&fit=crop"
                                alt="Mount Bromo background"
                                className="absolute inset-x-0 top-0 -z-20 hidden lg:block object-cover h-[800px] w-full"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,#221E2A_75%)]" />
                        <div className="mx-auto max-w-7xl px-6 relative z-10">
                            <div className="text-center sm:mx-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/packages"
                                        className="hover:bg-[#E9F5F7]/10 bg-[#E9F5F7]/5 group mx-auto flex w-fit items-center gap-4 rounded-full border border-white/10 p-1 pl-4 shadow-md shadow-black/20 transition-all duration-300">
                                        <span className="text-[#E9F5F7] text-sm font-body">New: Custom Bromo Sunrise Packages</span>
                                        <span className="block h-4 w-0.5 border-l border-white/20"></span>

                                        <div className="bg-[#C1EA00] text-[#285056] group-hover:bg-[#C1EA00]/80 size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                        
                                    <h1
                                        className="font-display mt-8 max-w-5xl mx-auto text-balance text-5xl md:text-7xl lg:mt-16 xl:text-[5.25rem] text-[#E9F5F7]">
                                        Explore the Majestic <span className="text-[#C1EA00]">Mount Bromo</span>
                                    </h1>
                                    <p
                                        className="font-body mx-auto mt-8 max-w-2xl text-balance text-lg text-[#E9F5F7]/80">
                                        Handcrafted travel packages for unforgettable moments. Witness breathtaking sunrises, roam the sea of sand, and create memories that last forever.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-xl px-8 text-base bg-[#C1EA00] text-[#285056] hover:bg-[#C1EA00]/90 font-medium h-12">
                                        <Link href="/packages">
                                            <span className="text-nowrap">View Packages</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-12 rounded-xl px-8 border-[#0ED2E9]/30 text-[#0ED2E9] hover:bg-[#0ED2E9]/10 bg-transparent font-medium">
                                        <Link href="/contact">
                                            <span className="text-nowrap">Plan Custom Trip</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="relative z-10">
                            <div className="relative mt-12 overflow-hidden px-4 md:mt-20 flex justify-center">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-[#221E2A] absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#0ED2E9]/20 p-2 shadow-2xl shadow-[#0ED2E9]/10 bg-[#285056]/50 backdrop-blur-sm">
                                    <img
                                        className="aspect-video relative rounded-xl object-cover"
                                        src="https://images.unsplash.com/photo-1571509618118-c2b3e404b901?q=80&w=2700&auto=format&fit=crop"
                                        alt="Mount Bromo View"
                                        width="1920"
                                        height="1080"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                
                {/* Removed the trusted by logos section as it doesn't fit standard Mount Bromo tour agency vibe, unless they have specific partners. We replace it with a small divider or keep it clean. */}
                <section className="pb-16 pt-8 md:pb-32 relative z-10 text-center">
                    <p className="text-sm font-accent text-[#0ED2E9] tracking-widest uppercase">Trusted by Adventurers Worldwide</p>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Destinations', href: '/packages' },
    { name: 'Journal', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-50 w-full px-2 group">
                <div className={cn('mx-auto mt-4 max-w-6xl px-6 transition-all duration-300 lg:px-8', isScrolled && 'bg-[#285056]/80 max-w-4xl rounded-full border border-white/10 backdrop-blur-lg')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between lg:w-auto items-center">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <span className="font-display font-bold text-xl tracking-wide text-[#E9F5F7]">BagPackerMe</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 block cursor-pointer p-2.5 lg:hidden text-[#E9F5F7]">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-body">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-[#E9F5F7]/80 hover:text-[#C1EA00] block duration-150 transition-colors">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#285056] group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base font-body">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-[#E9F5F7]/80 hover:text-[#C1EA00] block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-[#C1EA00] text-[#285056] hover:bg-[#C1EA00]/90 rounded-full px-6 w-full sm:w-auto">
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
