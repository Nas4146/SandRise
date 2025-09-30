# AI Coding Agent Instructions for SandRise Portfolio

## Architecture Overview

This is an **Astro 4 + TypeScript** portfolio site with a sophisticated design system and content-driven architecture. Key characteristics:

- **Static Site Generation**: Astro builds to static files in `dist/` for deployment
- **Content Collections**: Projects and blog posts are managed via `src/content/` with Zod schema validation
- **Design System**: CSS custom properties in `src/styles/tokens.css` drive consistent styling
- **Component Architecture**: `.astro` files blend HTML, TypeScript, and scoped CSS

## Essential Patterns

### Content Management
- **Projects**: All project case studies live in `src/content/projects/*.md` with strict frontmatter schema
- **Schema**: Defined in `src/content/config.ts` - projects require `title`, `summary`, `category`, `role`, `timeline`, `heroImage`, `heroAlt`, `problem`, `roleDetail`, `process`, `outcomes`, `reflection`
- **Images**: Place project assets in `public/images/projects/` (not `src/content/projects/`)
- **Draft Control**: Set `draft: true` in frontmatter to hide from production

### Styling Architecture
- **Design Tokens**: `src/styles/tokens.css` defines all spacing, colors, typography, animations as CSS custom properties
- **Global Styles**: `src/styles/global.css` provides base styles and utility classes
- **Component Styles**: Each `.astro` component has scoped `<style>` blocks that consume tokens
- **Responsive**: Uses `clamp()` functions for fluid typography and space values

### Project Card System
- **Homepage**: Custom `project-tile` layout with full-background images (`background-size: cover`)
- **Work Page**: Traditional `ProjectCard` component with thumbnails
- **Gradient Overlays**: Homepage tiles use gradient overlays for text readability over background images
- **Animation**: Staggered `fadeInUp` animations with `nth-child` delays (0.1s intervals)

### Route Structure
- **Homepage**: `src/pages/index.astro` - intro, projects showcase, interests
- **Work Archive**: `src/pages/work/index.astro` - filterable project grid
- **Project Detail**: `src/pages/work/[slug].astro` - dynamic routes from content collections
- **Static Pages**: About, Skills, Contact, etc. in `src/pages/*.astro`

## Development Workflow

### Commands
```bash
npm run dev          # Development server on :4321
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run check        # Astro + TypeScript diagnostics
```

### Adding Projects
1. Create `src/content/projects/project-name.md` with required frontmatter
2. Add hero image to `public/images/projects/project-name.ext`
3. Reference image as `/images/projects/project-name.ext` in frontmatter
4. Ensure all required schema fields are present (see `src/content/config.ts`)

### Component Development
- Import path aliases: `@components/*`, `@layouts/*`, `@styles/*`, `@content/*`
- Use design tokens from `tokens.css`: `var(--space-lg)`, `var(--color-accent)`, etc.
- Follow existing animation patterns: `slideInLeft`, `slideInRight`, `fadeInUp`
- Test responsive behavior with `clamp()` values

## Critical Integration Points

### SEO & Metadata
- `src/components/SEO.astro` centralizes meta tags, Open Graph, JSON-LD
- Each page provides `title`, `description`, optional `structuredData`
- Project pages auto-generate `CreativeWork` schema
- Sitemap auto-generated via `@astrojs/sitemap`

### Performance
- Images use `loading="lazy"` and `decoding="async"`
- Sharp image optimization in production builds
- Critical CSS inlined, non-critical deferred
- Reduced motion support via `prefers-reduced-motion`

### Accessibility
- Skip links on all pages (`<a class="skip-link" href="#main">`)
- Semantic HTML structure with proper heading hierarchy
- Focus-visible styles on interactive elements
- Alt text required for all project images

## Project-Specific Conventions

### Animation System
- **Homepage**: Uses custom keyframes `slideInLeft`, `slideInRight`, `fadeInUp`
- **Staggered Timing**: `.project-tile:nth-child(n)` with 0.1s delay increments
- **Motion Preference**: Respects `prefers-reduced-motion: reduce`

### Image Handling
- **Public Directory**: All served images go in `public/images/`
- **Content Images**: Never put images in `src/content/` - they won't be served
- **Hero Images**: Project cards use `heroImage` path from frontmatter
- **Background Images**: Homepage tiles use CSS `var(--project-image)` for full coverage

### Design Token Usage
- **Spacing**: Use semantic tokens like `--space-lg`, `--space-xl`
- **Colors**: Stick to palette: `--color-accent`, `--color-text-primary`, etc.
- **Typography**: Fluid sizing with `--font-size-lg`, `--font-size-hero`
- **Borders**: Consistent radii: `--radius-sm`, `--radius-lg`, `--radius-round`

When modifying this codebase, always check existing patterns in similar components and maintain consistency with the design system tokens.