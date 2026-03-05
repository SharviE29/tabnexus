# TabNexus

**Auto Tab Grouper** - Automatically groups tabs by category

A Chrome extension that automatically groups tabs by category (Docs, Social Media, Shopping, Video, Code, Email, etc.).

## Features

- **Automatic Tab Grouping**: Automatically groups tabs based on their domain
- **Smart Categories**: Pre-configured categories including:
  - **Docs**: Google Docs, Notion, Overleaf, Confluence
  - **Social Media**: Twitter/X, Facebook, Instagram, LinkedIn, Reddit, Discord, Slack
  - **Shopping**: Amazon, eBay, Etsy, Shopify
  - **Video**: YouTube, Netflix, Hulu, Vimeo, Twitch
  - **Code**: GitHub, GitLab, Stack Overflow, Dev.to, CodePen
  - **Email**: Gmail, Outlook, Yahoo Mail, ProtonMail
  - **Search**: Google, Bing, DuckDuckGo, Yahoo Search
- **Manual Controls**: Popup interface to manually group or ungroup tabs
- **Color-Coded Groups**: Each category has a distinct color for easy identification

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `tab_xtend` folder
6. The extension will start automatically grouping your tabs!

## How It Works

The extension monitors your tabs and automatically groups them when:
- A new tab is opened
- A tab finishes loading
- A tab is closed (regroups remaining tabs)

Tabs are categorized based on their URL domain. For example, any tab from `docs.google.com` will be grouped under "Docs" with a blue color.

## Manual Controls

Click the extension icon in your toolbar to:
- **Group Tabs Now**: Manually trigger tab grouping
- **Ungroup All**: Remove all tab groups

## Adding Custom Categories

Edit `background.js` and add your own patterns to the `CATEGORIES` object:

```javascript
yourCategory: {
  name: 'Your Category Name',
  patterns: [
    'example.com',
    'another-site.com'
  ],
  color: 'blue' // or 'red', 'yellow', 'green', 'pink', 'purple', 'grey', 'cyan'
}
```

## Permissions

- `tabs`: Required to read and manage tabs
- `tabGroups`: Required to create and manage tab groups
- `<all_urls>`: Required to read tab URLs for categorization

## Development

The extension uses Chrome Extension Manifest V3 and TypeScript. The project structure:

- `manifest.json`: Extension configuration
- `src/background.ts`: Service worker that handles tab grouping logic (TypeScript)
- `src/popup.ts`: Popup UI logic (TypeScript)
- `src/types.ts`: TypeScript type definitions
- `popup.html`: Popup UI markup
- `dist/`: Compiled JavaScript files (generated)

### Building

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build TypeScript:
   ```bash
   npm run build
   ```

3. Watch mode (auto-rebuild on changes):
   ```bash
   npm run watch
   ```

After building, load the `dist/` folder (or the project root) in Chrome as an unpacked extension.

