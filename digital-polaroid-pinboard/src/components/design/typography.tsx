import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant:
    | 'display-large'
    | 'display-medium'
    | 'handwritten-large'
    | 'handwritten-medium'
    | 'handwritten-small'
    | 'body-large'
    | 'body-medium'
    | 'body-small'
    | 'label-large'
    | 'label-medium'
    | 'label-small';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  as?: keyof JSX.IntrinsicElements;
}

const typographyVariants = {
  'display-large': 'font-display text-4xl font-bold leading-tight tracking-tight',
  'display-medium': 'font-display text-3xl font-bold leading-tight tracking-tight',
  'handwritten-large': 'font-handwritten text-2xl font-bold leading-relaxed',
  'handwritten-medium': 'font-handwritten text-xl font-semibold leading-relaxed',
  'handwritten-small': 'font-handwritten text-lg font-medium leading-relaxed',
  'body-large': 'text-lg leading-relaxed',
  'body-medium': 'text-base leading-normal',
  'body-small': 'text-sm leading-normal',
  'label-large': 'text-sm font-medium leading-none',
  'label-medium': 'text-xs font-medium leading-none',
  'label-small': 'text-xs font-normal leading-none',
};

const colorVariants = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  accent: 'text-cork-brown',
};

export function Typography({
  variant,
  color = 'primary',
  as: Component = 'p',
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(
        typographyVariants[variant],
        colorVariants[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}