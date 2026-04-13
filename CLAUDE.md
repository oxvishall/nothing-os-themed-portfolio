@AGENTS.md

# Nothing × X Portfolio — Build Rules

> These rules govern ALL future changes to this project. Read before writing any code.

---

## 0. Project Identity

This is a **Nothing × X (Twitter) themed portfolio** built with Next.js (App Router) + TypeScript + Tailwind CSS v4.

Design fusion: Nothing OS settings screen rendered inside X's profile layout. Minimal, monochrome, slightly brutalist, typographically deliberate.

---

## 1. Typography — NON-NEGOTIABLE

Three fonts only — loaded via `next/font/google`:

| Variable | Font | Use case |
|---|---|---|
| `--font-dot` | Dot Gothic 16 | Cover banner text, clock widget, tags, "loading…" states |
| `--font-sans` | Space Grotesk (300/400/500/700) | UI labels, body, bio, tabs, stats, buttons |
| `--font-serif` | DM Serif Display (italic 0;1) | Display name (h1), project card headings |

**Never use Geist, Arial, or any other font.**

---

## 2. Color System — Monochrome Only

Use CSS custom properties from `globals.css`. No hardcoded colors.

```
Light: bg #ffffff, text #0f0f0f, secondary #6b6b6b, tertiary #a8a8a8
Dark:  bg #0a0a0a, text #f0f0f0, secondary #909090, tertiary #606060
Accent: pure black (#0f0f0f) in light / pure white (#f0f0f0) in dark
```

**No color gradients. No colored accents. Monochrome only.**  
Dark mode uses `prefers-color-scheme: dark` on `:root` + manual toggle via `.dark` class.

---

## 3. Page Layout — X Profile Shell

```
cover (canvas dot-pattern banner + avatar + actions)
  → bio (name h1, handle, bio text, meta chips, stats row)
  → profile-tabs (Projects | Experiences | Contributions | Tools)
  → tab-panels (main content)
  → sidebar (desktop only: about, dot-clock, links, theme toggle)
```

Responsive grid:
- Mobile: single column, max-width 100%
- Tablet 640px+: max-width 680px, centered
- Desktop 1024px+: two-column grid (680px content + 300px sidebar)

---

## 4. Components Structure

All components live in `app/components/`. Every interactive component MUST be a Client Component (`'use client'`).

```
app/
  components/
    CoverBanner.tsx       ← canvas dot-pattern (client)
    BioSection.tsx        ← static bio content (server)
    ProfileTabs.tsx       ← tab bar + panel switching (client)
    panels/
      ProjectsPanel.tsx   ← project card grid (client for canvas thumbs)
      ExperiencesPanel.tsx← timeline list (server)
      ContribPanel.tsx    ← contributions dot grid (client)
      ToolsPanel.tsx      ← tool badges + NDot image generator (client)
    Sidebar.tsx           ← dot clock + links + theme toggle (client)
    DotClock.tsx          ← canvas clock (client)
    NdotGenerator.tsx     ← dot-matrix image tool (client)
  globals.css
  layout.tsx
  page.tsx
```

---

## 5. Canvas-Based Features

**No external images.** All visuals are generated via `<canvas>`:

1. **Cover banner** — `drawNDotBanner()`: 4×4 dot grid SVG-less pattern
2. **Project card thumbnails** — unique dot-pattern per project (seeded random)
3. **Contributions grid** — 52-week × 7-day GitHub-style heat map
4. **Dot-matrix clock** — updates every 1000ms via `setInterval`
5. **NDot Image Generator** — upload → `dotMatrixify()` → download PNG

All canvas operations must check dark mode and re-render on `prefers-color-scheme` change.

---

## 6. Interaction Rules

- All animations ≤ 200ms. Use `transition`, not `animation` (except panel fade-in).
- Panel fade-in: `opacity 0→1 + translateY 4px→0`, 150ms ease.
- Card hover: `translateY(-2px)` + `border-color` change only.
- Custom dot cursor on desktop (`pointer: fine`). 8px dot, `position: fixed`.
- Tab underline slide: `border-bottom-color` transition 150ms.
- Respect `prefers-reduced-motion` — skip all keyframe animations.

---

## 7. Content Data

All portfolio content is stored in `app/data/portfolio.tsx` as a typed constant — **never hardcoded inline in JSX**.

```ts
// Shape
interface PortfolioData {
  name: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
  joinedYear: number;
  projects: Project[];
  experiences: Experience[];
  contributions: Contribution[];
  tools: Tool[];
  links: Link[];
}
```

When adding/editing content, edit `app/data/portfolio.tsx` only.

---

## 8. Performance Rules

- Fonts: `next/font/google` with `display: 'swap'`
- No external images — canvas only
- No CSS frameworks like Bootstrap — custom properties only
- `content-visibility: auto` on hidden tab panels
- `will-change: transform` only on `.project-card:hover`
- Meta viewport must be set in layout.tsx metadata

---

## 9. File Naming

- Components: PascalCase `.tsx`
- Data files: camelCase `.ts`
- CSS modules: `ComponentName.module.css` (only if Tailwind insufficient)
- No `.js` or `.jsx` — TypeScript always

---

## 10. Theme Toggle

Manual dark mode override stored in `localStorage` as `'dark'` or `'light'`.  
Apply `.dark` class to `<html>` element.  
Initial class set in an inline `<script>` in `layout.tsx` (before first paint) to prevent flash.

---

## 11. Stretch Goals (Implement After MVP)

1. NOS boot screen — 1-second splash on first load with `font-dot` "BOOTING…" animation
2. Now Playing widget — sidebar card with fake currently-playing track
3. Glyph cursor — SVG cursor shaped like Nothing glyph dot
4. Print stylesheet — `@media print` resume layout
5. URL routing — `?tab=projects` deep-link support via `useSearchParams`
