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
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        'dist/',
        'build/'
      ]
    },
    testTimeout: 10000,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'src/__tests__/setup.ts'],
    transformMode: {
      web: [/\.[jt]sx$/,
        /@testing-library\/jest-dom/],
    },
  },
});