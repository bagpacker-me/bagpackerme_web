import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const isLight = variant === 'light';
  const color = isLight ? '#FFFFFF' : '#285056';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <mask id="strap-mask" maskUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="white" />
          <rect x="0" y="24" width="32" height="2" fill="black" />
        </mask>
        <g mask="url(#strap-mask)" fill={color}>
          {/* Top Flap (shorter) */}
          <path d="M4 4C4 2.89543 4.89543 2 6 2H16C20.4183 2 24 5.58172 24 10C24 14.4183 20.4183 18 16 18H6C4.89543 18 4 17.1046 4 16V4Z" />
          {/* Bottom Body (taller) */}
          <path d="M4 14C4 12.8954 4.89543 12 6 12H18C23.5228 12 28 16.4772 28 22C28 27.5228 23.5228 32 18 32H6C4.89543 32 4 31.1046 4 30V14Z" />
        </g>
      </svg>
      <span
        style={{ color }}
        className="font-display text-xl font-bold uppercase tracking-widest mt-1"
      >
        BAGPACKERME
      </span>
    </div>
  );
}
