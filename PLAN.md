# `chapkanov-dev` — Execution Plan

> Self-contained build plan. Inherits shared standards from the master plan.

## Goal

The personal portfolio site. Single source of truth for "this is who Aleksandar
is and these are his projects." Everything else (Upwork, LinkedIn, CV)
eventually links here.

**v1 = portfolio only**: bio + projects + contact. Blog structure built but
empty (one welcome post). CV/about page deferred to v2.

**Sells:** the rest of the portfolio. Site quality itself is a hiring signal —
Lighthouse ≥ 95 across the board.

## Scope (must-haves)

1. Astro 4.x + Tailwind, MDX-driven content collections.
2. Pages: `/` (hero + bio + project grid + contact CTA), `/projects/[slug]`
   (one MDX page per public project), `/contact`, `/blog` (index), `/blog/[slug]`
   (one welcome post placeholder), 404.
3. **Six project pages** (one per pinned repo). Each pulls metadata from the MDX
   frontmatter and renders a hero, summary, "Skills", "Tech stack", screenshots
   gallery, "View on GitHub" CTA.
4. Vercel Web Analytics enabled (free tier, no cookies).
5. SEO: per-page `<title>`, meta description, `og:image` (one shared site default
   plus project-specific overrides), `sitemap.xml`, `robots.txt`, `feed.xml` for
   the blog.
6. Dark/light theme toggle (system-preference default, persisted to `localStorage`).
7. Lighthouse target ≥ 95 on Performance / Accessibility / Best Practices / SEO.
8. Deployed at `https://chapkanov-dev.vercel.app` (free Vercel URL) initially.
   Custom domain wiring is out-of-band (the user will buy one separately).
9. Repo deployed-from-`main` so each merge = ship.

## Out of scope (v1)

- `/about` long-form CV page → v2
- Real blog content (the structure exists; only one welcome post, no full posts) → v2
- Comments (Giscus / Utterances) → v2
- Testimonials section → v2 (need actual clients first)
- `/uses` page → v2
- Internationalisation
- Newsletter signup
- Custom domain (separate decision)

## Tech stack

- **Framework:** Astro 4.x (`@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`)
- **Styling:** Tailwind CSS via `@astrojs/tailwind`
- **Hosting:** Vercel (`@astrojs/vercel/serverless` adapter, but this is a
  fully static site — output `static` is fine)
- **Analytics:** `@vercel/analytics/astro` (or Plausible if Aleksandar prefers;
  Vercel is one less account)
- **Theme:** Tailwind `dark:` class strategy with a tiny inline script to set
  `class="dark"` before paint to avoid FOUC
- **Icons:** `astro-icon` with the Lucide pack (small, free, MIT)
- **Linting:** `eslint` + `prettier` + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`
- **CI:** GitHub Actions (Vercel handles the actual deploy via its GitHub app)

## File tree

```
chapkanov-dev/
  README.md
  PLAN.md
  LICENSE
  .gitignore
  package.json
  pnpm-lock.yaml
  astro.config.mjs
  tailwind.config.mjs
  tsconfig.json
  vercel.json                     ← optional, mainly for headers
  public/
    favicon.svg
    og-default.png
    robots.txt                    ← generated or static
  src/
    pages/
      index.astro
      contact.astro
      404.astro
      projects/[...slug].astro
      blog/index.astro
      blog/[...slug].astro
    layouts/
      Base.astro
      Project.astro
      Blog.astro
    components/
      Header.astro
      Footer.astro
      ThemeToggle.astro
      ProjectCard.astro
      Hero.astro
      SkillBadge.astro
      Seo.astro
    content/
      config.ts                   ← Astro content collections config
      projects/                   ← 6 MDX files (one per pinned repo)
        claude-agent-starter.mdx
        markdown-rag.mdx
        mcp-server-sample.mdx
        helm-chart-template.mdx
        terraform-aws-static-site.mdx
        gymapp.mdx
      blog/
        welcome.mdx
    styles/
      base.css
  .github/
    workflows/
      ci.yml
```

## Step-by-step build

### 1. Bootstrap

```bash
pnpm create astro@latest . --template minimal --typescript strict --no-install
pnpm add -D astro @astrojs/tailwind @astrojs/mdx @astrojs/sitemap @astrojs/rss \
  tailwindcss astro-icon @iconify-json/lucide @vercel/analytics \
  prettier prettier-plugin-astro prettier-plugin-tailwindcss eslint
pnpm install
```

`astro.config.mjs`:
```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://chapkanov.dev", // update once domain bought
  integrations: [tailwind(), mdx(), sitemap(), icon()],
  output: "static",
});
```

### 2. Layouts

`Base.astro` — shell with `<html>`, theme script (set `class="dark"` before
paint), `<Header />`, `<slot />`, `<Footer />`. Inject Vercel Analytics
(`<Analytics />`) once. Pulls SEO metadata from props.

`Project.astro` — wraps Base, renders project hero + frontmatter (title,
description, skills, tech stack, repo URL, screenshots), then `<slot />` for
MDX body.

`Blog.astro` — wraps Base, renders post date + title + slot.

### 3. Content collections (`src/content/config.ts`)

```ts
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pitch: z.string(),
    repo: z.string().url(),
    skills: z.array(z.string()),
    techStack: z.array(z.string()),
    screenshots: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    pinned: z.boolean().default(false),
    status: z.enum(["public", "private", "draft"]).default("public"),
    order: z.number().default(99),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
