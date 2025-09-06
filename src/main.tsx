import '@/polyfills/process';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx'
import '@/index.css'
import '@/styles/charts.css'
import { initGA } from '@/lib/analytics'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { SecurityProvider } from '@/components/security/SecurityProvider';

// NOTE: Environment variables are configured via constants in Supabase client for this environment.

// Inicializar Google Analytics
try {
  initGA();
} catch (error) {
  console.error('Falha ao inicializar Google Analytics:', error);
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
  <SecurityProvider>
    <App />
    <SpeedInsights />
  </SecurityProvider>
);
} else {
  console.error('Root element not found');
}
