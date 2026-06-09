# `chapkanov-dev` — operator's guide

> **Last verified:** 2026-06-09 against `main` at parent commit `82ba09f`,
> immediately before adding this guide. Ran `pnpm install && pnpm dev` on
> macOS, pnpm 10.18.1. Localhost:4321 returned HTTP 200, ~108KB. The
> homepage rendered with hero ("Hi, I'm Aleksandar. I ship things."),
> 3-paragraph bio, 9 project cards in 4 category groups (DevOps / AI /
> Terraform / Learning notes), footer with obfuscated email + 3 social
> links. `pnpm build` emitted 14 static pages plus `sitemap-index.xml`.

> **Note on doc rot:** this guide enumerates exact file lists and pinned
> versions. When in doubt, trust the source of truth (`package.json`,
> `src/`, `astro.config.mjs`) over this file.

`chapkanov-dev` is the personal portfolio site at
[chapkanov-dev.vercel.app](https://chapkanov-dev.vercel.app). It's a static
Astro 4 site — no backend, no database, no API. The "demo" is just the site
itself: clone, install, run, open browser.

This guide is for someone who has never touched the repo. Plain English,
copy-pasteable commands, every prerequisite spelled out.

---

## 1. Run the site end-to-end

### Prerequisites

You need three things on your machine. If any are missing, install them via
the command after the bullet.

- **Git** — should already be on your machine. Verify: `git --version`. If
  missing on macOS: `xcode-select --install`.
- **Node.js 20 or newer** — `node --version` should print `v20.x.x` or
  higher. The repo is tested with Node 20 (CI) and Node 26 (local). If
  missing: install via [nvm](https://github.com/nvm-sh/nvm) (`nvm install 20`)
  or [the official installer](https://nodejs.org/).
- **pnpm 10** — Node ships with `corepack`, which manages pnpm automatically
  via the `packageManager` field in `package.json`. Enable it once:
  ```bash
  corepack enable
  ```
  Verify: `pnpm --version` should print `10.18.1` (or whatever the
  `packageManager` field says).

### Step-by-step

```bash
# 1. Clone the repo
git clone https://github.com/NoobCoder1209/chapkanov-dev.git
cd chapkanov-dev

# 2. Install dependencies
#    First-time install will take ~30s. pnpm reads pnpm-workspace.yaml and
#    auto-approves build scripts for `esbuild` and `sharp` (both legitimate;
#    Astro's image pipeline needs sharp).
pnpm install

# 3. Run the dev server
pnpm dev
```

You should see something like:

```
 astro  v4.16.19 ready in 1244 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

watching for file changes...
```

Open <http://localhost:4321/> in your browser. The homepage should render the
hero, bio, and 9 project cards. The theme toggle is the icon top-right; it
cycles **system → light → dark** on each click.

### Other commands

```bash
pnpm build          # produce a static build to ./dist
pnpm preview        # serve ./dist on http://localhost:4321 (production mode)
pnpm check          # astro check — TypeScript + Astro diagnostics
pnpm lint           # ESLint over .js / .mjs / .ts / .astro
pnpm format         # prettier --write
pnpm format:check   # CI gate (no writes)
```

CI (GitHub Actions, `.github/workflows/ci.yml`) runs `format:check` →
`lint` → `check` → `build` → "verify dist artifacts" (asserts every
expected static file exists post-build) on every push to `main` and
every pull request.

---

## 2. What every directory and file does

```
chapkanov-dev/
├── astro.config.mjs          ← Astro config: site URL, integrations, vite tweaks
├── tailwind.config.mjs       ← Tailwind theme.extend pointed at design tokens
├── tsconfig.json             ← Extends astro/tsconfigs/strict
├── vercel.json               ← Vercel hosting config + security headers
├── package.json              ← Scripts + dependencies. packageManager pins pnpm@10
├── pnpm-workspace.yaml       ← Approves esbuild + sharp build scripts; peer-dep
│                                ignore list keeps Next/React/Svelte out of node_modules
├── pnpm-lock.yaml            ← Lockfile (frozen in CI)
├── eslint.config.mjs         ← ESLint v9 flat config, parses .astro <script> as TS
├── .prettierrc.json          ← Prettier config (incl. astro + tailwindcss plugins)
├── .prettierignore           ← Skips PLAN.md, LICENSE, dist, etc.
├── .npmrc                    ← auto-install-peers + relaxed peer-strictness
├── .gitignore                ← Standard Astro gitignore (dist, .astro, node_modules, …)
├── README.md                 ← Public-facing repo intro
├── PLAN.md                   ← The full execution plan (history of how the site was built)
├── guide.md                  ← This file
├── LICENSE                   ← MIT, © Aleksandar Chapkanov
│
├── public/                   ← Files served as-is from /
│   ├── favicon.svg           ← The blue rounded-square "c" mark
│   ├── og-default.png        ← 1200×630 OG card used for social shares
│   └── robots.txt            ← Allows all crawlers, advertises sitemap-index.xml
│
├── docs/
│   └── design-system.md      ← Palette, type scale, spacing, motion tokens, rules
│
├── src/
│   ├── content/
│   │   ├── config.ts         ← Zod-validated schema for `projects` collection
│   │   └── projects/         ← One MDX file per pinned project (9 entries)
│   │
│   ├── layouts/
│   │   ├── Base.astro        ← <html> shell: FOUC-free theme script, view transitions,
│   │   │                       Header, Footer, ScrollReveal, Vercel Analytics +
│   │   │                       Speed Insights at end of body
│   │   └── Project.astro     ← Wraps Base for project detail pages
│   │
│   ├── components/
│   │   ├── Header.astro      ← Sticky blurred top bar, nav, ThemeToggle, skip link
│   │   ├── Footer.astro      ← Social icons (Email obfuscated), copyright
│   │   ├── ThemeToggle.astro ← 3-state (system/light/dark) toggle, no FOUC
│   │   ├── IconLink.astro    ← Anchor + Lucide icon + tooltip pattern
│   │   ├── MailtoLink.astro  ← Scraper-resistant email link
│   │   ├── Hero.astro        ← Homepage hero (eyebrow, h1, subhead, 2 CTAs)
│   │   ├── Bio.astro         ← Two-column "About" block, 3 paragraphs
│   │   ├── ProjectGrid.astro ← Groups projects by category, handles empty state
│   │   ├── ProjectCard.astro ← Card: title, pitch, tech, status badge, GitHub link
│   │   ├── SkillBadge.astro  ← Pill chip used on project detail "Skills"
│   │   ├── StatusBadge.astro ← Public / private / learning-notes / draft variants
│   │   ├── Prose.astro       ← Typographic wrapper for MDX bodies
│   │   ├── Reveal.astro      ← Fade-in-on-scroll wrapper around its slot
│   │   ├── ScrollReveal.astro← Singleton IntersectionObserver for [data-reveal]
│   │   └── Seo.astro         ← Per-page <head>: title, description, canonical,
│   │                           OG / Twitter cards, Person json-ld
│   │
│   ├── pages/
│   │   ├── index.astro       ← /
│   │   ├── contact.astro     ← /contact
│   │   ├── now.astro         ← /now
│   │   ├── 404.astro         ← 404 page (Vercel auto-serves on missing routes)
│   │   ├── 500.astro         ← 500 page (needs Vercel rewrite to actually serve)
│   │   └── projects/
│   │       └── [...slug].astro ← Dynamic route, one detail page per project MDX
│   │
│   ├── styles/
│   │   ├── tokens.css        ← Design tokens (CSS custom properties, light + dark)
│   │   └── base.css          ← Global resets + tooltip / reveal / container utilities
│   │
│   ├── lib/
│   │   └── theme.ts          ← Shared theme storage helpers (used by ThemeToggle)
│   │
│   └── env.d.ts              ← Auto-generated by `astro sync`, kept in tree
│
└── .github/
    └── workflows/ci.yml      ← format:check + lint + check + build + verify-artifacts
```

For the visual system specifically (colours, type scale, spacing, motion
tokens, accent rules), read `docs/design-system.md`.

---

## 3. Environment variables and secrets

**There are none.** This is a fully static site: no backend, no API keys, no
database, no auth. You can clone and run without a single secret.

A few notes for the curious:

- **Vercel Web Analytics + Speed Insights** are enabled per-project in the
  Vercel dashboard, not via code. The `<Analytics />` and `<SpeedInsights />`
  components in `Base.astro` need zero config.
- **No `.env` files** ship with the repo. The `.gitignore` excludes `.env`,
  `.env.local`, `.env.production`, `.env.*.local` so you can't accidentally
  commit secrets if you add any later.
- **Vercel deploys** are wired through the Vercel UI (connect the GitHub
  repo, point at `main`), not through `vercel.json` secrets. The `vercel.json`
  in the repo only sets security headers (`X-Frame-Options`, etc.) and
  framework metadata.

If you ever need to add an env var (say, for a contact form backend), the
pattern is:

1. Add it to a new `.env.local` (gitignored).
2. Add a placeholder line to `.env.example` (committed) so others know it
   exists.
3. Reference it via `import.meta.env.PUBLIC_FOO` (must be `PUBLIC_*` to be
   readable client-side) or as a build-time substitution via
   `astro:env`.

---

## 4. How to verify the site actually worked

After `pnpm dev` is running, here's what "working" looks like.

### A. The dev server log

You should see exactly this shape:

```
 astro  v4.16.19 ready in NNNN ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

watching for file changes...
```

If the port is taken, Astro will pick the next free one (`4322`, `4323`, …)
and print that. Use whichever URL it prints.

### B. The HTTP probe

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}b\n" http://localhost:4321/
# → 200 1xxxxxb   (around 100–110 KB)
```

Routes that work in **dev** (`pnpm dev`):

| Route                        | Expected status |
| ---------------------------- | --------------- |
| `/`                          | 200             |
| `/contact`                   | 200             |
| `/now`                       | 200             |
| `/projects/markdown-rag`     | 200             |
| `/projects/<any of 9 slugs>` | 200             |
| `/projects/does-not-exist`   | 404             |
| `/og-default.png`            | 200             |
| `/robots.txt`                | 200             |

Routes that only exist **after a build** (`pnpm build && pnpm preview`):

| Route                | Expected status |
| -------------------- | --------------- |
| `/sitemap-index.xml` | 200             |
| `/sitemap-0.xml`     | 200             |

The sitemap integration doesn't emit anything in dev mode — it only runs
during `pnpm build`.

### C. The browser check

Open <http://localhost:4321/>. You should see:

- A **header** at the top: wordmark `chapkanov.dev` (with a blue dot before
  `dev`), nav `Home / Now / Contact`, and a sun/moon/monitor icon button
  (the theme toggle).
- A **hero**: eyebrow `Sofia · SRE & AI apps`, large heading `Hi, I'm
Aleksandar. I ship things.`, subhead about SRE + AI agents, two CTAs
  (`See projects`, `Get in touch`).
- An **about block**: small `ABOUT` label on the left, three paragraphs of
  bio on the right.
- A **project grid**: heading `Projects · 9 pinned`, then four category
  groups in this order:
  - **DevOps** — 4 cards (Jenkins/Docker/SonarQube, helm-chart-template,
    github-actions-templates, k8s-pod-doctor)
  - **AI** — 3 cards (claude-agent-starter, markdown-rag, mcp-server-sample)
  - **Terraform** — 1 card (terraform-aws-static-site)
  - **Learning notes** — 1 card (DevOpsCourse, with an amber "Learning notes"
    badge)
- A **footer**: copyright line, four social icons (mail, GitHub, LinkedIn,
  Upwork briefcase). Hover any of them to see the tooltip.

Click the theme toggle and confirm it cycles through three states. The
choice persists across reloads (localStorage).

### D. The build

```bash
pnpm build
```

Expected tail:

```
 generating static routes
17:20:09 ▶ src/pages/index.astro
17:20:09   └─ /index.html
... (12 more)
17:20:09 [@astrojs/sitemap] `sitemap-index.xml` created at `dist`
17:20:09 [build] 14 page(s) built in 1.22s
17:20:09 [build] Complete!
```

Then the CI gate:

```bash
pnpm format:check  # → "All matched files use Prettier code style!"
pnpm lint          # → no findings
pnpm check         # → "0 errors / 0 warnings / 0 hints"
```

If all four pass, the build is green. CI will accept the same.

---

## 5. Common failure modes and their fixes

### `pnpm: command not found`

Corepack isn't enabled. Run:

```bash
corepack enable
pnpm --version
```

If `corepack` itself isn't found, your Node is too old (pre-16). Upgrade
Node to 20 or later.

### `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild, sharp`

pnpm 10 blocks postinstall scripts by default. The repo includes
`pnpm-workspace.yaml` with an `allowBuilds` mapping that opts in `esbuild`
and `sharp`:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

If you see this error, the workspace file probably wasn't copied or you're
on a tooling chain that ignores it. Fix:

```bash
corepack enable
rm -rf node_modules
pnpm install
```

### Port 4321 already in use

Either Astro will pick the next free port automatically, or another process
is hanging on. Find and kill:

```bash
lsof -iTCP:4321 -sTCP:LISTEN
kill <PID>
```

Or run dev on a custom port:

```bash
pnpm dev --port 5173
```

### `Missing "./font.css" specifier in "geist" package`

You're not on this version of the repo — earlier in the build the fonts
came from the `geist` npm package which is Next.js-only. The current repo
uses `@fontsource-variable/geist` instead. Pull `main` and reinstall.

### `Cannot read properties of undefined (reading 'reduce')` during build

The `@astrojs/sitemap` integration crashed. It's pinned to `3.2.1` because
3.7.x targets Astro 5 internals and breaks on Astro 4. If you bump it,
you'll see this. Pin it back:

```bash
pnpm add -D @astrojs/sitemap@3.2.1
```

### Dark mode flickers on reload (FOUC)

Should not happen — there's an `is:inline` pre-paint script in `Base.astro`
that runs before any content paints. If you see a flash of light theme on a
dark-preferring browser, suspect a misconfigured CDN / cache that's
stripping `<script is:inline>` blocks. Check the served HTML for the
`(() => { const KEY = "theme" …` script in `<head>`.

### Theme toggle does nothing after a view-transition navigation

The toggle's listener should re-bind on `astro:after-swap`. If you've
edited `ThemeToggle.astro` and the rebind got lost, the click handler will
be dead after navigating from one page to another via the in-app links.
Look for the `document.addEventListener("astro:after-swap", wire)` line.

### `pnpm check` reports type errors after editing `src/content/config.ts`

Astro generates content collection types into `.astro/types.d.ts`. Stale
types are the usual cause. Regenerate:

```bash
pnpm exec astro sync
pnpm check
```

### `pnpm build` produces 0 pages but exits 0

Astro prints the built page list before the success summary. If you see
`0 page(s) built` without an error, you've probably wiped `src/pages/` or
the dynamic route's `getStaticPaths` returned an empty array. Check:

```bash
ls src/pages/
ls src/content/projects/
```

There should be 5 page files (`index`, `contact`, `now`, `404`, `500`)
plus `projects/[...slug].astro`, and 9 MDX files in `src/content/projects/`.

### CI fails on `Verify dist artifacts`

This step asserts that every expected file exists in `dist/` after the
build. If you see `cannot stat 'dist/projects/<slug>/index.html'`, you
either deleted an MDX file from `src/content/projects/` without removing
its hardcoded slug from the loop (the loop is filesystem-driven now, but
older PRs may still hit this), or the build didn't actually emit that
page (check the build log above the failure).
