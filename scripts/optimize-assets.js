// Asset optimization script
// This script handles image compression, sourcemap removal in production, etc.

const fs = require('fs');
const path = require('path');

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
if (require.main === module) {
  optimizeAssets();
}

module.exports = { optimizeAssets, removeSourcemaps };