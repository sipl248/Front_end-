/**
 * Custom Games Utility
 * Manages custom games from the games folder and provides helper functions
 */

import { titleToSlug } from './urlUtils';

/**
 * Auto-generate tags based on game name
 * @param {string} gameName - The name of the game
 * @returns {string} - Comma-separated tags
 */
export function generateTags(gameName) {
    if (!gameName) return 'Game, Fun, Free';

    const name = gameName.toLowerCase();
    const tags = [];

    // Common game type keywords
    const gameTypes = {
        'puzzle': 'Puzzle',
        'action': 'Action',
        'adventure': 'Adventure',
        'racing': 'Racing',
        'sports': 'Sports',
        'arcade': 'Arcade',
        'strategy': 'Strategy',
        'casual': 'Casual',
        'hypercasual': 'Hypercasual',
        'multiplayer': 'Multiplayer',
        'single': 'Single Player',
        '2d': '2D',
        '3d': '3D',
    };

    // Check for game type keywords
    Object.keys(gameTypes).forEach(key => {
        if (name.includes(key)) {
            tags.push(gameTypes[key]);
        }
    });

    // Extract meaningful words from the game name
    const words = name.split(/[\s-]+/).filter(w => w.length > 3);
    words.slice(0, 3).forEach(word => {
        const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
        if (!tags.includes(capitalized)) {
            tags.push(capitalized);
        }
    });

    // Add default tags if not enough
    if (tags.length < 2) {
        tags.push('Fun', 'Free');
    }

    return tags.join(', ');
}

/**
 * Auto-generate description based on game name
 * @param {string} gameName - The name of the game
 * @param {string} category - Optional category
 * @returns {string} - Generated description
 */
export function generateDescription(gameName, category = '') {
    if (!gameName) {
        return 'Play this exciting game for free! No download needed, play instantly in your browser.';
    }

    const name = gameName;
    const cat = category || 'exciting';

    const templates = [
        `Experience the thrill of ${name}! This ${cat.toLowerCase()} game offers endless fun and excitement. Play for free, no download required.`,
        `Dive into ${name} and enjoy hours of entertainment. This ${cat.toLowerCase()} game is perfect for players of all ages. Play instantly in your browser!`,
        `Get ready for ${name}! Challenge yourself with this engaging ${cat.toLowerCase()} game. Free to play, no installation needed.`,
        `Welcome to ${name}! Enjoy this amazing ${cat.toLowerCase()} game experience. Play now for free, directly in your browser.`,
    ];

    // Use game name hash to pick a template consistently
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const template = templates[hash % templates.length];

    return template;
}

/**
 * Auto-generate instructions based on game name and category
 * @param {string} gameName - The name of the game
 * @param {string} category - Optional category
 * @returns {string} - Generated instructions
 */
export function generateInstructions(gameName, category = '') {
    const name = gameName || 'the game';

    const baseInstructions = `Use mouse or touch controls to play ${name}. Explore the game mechanics and enjoy the gameplay!`;

    // Category-specific instructions
    const categoryInstructions = {
        'Puzzle': `Solve puzzles and complete challenges in ${name}. Think strategically to progress through levels.`,
        'Action': `Take action in ${name}! Use your reflexes and skills to overcome obstacles and enemies.`,
        'Racing': `Race to victory in ${name}! Control your vehicle and compete for the best time.`,
        'Sports': `Play ${name} and show your sports skills! Master the controls and become a champion.`,
        'Arcade': `Enjoy classic arcade gameplay in ${name}! Score points and beat your high score.`,
    };

    return categoryInstructions[category] || baseInstructions;
}

/**
 * Get custom games configuration
 * 
 * AUTOMATED: Games are now auto-discovered from the games folder!
 * 
 * To add a new game:
 * 1. Place your game files in /games/your-game-folder/
 * 2. Make sure it has an index.html file
 * 3. Run: npm run setup-games (to copy to public folder)
 * 4. That's it! The game will automatically appear on the site.
 * 
 * No manual configuration needed!
 */
