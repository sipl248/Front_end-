/**
 * Game Helpers
 * Utility functions for game operations
 */

import { normalizeTitle } from './urlUtils';
import { loadCustomGames, findCustomGame } from './customGames';

/**
 * Find a game from all sources (API, custom games, constants)
 * @param {string} searchTerm - Game title or slug to search for
 * @param {Array} apiGames - Games from API (optional)
 * @param {Array} constantGames - Games from constants (optional)
 * @returns {Object|null} - Found game or null
 */
export async function findGame(searchTerm, apiGames = [], constantGames = []) {
  if (!searchTerm) return null;
  
  const normalized = normalizeTitle(searchTerm);
  
  // 1. Try custom games first
  const customGame = findCustomGame(searchTerm);
  if (customGame) return customGame;
  
  // 2. Try API games
  if (apiGames && apiGames.length > 0) {
    const apiGame = apiGames.find(g => {
      const gameTitle = normalizeTitle(g?.title || '');
      return gameTitle === normalized || gameTitle.includes(normalized);
    });
    if (apiGame) return apiGame;
  }
  
  // 3. Try constant games
  if (constantGames && constantGames.length > 0) {
    const constGame = constantGames.find(g => {
      const gameTitle = normalizeTitle(g?.title || '');
      return gameTitle === normalized || gameTitle.includes(normalized);
    });
    if (constGame) return constGame;
  }
  
  return null;
}

/**
 * Get all games from all sources, merged and deduplicated
 * @param {Array} apiGames - Games from API
 * @param {Array} constantGames - Games from constants
 * @returns {Array} - All games merged
 */
export function getAllGames(apiGames = [], constantGames = []) {
  const customGames = loadCustomGames();
  
  // Combine all sources
  const allGames = [...customGames, ...apiGames, ...constantGames];
  
  // Remove duplicates based on normalized title
  const seen = new Set();
  return allGames.filter(game => {
    const normalizedTitle = normalizeTitle(game?.title || '');
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

/**
 * Get games by category from all sources
 * @param {string} category - Category name
 * @param {Array} apiGames - Games from API
 * @param {Array} constantGames - Games from constants
 * @returns {Array} - Games in that category
 */
export function getGamesByCategory(category, apiGames = [], constantGames = []) {
  const allGames = getAllGames(apiGames, constantGames);
  
  if (!category) return allGames;
  
  return allGames.filter(game => {
    const gameCategory = (game?.category || '').toLowerCase();
    return gameCategory === category.toLowerCase();
  });
}

