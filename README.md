# SandRise Portfolio

A responsive, accessible portfolio for Nick Sanders (Product Builder) and the SandRise studio. Built with [Astro 4](https://astro.build) and a custom design system inspired by modern light-mode product sites. Includes reusable layout components, content collections, design tokens, and a Figma-ready mockup blueprint.

## Highlights

- **Modern stack**: Astro + TypeScript (SSR-ready), with design tokens and components composed in `.astro` files.
- **Design system tokens**: Centralized colors, typography, spacing, radii, shadows, and animation settings in `src/styles/tokens.css`.
- **Accessible + performant**: Semantic structure, skip link, reduced-motion support, lazy-loaded imagery, Netlify-ready forms, and WCAG AA contrast.
- **Content collections**: Project case studies and blog insights defined via `astro:content` for scalable CMS-lite authoring.
- **Design blueprint**: `design/sandrise-figma.json` encodes desktop & mobile frames for quick import into Figma via JSON plugins.

## Getting Started

```bash
npm install
npm run dev
```

- Development server: `http://localhost:4321`
- Production build: `npm run build`
- Type checks / Astro diagnostics: `npm run check`
- Format: `npm run format`

## Project Structure

```
src/
  components/    # Header, Footer, SEO, ProjectCard, SectionHeading, etc.
  content/       # Markdown-driven projects & insights (Astro Content Collections)
  layouts/       # Base layout with SEO + shared chrome
  pages/         # Route definitions for Home, Work, Project detail, About, Approach, Skills, Contact, Blog
  styles/        # Global styles + design tokens
public/
  images/        # Placeholder imagery ready to swap with final assets
  resume.pdf     # Placeholder; replace with final resume
  brand-guidelines.pdf # Placeholder brand kit
```

## Design System

| Token | Value | Notes |
| --- | --- | --- |
| Accent | `#0C7AE3` | Primary electric blue accent |
| Highlight | `#5A7BFF` | Secondary violet-blue |
| Base background | `#F8F8F8` | Light neutral wash |
| Typography | Inter (body), Manrope (headings) | Loaded via Google Fonts |
| Radii | 6px / 12px / 18px / 999px | Cards and pill buttons |
| Shadows | Soft + medium | Subtle depth cues |

Fonts, colors, spacing, and animation durations are exposed as CSS Custom Properties in `tokens.css` and consumed throughout components.

### Reduced Motion & Contrast

- `prefers-reduced-motion` disables hero orbit animations and transitions.
- All text combinations pass WCAG AA on the default light background (verified via Stark contrast ratios).

## Content Management

Projects live in `src/content/projects/*.md` with structured frontmatter:

```yaml
title: "Atlas Labs — Analytics reboot"
summary: "Scaled an analytics suite..."
category: "SaaS"
role: "Head of Product"
heroImage: "/images/projects/atlas-labs.svg"
...
```

Blog posts live in `src/content/blog/*.md`. Draft posts (`draft: true`) are hidden automatically.

## Design Mockup

`design/sandrise-figma.json` contains frame definitions for desktop and mobile. Import using plugins such as _"Figma Import JSON"_ or use it as a reference when building the visual spec. Tokens mirror the CSS variables so engineering <-> design stay in sync.

## TODO Before Launch

- Replace placeholder imagery (`public/images/...`) with production assets.
- Swap `resume.pdf` and `brand-guidelines.pdf` placeholders with final exports.
- Populate blog posts and set `draft: false` for publish-ready articles.
- Configure Netlify (or alternative) forms handling if using built-in contact/newsletter forms.

## SEO & Metadata

- `SEO.astro` centralizes meta tags, Open Graph, Twitter cards, and JSON-LD injection.
- Each page feeds a tailored `title` / `description`; project detail pages emit `CreativeWork` schema, blog posts emit `Article` schema.
- `astro.config.mjs` includes sitemap generation (via `@astrojs/sitemap`).

## Accessibility Checklist

- Skip-to-content link
- Focus-visible styles on interactive components
- Labels on all form inputs
- Decorative animations disabled for motion-sensitive users
- Alt text for every non-decorative image

## Deployment

1. Replace placeholder assets & content.
2. `npm run build`
3. Deploy `dist/` to Netlify, Vercel, or preferred static host (Astro SSR adapters optional).

## Exploring Next Ingestion Service

The Cloudflare Worker powering SMS/Slack ingestion lives in `workers/exploring-ingest/`.

### 1. Configure Environment Variables

Set the following on the Worker via `wrangler.toml` vars or `wrangler secret put`:

| Name | Type | Purpose |
| --- | --- | --- |
| `ENABLE_TWILIO` | plain | Gate the Twilio channel (`true`/`false`) |
| `ENABLE_SLACK` | plain | Gate the Slack channel (`true`/`false`) |
| `SUPABASE_URL` | plain | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | secret | Service-role key for writes/reads |
| `SUPABASE_EXPLORING_TABLE` | plain (optional) | Override table name (`exploring_next` default) |
| `TWILIO_AUTH_TOKEN` | secret | Validate Twilio webhook signatures |
| `SLACK_SIGNING_SECRET` | secret | Validate Slack slash command signatures |
| `BUILD_WEBHOOK_URL` | secret (optional) | Trigger Astro rebuild after new entry |
| `TWILIO_SUCCESS_MESSAGE` | plain (optional) | Custom SMS confirmation |
| `SLACK_SUCCESS_MESSAGE` | plain (optional) | Custom Slack response |
| `FEED_LIMIT` | plain (optional) | Default number of items served by `/feed` |

On the Astro site, expose the Worker feed via `.env`:

```
PUBLIC_EXPLORING_FEED_URL="https://<worker-domain>/feed"
```

### 2. Deploy the Worker

```
npm install --prefix workers/exploring-ingest
npm run deploy --prefix workers/exploring-ingest
```

Point Twilio SMS and the Slack Slash Command to:

- `POST https://<worker-domain>/ingest/twilio`
- `POST https://<worker-domain>/ingest/slack`

### 3. Supabase Table Schema

```
create table public.exploring_next (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  type text check (type in ('tool','article','research','api')) default 'article',
  description text,
  source_channel text,
  source_context jsonb,
  discovered_at timestamptz default now()
);
```

The Worker also exposes `GET /feed` returning `{ items: [...] }`; `ExploringNext.astro` will call this endpoint when `PUBLIC_EXPLORING_FEED_URL` is set, falling back to the static list when absent or on error.

---

Crafted with care for SandRise — let me know when you’re ready to plug in real case studies or iterate further.
