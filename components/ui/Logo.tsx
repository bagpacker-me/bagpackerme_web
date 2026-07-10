import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'text';
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = 'light', className = '', priority = false }: LogoProps) {
  const src = variant === 'text' ? '/text_w.webp' : (variant === 'dark' ? '/logo_b.webp' : '/logo_w.webp');

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={src}
        alt="BagPackerMe Logo"
        width={160}
        height={48}
        className="w-auto h-8 md:h-10 object-contain"
        priority={priority}
        sizes="160px"
      />
    </div>
  );
}
