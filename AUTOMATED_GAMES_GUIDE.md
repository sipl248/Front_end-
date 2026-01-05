# Automated Custom Games Guide

## 🎮 Fully Automated Game Registration

The custom games system is now **fully automated**! No manual configuration needed.

## How It Works

The system automatically:
1. ✅ Scans the `games/` folder
2. ✅ Detects new game folders
3. ✅ Auto-generates all metadata
4. ✅ Registers games automatically

## Adding a New Game (3 Simple Steps)

### Step 1: Add Game Folder
Place your game files in the `games/` folder:

```
games/
  your-new-game/
    index.html          ← Required: Main game file
    icons/
      icon-256.png      ← Optional: Game icon
    ... (other game assets)
```

### Step 2: Copy to Public Folder
Run the setup script:

```bash
npm run setup-games
```

This copies games to `public/games/` so Next.js can serve them.

### Step 3: That's It!
The game will automatically:
- ✅ Appear on the website
- ✅ Be included in game listings
- ✅ Have auto-generated title, description, tags
- ✅ Be categorized automatically
- ✅ Work seamlessly with the rest of the site

**No manual configuration needed!**

## Auto-Generated Metadata

### Title
- **Source**: Folder name
- **Example**: `feed-the-frog` → `Feed The Frog`
- **Format**: Converts hyphens to spaces, capitalizes words

### Category
- **Source**: Folder name keywords
- **Detection**: Looks for keywords like `puzzle`, `action`, `racing`, etc.
- **Default**: `Arcade` if no keyword found
- **Keywords**:
  - `puzzle` → Puzzle
  - `action` → Action
  - `adventure` → Adventure
  - `racing` → Racing
  - `sports` → Sports
  - `arcade` → Arcade
  - `strategy` → Strategy
  - `casual` → Casual
  - `hypercasual` → Hypercasual
  - `girls` → Girls

### Thumbnail
- **Auto-detection**: Searches for icons in this order:
  1. `/games/{folder}/icons/icon-256.png`
  2. `/games/{folder}/icons/icon.png`
  3. `/games/{folder}/icon.png`
  4. `/games/{folder}/thumbnail.png`
  5. `/games/{folder}/thumb.png`
  6. `/games/{folder}/images/icon.png`
- **Default**: `/games/{folder}/icons/icon-256.png`

### Description
- **Auto-generated**: Based on game name and category
- **Templates**: Multiple templates for variety

### Tags
- **Auto-generated**: Based on game name keywords
- **Includes**: Game type, category, and relevant keywords

### Instructions
- **Auto-generated**: Category-specific instructions
- **Format**: Tailored to game category

## Manual Overrides (Optional)

If you need to override auto-detected settings, you can add manual overrides in `src/utils/autoDiscoverGames.js`:

```javascript
const manualOverrides = [
  {
    folder: 'feed-the-frog',
    title: 'Feed The Frog - Custom Title',  // Override title
    category: 'Puzzle',                     // Override category
    thumb: '/games/feed-the-frog/custom-icon.png', // Override thumbnail
  },
];
```

## Verification

After adding a game, verify it was discovered:

```bash
npm run discover-games
```

This will show all discovered games:
```
✅ Discovered 2 game(s):
   - Feed The Frog (feed-the-frog) - Puzzle
   - Your New Game (your-new-game) - Arcade

📊 Total games discovered: 2
```

## Requirements

### Required Files
- ✅ `index.html` - Must exist in game folder
- ✅ Game folder must be a directory (not a file)

### Optional Files
- 📁 `icons/icon-256.png` - Recommended for better thumbnails
- 📁 Other game assets (images, scripts, media, etc.)

## Workflow

### Development
1. Add game folder to `games/`
2. Run `npm run setup-games`
3. Restart dev server: `npm run dev`
4. Game appears automatically!

### Production Build
1. Add game folder to `games/`
2. Run `npm run build` (automatically runs setup-games)
3. Deploy
4. Games appear automatically!

## Troubleshooting

### Game Not Appearing
1. ✅ Check that `index.html` exists in game folder
2. ✅ Run `npm run setup-games` to copy to public folder
3. ✅ Run `npm run discover-games` to verify discovery
4. ✅ Restart dev server after adding games

### Wrong Category
- Add category keyword to folder name (e.g., `my-puzzle-game`)
- Or use manual override in `autoDiscoverGames.js`

### Wrong Title
- Use manual override to set custom title
- Or rename folder to desired title format

### Thumbnail Not Found
- Place icon at: `/games/{folder}/icons/icon-256.png`
- Or use manual override to specify custom path

## Benefits

✅ **Zero Configuration**: Just add folder, game appears
✅ **Automatic**: No manual file edits needed
✅ **Scalable**: Works with any number of games
✅ **Reliable**: Consistent auto-generation
✅ **Flexible**: Manual overrides available when needed

## Examples

### Example 1: Simple Game
```
games/
  my-game/
    index.html
    icons/
      icon-256.png
```

**Result**: Automatically appears as "My Game" in "Arcade" category

### Example 2: Puzzle Game
```
games/
  puzzle-adventure/
    index.html
    icons/
      icon-256.png
```

**Result**: Automatically appears as "Puzzle Adventure" in "Puzzle" category

### Example 3: Racing Game
```
games/
  super-racing/
    index.html
    icons/
      icon-256.png
```

**Result**: Automatically appears as "Super Racing" in "Racing" category

## Next Steps

1. ✅ Add your game folder to `games/`
2. ✅ Run `npm run setup-games`
3. ✅ Verify with `npm run discover-games`
4. ✅ Restart dev server
5. ✅ Game appears automatically!

No more manual configuration! 🎉

