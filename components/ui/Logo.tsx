import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.webp"
        alt="BagPackerMe Logo"
        width={160}
        height={48}
        className="w-auto h-8 md:h-10 object-contain"
        priority
      />
    </div>
  );
}
