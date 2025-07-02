'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Typography } from '@/components/design/typography';
import type { Member } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

interface PolaroidCardProps {
  member: Member;
  size?: 'small' | 'medium' | 'large';
  rotation?: number;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  small: 'w-48 h-60',
  medium: 'w-64 h-80',
  large: 'w-80 h-96',
};

const PolaroidCard = forwardRef<HTMLDivElement, PolaroidCardProps>(
  ({ member, size = 'medium', rotation = 0, interactive = true, onClick, className }, ref) => {
    const handleClick = () => {
      if (interactive && onClick) {
        onClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'bg-polaroid-white border-polaroid-border border-8 shadow-polaroid cursor-pointer',
          sizeClasses[size],
          interactive && 'hover:shadow-lg transition-all duration-300',
          className
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={interactive ? { y: -8, scale: 1.02 } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive ? 0 : -1}
        role={interactive ? 'button' : 'img'}
        aria-label={interactive ? `View ${member.name}'s profile` : `Photo of ${member.name}`}
      >
        {/* Pin */}
        <div
          className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full shadow-sm z-10 bg-pin-${member.pin_color}`}
        />

        {/* Photo */}
        <div className="relative w-full h-3/4 bg-gray-100 overflow-hidden">
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={`Photo of ${member.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cork-light to-cork-brown/20 flex items-center justify-center">
              <Typography variant="handwritten-large" color="muted">
                {member.name.charAt(0).toUpperCase()}
              </Typography>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="p-4 h-1/4 flex flex-col justify-center">
          <Typography variant="handwritten-medium" color="primary" className="text-center">
            {member.name}
          </Typography>
          {member.role && (
            <Typography variant="body-small" color="secondary" className="text-center mt-1">
              {member.role}
            </Typography>
          )}
          {member.company && (
            <Typography variant="body-small" color="muted" className="text-center">
              {member.company}
            </Typography>
          )}
        </div>
      </motion.div>
    );
  }
);

PolaroidCard.displayName = 'PolaroidCard';

export { PolaroidCard };