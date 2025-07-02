import { designTokens } from '@/lib/design/design-tokens';

describe('Design Tokens', () => {
  test('contains all required color categories', () => {
    expect(designTokens.colors).toHaveProperty('cork');
    expect(designTokens.colors).toHaveProperty('polaroid');
    expect(designTokens.colors).toHaveProperty('pin');
    expect(designTokens.colors).toHaveProperty('text');
  });

  test('cork colors are properly defined', () => {
    expect(designTokens.colors.cork.primary).toBe('#8B4513');
    expect(designTokens.colors.cork.light).toBe('#D2B48C');
    expect(designTokens.colors.cork.dark).toBe('#654321');
  });

  test('pin colors include all variants', () => {
    expect(designTokens.colors.pin).toHaveProperty('cherry');
    expect(designTokens.colors.pin).toHaveProperty('mustard');
    expect(designTokens.colors.pin).toHaveProperty('teal');
    expect(designTokens.colors.pin).toHaveProperty('lavender');
  });

  test('typography tokens are properly structured', () => {
    expect(designTokens.typography.fontFamilies).toHaveProperty('display');
    expect(designTokens.typography.fontFamilies).toHaveProperty('handwritten');
    expect(designTokens.typography.fontFamilies).toHaveProperty('body');
  });

  test('animation tokens provide required durations', () => {
    expect(designTokens.animations.durations).toHaveProperty('fast');
    expect(designTokens.animations.durations).toHaveProperty('normal');
    expect(designTokens.animations.durations).toHaveProperty('slow');
  });
});