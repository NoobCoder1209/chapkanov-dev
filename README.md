# chapkanov-dev

> Personal portfolio site for Aleksandar Chapkanov.
> Astro 4 + Tailwind, MDX-driven content collections, deployed on Vercel.

**Live:** [chapkanov-dev.vercel.app](https://chapkanov-dev.vercel.app)

## What it shows

- **Astro 4 + Tailwind** with design tokens locked in CSS custom properties (light + dark themes share the same component code)
- **Content collections** (Zod-validated frontmatter) for project entries — nine MDX files drive the homepage grid and detail pages
- **Dark / light / system theme toggle** with zero FOUC, persisted via `localStorage`, View-Transitions-safe
- **Motion-driven**: scroll-reveal primitive (IntersectionObserver) + Astro view transitions, with full `prefers-reduced-motion` discipline
- **SEO complete**: per-page title / description / canonical, OG + Twitter card meta, Person json-ld on the homepage, sitemap, robots.txt
- **Vercel Web Analytics + Speed Insights** enabled
- **Lighthouse target: ≥ 95** on Performance / Accessibility / Best Practices / SEO

## Skills demonstrated

Astro · TypeScript · Tailwind · MDX · Vercel · SEO · Web performance · Accessibility · Design systems

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output to ./dist
pnpm preview      # serve the built site
```

Other scripts:

```bash
pnpm check          # astro check (TypeScript + Astro diagnostics)
pnpm lint           # eslint over .js / .mjs / .ts / .astro
pnpm format         # prettier --write
pnpm format:check   # CI gate
```

CI runs `format:check`, `lint`, `check`, and `build` on every push to `main` and every pull request.

## Adding a project

Drop a new MDX file under `src/content/projects/<slug>.mdx`:

```mdx
---
title: my-new-project
pitch: One-line description, max 200 chars.
repo: https://github.com/me/my-new-project
category: devops # devops | ai | terraform | learning
order: 10 # lower = earlier on the homepage grid
status: public # public | private | learning-notes | draft
skills:
  - One skill
techStack:
  - One tech
screenshots:
  - { src: "/screenshots/my-new-project.png", alt: "...", width: 1600, height: 900 }
---

Body text rendered through `<Prose>` on the project detail page.
```

The schema lives in `src/content/config.ts` — frontmatter that doesn't validate fails the build.

## Architecture

```
src/
  styles/tokens.css           — single source of truth for the design system
  layouts/                    — Base + Project shell
  components/                 — Hero, Bio, ProjectGrid, ProjectCard, Header, Footer, …
  content/projects/           — MDX entries (one per pinned repo)
  pages/                      — /, /contact, /now, /404, /500, /projects/[slug]
  lib/theme.ts                — shared theme storage helpers
docs/design-system.md         — palette / type / spacing / motion reference
```

See [`docs/design-system.md`](./docs/design-system.md) for the full visual system reference.
See [`PLAN.md`](./PLAN.md) for the build plan that produced this site.

## Deployment

Deployed-from-`main` via Vercel. The Astro build outputs static HTML to `dist/`; no SSR adapter is needed.

## License

[MIT](./LICENSE)
