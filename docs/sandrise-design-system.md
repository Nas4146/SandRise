# SandRise Web Design System Cheat Sheet

_Last updated: 2025-10-03_

This guide captures the visual language and component usage patterns already established on `sandrise.io`. New pages should follow these conventions to keep the site cohesive.

---

## 1. Layout Foundations

- **Base layout**: Always wrap pages with `BaseLayout`. Pass `title`, `description`, and optionally `structuredData`, `noindex`, `type`, and `hideFooter`.
  ```astro
  ---
  import BaseLayout from '@layouts/BaseLayout.astro';
  ---
  <BaseLayout title="Page title" description="Description" structuredData={schema}>
    <!-- content -->
  </BaseLayout>
  ```
- **Grid & spacing**: Use the `.container` class to constrain width (`max-width: 1200px`) and rely on CSS variables from `tokens.css` for spacing (`var(--space-md)`, etc.).
- **Sections**: Follow the `section` patterns in `nicksanders.astro`.
  - Primary sections: `<section class="section-alt ...">`
  - Compact sections: `<section class="section-compact ...">`
  - Include `scroll-trigger` class when using animation.

## 2. Typography & Color

| Token | Purpose |
|-------|---------|
| `--color-text-primary` | Primary text color |
| `--color-text-secondary` | Secondary/descriptive text |
| `--color-accent` | Accent lines, highlights |
| `--font-size-lg`, `--font-size-xs` | Responsive typography |
| `--font-weight-bold`, `--font-weight-medium` | Font weights |

Use existing utility classes rather than hard-coding values. If custom styling is needed, leverage `clamp()` for fluid font sizes and reference tokens from `tokens.css`.

## 3. Key Components

- `SectionHeading` (`@components/SectionHeading.astro`)
  - Props: `eyebrow`, `title`, `description`.
  - Use for section intros; wraps typography and includes accent underline.
- `TrustedByLogos`, `TechnologiesSection`, `ExploringNext`
  - Available for reuse when relevant.
- `ProjectCard` / `project-tile` pattern
  - See `.project-list` definition in `nicksanders.astro` for layout and animations.

## 4. Imagery & Media

- Profile and project imagery live in `/src/content` frontmatter or `/public/images`.
- Use `<img>` with `loading="lazy"` and `decoding="async"`.
- Maintain rounded corners using `var(--radius-lg)` when adding new cards or panels.

## 5. Animation System

- Class-based triggers: `.scroll-fade-up`, `.scroll-scale-in`, `.scroll-slide-in`, `.scroll-fade-left`, `.scroll-fade-right`.
- Wrap animated regions in `.scroll-trigger` to hook into the Intersection Observer defined in `nicksanders.astro`.
- Respect reduced motion: the existing script exits early when `prefers-reduced-motion` is true. Avoid introducing animation outside this pattern.

## 6. Backgrounds & Effects

- Glassmorphism panels use transparent white backgrounds with blur (see `.intro-copy`).
- Body background pattern is defined in `BaseLayout` using a subtle grid. Do not override globally.
- Accent dividers use `var(--color-accent)`.

## 7. Accessibility

- Ensure headings follow semantic order (`h1` per page, nested `h2`/`h3`).
- Maintain `aria-labels` on interactive elements (e.g., project tiles).
- Keep sufficient contrast (accent color already tuned for WCAG AA).
- Include descriptive `alt` text for images.

## 8. Page Template Recommendations

### Hero block
```astro
<section class="hero-section scroll-trigger">
  <div class="container hero-grid">
    <div class="hero-card scroll-fade-up">
      <h1>Page Heading</h1>
      <p class="hero-subhead">Supporting copy.</p>
      <div class="hero-meta">Optional badges/tags</div>
    </div>
    <aside class="hero-media scroll-fade-right">
      <!-- image or stats -->
    </aside>
  </div>
</section>
```

### Content section template
```astro
<section class="section-alt scroll-trigger">
  <div class="container">
    <div class="scroll-fade-up">
      <SectionHeading eyebrow="Section" title="Title" description="Optional description" />
    </div>
    <div class="content-grid">
      <!-- columns/cards -->
    </div>
  </div>
</section>
```

Use CSS from `nicksanders.astro` as reference for `.hero-section`, `.content-grid`, etc. When creating new classes, follow naming conventions (`.hero-*`, `.section-*`, `.scroll-*`) to keep styles consistent.

## 9. Project Detail Page Guidelines

- Use the hero section to surface project name, role, timeline, and quick stats.
- Follow with structured sections: **Problem → Role → Process → Outcomes → Reflection** (matches project frontmatter in `src/content/projects`).
- Pull metadata from Astro content collection to keep copy centralized.
- Include optional callouts using cards with `box-shadow` and accent borders similar to `.intro-copy`.

## 10. File Organization & Naming

- Page routes live in `src/pages`. For project detail: `src/pages/projects/[slug].astro`.
- Keep styles co-located in the page file unless shared across pages (then extract to `/src/styles` if multiple pages need it).
- Document future additions or variations by appending to this file.

---

**When in doubt:** mimic structure from `src/pages/nicksanders.astro`, reuse components, and lean on design tokens for any new styling. This ensures every new page feels like part of the same studio experience.
