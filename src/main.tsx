import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initGA } from './lib/analytics';
import { SpeedInsights } from "@vercel/speed-insights/react"

initGA();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

createRoot(document.getElementById("root")!).render(<App />);

<SpeedInsights />
