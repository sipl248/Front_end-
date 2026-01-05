/**
 * Setup script to copy games folder to public directory
 * Run this script: node scripts/setup-games.js
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'games');
const destDir = path.join(__dirname, '..', 'public', 'games');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('Copying games folder to public directory...');
  if (fs.existsSync(sourceDir)) {
    copyRecursiveSync(sourceDir, destDir);
    console.log('✅ Games folder copied successfully to public/games');
  } else {
    console.log('⚠️  Games folder not found at:', sourceDir);
    console.log('   Creating empty public/games directory...');
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
  }
} catch (error) {
  console.error('❌ Error copying games folder:', error);
  process.exit(1);
}

