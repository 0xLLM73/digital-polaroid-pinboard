import fs from 'fs'
import path from 'path'

describe('Project Structure', () => {
  const requiredDirectories = [
    'src/app',
    'src/components/ui',
    'src/components/polaroid',
    'src/components/layout',
    'src/components/forms',
    'src/lib/supabase',
    'src/lib/utils',
    'src/types',
    'src/hooks',
    'src/utils',
    '__tests__/components',
    '__tests__/lib',
    'public/images',
  ]

  const requiredFiles = [
    'tsconfig.json',
    '.eslintrc.json',
    '.prettierrc',
    'tailwind.config.js',
    'next.config.js',
    'jest.config.js',
    'jest.setup.js',
    '.env.example',
  ]

  test.each(requiredDirectories)('directory %s should exist', (dir) => {
    expect(fs.existsSync(path.join(process.cwd(), dir))).toBe(true)
  })

  test.each(requiredFiles)('file %s should exist', (file) => {
    expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true)
  })
})