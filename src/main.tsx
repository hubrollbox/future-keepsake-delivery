import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initGA } from './lib/analytics';
import { SpeedInsights } from "@vercel/speed-insights/react"

initGA();

createRoot(document.getElementById("root")!).render(<App />);

<SpeedInsights />
