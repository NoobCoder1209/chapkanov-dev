# `chapkanov-dev` — Execution Plan

## How to use this plan

You are the build session for this repo. Read this file end-to-end, then start executing immediately.

**Working agreement:**

1. **Start without waiting.** Begin Phase 1 in the *Subagent playbook* below.
2. **Always ask the user about business decisions and business logic.** Bio copy, hero tagline, project order, screenshots, colour palette / theme, contact links, blog welcome post text, custom domain timing. The "Business decisions" section below lists them.
3. **Ask the user when you are genuinely blocked.**
4. **Do not ask the user about engineering details.** Component shape, layout structure, prop names, MDX schema — your call.
5. **Use subagents aggressively.** Default to the playbook below.
6. **TaskCreate / TaskUpdate everything.**
7. **Pattern 3 only — except for this site.** This repo *is* the public deployed artefact. The site itself runs on Vercel free tier with Vercel Web Analytics or Plausible. No Anthropic API calls from this repo at all. Never commit secrets.
8. **Follow shared standards** (MIT, README, CI, topics, private until verified).
9. **All `Agent` tool calls must pass `model: "opus"`.**
10. **Off-limits forever:** SAP-internal references, `~/.claude/` material, RCA content. Aleksandar's bio mentions SAP work in general terms only, never specifics.

## Subagent playbook (this repo)

UI repo with multiple concerns (build pipeline, content collections, design, SEO). 4 in research, 2 in review.

**Phase 1 — Research (parallel):**
- `Explore` (Opus): "Find current Astro 4.x + Tailwind setup with `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `astro-icon` + Lucide. Return a working `astro.config.mjs` and content-collections setup."
- `Explore` (Opus): "Find best-practice dark/light theme toggle in Astro that avoids FOUC (inline pre-paint script). Return ≤30-line snippet."
- `Explore` (Opus): "Find Vercel Web Analytics integration for an Astro site (`@vercel/analytics/astro`). Return setup steps and any caveats."
- `Explore` (Opus): "Find Lighthouse-friendly Astro starter patterns for portfolios (image handling, font loading, critical CSS). Return a 10-bullet checklist."

**Phase 2 — Design (single):**
- `Plan` (Opus): "Given research and this PLAN.md, propose the page list, component list, content collection schema, and 5-step build order. Return as a checklist."

**Phase 3 — Build:** main session writes Astro + Tailwind + MDX content. Dispatch `Explore` for design questions on demand.

**Phase 4 — Review (parallel):**
- `code-reviewer` (Opus): "Review for: SEO completeness (sitemap, robots, og:image, canonical), accessibility (alt text, heading order, contrast), performance (image dims, preload, lazy-load), no SAP/Claude-Code references in copy. High effort."
- `tester` (Opus): "Run Lighthouse on `pnpm build && pnpm preview` locally and on the deployed Vercel URL. Confirm ≥95 across Performance / Accessibility / Best Practices / SEO. Surface any failures with fixes."

**Phase 5 — Polish:** capture screenshot of `/`, run final Lighthouse, ask user before flipping public.

---

## Goal

The personal portfolio site. Single source of truth for "this is who Aleksandar
is and these are his projects." Everything else (Upwork, LinkedIn, CV) eventually
links here.

**v1 = portfolio only**: bio + projects + contact. Blog structure built but empty
(one welcome post). CV/about page deferred to v2.

**Sells:** the rest of the portfolio. Site quality itself is a hiring signal.

## Business decisions to ask the user about

- **Hero tagline / one-liner** — must align with the Upwork "AI Apps & Integration" positioning while not lying about depth.
- **Bio copy** (~3–4 paragraphs) — the user's voice, not yours. Use their `human` skill style if available, otherwise ask them.
- **Pinned project order** — recommend AI repos first (1–3), then DevOps (4, 7, 8), then Terraform (5), then GymApp card.
- **Project card screenshots** — placeholders during build, real images before public flip. Each repo build session produces one; coordinate.
- **Colour palette / brand tone** — recommend dark-default, neutral palette with one accent. Ask before committing.
- **Email shown publicly on `/contact`** vs a contact form — recommend just the email + GitHub + LinkedIn + Upwork links (no form, no backend).
- **Custom domain timing** — site ships on `chapkanov-dev.vercel.app` first; user buys domain separately and tells you when to wire DNS.

## Scope (must-haves)