export function getCustomGamesConfig() {
    // Try to load from generated config file (works on both server and client)
    try {
        const config = require('./games-config.json');
        if (config && config.games && config.games.length > 0) {
            return config.games;
        }
    } catch (error) {
        // Config file doesn't exist yet - will be generated on next build
    }

    // Try auto-discovery (server-side only)
    if (typeof window === 'undefined') {
        try {
            const { getAutoDiscoveredGamesConfig } = require('./autoDiscoverGames');
            const discovered = getAutoDiscoveredGamesConfig();
            if (discovered && discovered.length > 0) {
                return discovered;
            }
        } catch (error) {
            // Auto-discovery not available
        }
    }

    // Fallback: Return empty array
    // Run 'npm run generate-config' to generate the config file
    return [];
}

/**
 * Load and format custom games
 * @returns {Array} - Array of formatted game objects
 */
export function loadCustomGames() {
    const config = getCustomGamesConfig();

    return config.map(gameConfig => {
        const {
            folder,
            title,
            category = 'Arcade',
            thumb,
            description,
            tags,
            instructions,
            width = '1920',
            height = '1080',
        } = gameConfig;

        // Generate game URL (points to the game's index.html)
        // Games should be in public/games folder for Next.js to serve them
        const gameUrl = `/games/${folder}/index.html`;

        // Use provided thumbnail or default
        // Try multiple possible locations for images
        const gameThumb = thumb || `/games/${folder}/icons/icon-256.png`;

        // Generate metadata if not provided
        const gameDescription = description || generateDescription(title, category);
        const gameTags = tags || generateTags(title);
        const gameInstructions = instructions || generateInstructions(title, category);

        // Create a unique ID based on folder name
        const gameId = `custom-${folder}`;

        return {
            id: gameId,
            gameId: gameId,
            title: title,
            description: gameDescription,
            instructions: gameInstructions,
            url: gameUrl,
            category: category,
            tags: gameTags,
            thumb: gameThumb,
            width: width,
            height: height,
            // Mark as custom game
            isCustom: true,
            // Store folder for reference
            folder: folder,
        };
    });
}

/**
 * Merge custom games with API games
 * @param {Array} apiGames - Games from API
 * @param {Array} customGames - Custom games
 * @returns {Array} - Merged and sorted games
 */
export function mergeGames(apiGames = [], customGames = []) {
    // Combine games
    const allGames = [...customGames, ...apiGames];

    // Remove duplicates based on title (normalized)
    const seen = new Set();
    const uniqueGames = allGames.filter(game => {
        const normalizedTitle = (game.title || '').toLowerCase().trim();
        if (seen.has(normalizedTitle)) {
            return false;
        }
        seen.add(normalizedTitle);
        return true;
    });

    return uniqueGames;
}

/**
 * Get custom games by category
 * @param {string} category - Category name
 * @returns {Array} - Custom games in that category
 */
export function getCustomGamesByCategory(category) {
    const customGames = loadCustomGames();
    if (!category) return customGames;

    return customGames.filter(game =>
        game.category && game.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Find custom game by slug or title
 * @param {string} slugOrTitle - Game slug or title
 * @returns {Object|null} - Custom game object or null
 */
export function findCustomGame(slugOrTitle) {
    const customGames = loadCustomGames();
    if (!slugOrTitle) return null;

    const searchTerm = slugOrTitle.toLowerCase().trim();

    return customGames.find(game => {
        const gameSlug = titleToSlug(game.title).toLowerCase();
        const gameTitle = game.title.toLowerCase();
        const normalizedTitle = gameTitle.replace(/[^a-z0-9]+/g, ' ');

        return (
            gameSlug === searchTerm ||
            gameTitle === searchTerm ||
            gameTitle.includes(searchTerm) ||
            normalizedTitle.includes(searchTerm.replace(/[^a-z0-9]+/g, ' '))
        );
    }) || null;
}

