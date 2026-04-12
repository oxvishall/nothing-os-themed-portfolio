# Nothing × X Portfolio — Full Build Prompt
> Feed this to your Antigravity agent as a single prompt. Sections are ordered by build priority.

---

## 0. Project Identity

Build a single-page portfolio that fuses **Nothing's visual identity** with **X (Twitter)'s profile UI pattern**. The result should feel like a Nothing OS settings screen rendered inside X's profile layout — minimal, monochrome, slightly brutalist, typographically deliberate.

**Core design principles:**
- Monochrome-first. White background, near-black text, dot-matrix accents. No color gradients.
- Every piece of text uses one of three Nothing fonts (see §1).
- Layout borrows X's profile shell: cover photo zone → avatar + actions → bio → pinned stats → tab bar → feed grid.
- The app is a static HTML/CSS/JS single file. Zero build tooling. No bundlers. No frameworks unless Preact or Alpine.js (CDN-loaded, < 4 KB gzip).
- Must be under **80 KB total** (HTML + inline CSS + inline JS). Images are external URLs or generated on-canvas.
- Fully responsive: works on 320 px wide phones and 2560 px ultrawide monitors.

---

## 1. Typography System

### Fonts to load (Google Fonts CDN)

```html
<!-- Nothing Dot Matrix (dotted / display) -->
<link href="https://fonts.googleapis.com/css2?family=Dot+Gothic+16&display=swap" rel="stylesheet">

<!-- Nothing's body/UI font equivalent: Space Grotesk (closest public match to Nothing Sans) -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- Nothing's serif / editorial headlines: DM Serif Display -->
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
```

### CSS tokens

```css
:root {
  --font-dot:    'Dot Gothic 16', monospace;        /* dotted display, NDot16 stand-in */
  --font-sans:   'Space Grotesk', sans-serif;        /* UI labels, body, tabs */
  --font-serif:  'DM Serif Display', Georgia, serif; /* big name, section titles */

  --text-primary:   #0f0f0f;
  --text-secondary: #6b6b6b;
  --text-tertiary:  #a8a8a8;
  --bg-page:        #ffffff;
  --bg-surface:     #f5f5f5;
  --bg-elevated:    #ebebeb;
  --border:         rgba(0,0,0,0.10);
  --border-strong:  rgba(0,0,0,0.20);
  --accent:         #0f0f0f;          /* the only "color" — pure black CTAs */

  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  18px;
  --radius-pill: 9999px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary:   #f0f0f0;
    --text-secondary: #909090;
    --text-tertiary:  #606060;
    --bg-page:        #0a0a0a;
    --bg-surface:     #141414;
    --bg-elevated:    #1e1e1e;
    --border:         rgba(255,255,255,0.08);
    --border-strong:  rgba(255,255,255,0.15);
    --accent:         #f0f0f0;
  }
}
```

### Usage rules
- `var(--font-dot)` — cover banner text, dot-matrix generator label, clock widget, "loading…" states only.
- `var(--font-serif)` — your display name (h1), section headings inside project cards.
- `var(--font-sans)` — everything else (bio, tabs, stats, tags, captions, buttons).

---

## 2. Page Layout Shell

### HTML skeleton

```
┌──────────────────────────────────────────────────────┐
│  <header class="cover">                              │  ← dot-pattern SVG banner
│    <div class="avatar-ring">…</div>                  │
│    <div class="header-actions">…</div>               │
│  </header>                                           │
│                                                      │
│  <section class="bio">                               │  ← name, handle, summary
│    <h1 class="display-name">…</h1>                   │
│    <p class="handle">@…</p>                          │
│    <p class="bio-text">…</p>                         │
│    <div class="stats-row">…</div>                    │
│  </section>                                          │
│                                                      │
│  <nav class="profile-tabs">                          │  ← Projects / Experiences /
│    <button …>Projects</button>                       │     Contributions / Tools
│    <button …>Experiences</button>                    │
│    <button …>Contributions</button>                  │
│    <button …>Tools</button>                          │
│  </nav>                                              │
│                                                      │
│  <main class="tab-panels">                           │
│    <div id="panel-projects"   …>…</div>              │
│    <div id="panel-experiences" …>…</div>             │
│    <div id="panel-contributions" …>…</div>           │
│    <div id="panel-tools"      …>…</div>              │
│  </main>                                             │
│                                                      │
│  <aside class="sidebar">                             │  ← right sidebar (desktop only)
│    …                                                 │
│  </aside>                                            │
└──────────────────────────────────────────────────────┘
```

