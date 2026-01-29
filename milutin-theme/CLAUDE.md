# Milutin Shopify Theme - Project Documentation

## Overview
A premium Shopify 2.0 theme inspired by Zara's minimalist design aesthetic, built specifically for the Serbian market. The theme emphasizes clean typography, generous whitespace, and seamless user experience.

## Tech Stack
- **Platform**: Shopify 2.0 (Online Store 2.0)
- **Templating**: Liquid
- **Styling**: CSS3 with Custom Properties (no preprocessors)
- **JavaScript**: Vanilla ES6+ (no jQuery)
- **Icons**: Inline SVG

## Design Principles
1. **Minimalism First** - Every element must earn its place
2. **Typography-Driven** - Clean, readable fonts with careful hierarchy
3. **Generous Whitespace** - Let content breathe
4. **Mobile-First** - Design for mobile, enhance for desktop
5. **Performance** - Fast loading, optimized assets

## File Structure
```
milutin-theme/
├── assets/           # CSS, JS, images, fonts
├── config/           # Theme settings schema
├── layout/           # Theme layouts (theme.liquid)
├── locales/          # Translation files (sr, en)
├── sections/         # Shopify sections
├── snippets/         # Reusable Liquid snippets
└── templates/        # Page templates (JSON)
```

## Naming Conventions

### CSS
- **BEM Methodology**: `.block__element--modifier`
- **Section styles**: `section-{name}.css`
- **Snippet styles**: `snippet-{name}.css`
- **Utility classes**: `.u-{property}-{value}`

### JavaScript
- **Section scripts**: `section-{name}.js`
- **Custom elements**: `<{name}-component>`
- **Event naming**: `milutin:{event-name}`

### Liquid
- **Sections**: `{name}.liquid`
- **Snippets**: `{name}.liquid` or `icon-{name}.liquid` for icons

## CSS Custom Properties
All theming done via CSS custom properties defined in `base.css`:
- Colors: `--color-{name}`
- Typography: `--font-{name}`, `--font-size-{name}`
- Spacing: `--spacing-{size}`
- Transitions: `--transition-{speed}`

## Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 750px) { /* Tablet */ }
@media (min-width: 990px) { /* Desktop */ }
@media (min-width: 1400px) { /* Large Desktop */ }
```

## Accessibility Requirements
- All interactive elements keyboard accessible
- Proper ARIA labels on icons and buttons
- Focus states visible and consistent
- Color contrast meets WCAG AA standards
- Skip links for navigation

## Performance Guidelines
- Lazy load images below the fold
- Defer non-critical JavaScript
- Minimize CSS specificity
- Use system fonts with web font fallbacks
- Inline critical CSS

## Serbian Market Considerations
- Default language: Serbian (Latin script)
- Currency: RSD (Serbian Dinar)
- Date format: DD.MM.YYYY
- Number format: 1.234,56

## Key Components

### Header
- Sticky with hide-on-scroll-down behavior
- Mega menu on desktop hover
- Full-screen mobile menu
- Announcement bar support

### Footer (Planned)
- Newsletter signup
- Navigation columns
- Social links
- Payment icons
- Copyright

### Product Grid (Planned)
- Quick view functionality
- Wishlist integration
- Hover image swap
- Size quick-add

## Testing Checklist
- [ ] `shopify theme check` passes
- [ ] Responsive: 320px, 768px, 1024px, 1440px
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Performance score > 90
- [ ] Serbian translations complete
