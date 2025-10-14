// Generates sitemap.xml and updates robots.txt with the sitemap location.
// Base URL priority: SITE_URL env > VERCEL_URL env (with https) > http://localhost:8080
// Routes are derived from src/App.tsx; update here if routes change.

import fs from 'fs';
import path from 'path';

const DOMAIN = process.env.SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  || 'http://localhost:8080';

// Define the public routes of the SPA
const routes = [
  '/',
  '/landing',
  '/login',
  '/register',
  '/dashboard',
  '/create-keepsake',
  '/profile',
  '/about',
  '/contact',
  '/how-it-works',
  '/pricing',
  '/products',
  '/faq',
  '/partnerships',
  '/checkout',
  '/terms',
  '/privacy'
];

const now = new Date().toISOString().split('T')[0];

const urlSet = routes.map((route) => {
  const loc = `${DOMAIN}${route}`;
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.7'}</priority>\n  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlSet}\n</urlset>\n`;

const publicDir = path.resolve('public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`[sitemap] Generated ${sitemapPath} for DOMAIN=${DOMAIN}`);

// Update robots.txt with Sitemap line (absolute URL) if missing
const robotsPath = path.join(publicDir, 'robots.txt');
try {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  const sitemapLine = `Sitemap: ${DOMAIN}/sitemap.xml`;
  if (!robots.includes('Sitemap:')) {
    const updated = `${robots.trim()}\n\n${sitemapLine}\n`;
    fs.writeFileSync(robotsPath, updated, 'utf8');
    console.log('[sitemap] Added Sitemap line to robots.txt');
  } else {
    // Replace existing sitemap line to ensure correct domain
    const updated = robots.replace(/Sitemap:\s*.*/i, sitemapLine);
    fs.writeFileSync(robotsPath, updated, 'utf8');
    console.log('[sitemap] Updated existing Sitemap line in robots.txt');
  }
} catch (err) {
  console.warn('[sitemap] robots.txt not found or unreadable; skipping update');
}