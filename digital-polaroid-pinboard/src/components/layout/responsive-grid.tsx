'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ResponsiveGridProps {
  children: React.ReactNode;
  variant?: 'polaroids' | 'pins' | 'gallery';
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  variant = 'polaroids', 
  gap = 'medium',
  className = '' 
}: ResponsiveGridProps) {
  const gridClasses = {
    polaroids: `
      grid grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      2xl:grid-cols-5
    `,
    pins: `
      grid grid-cols-2 
      sm:grid-cols-3 
      md:grid-cols-4 
      lg:grid-cols-6 
      xl:grid-cols-8
    `,
    gallery: `
      grid grid-cols-1 
      md:grid-cols-2 
      xl:grid-cols-3
    `,
  };

  const gapClasses = {
    small: 'gap-4',
    medium: 'gap-6',
    large: 'gap-8',
  };

  return (
    <motion.div
      className={`${gridClasses[variant]} ${gapClasses[gap]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}