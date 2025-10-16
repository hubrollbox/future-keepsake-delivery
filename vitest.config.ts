import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],

    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: false,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        'dist/',
        'build/',
        'public/**',
        'scripts/**',
        'ops/**',
        'cypress/**',
        'supabase/**',
        'docs/**',
        'brand/**',
        'sql/**',
        'src/integrations/supabase/types.ts',
        'src/integrations/supabase/database.types.ts',
        '**/*.config.*',
        '**/main.tsx'
      ],
      thresholds: {
        lines: 10,
        functions: 10,
        branches: 5,
        statements: 10
      }
    },
    testTimeout: 10000,
    include: ['src/pages/**/*.test.tsx', 'src/__tests__/components/**/*.test.tsx'],
    exclude: ['src/__tests__/setup.ts'],
    transformMode: {
      web: [/\.[jt]sx$/,
        /@testing-library\/jest-dom/],
    },
    deps: {
      optimizer: {
        web: {
          include: [/@testing-library\/jest-dom/]
        }
      }
    },
  },
  optimizeDeps: {
    include: ['@testing-library/jest-dom'],
  },
});