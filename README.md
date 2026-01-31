# Milutin - Premium Shopify Theme

A minimalist Shopify 2.0 theme inspired by Zara's design aesthetic, built for the Serbian market.

## Features

- **Clean, Minimalist Design** - Typography-focused with generous whitespace
- **Fully Responsive** - Mobile-first approach
- **Serbian Localization** - Native Serbian language support
- **Performance Optimized** - Fast loading, optimized assets
- **Accessible** - WCAG AA compliant

## Requirements

- Shopify CLI 3.x
- Node.js 18+

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd milutin-theme

# Install Shopify CLI (if not installed)
npm install -g @shopify/cli @shopify/theme

# Connect to your store
shopify theme dev --store your-store.myshopify.com
```

### Commands

```bash
# Start development server
shopify theme dev

# Check for errors
shopify theme check

# Push to theme
shopify theme push

# Pull latest changes
shopify theme pull
```

## Structure

```
milutin-theme/
├── assets/         # CSS, JS, images
├── config/         # Theme settings
├── layout/         # Main layouts
├── locales/        # Translations (sr, en)
├── sections/       # Theme sections
├── snippets/       # Reusable components
└── templates/      # Page templates
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

Proprietary - All rights reserved