1. Astro 4.x + Tailwind, MDX-driven content collections.
2. Pages: `/`, `/projects/[slug]`, `/contact`, `/blog`, `/blog/[slug]`, 404.
3. **Six project pages** (one per pinned repo) — each with hero, summary, "Skills", "Tech stack", screenshots, "View on GitHub" CTA.
4. Vercel Web Analytics enabled.
5. SEO: per-page `<title>`, meta description, `og:image`, sitemap, robots, RSS.
6. Dark/light theme toggle with system-preference default + `localStorage`.
7. Lighthouse ≥ 95 across Performance / Accessibility / Best Practices / SEO.
8. Deployed at `https://chapkanov-dev.vercel.app` initially. Custom domain later.
9. Repo deployed-from-`main`.

## Production hygiene (must apply, not optional)

Inherits the master plan's "Production hygiene checklist." Repo-specific application:

- **No secrets in repo.** No env vars needed for v1 (analytics needs none). If any are added later, `.env*` gitignored, `.env.example` placeholders only.
- **Custom error screens.** Ship both `404.astro` and `500.astro`. Friendly tone, one CTA back to home. **Never expose stack traces or framework internals** to visitors.
- **Error messages tell what / why / what to do.** Apply this rule to any user-visible error string in the site copy (404, contact-page errors if added later, blog post-not-found).

## UX standards (must apply across the site)

These are the design rules every page and component inherits.

### Loading / async state policy

- **< 1 second** — no spinner, no skeleton, just render. Spinners on instant content feel broken.
- **1–5 seconds** — skeleton loaders (Tailwind `animate-pulse` blocks shaped like the eventual content). Plain spinners are weak; skeletons preview the layout.
- **> 5 seconds** — skeleton + a small status text ("Loading projects…"). Rare on a static site, but document the rule.

In a static Astro site most surfaces are instant, so this mostly applies to: image lazy-load (use `loading="lazy"` + skeleton placeholder), the project-grid first paint on slower connections, and any blog index that grows past a handful of posts.

### Four-state rule for every async surface

Every list, fetch, or async render must define all four:

1. **Loading state** — skeleton, never blank
2. **Empty state** — friendly, with one CTA (e.g. blog with no posts: "Posts coming soon — meanwhile, check out the projects.")
3. **Error state** — what / why / what to do
4. **Success state** — the actual content

Document the four states in `src/components/` as TSX-style props comments so reviewers see the discipline.

### Tooltips on icon-only buttons

`ThemeToggle`, social-icon links in `Footer`, any icon button anywhere — must have an accessible tooltip (visual on hover/focus + `aria-label` for screen readers). Use a small headless-tooltip pattern or pure CSS `title` as fallback.

### Image discipline

Every `<img>` / `<Image />`:
- Explicit `width` + `height` to prevent layout shift
- Meaningful `alt` (or `alt=""` if decorative — be deliberate)
- `loading="lazy"` for below-the-fold

### Design tokens (style guide)

Lock the design system in code, not in headers per file:

- `src/styles/tokens.css` — CSS custom properties for colours, spacing, font sizes, radii, shadows. Light + dark variants.
- `tailwind.config.mjs` — extend `theme.colors` etc. from those tokens so Tailwind utilities reference them.
- `docs/design-system.md` — short reference page documenting the palette, type scale, spacing scale, component states. Aleksandar can iterate the brand once and the site follows.

This is the "lock in a style guide" rule — without it every page drifts. With it, future pages cost half as much to build and the site stays cohesive.

### Cache discipline

`chapkanov-dev` is fully static — Astro emits static HTML/CSS. Vercel CDN handles caching. No application-level cache logic needed. **Skip "cache API data"** for v1 (no APIs).

## Out of scope (v1)

- `/about` long-form CV page
- Real blog content beyond one welcome post
- Comments
- Testimonials
- `/uses` page
- i18n
- Newsletter signup
- Custom domain (separate decision)

## Tech stack

- **Framework:** Astro 4.x
- **Styling:** Tailwind via `@astrojs/tailwind`
- **Hosting:** Vercel (`output: "static"`)
- **Analytics:** `@vercel/analytics/astro`
- **Theme:** Tailwind `dark:` class strategy + inline FOUC-prevention script
- **Icons:** `astro-icon` + Lucide
- **Linting:** `eslint` + `prettier` + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`
- **CI:** GitHub Actions (Vercel handles actual deploy)

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
  vercel.json
  public/
    favicon.svg
    og-default.png
    robots.txt
  src/
    pages/
      index.astro
      contact.astro
      404.astro
      500.astro
      projects/[...slug].astro
      blog/index.astro
      blog/[...slug].astro
      feed.xml.ts
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
      config.ts
      projects/                 ← 6 MDX files
      blog/welcome.mdx
    styles/
      base.css
      tokens.css                 ← CSS custom properties for colours/spacing/fonts (light + dark)
  docs/
    design-system.md             ← palette, type scale, spacing scale, component states
  .github/workflows/ci.yml
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
export default defineConfig({
  site: "https://chapkanov.dev",
  integrations: [tailwind(), mdx(), sitemap(), icon()],
  output: "static",
});
```

