export const designTokens = {
  // Color tokens
  colors: {
    cork: {
      primary: '#8B4513',
      light: '#D2B48C',
      dark: '#654321',
      texture: '#A0522D',
    },
    polaroid: {
      white: '#F9F8F6',
      cream: '#FDF6E3',
      border: '#E8E6E3',
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
  
  // Spacing tokens
  spacing: {
    polaroidPadding: '12px',
    pinOffset: '8px',
    cardGap: '24px',
    sectionGap: '48px',
  },
  
  // Typography tokens
  typography: {
    fontFamilies: {
      display: 'Alfa Slab One, serif',
      handwritten: 'Kalam, cursive',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSizes: {
      handwrittenSmall: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
      handwrittenMedium: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      handwrittenLarge: 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
    },
  },
  
  // Animation tokens
  animations: {
    durations: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.6s',
    },
    easings: {
      easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Shadow tokens
  shadows: {
    polaroid: '0 4px 8px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
    polaroidHover: '0 8px 16px rgba(0, 0, 0, 0.15), 0 16px 32px rgba(0, 0, 0, 0.15)',
    pin: '0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
  },
  
  // Border radius tokens
  borderRadius: {
    polaroid: '2px',
    pin: '50%',
    vintage: '4px',
  },
} as const;

export type DesignTokens = typeof designTokens;