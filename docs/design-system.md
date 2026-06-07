# Design system

This document is the human-readable reference for the visual system.
The single source of truth in code is **`src/styles/tokens.css`** —
Tailwind utilities (`bg-bg`, `text-fg`, etc.) and component CSS read those
custom properties via `tailwind.config.mjs`.

## Palette

Monochrome neutrals + a single blue accent. Light is the default; `.dark`
on `<html>` swaps to the dark variant.

| Token               | Light     | Dark      | Use                           |
| ------------------- | --------- | --------- | ----------------------------- |
| `--color-bg`        | `#FAFAFA` | `#09090B` | Page background               |
| `--color-fg`        | `#09090B` | `#FAFAFA` | Primary text                  |
| `--color-muted`     | `#52525B` | `#A1A1AA` | Secondary text, captions      |
| `--color-subtle`    | `#E4E4E7` | `#27272A` | Soft fills (chip bg, code bg) |
| `--color-card`      | `#FFFFFF` | `#18181B` | Card surfaces, code blocks    |
| `--color-border`    | `#E4E4E7` | `#27272A` | Hairline borders              |
| `--color-accent`    | `#2563EB` | `#2563EB` | CTAs, links, focus rings      |
| `--color-accent-fg` | `#FFFFFF` | `#FFFFFF` | Text/icons on accent          |
| `--color-ring`      | `#2563EB` | `#2563EB` | `:focus-visible` outline      |

Contrast: every text/background pair clears WCAG AA 4.5:1 in both themes.
The `text-muted` on `bg-bg` pair sits at 4.61:1 light / 4.75:1 dark.

## Typography

Geist Sans + Geist Mono via `@fontsource-variable/geist` (variable, latin
subset, self-hosted by Vite). One family for sans, one for mono — keeps
the bundle small and the type voice tight.

| Token         | Stack                                    |
| ------------- | ---------------------------------------- |
| `--font-sans` | `"Geist Variable", system-ui, …`         |
| `--font-mono` | `"Geist Mono Variable", ui-monospace, …` |

Type scale (rem):

| Token       | Size       | Use                  |
| ----------- | ---------- | -------------------- |
| `--fs-xs`   | `0.75rem`  | Eyebrow, footnote    |
| `--fs-sm`   | `0.875rem` | Captions, small body |
| `--fs-base` | `1rem`     | Body                 |
| `--fs-lg`   | `1.125rem` | Lead paragraph       |
| `--fs-xl`   | `1.25rem`  | Section subhead      |
| `--fs-2xl`  | `1.5rem`   | h3                   |
| `--fs-3xl`  | `1.875rem` | h2                   |
| `--fs-4xl`  | `2.25rem`  | Page h1 (mobile)     |
| `--fs-5xl`  | `3rem`     | Hero h1 (desktop)    |

Line-height: 1.6 for body, 1.1–1.2 for h1/h2.
Line-length: max-width `prose` (~65ch) on body copy.

## Spacing

Eight-step scale, `0.25rem` (4 px) base unit.
Tokens: `--space-1` … `--space-24`. Use Tailwind's `p-*`, `gap-*`, etc.;
they pull from the same scale.

## Radii & shadows

| Token         | Value     | Use                      |
| ------------- | --------- | ------------------------ |
| `--radius-sm` | `0.25rem` | Small chips, code        |
| `--radius-md` | `0.5rem`  | Buttons, inputs          |
| `--radius-lg` | `0.75rem` | Cards                    |
| `--radius-xl` | `1rem`    | Hero illustration frames |
| `--shadow-sm` | tiny lift | Hover state on subtle UI |
| `--shadow-md` | card lift | `ProjectCard` hover      |

## Motion

Three durations + one easing. Set to `0ms` automatically when the user has
`prefers-reduced-motion: reduce` (handled in `tokens.css`).

| Token           | Value                           | Use                                 |
| --------------- | ------------------------------- | ----------------------------------- |
| `--motion-fast` | `150ms`                         | Hover states, tooltips, focus rings |
| `--motion-base` | `250ms`                         | Card transitions, button presses    |
| `--motion-slow` | `400ms`                         | Page-level reveals, image scale     |
| `--ease-out`    | `cubic-bezier(0.16, 1, 0.3, 1)` | Default ease for everything         |

Reveal-on-scroll uses the `[data-reveal]` selector + `<ScrollReveal />`
singleton (`src/components/ScrollReveal.astro`). It opacity+translateY-
fades elements once they intersect the viewport. `prefers-reduced-motion`
disables the JS branch entirely; the CSS rule already shows revealed
elements in their final state.

## Component states

Every async-rendering surface (lists, fetches, async images) defines four
states. Implementations live in components like `ProjectGrid.astro`.

1. **Loading** — skeleton, never blank. (Not used in v1 — site is static.)
2. **Empty** — friendly message + one CTA. Example: `ProjectGrid` empty
   state points at `/contact` while projects are still being built.
3. **Error** — what / why / what to do. (Not used in v1 — Astro fails the
   build on collection errors.)
4. **Success** — the actual content.

## Tooltip pattern

Every icon-only button has both a visual tooltip and a screen-reader label.

- Add `class="tooltip-host"` and `data-tooltip="…"` to the element.
- Add `aria-label="…"` (the source of truth for screen readers).
- The CSS rule in `base.css` handles hover + `:focus-visible`.

## Image discipline

- Every `<img>` has explicit `width` + `height` (CLS guard).
- Below-the-fold images use `loading="lazy"` and `decoding="async"`.
- Decorative images use `alt=""`; meaningful images get descriptive alt.
- Project screenshots normalise on a 1600×900 (16:9) aspect ratio.

## Accent usage rules

The blue `--color-accent` is the only chromatic colour in the palette.
Use it sparingly:

- Primary CTAs (filled accent button)
- Inline links inside body copy
- Active nav state / `:focus-visible` ring
- The dot in the `chapkanov.dev` wordmark
- StatusBadge "draft"/"private" do **not** use accent — they use neutrals.
- StatusBadge "learning-notes" uses an amber tint to differentiate from
  the production-ready cards.

## Where things live

```
src/
  styles/
    tokens.css       — design tokens (single source of truth)
    base.css         — global reset + utility classes (.tooltip-host, .container-page, [data-reveal])
  components/
    Hero, Bio, ProjectGrid, ProjectCard, SkillBadge, StatusBadge, Prose,
    Header, Footer, ThemeToggle, IconLink, MailtoLink, Reveal, ScrollReveal, Seo
  layouts/
    Base.astro       — <html>, FOUC-free theme script, view transitions, header, footer
    Project.astro    — project-detail page wrapper
  lib/
    theme.ts         — shared theme storage helpers (consumed by ThemeToggle)
docs/
  design-system.md   — this file
```

When adding a new component, follow these rules:

1. Reach for tokens, not literals (`bg-card`, not `bg-white`).
2. If you need a new colour or a new size, add it to `tokens.css` first.
3. Document the four async states in a JSDoc comment at the top of the
   component file (even if some are n/a — say so).
4. If the component is icon-only, add the tooltip pattern.
5. If it animates on scroll, wrap it in `<Reveal>`.
