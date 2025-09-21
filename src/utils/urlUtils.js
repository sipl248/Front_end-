/**
 * Convert game title to URL-friendly slug
 * @param {string} title - The game title
 * @returns {string} - URL-friendly slug
 */
export function titleToSlug(title) {
    if (!title) return '';

    return title
        .toLowerCase()
        .trim()
        // Replace spaces and special characters with hyphens
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}

/**
 * Convert URL slug back to title format (for display purposes)
 * @param {string} slug - The URL slug
 * @returns {string} - Formatted title
 */
export function slugToTitle(slug) {
    if (!slug) return '';

    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
