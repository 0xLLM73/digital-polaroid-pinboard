describe('Dependencies', () => {
  const requiredDependencies = [
    'next',
    'react',
    'react-dom',
    '@supabase/supabase-js',
    'framer-motion',
    'lucide-react',
    'react-hook-form',
    'zod',
  ]

  const requiredDevDependencies = [
    '@types/react',
    '@types/node',
    'eslint',
    'prettier',
    'jest',
    '@testing-library/react',
    '@playwright/test',
  ]

  test.each(requiredDependencies)('should have %s dependency', (dep) => {
    expect(() => require(dep)).not.toThrow()
  })

  test.each(requiredDevDependencies)('should have %s dev dependency', (dep) => {
    expect(() => require.resolve(dep)).not.toThrow()
  })
})