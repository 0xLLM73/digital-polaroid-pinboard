'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      // Display typography
      'display-large': 'font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cork-brown leading-tight',
      'display-medium': 'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-cork-brown leading-tight',
      'display-small': 'font-display text-2xl md:text-3xl lg:text-4xl font-bold text-cork-brown leading-tight',
      
      // Handwritten typography
      'handwritten-large': 'font-handwritten text-2xl md:text-3xl text-text-primary leading-relaxed',
      'handwritten-medium': 'font-handwritten text-xl md:text-2xl text-text-primary leading-relaxed',
      'handwritten-small': 'font-handwritten text-lg md:text-xl text-text-primary leading-relaxed',
      'handwritten-caption': 'font-handwritten text-base md:text-lg text-text-secondary leading-relaxed',
      
      // Body typography
      'body-large': 'font-sans text-lg md:text-xl text-text-primary leading-relaxed',
      'body-medium': 'font-sans text-base md:text-lg text-text-primary leading-relaxed',
      'body-small': 'font-sans text-sm md:text-base text-text-primary leading-relaxed',
      'body-caption': 'font-sans text-xs md:text-sm text-text-secondary leading-relaxed',
      
      // Label typography
      'label-large': 'font-sans text-sm md:text-base font-medium text-text-primary uppercase tracking-wide',
      'label-medium': 'font-sans text-xs md:text-sm font-medium text-text-secondary uppercase tracking-wide',
      'label-small': 'font-sans text-xs font-medium text-text-muted uppercase tracking-wider',
      
      // Vintage typography
      'vintage-heading': 'font-display text-xl md:text-2xl font-bold text-cork-brown tracking-wide',
      'vintage-subheading': 'font-sans text-base md:text-lg font-semibold text-text-secondary tracking-wide',
      'vintage-body': 'font-sans text-sm md:text-base text-text-primary leading-loose',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    color: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      muted: 'text-text-muted',
      inverse: 'text-text-inverse',
      cork: 'text-cork-brown',
      'cork-light': 'text-cork-light',
      'cork-dark': 'text-cork-dark',
    },
  },
  defaultVariants: {
    variant: 'body-medium',
    align: 'left',
    color: 'primary',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  children: React.ReactNode;
}

export function Typography({
  className,
  variant,
  align,
  color,
  as: Component = 'p',
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(typographyVariants({ variant, align, color, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

// Specialized typography components
export function HandwrittenText({ 
  children, 
  size = 'medium',
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'caption';
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Typography
      as="span"
      variant={`handwritten-${size}` as any}
      className={cn('relative', className)}
      {...props}
    >
      {children}
      {/* Handwritten underline effect */}
      <span 
        className="absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-30"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            currentColor 10%, 
            currentColor 90%, 
            transparent 100%
          )`,
          transform: 'rotate(-0.5deg) scaleY(0.5)',
        }}
      />
    </Typography>
  );
}

export function VintageLabel({ 
  children, 
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <Typography
      as="label"
      variant="label-medium"
      className={cn(
        'relative inline-block px-2 py-1 bg-polaroid-cream border border-cork-light rounded-sm shadow-sm',
        className
      )}
      {...props}
    >
      {children}
      {/* Vintage label tape effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 pointer-events-none" />
    </Typography>
  );
}