### Responsive breakpoints

```css
/* Mobile-first base: single column */
.layout { display: grid; grid-template-columns: 1fr; }

/* Tablet 640px+: wider content, sidebar appears */
@media (min-width: 640px) {
  .layout { max-width: 680px; margin: 0 auto; }
}

/* Desktop 1024px+: sidebar docks right */
@media (min-width: 1024px) {
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 680px) 300px;
    gap: 24px;
    max-width: 1024px;
    margin: 0 auto;
  }
  .sidebar { display: block; }
}
```

---

## 3. Cover Banner — NDot Pattern

Generate the dotted cover using an inline `<canvas>` that draws a 4×4 dot grid:

```js
function drawNDotBanner(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  ctx.fillStyle = dark ? '#141414' : '#f5f5f5';
  ctx.fillRect(0, 0, W, H);
  const DOT = 3, GAP = 8, COLOR = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
  ctx.fillStyle = COLOR;
  for (let x = GAP; x < W; x += GAP + DOT) {
    for (let y = GAP; y < H; y += GAP + DOT) {
      ctx.beginPath();
      ctx.arc(x, y, DOT / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Optional: write name in dot font
  ctx.font = `bold 22px 'Dot Gothic 16', monospace`;
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  ctx.fillText('NOTHING × YOU', 24, H - 16);
}
```

Call on `DOMContentLoaded` and on `matchMedia` change for dark mode.

---

## 4. Bio Section

```html
<section class="bio">
  <h1 class="display-name" style="font-family: var(--font-serif); font-size: clamp(22px, 5vw, 32px);">
    Your Name
  </h1>
  <p class="handle" style="font-family: var(--font-sans); color: var(--text-secondary); font-size: 14px;">
    @yourhandle
  </p>
  <p class="bio-text" style="font-family: var(--font-sans); font-size: 15px; line-height: 1.6; max-width: 520px; margin-top: 10px;">
    [2–3 sentence summary. What you build, what you care about, what makes you different.
     Keep it under 200 characters — X bio discipline applies here too.]
  </p>
  <ul class="meta-chips">
    <li>📍 Chennai</li>
    <li>🔗 <a href="…">yoursite.com</a></li>
    <li>Joined 2021</li>
  </ul>
  <div class="stats-row">
    <span><strong>4</strong> Projects</span>
    <span><strong>3</strong> Experiences</span>
    <span><strong>12</strong> Contributions</span>
  </div>
</section>
```

---

## 5. Tab Bar

```html
<nav class="profile-tabs" role="tablist">
  <button role="tab" aria-selected="true"  data-panel="projects">Projects</button>
  <button role="tab" aria-selected="false" data-panel="experiences">Experiences</button>
  <button role="tab" aria-selected="false" data-panel="contributions">Contributions</button>
  <button role="tab" aria-selected="false" data-panel="tools">Tools</button>
</nav>
```

```css
.profile-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.profile-tabs button {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 14px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.profile-tabs button[aria-selected="true"] {
  color: var(--text-primary);
  border-bottom-color: var(--text-primary);
}
```

```js
document.querySelectorAll('.profile-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.profile-tabs button').forEach(b => b.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    btn.setAttribute('aria-selected', 'true');
    document.getElementById('panel-' + btn.dataset.panel).hidden = false;
  });
});
```

---

## 6. Tab Panels

### 6a. Projects Panel

