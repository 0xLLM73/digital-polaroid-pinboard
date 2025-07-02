'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CorkBoardBackgroundProps {
  variant?: 'light' | 'medium' | 'dark';
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CorkBoardBackground({ 
  variant = 'medium', 
  animated = true, 
  children, 
  className = '' 
}: CorkBoardBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Generate cork texture
    generateCorkTexture(ctx, dimensions.width, dimensions.height, variant);
  }, [dimensions, variant]);

  const generateCorkTexture = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    variant: string
  ) => {
    // Base cork color based on variant
    const baseColors = {
      light: { r: 210, g: 180, b: 140 },
      medium: { r: 160, g: 130, b: 90 },
      dark: { r: 120, g: 90, b: 60 },
    };

    const baseColor = baseColors[variant as keyof typeof baseColors];

    // Create base gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgb(${baseColor.r + 20}, ${baseColor.g + 20}, ${baseColor.b + 20})`);
    gradient.addColorStop(0.5, `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`);
    gradient.addColorStop(1, `rgb(${baseColor.r - 20}, ${baseColor.g - 20}, ${baseColor.b - 20})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add cork grain texture
    for (let i = 0; i < width * height / 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.3 + 0.1;

      ctx.fillStyle = `rgba(${baseColor.r + Math.random() * 40 - 20}, ${baseColor.g + Math.random() * 40 - 20}, ${baseColor.b + Math.random() * 40 - 20}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add subtle wood grain lines
    for (let i = 0; i < 20; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = startX + Math.random() * 200 - 100;
      const endY = startY + Math.random() * 20 - 10;

      ctx.strokeStyle = `rgba(${baseColor.r - 30}, ${baseColor.g - 30}, ${baseColor.b - 30}, 0.1)`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {animated && (
        <motion.div
          className="fixed inset-0 -z-5 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(101, 67, 33, 0.1) 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}