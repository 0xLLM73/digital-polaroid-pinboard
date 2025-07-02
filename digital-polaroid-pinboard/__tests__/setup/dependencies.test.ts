import * as fs from 'fs'
import * as path from 'path'

describe('Dependencies', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

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
    expect(packageJson.dependencies).toHaveProperty(dep)
  })

  test.each(requiredDevDependencies)('should have %s dev dependency', (dep) => {
    expect(packageJson.devDependencies).toHaveProperty(dep)
  })
})