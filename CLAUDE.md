# CLAUDE.md - AI Assistant Guidelines for Shopify-Milutin

## Project Overview

**Project Name:** Shopify-Milutin
**Type:** Shopify Theme
**Description:** A Shopify e-commerce theme inspired by Zara's minimalist, fashion-forward design aesthetic
**Organization:** MandaWeb3
**Status:** Early Development Stage

## Repository Structure

### Current State
The repository is in its initial setup phase with minimal content:
```
/Shopify-Milutin/
├── .git/              # Git version control
├── README.md          # Project description
└── CLAUDE.md          # AI assistant guidelines (this file)
```

### Expected Shopify Theme Structure
When fully developed, the theme should follow the standard Shopify 2.0 theme architecture:

```
/Shopify-Milutin/
├── assets/                    # CSS, JavaScript, images, fonts
│   ├── base.css
│   ├── component-*.css
│   └── theme.js
├── config/                    # Theme configuration
│   ├── settings_schema.json   # Theme settings schema
│   └── settings_data.json     # Default settings values
├── layout/                    # Layout templates
│   ├── theme.liquid           # Main layout wrapper
│   └── password.liquid        # Password page layout
├── locales/                   # Translation files
│   └── en.default.json
├── sections/                  # Reusable page sections
│   ├── header.liquid
│   ├── footer.liquid
│   ├── featured-collection.liquid
│   └── ...
├── snippets/                  # Reusable code snippets
│   ├── icon-*.liquid
│   ├── product-card.liquid
│   └── ...
├── templates/                 # Page templates (JSON for 2.0)
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   ├── page.json
│   └── customers/
│       ├── account.json
│       ├── login.json
│       └── ...
├── blocks/                    # Theme blocks (optional)
├── .shopifyignore             # Files to ignore during upload
├── shopify.theme.toml         # Shopify CLI configuration
├── README.md                  # Project documentation
└── CLAUDE.md                  # AI assistant guidelines
```

## Technology Stack

### Core Technologies
- **Liquid** - Shopify's templating language
- **HTML5** - Semantic markup
- **CSS3** - Styling (custom properties, flexbox, grid)
- **JavaScript (ES6+)** - Interactivity and dynamic features
- **JSON** - Template and configuration structure

### Development Tools
- **Shopify CLI** - Theme development and deployment
- **Git** - Version control
- **Node.js** (optional) - For build tools if needed

## Development Workflow

### Setting Up Development Environment
```bash
# Install Shopify CLI (requires Ruby)
npm install -g @shopify/cli @shopify/theme

# Or via Homebrew (macOS)
brew tap shopify/shopify
brew install shopify-cli

# Authenticate with Shopify
shopify theme dev --store=your-store.myshopify.com
```

### Local Development
```bash
# Start local development server
shopify theme dev

# Push theme to development store
shopify theme push

# Pull theme from store
shopify theme pull

# Preview theme
shopify theme open
```

### Git Workflow
1. Create feature branches from main
2. Make changes and test locally with `shopify theme dev`
3. Commit with descriptive messages
4. Push and create pull requests for review
5. Deploy via Shopify CLI after merge

## Code Conventions

### Liquid Templates
- Use meaningful section and block names
- Keep sections modular and reusable
- Use schema settings for customizable content
- Follow Shopify's naming conventions for templates

```liquid
{% comment %} Example section structure {% endcomment %}
{% schema %}
{
  "name": "Section Name",
  "settings": [...],
  "blocks": [...],
  "presets": [...]
}
{% endschema %}
```

### CSS Conventions
- Use CSS custom properties for theming
- Follow BEM naming convention for classes
- Mobile-first responsive design
- Keep specificity low, avoid !important

```css
/* Example naming convention */
.product-card { }
.product-card__image { }
.product-card__title { }
.product-card--featured { }
```

### JavaScript Conventions
- Use ES6+ syntax
- Prefer vanilla JavaScript over jQuery
- Use Web Components for complex UI elements
- Implement progressive enhancement
- Keep scripts minimal and performant

```javascript
// Use descriptive function names
function initProductGallery() { }

// Prefer const/let over var
const productCards = document.querySelectorAll('.product-card');
```

### File Naming
- Use lowercase with hyphens: `featured-collection.liquid`
- Prefix component CSS: `component-product-card.css`
- Use descriptive names that indicate purpose

## Design Guidelines (Zara-Inspired)

### Visual Principles
- **Minimalist aesthetic** - Clean layouts with ample white space
- **Typography-focused** - Bold, clear typography hierarchy
- **High-quality imagery** - Large, impactful product photos
- **Monochromatic palette** - Black, white, and neutral tones
- **Subtle animations** - Smooth, understated transitions

### UI Components
- Full-width hero sections
- Grid-based product layouts
- Minimal navigation (hamburger menu on mobile)
- Clean product cards with hover effects
- Streamlined checkout flow

## Key Files Reference

| File | Purpose |
|------|---------|
| `layout/theme.liquid` | Main HTML wrapper, includes head and body tags |
| `config/settings_schema.json` | Theme customization options |
| `sections/header.liquid` | Site header with navigation |
| `sections/footer.liquid` | Site footer |
| `templates/index.json` | Homepage template |
| `templates/product.json` | Product page template |
| `templates/collection.json` | Collection page template |
| `assets/base.css` | Base styles and CSS variables |

## Common Tasks for AI Assistants

### Creating a New Section
1. Create file in `sections/` directory
2. Add Liquid markup with schema
3. Include settings for customization
4. Reference in templates as needed

### Adding Styles
1. Create/edit CSS files in `assets/`
2. Use CSS custom properties from base.css
3. Include file in theme.liquid if new
4. Test responsive behavior

### Modifying Templates
1. Edit JSON template files in `templates/`
2. Reference appropriate sections
3. Configure section order and settings

### Adding JavaScript Functionality
1. Create/edit JS files in `assets/`
2. Use progressive enhancement
3. Defer non-critical scripts
4. Test across browsers

## Testing Checklist

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Cross-browser compatibility
- [ ] Shopify theme check passes
- [ ] Lighthouse performance score
- [ ] Accessibility compliance (WCAG)
- [ ] RTL language support (if applicable)
- [ ] Page speed optimization

## Useful Commands

```bash
# Run theme check for best practices
shopify theme check

# Package theme for upload
shopify theme package

# List available themes
shopify theme list

# Delete a theme
shopify theme delete
```

## Resources

- [Shopify Theme Development Docs](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.dev/docs/api/liquid)
- [Dawn Theme (Reference)](https://github.com/Shopify/dawn)
- [Shopify CLI Documentation](https://shopify.dev/themes/tools/cli)
- [Theme Check](https://shopify.dev/themes/tools/theme-check)

## Notes for AI Assistants

1. **Always validate Liquid syntax** before committing
2. **Test locally** using Shopify CLI when possible
3. **Follow Shopify 2.0 patterns** - Use JSON templates and sections
4. **Prioritize performance** - Minimize render-blocking resources
5. **Maintain accessibility** - Use semantic HTML and ARIA attributes
6. **Keep commits focused** - One feature/fix per commit
7. **Document schema settings** - Add helpful descriptions for store admins
8. **Use translation keys** - Support internationalization from the start

## Project-Specific Notes

- This theme is inspired by Zara's minimalist fashion aesthetic
- Focus on clean, modern design with emphasis on product imagery
- Target audience: Fashion-forward e-commerce stores
- Priority features: Fast loading, mobile-first, easy customization
