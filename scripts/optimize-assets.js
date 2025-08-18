// Asset optimization script
// This script handles image compression, sourcemap removal in production, etc.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

function removeSourcemaps() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.log('Assets directory not found, skipping sourcemap removal');
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const sourcemapFiles = files.filter(file => file.endsWith('.map'));
  
  sourcemapFiles.forEach(file => {
    const filePath = path.join(ASSETS_DIR, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`Removed sourcemap: ${file}`);
    } catch (error) {
      console.error(`Failed to remove ${file}:`, error.message);
    }
  });
}

function optimizeAssets() {
  console.log('Starting asset optimization...');
  
  // Remove sourcemaps in production
  if (process.env.NODE_ENV === 'production') {
    removeSourcemaps();
  }
  
  console.log('Asset optimization completed');
}

// Run optimization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAssets();
}

export { optimizeAssets, removeSourcemaps };