### 2. Layouts

`Base.astro` — shell with `<html>`, theme script, header, slot, footer, `<Analytics />`.
`Project.astro` — wraps Base, renders project hero + frontmatter + slot.
`Blog.astro` — wraps Base, renders post date + title + slot.

### 3. Content collections

```ts
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
const blog = defineCollection({ type: "content", schema: z.object({ title: z.string(), description: z.string(), pubDate: z.coerce.date(), draft: z.boolean().default(false) }) });
export const collections = { projects, blog };
```

### 4. Project MDX template

Six files, one per pinned repo. Each: title, pitch, repo URL, skills, techStack, screenshots, pinned, order. The GymApp one points at `2Bros1Mission/GymApp` and notes source is private.

### 5. Pages

- `index.astro` — hero, bio, project grid (filter `pinned`, sort `order`), contact CTA.
- `projects/[...slug].astro` — `getStaticPaths` from collection.
- `contact.astro` — email + social links.
- `blog/index.astro` — list non-draft posts.
- `blog/[...slug].astro` — render post.
- `404.astro` — friendly 404.

### 6. Components

Header, Footer, ThemeToggle, ProjectCard, SkillBadge, Hero, Seo.

### 7. SEO + sitemap + RSS + robots

Sitemap auto, RSS at `/feed.xml`, `robots.txt` allowing all + sitemap, default `og:image`.

### 8. Analytics

`<Analytics />` once in `Base.astro`.

### 9. CI

Setup Node 20 + pnpm; install; `astro check`; `prettier --check .`; `astro build`. Vercel deploys on `main`.

### 10. Vercel wiring

Connect repo to Vercel project `chapkanov-dev`. Astro preset auto. Production = `main`, previews on PR.

### 11. README

1. Title — *chapkanov-dev — Personal portfolio site*
2. Demo — link to live URL
3. What it shows — Astro + Tailwind, content collections, dark mode, Vercel deploy, ≥95 Lighthouse
4. Skills demonstrated — Astro, TypeScript, Tailwind, MDX, Vercel, SEO, Web Performance
5. Quick start: `pnpm install && pnpm dev`
6. Adding a project — short MDX frontmatter snippet
7. License — MIT

### 12. Polish + flip public

Lighthouse audit on prod, capture `/` screenshot. Topics: `astro`, `portfolio`, `tailwindcss`, `vercel`, `mdx`, `personal-website`. Ask user before flipping.

## Verification

- [ ] `pnpm dev` works fresh clone
- [ ] `pnpm build` + `pnpm preview` works
- [ ] All six project pages render with screenshots
- [ ] Dark mode flips correctly, no FOUC
- [ ] `404.astro` and `500.astro` exist and render friendly content (no stack traces)
- [ ] All four states (loading / empty / error / success) defined for every async surface
- [ ] Skeleton loaders used wherever a spinner was tempting
- [ ] Every icon-only button has a tooltip + `aria-label`
- [ ] Every `<img>` has explicit width/height + meaningful alt + lazy where appropriate
- [ ] `src/styles/tokens.css` exists, Tailwind theme references it, `docs/design-system.md` documents it
- [ ] Lighthouse on deployed URL ≥ 95 across all four metrics
- [ ] Sitemap, RSS, robots.txt reachable
- [ ] External links use `rel="noopener"` where appropriate
- [ ] Vercel Analytics live (test by visiting in another browser)
- [ ] No SAP-internal references; no `~/.claude/` references
- [ ] Topics + description set

## Stretch (defer to v2)

- `/about` recruiter-friendly CV page
- `/uses` page
- `/design` page — public design-system page rendered from `docs/design-system.md`, doubles as a portfolio piece showing UX discipline
- Real blog posts (3 ideas: "Building a tiny RAG", "Why MCP matters", "What I learned shipping a portfolio in 4 weeks")
- Giscus comments
- Custom domain
- Testimonials carousel
- Project filter / search