Grid of cards. Each card:
- Dotted canvas thumbnail (generated, not a real image)
- Project name in `var(--font-serif)`
- 1-line description in `var(--font-sans)`
- Tag chips (tech stack)
- Year + external link

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 20px 0;
}
.project-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface);
  transition: border-color 0.15s, transform 0.15s;
}
.project-card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
.project-card .thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--bg-elevated);
  display: block;
}
.project-card .body { padding: 16px; }
.project-card h2 {
  font-family: var(--font-serif);
  font-size: 18px;
  margin: 0 0 6px;
}
.project-card p {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 12px;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--font-dot);
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}
```

### 6b. Experiences Panel

Timeline-style list. Each item:
- Company name (`--font-serif`, bold)
- Role + dates (`--font-sans`)
- 2–3 bullet points
- Left border accent (1px solid `var(--border-strong)`)

### 6c. Contributions Panel

GitHub-style dot grid showing open source or personal project activity:

```js
// Generate a 52-week × 7-day contribution grid
// Fill each cell with opacity based on a seeded random (or real data)
function drawContribGrid(canvas, data) {
  const ctx = canvas.getContext('2d');
  const CELL = 10, GAP = 2;
  data.forEach((week, wi) => {
    week.forEach((count, di) => {
      const opacity = count === 0 ? 0.06 : Math.min(0.12 + count * 0.22, 1);
      ctx.fillStyle = `rgba(15,15,15,${opacity})`;
      ctx.roundRect((CELL + GAP) * wi, (CELL + GAP) * di, CELL, CELL, 2);
      ctx.fill();
    });
  });
}
```

### 6d. Tools Panel

Grid of tool/skill badges using `--font-dot`. Each badge: icon (emoji or inline SVG) + tool name. Rendered as a masonry-style flex-wrap.

---

## 7. Sidebar (Desktop Only)

```html
<aside class="sidebar">
  <!-- About card -->
  <div class="sidebar-card">
    <h3 class="sidebar-heading">About</h3>
    <p>…one paragraph…</p>
  </div>

  <!-- Dot-matrix clock -->
  <div class="sidebar-card">
    <canvas id="dot-clock" width="260" height="60"></canvas>
  </div>

  <!-- Links -->
  <div class="sidebar-card">
    <h3 class="sidebar-heading">Links</h3>
    <ul class="link-list">
      <li><a href="…">GitHub</a></li>
      <li><a href="…">LinkedIn</a></li>
      <li><a href="…">Resume PDF</a></li>
    </ul>
  </div>

  <!-- Theme toggle -->
  <button id="theme-toggle" class="sidebar-card theme-btn">
    <span class="dot-label">· THEME ·</span>
    <span id="theme-icon">◐</span>
  </button>
