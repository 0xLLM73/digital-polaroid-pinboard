/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cork board colors
        cork: {
          50: '#FDF8F3',
          100: '#F9F0E6',
          200: '#F0E0CC',
          300: '#E6D0B3',
          400: '#DCC099',
          500: '#D2B48C', // Main cork color
          600: '#C4A373',
          700: '#B8935A',
          800: '#A0522D',
          900: '#8B4513',
          950: '#654321',
          brown: '#8B4513',
          light: '#D2B48C',
          dark: '#654321',
          texture: '#A0522D',
        },
        
        // Polaroid colors
        polaroid: {
          50: '#FEFEFE',
          100: '#FDFDFD',
          200: '#FBFBFB',
          300: '#F9F9F9',
          400: '#F7F7F7',
          500: '#F9F8F6', // Main polaroid white
          600: '#F5F4F2',
          700: '#F1F0EE',
          800: '#E8E6E3',
          900: '#DDD9D4',
          white: '#F9F8F6',
          cream: '#FDF6E3',
          border: '#E8E6E3',
          shadow: 'rgba(0, 0, 0, 0.15)',
        },
        
        // Pin colors with full palette
        pin: {
          cherry: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#DC143C', // Main cherry
            600: '#C41E3A',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          mustard: {
            50: '#FFFEF0',
            100: '#FFFCE0',
            200: '#FFF9C2',
            300: '#FFF59D',
            400: '#FFF176',
            500: '#FFDB58', // Main mustard
            600: '#FFD54F',
            700: '#FFCA28',
            800: '#FFB300',
            900: '#FF8F00',
          },
          teal: {
            50: '#F0FDFA',
            100: '#CCFBF1',
            200: '#99F6E4',
            300: '#5EEAD4',
            400: '#2DD4BF',
            500: '#008B8B', // Main teal
            600: '#0D9488',
            700: '#0F766E',
            800: '#115E59',
            900: '#134E4A',
          },
          lavender: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#E6E6FA', // Main lavender
            600: '#A855F7',
            700: '#9333EA',
            800: '#7C3AED',
            900: '#6B21A8',
          },
        },
        
        // Text colors with semantic naming
        text: {
          primary: '#2C1810',
          secondary: '#5D4E37',
          muted: '#8B7355',
          inverse: '#F9F8F6',
          accent: '#8B4513',
        },
        
        // Semantic colors
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      
      // Extended spacing for nostalgic layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Custom border radius for authentic shapes
      borderRadius: {
        'polaroid': '0.125rem',
        'vintage': '0.25rem',
      },
      
      // Enhanced shadows for depth and authenticity
      boxShadow: {
        'polaroid': '0 4px 8px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'polaroid-hover': '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(0, 0, 0, 0.15)',
        'polaroid-active': '0 2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
        'pin': '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
        'cork': 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'vintage': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'handwritten': '0 1px 2px rgba(139, 69, 19, 0.2)',
      },
      
      // Typography enhancements
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Alfa Slab One', 'serif'],
        handwritten: ['Kalam', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
        vintage: ['Playfair Display', 'serif'],
      },
      
      // Responsive font sizes with fluid scaling
      fontSize: {
        'xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.25' }],
        'sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.5' }],
        'lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', { lineHeight: '1.5' }],
        'xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.25' }],
        '2xl': ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.25' }],
        '3xl': ['clamp(2rem, 1.7rem + 1.5vw, 2.5rem)', { lineHeight: '1.25' }],
        '4xl': ['clamp(2.5rem, 2rem + 2vw, 3rem)', { lineHeight: '1.1' }],
        '5xl': ['clamp(3rem, 2.5rem + 2.5vw, 3.5rem)', { lineHeight: '1.1' }],
        '6xl': ['clamp(3.5rem, 3rem + 3vw, 4rem)', { lineHeight: '1' }],
        '7xl': ['clamp(4rem, 3.5rem + 3.5vw, 4.5rem)', { lineHeight: '1' }],
      },
      
      // Animation and transition enhancements
      animation: {
        'polaroid-hover': 'polaroid-hover 0.3s ease-out',
        'polaroid-flip': 'polaroid-flip 0.6s ease-in-out',
        'pin-pulse': 'pin-pulse 0.6s ease-in-out infinite',
        'pin-wiggle': 'pin-wiggle 0.5s ease-in-out',
        'cork-texture': 'cork-texture 20s linear infinite',
        'handwritten-draw': 'handwritten-draw 2s ease-out',
        'vintage-fade': 'vintage-fade 1s ease-in-out',
        'nostalgic-float': 'nostalgic-float 3s ease-in-out infinite',
      },
      
      keyframes: {
        'polaroid-hover': {
          '0%': { transform: 'translateY(0) scale(1) rotateZ(0deg)' },
          '100%': { transform: 'translateY(-8px) scale(1.02) rotateZ(1deg)' },
        },
        'polaroid-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        'pin-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'pin-wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        'cork-texture': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        'handwritten-draw': {
          '0%': { strokeDasharray: '0 100%' },
          '100%': { strokeDasharray: '100% 0' },
        },
        'vintage-fade': {
          '0%': { opacity: '0', filter: 'sepia(100%) hue-rotate(30deg)' },
          '100%': { opacity: '1', filter: 'sepia(20%) hue-rotate(10deg)' },
        },
        'nostalgic-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // Custom gradients for nostalgic effects
      backgroundImage: {
        'cork-grain': `
          radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.15) 1px, transparent 0),
          linear-gradient(45deg, transparent 40%, rgba(160, 82, 45, 0.1) 50%, transparent 60%)
        `,
        'polaroid-texture': `
          radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0),
          linear-gradient(45deg, transparent 40%, rgba(0, 0, 0, 0.02) 50%, transparent 60%)
        `,
        'vintage-paper': `
          linear-gradient(45deg, #fdf6e3 25%, transparent 25%),
          linear-gradient(-45deg, #fdf6e3 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #fdf6e3 75%),
          linear-gradient(-45deg, transparent 75%, #fdf6e3 75%)
        `,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}