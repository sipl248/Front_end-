/**
 * Generate Games Config Script
 * Scans games folder and generates a static config file
 * This allows games to work on both server and client side
 */

const fs = require('fs');
const path = require('path');
const { autoDiscoverGames } = require('./auto-discover-games');

const configPath = path.join(process.cwd(), 'src', 'utils', 'games-config.json');

// Manual overrides (same as in autoDiscoverGames.js)
const manualOverrides = [
  {
    folder: 'feed-the-frog',
    category: 'Puzzle', // Override: Feed The Frog is a puzzle game
  },
];

function generateConfig() {
  console.log('🔍 Scanning games folder...');
  
  const discoveredGames = autoDiscoverGames();
  
  // Apply manual overrides
  const games = discoveredGames.map(game => {
    const override = manualOverrides.find(o => o.folder === game.folder);
    if (override) {
      return { ...game, ...override };
    }
    return game;
  });
  
  // Add manual-only games
  const manualOnly = manualOverrides.filter(
    override => !discoveredGames.find(g => g.folder === override.folder)
  );
  
  const finalGames = [...games, ...manualOnly];
  
  if (finalGames.length === 0) {
    console.warn('⚠️  No games found. Make sure games are in public/games or games/');
    // Keep existing config if available
    if (fs.existsSync(configPath)) {
      console.log('📋 Using existing config file');
      return;
    }
  }
  
  const config = {
    games: finalGames,
    lastUpdated: new Date().toISOString(),
    count: finalGames.length,
  };
  
  // Write config file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  
  console.log(`✅ Generated config for ${finalGames.length} game(s)`);
  finalGames.forEach(game => {
    console.log(`   - ${game.title} (${game.folder}) - ${game.category}`);
  });
  console.log(`📄 Config saved to: ${configPath}`);
}

// Run if called directly
if (require.main === module) {
  generateConfig();
}

module.exports = { generateConfig };

