'use client';

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'

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
                        <div
                            className="absolute inset-0 -z-20 opacity-30 pointer-events-none"
                            dangerouslySetInnerHTML={{
                                __html: `
                                <video
                                    autoplay
                                    loop
                                    muted
                                    playsinline
                                    class="absolute inset-x-0 top-0 object-cover h-[800px] w-full"
                                >
                                    <source src="/hero_bg.webm" type="video/webm" />
                                </video>
                                `
                            }}
                        />
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,#221E2A_75%)]" />
                        <div className="mx-auto max-w-7xl px-6 relative z-10">
                            <div className="text-center sm:mx-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>

                        
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


