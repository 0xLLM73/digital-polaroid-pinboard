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
        cork: {
          brown: '#8B4513',
          light: '#D2B48C',
          dark: '#654321',
          texture: '#A0522D',
        },
        polaroid: {
          white: '#F9F8F6',
          cream: '#FDF6E3',
          border: '#E8E6E3',
          shadow: 'rgba(0, 0, 0, 0.15)',
        },
        pin: {
          cherry: '#DC143C',
          mustard: '#FFDB58',
          teal: '#008B8B',
          lavender: '#E6E6FA',
        },
        text: {
          primary: '#2C1810',
          secondary: '#5D4E37',
          muted: '#8B7355',
          inverse: '#F9F8F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Alfa Slab One', 'serif'],
        handwritten: ['Kalam', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', '1.25'],
        sm: ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', '1.5'],
        base: ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', '1.5'],
        lg: ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', '1.5'],
        xl: ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', '1.25'],
        '2xl': ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', '1.25'],
        '3xl': ['clamp(2rem, 1.7rem + 1.5vw, 2.5rem)', '1.25'],
      },
      animation: {
        'polaroid-hover': 'polaroid-hover 0.3s ease-out',
        'pin-pulse': 'pin-pulse 0.6s ease-in-out infinite',
        'cork-texture': 'cork-texture 20s linear infinite',
      },
      keyframes: {
        'polaroid-hover': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-8px) scale(1.02)' },
        },
        'pin-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'cork-texture': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
      boxShadow: {
        polaroid: '0 4px 8px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'polaroid-hover': '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(0, 0, 0, 0.15)',
        pin: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}