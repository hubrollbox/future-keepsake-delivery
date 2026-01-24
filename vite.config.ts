import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { componentTagger } from "lovable-tagger";
import autoprefixer from 'autoprefixer';
import tailwindPostcss from '@tailwindcss/postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  // Tailwind CSS v4 moved the PostCSS plugin to `@tailwindcss/postcss`.
  // Our `postcss.config.js` is read-only in this environment, so we configure
  // PostCSS inline to unblock `vite build` / publishing.
  css: {
    postcss: {
      plugins: [tailwindPostcss(), autoprefixer()],
    },
  },
  server: {
    host: "::",
    port: 8080,
    headers: {
      'X-Content-Type-Options': 'nosniff',
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: [
        // '@supabase/supabase-js'
      ],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/ssr'],
          ui: ['@chakra-ui/react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['axios', 'date-fns', 'react-router-dom'],
          vendor: [
            // other vendor packages can go here
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}));
