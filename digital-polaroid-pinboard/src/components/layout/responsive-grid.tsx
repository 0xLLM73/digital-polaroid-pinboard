'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'polaroids' | 'cards' | 'tiles';
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

const gridVariants = {
  polaroids: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max',
  cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max',
  tiles: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 auto-rows-max',
};

const gapVariants = {
  small: 'gap-4',
  medium: 'gap-6',
  large: 'gap-8',
};

export function ResponsiveGrid({
  children,
  variant = 'polaroids',
  gap = 'medium',
  className,
}: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        gridVariants[variant],
        gapVariants[gap],
        'place-items-center justify-items-center',
        className
      )}
    >
      {children}
    </div>
  );
}