</aside>
```

#### Dot-matrix clock

```js
function drawDotClock(canvas) {
  const ctx = canvas.getContext('2d');
  const now = new Date();
  const timeStr = now.toTimeString().slice(0, 8); // HH:MM:SS
  const dark = document.documentElement.classList.contains('dark');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold 40px 'Dot Gothic 16', monospace`;
  ctx.fillStyle = dark ? '#f0f0f0' : '#0f0f0f';
  ctx.fillText(timeStr, 8, 46);
}
setInterval(() => drawDotClock(document.getElementById('dot-clock')), 1000);
```

---

## 8. NDot Image Generator (Tools Panel — Star Feature)

This is the interactive tool that provides real value. Build it as a self-contained widget inside the Tools tab.

### What it does
User uploads any image → the app renders it as a Nothing-style dot-matrix version on a `<canvas>`.

### Implementation

```js
// Step 1: Draw source image to offscreen canvas, sample pixel grid
// Step 2: For each sampled pixel, draw a circle whose size = luminance
// Step 3: Color mode toggle: monochrome dots OR preserve original color

function dotMatrixify(sourceCanvas, outputCanvas, { dotSize = 6, gap = 2, mono = true }) {
  const src = sourceCanvas.getContext('2d');
  const out = outputCanvas.getContext('2d');
  const W = outputCanvas.width, H = outputCanvas.height;
  const step = dotSize + gap;

  out.clearRect(0, 0, W, H);
  const dark = document.documentElement.classList.contains('dark');
  out.fillStyle = dark ? '#0a0a0a' : '#ffffff';
  out.fillRect(0, 0, W, H);

  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < H; y += step) {
      const px = src.getImageData(
        Math.floor(x * sourceCanvas.width / W),
        Math.floor(y * sourceCanvas.height / H),
        1, 1
      ).data;
      const [r, g, b, a] = px;
      if (a < 20) continue;
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const radius = (dotSize / 2) * (1 - lum * 0.8);
      if (radius < 0.5) continue;
      out.beginPath();
      out.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
      out.fillStyle = mono
        ? (dark ? `rgba(240,240,240,${0.3 + lum * 0.7})` : `rgba(15,15,15,${0.3 + (1 - lum) * 0.7})`)
        : `rgba(${r},${g},${b},${a / 255})`;
      out.fill();
    }
  }
}
```

### UI Controls
- **Upload button** (styled as a dashed dotted border drop zone — Nothing aesthetic)
- **Dot size slider** (4px – 16px)
- **Gap slider** (1px – 8px)
- **Mono / Color toggle** (pill switch)
- **Download PNG button** — `canvas.toBlob(…)` → anchor click

---

## 9. Interactions & Micro-animations

Keep all animations under 200 ms. Use `transition` not `animation` wherever possible.

```css
/* Tab underline slide */
.profile-tabs button { transition: color 0.15s, border-color 0.15s; }

/* Card lift */
.project-card { transition: border-color 0.15s, transform 0.15s; }
.project-card:hover { transform: translateY(-2px); }

/* Panel fade-in */
.tab-panel { animation: fadeIn 0.15s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

/* Dot cursor (optional, desktop only) */
@media (pointer: fine) {
  body { cursor: none; }
  #cursor {
    position: fixed; width: 8px; height: 8px;
    background: var(--text-primary); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transition: transform 0.1s;
  }
}
```

---

## 10. Performance Checklist

- [ ] All fonts loaded with `display=swap`
- [ ] No external images (generate thumbnails with canvas)
- [ ] No CSS frameworks (Tailwind, Bootstrap) — pure CSS custom properties
- [ ] JS total < 8 KB minified
- [ ] `will-change: transform` only on `.project-card` hover
- [ ] `content-visibility: auto` on `.tab-panel[hidden]`
- [ ] Meta viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] `prefers-reduced-motion` respected for all keyframe animations

---

## 11. File Structure

```
index.html          ← everything in one file
                       <style> block (CSS variables + layout)
                       <body> (HTML structure per §2–7)
                       <script> block (tab switching, canvas draws, dotMatrixify)
```

No build step. No package.json. Just `index.html`.

---

## 12. Content Slots (Fill These In)

| Slot | What to put |
|---|---|
| Display name | Your full name |
| Handle | @yourhandle |
| Bio | ≤ 200 chars. Role + what you make + one unusual fact |
| Projects (×4) | Name, 1-line desc, tech tags, year, URL |
| Experiences (×3) | Company, role, dates, 2–3 bullet points |
| Contributions (×12) | Open-source project or article links |
| Links | GitHub, LinkedIn, Resume |
| Location | City |

---

## 13. Stretch Goals (Post-MVP)

1. **NOS boot screen** — on first load, show a 1-second splash with `font-dot` "BOOTING…" dot animation, then fade into the profile.
2. **Now Playing widget** — sidebar card that shows a fake (or real via Last.fm API) currently-playing track in NDot style.
3. **Glyph cursor** — custom SVG cursor shaped like Nothing's glyph interface dot.
4. **Print stylesheet** — `@media print` that renders a clean resume layout from the same data.
5. **URL routing** — `?tab=projects` deep links to a specific tab on load.

---

*End of prompt. Feed sections 0–12 to your agent for the MVP build. Add §13 stretch goals in a second pass.*
