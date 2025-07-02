describe('Configuration Files', () => {
  test('Tailwind config should include nostalgic colors', () => {
    const tailwindConfig = require('../../tailwind.config.js')
    
    expect(tailwindConfig.theme.extend.colors).toHaveProperty('cork')
    expect(tailwindConfig.theme.extend.colors).toHaveProperty('polaroid')
    expect(tailwindConfig.theme.extend.colors).toHaveProperty('pin')
    expect(tailwindConfig.theme.extend.colors.pin).toHaveProperty('cherry')
    expect(tailwindConfig.theme.extend.colors.pin).toHaveProperty('mustard')
    expect(tailwindConfig.theme.extend.colors.pin).toHaveProperty('teal')
    expect(tailwindConfig.theme.extend.colors.pin).toHaveProperty('lavender')
  })

  test('Tailwind config should include nostalgic fonts', () => {
    const tailwindConfig = require('../../tailwind.config.js')
    
    expect(tailwindConfig.theme.extend.fontFamily).toHaveProperty('handwritten')
    expect(tailwindConfig.theme.extend.fontFamily).toHaveProperty('display')
  })

  test('Tailwind config should include nostalgic animations', () => {
    const tailwindConfig = require('../../tailwind.config.js')
    
    expect(tailwindConfig.theme.extend.animation).toHaveProperty('polaroid-hover')
    expect(tailwindConfig.theme.extend.animation).toHaveProperty('pin-pulse')
  })

  test('Next.js config should include image optimization', () => {
    const nextConfig = require('../../next.config.js')
    
    expect(nextConfig.images).toBeDefined()
    expect(nextConfig.images.formats).toContain('image/webp')
    expect(nextConfig.images.formats).toContain('image/avif')
  })

  test('Next.js config should include security headers', () => {
    const nextConfig = require('../../next.config.js')
    
    expect(nextConfig.headers).toBeDefined()
  })
})