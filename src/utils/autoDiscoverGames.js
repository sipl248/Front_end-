/**
 * Auto-Discover Games Utility
 * Automatically scans and discovers games from the games folder
 * 
 * NOTE: This uses Node.js fs module, so it only works server-side
 */

/**
 * Convert folder name to display title
 * @param {string} folderName - Folder name (e.g., 'feed-the-frog')
 * @returns {string} - Display title (e.g., 'Feed The Frog')
 */
function folderToTitle(folderName) {
  if (!folderName) return '';
  
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Auto-detect category from folder name or game files
 * @param {string} folderName - Game folder name
 * @param {string} gamePath - Full path to game folder
 * @returns {string} - Detected category
 */
function detectCategory(folderName, gamePath) {
  const name = folderName.toLowerCase();
  
  // Check folder name for category keywords
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
  
  // Try to detect from index.html content if available (server-side only)
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const indexPath = path.join(gamePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8').toLowerCase();
        for (const [keyword, category] of Object.entries(categoryKeywords)) {
          if (content.includes(keyword)) {
            return category;
          }
        }
      }
    } catch (error) {
      // Ignore errors, use default
    }
  }
  
  // Default to Arcade
  return 'Arcade';
}

/**
 * Find thumbnail image for a game
 * @param {string} gamePath - Full path to game folder
 * @param {string} folderName - Game folder name
 * @returns {string|null} - Thumbnail path or null
 */
function findThumbnail(gamePath, folderName) {
  if (typeof window !== 'undefined') {
    // Client-side: return default path
    return `/games/${folderName}/icons/icon-256.png`;
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    
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
        // Return relative path from public folder
        const relativePath = thumbPath.replace(/.*[\\/]public[\\/]/, '/');
        return relativePath.replace(/\\/g, '/') || `/games/${folderName}/icons/icon-256.png`;
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  // Return default path
  return `/games/${folderName}/icons/icon-256.png`;
}

/**
 * Auto-discover games from the games folder
 * Scans public/games directory and returns game configurations
 * @returns {Array} - Array of game configuration objects
 */
export function autoDiscoverGames() {
  const gamesConfig = [];
  
  // Only works server-side (has access to fs)
  if (typeof window !== 'undefined') {
    return gamesConfig;
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Path to games folder (in public directory after setup)
    const gamesPath = path.join(process.cwd(), 'public', 'games');
    
    // Also check root games folder (for development)
    const rootGamesPath = path.join(process.cwd(), 'games');
    
    let gamesDir = null;
    if (fs.existsSync(gamesPath)) {
      gamesDir = gamesPath;
    } else if (fs.existsSync(rootGamesPath)) {
      gamesDir = rootGamesPath;
    }
    
    if (!gamesDir || !fs.existsSync(gamesDir)) {
      return gamesConfig;
    }
    
    // Read all directories in games folder
    const entries = fs.readdirSync(gamesDir, { withFileTypes: true });
    
    for (const entry of entries) {
      // Only process directories
      if (!entry.isDirectory()) continue;
      
      const folderName = entry.name;
      const gamePath = path.join(gamesDir, folderName);
      
      // Check if it's a valid game (has index.html)
      const indexPath = path.join(gamePath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        continue; // Skip if no index.html
      }
      
      // Auto-generate configuration
      const title = folderToTitle(folderName);
      const category = detectCategory(folderName, gamePath);
      const thumb = findThumbnail(gamePath, folderName);
      
      // Default dimensions (can be overridden)
      const width = '1920';
      const height = '1080';
      
      gamesConfig.push({
        folder: folderName,
        title: title,
        category: category,
        thumb: thumb,
        width: width,
        height: height,
      });
    }
    
    // Sort by folder name for consistency
    gamesConfig.sort((a, b) => a.folder.localeCompare(b.folder));
    
  } catch (error) {
    console.error('Error auto-discovering games:', error);
  }
  
  return gamesConfig;
}

/**
 * Get custom games configuration (automated version)
 * This function automatically discovers games from the games folder
 * No manual configuration needed!
 * 
 * To add a new game:
 * 1. Place your game files in /games/your-game-folder/
 * 2. Make sure it has an index.html file
 * 3. Run: npm run setup-games (to copy to public folder)
 * 4. That's it! The game will automatically appear on the site.
 * 
 * Optional: You can still manually override settings by adding entries below
 */
export function getAutoDiscoveredGamesConfig() {
  // Auto-discover games from folder
  const discoveredGames = autoDiscoverGames();
  
  // Manual overrides (optional - for custom settings)
  // If you need to override auto-detected settings, add them here
  const manualOverrides = [
    {
      folder: 'feed-the-frog',
      category: 'Puzzle', // Override: Feed The Frog is a puzzle game
    },
    // Add more overrides as needed:
    // {
    //   folder: 'your-game-folder',
    //   title: 'Custom Title',
    //   category: 'Action',
    //   thumb: '/games/your-game-folder/custom-icon.png',
    // },
  ];
  
  // Merge discovered games with manual overrides
  const mergedConfig = discoveredGames.map(game => {
    const override = manualOverrides.find(o => o.folder === game.folder);
    if (override) {
      // Merge override with discovered game (override takes precedence)
      return { ...game, ...override };
    }
    return game;
  });
  
  // Add any manual-only games (not in folder but manually configured)
  const manualOnly = manualOverrides.filter(
    override => !discoveredGames.find(g => g.folder === override.folder)
  );
  
  return [...mergedConfig, ...manualOnly];
}
