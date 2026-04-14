# nothing-os-portfolio

> Developer portfolio with Nothing OS aesthetics × X (Twitter) profile UI.  
> NDot fonts, dot-matrix generator, dark mode.

---

![nothing-os-portfolio](https://img.shields.io/badge/theme-Nothing%20OS-000000?style=flat&labelColor=000000&color=ffffff)
![license](https://img.shields.io/badge/license-MIT-000000?style=flat&labelColor=000000&color=ffffff)
![zero deps](https://img.shields.io/badge/dependencies-zero-000000?style=flat&labelColor=000000&color=ffffff)

---

## what is this

A single-file developer portfolio that fuses **Nothing OS's visual identity** with **X's (Twitter) profile UI layout**.

The profile structure, tabs, and stats row are borrowed from X. The typography, dot-matrix patterns, and monochrome aesthetic are borrowed from Nothing OS. The content is yours.

No frameworks. No build step. One `index.html`.

---

## preview

```
┌─────────────────────────────────────────────┐
│  · · · · · · · · · · · · · · · · · · · · ·  │  ← NDot dot-matrix cover banner
│                                             │
│  ◉  Your Name                [Following]   │
│     @handle                                 │
│     building things · Chennai · 2021        │
│                                             │
│  4 Projects  3 Experiences  12 Contributions│
├─────────────────────────────────────────────┤
│  Projects  Experiences  Contributions  Tools│
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐         │
│  │ · · · · · ·  │  │ · · · · · ·  │         │
│  │ Project One  │  │ Project Two  │         │
│  │ desc · 2024  │  │ desc · 2025  │         │
│  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```

---

## features

- **X profile layout** — cover banner, avatar, bio, stats row, tab navigation
- **Nothing OS typography** — NDot55 dot-matrix font, NType-style mono, clean sans
- **NDot cover banner** — canvas-generated dot grid pattern, no image files
- **NDot image generator** — upload any image, convert to Nothing's dot-matrix aesthetic in-browser, download PNG
- **Dot-matrix clock** — live sidebar clock rendered in NDot font
- **Four tabs** — Projects, Experiences, Contributions, Tools
- **Sidebar** — about card, links, clock widget, theme toggle
- **Dark mode** — system-aware via `prefers-color-scheme`, no flash on load
- **Fully responsive** — 320px phones to ultrawide monitors
- **Zero build tooling** — open `index.html` and it works

---

## themes

| Theme | Status |
|---|---|
| Nothing OS × X | ✅ live |
| iPhone × X | 🔜 in progress |
| CMF × X | 💭 planned |

Each theme is a CSS variable override file. The HTML structure never changes between themes.

---

## fonts

Nothing's typeface suite was designed by [Colophon Foundry](https://colophon-foundry.org/) exclusively for Nothing Technology Ltd, drawing from IBM's 1980s mainframe era aesthetic.

This project uses:

| Font | Source | Used for |
|---|---|---|
| NDot-55 | [Nothing Glyph Developer Kit](https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit) | dot-matrix clock, cover banner, NDot generator label |
| Space Mono | Google Fonts | display name, section headings (NType stand-in) |
| Space Grotesk | Google Fonts | bio, tabs, body, descriptions |

> **Note:** NDot is proprietary to Nothing Technology Ltd. This project uses it for personal/portfolio purposes under their developer programme terms. Do not redistribute the font files.

---

## get started

```bash
git clone https://github.com/yourusername/nothing-os-portfolio
cd nothing-os-portfolio
open index.html
```

No install. No build. Just open the file.

**Deploy in 30 seconds:** drag `index.html` into [Netlify Drop](https://app.netlify.com/drop), or push to GitHub and enable Pages.

---

## customise

At the top of the `<script>` block in `index.html`, fill in your details:

```js
const ME = {
  name:        "Your Name",
  handle:      "@yourhandle",
  bio:         "what you build · what you care about · one unusual fact",
  location:    "Chennai",
  url:         "https://yoursite.com",
  joinedYear:  "2021",

  projects: [
    {
      title: "Project Name",
      desc:  "One line description.",
      tags:  ["React", "TypeScript"],
      year:  "2024",
      url:   "https://github.com/..."
    }
  ],

  experiences: [
    {
      company: "Company Name",
      role:    "Role Title",
      period:  "Jan 2023 – Present",
      bullets: ["did x", "built y", "shipped z"]
    }
  ],

  contributions: [
    { title: "repo or article", url: "https://..." }
  ]
}
```

---

## adding a theme

Each theme lives in `themes/` as a single CSS file overriding the root tokens:

```css
/* themes/iphone-x.css */
:root {
  --font-dot:    'SF Mono', monospace;
  --font-mono:   '-apple-system', 'SF Pro Display', sans-serif;
  --font-sans:   '-apple-system', sans-serif;
  --cover-style: 'blur';
  --radius-card: 16px;
}
```

Swap themes by changing one line in `<head>`:

```html
<link rel="stylesheet" href="themes/nothing-x.css">
```

---

## project structure

```
nothing-os-portfolio/
├── index.html          ← everything lives here
├── themes/
│   ├── nothing-x.css   ← Nothing OS × X (default)
│   └── iphone-x.css    ← iPhone × X (coming soon)
├── fonts/
│   └── NDot-55.ttf     ← self-hosted, see font note above
└── README.md
```

---

## roadmap

- [x] Nothing OS × X base layout
- [x] NDot cover banner (canvas generated)
- [x] Tab navigation — Projects, Experiences, Contributions, Tools
- [x] Dot-matrix sidebar clock
- [x] Dark mode
- [ ] NDot image generator (upload → dot-matrix conversion + download)
- [ ] iPhone × X theme
- [ ] NOS boot screen — 1s splash on first load, fades to profile
- [ ] Now Playing sidebar widget
- [ ] `?theme=iphone` URL param for instant theme switching
- [ ] Print stylesheet → clean résumé layout from same data
- [ ] CMF × X theme

---

## inspiration

- [Nothing OS](https://nothing.tech) — the only phone that made settings screens worth screenshotting
- [X / Twitter](https://x.com) — solid information architecture in a profile layout
- [Linear](https://linear.app) — monochrome + good typography is enough

---

## license

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
MIT — code is free to use, modify, and deploy.  
NDot font © Nothing Technology Ltd — do not redistribute the font files.

---

<p align="center">· · · nothing-os-portfolio · · ·</p>
