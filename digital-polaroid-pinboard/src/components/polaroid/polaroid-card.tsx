'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import type { Member } from '@/lib/supabase/types';

interface PolaroidCardProps {
  member: Member;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  rotation?: number;
  interactive?: boolean;
  className?: string;
}

export function PolaroidCard({ 
  member, 
  onClick, 
  size = 'medium', 
  rotation = 0, 
  interactive = true,
  className = '' 
}: PolaroidCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for 3D effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  // Spring animations
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const sizeClasses = {
    small: 'w-48 h-56',
    medium: 'w-64 h-80',
    large: 'w-80 h-96',
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / 5);
    y.set((event.clientY - centerY) / 5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const pinColorClasses = {
    cherry: 'bg-pin-cherry-500',
    mustard: 'bg-pin-mustard-500',
    teal: 'bg-pin-teal-500',
    lavender: 'bg-pin-lavender-500',
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer select-none ${sizeClasses[size]} ${className}`}
      style={{
        perspective: 1000,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        rotateZ: rotation,
      }}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={interactive ? { 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onClick={onClick}
      drag={interactive}
      dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
      dragElastic={0.1}
    >
      {/* Polaroid frame */}
      <div className="relative w-full h-full bg-polaroid-white rounded-sm shadow-polaroid transform-gpu">
        {/* Photo area */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-sm overflow-hidden m-3 mb-0">
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={`Photo of ${member.name}`}
              fill
              className="object-cover"
              sizes={`(max-width: 768px) 100vw, ${size === 'small' ? '192px' : size === 'medium' ? '256px' : '320px'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl font-handwritten text-gray-400">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Photo overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 pointer-events-none" />
          
          {/* Vintage photo effects */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-sm" />
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-black/20 rounded-full blur-sm" />
          </div>
        </div>

        {/* Text area */}
        <div className="p-3 pt-4 space-y-1">
          <h3 className="font-handwritten text-lg text-center text-text-primary leading-tight">
            {member.name}
          </h3>
          
          {member.role && (
            <p className="text-sm text-text-secondary text-center font-sans">
              {member.role}
            </p>
          )}
          
          {member.company && (
            <p className="text-xs text-text-muted text-center font-sans">
              {member.company}
            </p>
          )}
        </div>

        {/* Pin */}
        <motion.div
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${pinColorClasses[member.pin_color]} shadow-pin border-2 border-white`}
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%), ${pinColorClasses[member.pin_color].replace('bg-', '')}`,
          }}
          animate={isHovered ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{ duration: 0.5 }}
        />

        {/* Hover effects */}
        {isHovered && interactive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 rounded-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-sm"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0),
              linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%)
            `,
            backgroundSize: '20px 20px, 40px 40px',
          }}
        />
      </div>

      {/* Drop shadow */}
      <div 
        className="absolute inset-0 bg-black/20 rounded-sm -z-10 blur-sm"
        style={{
          transform: `translate(${isHovered ? '8px' : '4px'}, ${isHovered ? '12px' : '8px'})`,
          transition: 'transform 0.2s ease-out',
        }}
      />
    </motion.div>
  );
}