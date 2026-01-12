/**
 * Auto-Discover Games Script
 * Scans the games folder and generates/updates game configuration
 * Run this script: node scripts/auto-discover-games.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Convert folder name to display title
 */
function folderToTitle(folderName) {
  if (!folderName) return '';
  
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Auto-detect category from folder name
 */
function detectCategory(folderName) {
  const name = folderName.toLowerCase();
  
  const categoryKeywords = {
    'puzzle': 'Puzzle',
    'action': 'Action',
    'adventure': 'Adventure',
    'racing': 'Racing',
    'sports': 'Sports',
    'arcade': 'Arcade',
    'strategy': 'Strategy',
    'casual': 'Casual',
    'hypercasual': 'Hypercasual',
    'girls': 'Girls',
  };
  
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (name.includes(keyword)) {
      return category;
    }
  }
  
  return 'Arcade'; // Default
}

/**
 * Find thumbnail image for a game
 */
function findThumbnail(gamePath, folderName) {
  const possiblePaths = [
    path.join(gamePath, 'icons', 'icon-256.png'),
    path.join(gamePath, 'icons', 'icon.png'),
    path.join(gamePath, 'icon.png'),
    path.join(gamePath, 'thumbnail.png'),
    path.join(gamePath, 'thumb.png'),
    path.join(gamePath, 'images', 'icon.png'),
  ];
  
  for (const thumbPath of possiblePaths) {
    if (fs.existsSync(thumbPath)) {
      return `/games/${folderName}/${path.relative(gamePath, thumbPath).replace(/\\/g, '/')}`;
    }
  }
  
  return `/games/${folderName}/icons/icon-256.png`;
}

/**
 * Auto-discover games
 */
function autoDiscoverGames() {
  const gamesConfig = [];
  
  try {
    // Check both public/games and root games folder
    const publicGamesPath = path.join(process.cwd(), 'public', 'games');
    const rootGamesPath = path.join(process.cwd(), 'games');
    
    let gamesDir = null;
    if (fs.existsSync(publicGamesPath)) {
      gamesDir = publicGamesPath;
    } else if (fs.existsSync(rootGamesPath)) {
      gamesDir = rootGamesPath;
    }
    
    if (!gamesDir || !fs.existsSync(gamesDir)) {
      console.warn('⚠️  Games folder not found. Make sure games are in public/games or games/');
      return gamesConfig;
    }
    
    const entries = fs.readdirSync(gamesDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const folderName = entry.name;
      const gamePath = path.join(gamesDir, folderName);
      const indexPath = path.join(gamePath, 'index.html');
      
      if (!fs.existsSync(indexPath)) {
        continue; // Skip if no index.html
      }
      
      const title = folderToTitle(folderName);
      const category = detectCategory(folderName);
      const thumb = findThumbnail(gamePath, folderName);
      
      gamesConfig.push({
        folder: folderName,
        title: title,
        category: category,
        thumb: thumb,
        width: '1920',
        height: '1080',
      });
    }
    
    gamesConfig.sort((a, b) => a.folder.localeCompare(b.folder));
    
    console.log(`✅ Discovered ${gamesConfig.length} game(s):`);
    gamesConfig.forEach(game => {
      console.log(`   - ${game.title} (${game.folder}) - ${game.category}`);
    });
    
  } catch (error) {
    console.error('❌ Error discovering games:', error);
  }
  
  return gamesConfig;
}

// Run if called directly
if (require.main === module) {
  const games = autoDiscoverGames();
  console.log(`\n📊 Total games discovered: ${games.length}`);
}

module.exports = { autoDiscoverGames, folderToTitle, detectCategory, findThumbnail };


