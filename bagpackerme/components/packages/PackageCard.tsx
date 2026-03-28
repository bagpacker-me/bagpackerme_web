'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Package } from '@/types';

// ─── Shimmer Skeleton ────────────────────────────────────────────────────────

function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background:
          'linear-gradient(90deg, #E9F5F7 0%, #F7F9FA 50%, #E9F5F7 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
        ...style,
      }}
    />
  );
}

export function PackageCardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div
        style={{
          borderRadius: 0,
          overflow: 'hidden',
          background: '#ffffff',
          cursor: 'default',
        }}
      >
        {/* Image area */}
        <div className="aspect-[3/2] md:aspect-[4/5] overflow-hidden relative">
          <SkeletonBlock style={{ position: 'absolute', inset: 0 }} />
        </div>

        {/* Body */}
        <div className="p-[16px] md:p-[24px]">
          {/* Badge */}
          <SkeletonBlock
            style={{ width: 72, height: 20, marginBottom: 16, borderRadius: 0 }}
          />
          {/* Title line 1 */}
          <SkeletonBlock style={{ width: '90%', height: 22, marginBottom: 8 }} />
          {/* Title line 2 */}
          <SkeletonBlock style={{ width: '60%', height: 22, marginBottom: 12 }} />
          {/* Tagline line 1 */}
          <SkeletonBlock style={{ width: '100%', height: 16, marginBottom: 6 }} />
          {/* Tagline line 2 */}
          <SkeletonBlock style={{ width: '75%', height: 16, marginBottom: 16 }} />
          {/* Separator */}
          <div style={{ height: 1, background: '#E9F5F7', margin: '16px 0' }} />
          {/* Meta + price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SkeletonBlock style={{ width: 100, height: 16 }} />
            <SkeletonBlock style={{ width: 120, height: 20 }} />
          </div>
          {/* Separator */}
          <div style={{ height: 1, background: '#E9F5F7', margin: '16px 0' }} />
          {/* CTA row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBlock style={{ width: 120, height: 16 }} />
            <SkeletonBlock style={{ width: 16, height: 16 }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PackageCardProps {
  package: Package;
  showDestinations?: boolean;
  showSkeleton?: boolean;
  priority?: boolean;
}

// ─── PackageCard ─────────────────────────────────────────────────────────────

export default function PackageCard({
  package: pkg,
  showDestinations = false,
  showSkeleton = false,
  priority = false,
}: PackageCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  if (showSkeleton) return <PackageCardSkeleton />;

  // ── Card lift animation ──
  const cardMotion = prefersReducedMotion
    ? {}
    : {
        whileHover: { y: -8 },
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
      };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <motion.div
        {...cardMotion}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          borderRadius: 0,
          overflow: 'hidden',
          background: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="article"
        aria-label={pkg.title}
      >
        <Link
          href={`/packages/${pkg.slug}`}
          style={{ display: 'contents' }}
          tabIndex={0}
          aria-label={`Explore ${pkg.title}`}
        >
          {/* ── Image section ─────────────────────────────────────────── */}
          <div
            className="aspect-[3/2] md:aspect-[4/5] overflow-hidden relative"
          >
            {/* Next.js Image */}
            <Image
              src={pkg.heroImageUrl}
              alt={`${pkg.title} — ${pkg.category} journey`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={priority}
              style={{
                objectFit: 'cover',
                transition: 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)',
                transform: isHovered && !prefersReducedMotion ? 'scale(1.06)' : 'scale(1)',
              }}
            />

            {/* Category badge */}
            <span
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                background: '#C1EA00',
                color: '#221E2A',
                borderRadius: 0,
                zIndex: 2,
                lineHeight: 1,
              }}
            >
              {pkg.category}
            </span>

            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(40,80,86,0.84)',
                opacity: isHovered && !prefersReducedMotion ? 1 : 0,
                transition: 'opacity 400ms ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                zIndex: 3,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <ArrowRight size={24} color="#ffffff" strokeWidth={2} />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                }}
              >
                View Journey
              </span>
            </div>
          </div>

          {/* ── Content section ───────────────────────────────────────── */}
          <div className="p-[16px] md:p-[24px] flex flex-col flex-1">

            {/* Title */}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: '#221E2A',
                lineHeight: 1.25,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0,
                marginBottom: 6,
              }}
            >
              {pkg.title}
            </h3>

            {/* Tagline */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 400,
                color: '#718096',
                marginBottom: 12,
                marginTop: 0,
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {pkg.tagline}
            </p>

            {/* Destination tags — only on listing page */}
            {showDestinations && pkg.destinations && pkg.destinations.length > 0 && (() => {
              const MAX = 3;
              const shown = pkg.destinations.slice(0, MAX);
              const overflow = pkg.destinations.length - MAX;
              return (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginBottom: 12,
                    alignItems: 'center',
                  }}
                >
                  {shown.map((dest, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        background: '#F3F4F6',
                        color: '#4a5568',
                        padding: '3px 8px',
                        borderRadius: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {dest}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span className="dest-overflow-pill">+{overflow} more</span>
                  )}
                </div>
              );
            })()}

            {/* Meta row: duration (left) + price (right) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
              }}
            >
              {/* Duration */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Clock size={14} color="#285056" strokeWidth={2} />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#285056',
                  }}
                >
                  {pkg.duration}
                </span>
              </div>

              {/* Price: Indian Rupee formatting, font-variant-numeric oldstyle-nums */}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#285056',
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'oldstyle-nums',
                }}
              >
                From ₹{pkg.priceInr.toLocaleString('en-IN')}/person
              </span>
            </div>

            {/* Separator */}
            <div
              style={{
                height: 1,
                background: '#E9F5F7',
                margin: '16px 0',
              }}
            />

            {/* CTA row */}
            <CTARow isHovered={isHovered} prefersReducedMotion={!!prefersReducedMotion} />
          </div>
        </Link>
      </motion.div>
    </>
  );
}

// ─── CTA Row (isolated for clean hover transition) ───────────────────────────

function CTARow({
  isHovered,
  prefersReducedMotion,
}: {
  isHovered: boolean;
  prefersReducedMotion: boolean;
}) {
  const active = isHovered && !prefersReducedMotion;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'color 200ms ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          fontWeight: 700,
          color: active ? '#C1EA00' : '#285056',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'color 200ms ease',
        }}
      >
        Explore Journey
      </span>

      <ArrowRight
        size={16}
        color={active ? '#C1EA00' : '#285056'}
        strokeWidth={2}
        style={{
          transform: active ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 200ms ease, color 200ms ease',
          flexShrink: 0,
        }}
      />
    </div>
  );
}
