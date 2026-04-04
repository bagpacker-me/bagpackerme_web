'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, Star } from 'lucide-react';
import Image from 'next/image';

const destinations = [
  {
    id: 'kerala',
    title: 'KERALA',
    location: 'Munnar, Kerala',
    description: "Experience the tranquil backwaters, lush tea gardens, and vibrant culture of God's Own Country. A perfect blend of nature and heritage.",
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920',
    rating: '5.0',
  },
  {
    id: 'rajasthan',
    title: 'RAJASTHAN',
    location: 'Jaipur, Rajasthan',
    description: 'Step into the land of kings. Discover majestic forts, opulent palaces, and the golden sands of the Thar desert in vibrant colors.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1920',
    rating: '5.0',
  },
  {
    id: 'ladakh',
    title: 'LADAKH',
    location: 'Pangong Tso, Ladakh',
    description: 'Journey to the high mountain passes. Witness crystal clear lakes, ancient monasteries, and stark Himalayan beauty at the top of the world.',
    image: 'https://images.unsplash.com/photo-1542458402-998cbcc1fc46?auto=format&fit=crop&q=80&w=1920',
    rating: '5.0',
  },
  {
    id: 'kashmir',
    title: 'KASHMIR',
    location: 'Dal Lake, Srinagar',
    description: 'Often called Heaven on Earth. Glide on shikaras, walk through Mughal gardens, and soak in the awe-inspiring alpine scenery.',
    image: 'https://images.unsplash.com/photo-1466036692599-070d032f4711?auto=format&fit=crop&q=80&w=1920',
    rating: '4.9',
  },
  {
    id: 'goa',
    title: 'GOA',
    location: 'Palolem, Goa',
    description: 'Beyond the pristine beaches lies a rich Portuguese heritage. Enjoy vibrant nightlife, historic churches, and serene sunsets.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1920',
    rating: '4.8',
  }
];

export default function HeroInteractive() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalSlides = destinations.length;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (!isClient) {
    return <div className="h-screen w-screen bg-void" />;
  }

  const activeDest = destinations[currentIndex];
  const stringIndex = String(currentIndex + 1).padStart(2, '0');
  const stringTotal = String(totalSlides).padStart(2, '0');
  
  // Calculate the upcoming slides for the carousel
  const upcomingSlides = [
    destinations[(currentIndex + 1) % totalSlides],
    destinations[(currentIndex + 2) % totalSlides],
    destinations[(currentIndex + 3) % totalSlides],
  ];

  const nextDest = destinations[(currentIndex + 1) % totalSlides];

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-void font-sans text-white">
      {/* Background Images Crossfade */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeDest.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image 
            src={activeDest.image} 
            alt={activeDest.title}
            fill
            className="object-cover"
            priority
          />
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>



      {/* Main Content Area (Left Side) */}
      <div className="absolute inset-y-0 left-[5vw] z-40 flex flex-col justify-center w-[90%] md:w-[45%] pointer-events-none">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={activeDest.id}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="pointer-events-auto"
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tight leading-[0.9] mb-4">
              {activeDest.title}
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-md opacity-80 leading-relaxed">
              {activeDest.description}
            </p>
            <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all group font-medium uppercase tracking-widest text-sm">
              Explore
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Edge Accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-40 w-[5vw]">
        <span className="text-xs font-medium rotate-[-90deg] uppercase tracking-widest opacity-60">
          Slide {stringIndex}
        </span>
        <div className="w-[1px] h-24 bg-white/30" />
        <Plus size={14} className="opacity-60" />
      </div>

      {/* The Carousel / Card Slider (Right Side) */}
      <div className="absolute top-[15%] bottom-[15%] right-0 w-[45vw] z-40 hidden md:flex items-center">
        <div className="relative w-full h-full flex items-center">
          <AnimatePresence mode="popLayout">
            {upcomingSlides.map((slide, i) => {
              // Creating a staggered visual layout for the cards
              const xOffset = i * 280; 
              const scale = 1 - (i * 0.1);
              const opacity = 1 - (i * 0.2);
              const zIndex = 30 - i;
              
              if (i > 1.5) return null; // Show only about 2.5 cards

              return (
                <motion.div
                  key={`${slide.id}-${currentIndex}`} // Force re-animation on index change
                  initial={{ x: xOffset + 100, opacity: 0 }}
                  animate={{ x: xOffset, scale, opacity }}
                  exit={{ x: -100, opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute w-[240px] h-[360px] rounded-[24px] overflow-hidden shadow-2xl cursor-pointer"
                  style={{ zIndex, transformOrigin: 'left center' }}
                  onClick={handleNext}
                >
                  <Image 
                    src={slide.image} 
                    alt={slide.location}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Left: Destination Name & Rating */}
                  <div className="absolute top-4 left-4 right-16">
                    <h3 className="font-bold text-lg leading-tight mb-1">{slide.location}</h3>
                    <div className="flex items-center gap-1 text-lime text-xs font-semibold">
                      <Star size={12} fill="currentColor" />
                      <span>{slide.rating}</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls (Footer Area) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] py-8">
        {/* Left Side: Watermark Text */}
        <div className="w-[30%]">
          <AnimatePresence mode="wait">
            <motion.h2
              key={nextDest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-6xl md:text-8xl font-display font-extrabold uppercase text-white/5 whitespace-nowrap pointer-events-none tracking-tighter"
            >
              {nextDest.title}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Center: Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Right Side: Pagination */}
        <div className="flex items-center gap-3 text-sm font-medium tracking-widest min-w-[120px] justify-end">
          <span className="opacity-100">{stringIndex}</span>
          <div className="w-12 h-[2px] bg-white/30 relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="opacity-50">{stringTotal}</span>
        </div>
      </div>
    </section>
  );
}
