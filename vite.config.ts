import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';
 import { resolve } from 'path';
 import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      external: ['@vercel/speed-insights/react', '@tanstack/react-query', 'react-router-dom', '@sentry/react', 'zod', '@supabase/ssr', '@radix-ui/react-label',
        'vaul',
        '@radix-ui/react-progress',
        '@radix-ui/react-radio-group'
      ],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: [
            '@supabase/supabase-js',
            // add more as needed
          ]
        }
      }
    }
  }
});
