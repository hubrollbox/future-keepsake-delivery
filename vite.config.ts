import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: [
            '@supabase/supabase-js',
            'axios',
            'lodash',
            'date-fns',
            'react-router-dom',
            'recharts',
            // add more as needed
          ]
        }
      }
    }
  }
});
