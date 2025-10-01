# Exploring Next Section

## Overview
The "Exploring Next" section displays a curated queue of emerging technologies, research papers, articles, and tools that are on your radar for exploration and learning.

## Component Location
`src/components/ExploringNext.astro`

## Usage

### In Page
```astro
import ExploringNext from '@components/ExploringNext.astro';

<ExploringNext />
```

### Adding New Items
Edit the `exploringItems` array in `src/components/ExploringNext.astro`:

```typescript
const exploringItems: ExploringItem[] = [
  {
    title: 'Tool or Article Name',
    type: 'tool', // Options: 'tool', 'article', 'research', 'api'
    url: 'https://example.com', // Optional: makes title clickable
    description: 'Brief description of why this is interesting' // Optional
  },
  // ... more items
];
```

## Item Types

Each item is categorized with a visual badge:

| Type | Color | Use Case |
|------|-------|----------|
| `tool` | Blue | Developer tools, frameworks, libraries |
| `article` | Green | Blog posts, tutorials, thought leadership |
| `research` | Purple | Academic papers, research findings |
| `api` | Amber | APIs, services, integrations |

## Features

- **Visual Type Badges**: Color-coded labels for quick scanning
- **External Links**: Items with URLs include an external link icon
- **Hover Effects**: Cards lift and highlight on hover with type-specific colors
- **Scroll Animations**: Staggered fade-in animations as items enter viewport
- **Responsive**: Adapts spacing and typography for mobile and desktop
- **Accessibility**: Respects `prefers-reduced-motion` for users who need it

## Current Items

1. **continue.dev** (Tool) - AI-powered coding assistant
2. **Metacognitive Reuse** (Research) - Meta's LLM optimization research
3. **Prototype-first design with agents** (Article) - Agent-assisted development
4. **Spec-driven development** (Article) - Markdown as programming language
5. **NotebookLM alternative API** (API) - Voice/podcast generation alternatives

## Design Tokens Used

- `--color-bg-secondary` - Section background
- `--color-bg-primary` - Card background
- `--color-border` - Default card borders
- `--color-text-primary` - Main text
- `--color-text-secondary` - Descriptions
- `--space-*` - Consistent spacing
- `--radius-*` - Border radius
- `--transition-*` - Animation timing

## Customization

### Change Section Background
```astro
<ExploringNext className="custom-bg" />
```

Then add styles:
```css
.custom-bg {
  background: linear-gradient(to bottom, var(--color-bg-primary), var(--color-bg-secondary));
}
```

### Modify Type Colors
Edit the `typeColors` object in the component:
```typescript
const typeColors = {
  tool: '#3B82F6',    // Blue
  article: '#10B981',  // Green
  research: '#8B5CF6', // Purple
  api: '#F59E0B'      // Amber
};
```

## Maintenance

To keep this section current:
1. Add new items as you discover interesting tech
2. Remove or archive items once explored
3. Update descriptions based on your learnings
4. Add URLs when available for easy access

This section serves as both a public signal of your interests and a personal queue for exploration.