```

### 4. Project MDX template

Each `src/content/projects/<slug>.mdx`:

```mdx
---
title: claude-agent-starter
pitch: The minimal, opinionated Claude agent template.
repo: https://github.com/NoobCoder1209/claude-agent-starter
skills: [Anthropic Claude API, AI Agent Development, Prompt Engineering, TypeScript]
techStack: [TypeScript, Node.js, Anthropic SDK, pnpm, Vitest]
screenshots:
  - { src: /projects/claude-agent-starter/demo.png, alt: "Agent answering a question" }
pinned: true
order: 1
---

## What it does

Short paragraph...

## How it works

Short paragraph + maybe a code snippet...

## Why I built it

Personal-voice paragraph (1–2 sentences).
```

Six of these total. The `gymapp.mdx` one points its `repo` field to
`https://github.com/2Bros1Mission/GymApp` and notes in body that the source is
private; screenshots tell the story.

### 5. Pages

- `index.astro` — hero (name + tagline + CTA), short bio, project grid (filter
  `pinned: true`, sort by `order`), contact CTA at bottom.
- `projects/[...slug].astro` — `getStaticPaths` from the projects collection,
  render with `Project.astro`.
- `contact.astro` — simple page: email, GitHub, LinkedIn, Upwork. No form
  (Pattern 3 — no backend).
- `blog/index.astro` — list non-draft posts.
- `blog/[...slug].astro` — render with `Blog.astro`. RSS feed at `/feed.xml`.
- `404.astro` — friendly 404 with home link.

### 6. Components

- **Header** — name link, nav (Home, Projects, Blog, Contact), theme toggle.
- **Footer** — small print + social icons.
- **ThemeToggle** — button toggling `document.documentElement.classList`,
  syncing `localStorage["theme"]`.
- **ProjectCard** — image, title, pitch, skill badges (top 4), CTA.
- **SkillBadge** — Tailwind pill, lowercase, hover state.
- **Hero** — `h1` + tagline + two CTAs (Projects, Contact).
- **Seo** — `<head>` partial taking `{ title, description, image, canonical }`.

### 7. SEO + sitemap + RSS

- Sitemap auto-generated by `@astrojs/sitemap`.
- RSS via `@astrojs/rss` at `src/pages/feed.xml.ts` reading the blog collection.
- `robots.txt` in `public/` allowing all + pointing at sitemap.
- Default `og:image` at `public/og-default.png`. Project pages can override via
  frontmatter (Aleksandar can decide later — v1 ships with the default for all).

### 8. Analytics

`@vercel/analytics/astro` `<Analytics />` placed once in `Base.astro` near
`</body>`. No env var needed; Vercel auto-detects the project.

### 9. CI

`.github/workflows/ci.yml`:
- Setup Node 20 + pnpm
- `pnpm install --frozen-lockfile`
- `pnpm exec astro check` (type-checks and content collection schema)
- `pnpm exec prettier --check .`
- `pnpm exec astro build`

No deploy step in CI — Vercel's GitHub app handles `main` deploys.

### 10. Vercel wiring

- Connect `NoobCoder1209/chapkanov-dev` to a new Vercel project named `chapkanov-dev`.
- Framework preset: Astro (auto-detected).
- Production branch: `main`. Preview deployments on every PR.
- Add the project to a free Vercel team if Aleksandar uses one.

### 11. README

1. **Title** — *chapkanov-dev — Personal portfolio site*
2. **Demo** — link to live URL once deployed; otherwise screenshot of `/`
3. **What it shows** — Astro + Tailwind, content collections, dark mode, Vercel deploy, ≥95 Lighthouse
4. **Skills demonstrated** — Astro, TypeScript, Tailwind, MDX, Vercel, SEO, Web Performance
5. **Quick start**:
   ```bash
   pnpm install
   pnpm dev
   ```
6. **Adding a project** — short snippet showing the MDX frontmatter
7. **License** — MIT

### 12. Polish + flip public

Capture a screenshot of the deployed `/`. Run Lighthouse on the prod URL
(target ≥ 95 each metric). Topics: `astro`, `portfolio`, `tailwindcss`,
`vercel`, `mdx`, `personal-website`. Flip public.

## Verification

- [ ] `pnpm dev` works on a fresh clone
- [ ] `pnpm build` + `pnpm preview` works
- [ ] All six project pages render with screenshots (placeholder OK during build, real before public flip)
- [ ] Dark mode flips correctly, no FOUC
- [ ] Lighthouse on the deployed URL ≥ 95 across Performance / Accessibility / Best Practices / SEO
- [ ] Sitemap, RSS, robots.txt all reachable
- [ ] All external links use `rel="noopener"` where appropriate
- [ ] Vercel Analytics live (test by visiting in another browser, dashboard records the visit)
- [ ] No SAP-internal references; no `~/.claude/` references
- [ ] Repo topics + description set

## Stretch (defer to v2)

- `/about` recruiter-friendly CV page (replaces the PDF)
- `/uses` page
- Real blog posts (start with the three ideas: "Building a tiny RAG", "Why MCP matters",
  "What I learned shipping a portfolio in 4 weeks")
- Giscus comments on blog posts
- Custom domain (`chapkanov.dev` — out-of-band purchase)
- Testimonials carousel once Upwork engagements exist
- Project filter / search

Captured for v2 planning. Do not pull into v1.
