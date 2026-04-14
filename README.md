# nothing-os-portfolio

> Developer portfolio with Nothing OS aesthetics × X (Twitter) profile UI.  
> Built with Next.js 15, Tailwind CSS, and Framer Motion.

---

![nothing-os-portfolio](https://img.shields.io/badge/theme-Nothing%20OS-000000?style=flat&labelColor=000000&color=ffffff)
![nextjs](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)
![license](https://img.shields.io/badge/license-MIT-000000?style=flat&labelColor=000000&color=ffffff)

---

## what is this

A premium developer portfolio that fuses **Nothing OS's visual identity** with **X's (Twitter) profile UI layout**. 

This isn't just a static template; it's a full-featured **Next.js 15** application designed with a brutalist aesthetic, dot-matrix textures, and high-fidelity micro-animations.

---

## features

- **X profile layout** — cover banner, avatar, bio, live stats, and tab-based navigation.
- **Nothing OS aesthetics** — custom DotGothic16 typography, monochrome palette, and dot-matrix textures.
- **Live GitHub Metrics** — real-time contribution tracking (Last Year & This Year) via dynamic API fetching.
- **Deep-Linking & Highlighting** — share specific projects with `?project=id` to auto-scroll and pulse-highlight them.
- **NDot Cover Banner** — interactive canvas-generated dot grid pattern.
- **Dark Mode** — system-aware theme adaptation with custom CSS filtering for B&W GitHub charts.
- **Modern Tech Stack** — TypeScript for safety, Tailwind for styling, and Framer Motion for buttery-smooth transitions.

---

## stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Typefaces**: DotGothic16, Space Grotesk, DM Serif Display

---

## get started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/nothing-os-portfolio
   cd nothing-os-portfolio
   ```

2. **Install dependencies:**
   ```bash
   bun install # or npm install
   ```

3. **Run development server:**
   ```bash
   bun dev # or npm run dev
   ```

---

## customise

Most of the content is centralized in `app/data/portfolio.tsx`. Simply update the `portfolio` object with your details:

```tsx
const portfolio: PortfolioData = {
  name: "Your Name",
  handle: "@yourhandle",
  bio: "your story goes here...",
  location: "Your City",
  stats: {
    projects: "30+",
    experience: "3+ Years",
    contributions: "4k+"
  },
  // ... and so on
};
```

---

## project structure

```
nothing-os-portfolio/
├── app/
│   ├── components/      ← UI components (Bio, Tabs, Panels)
│   ├── data/            ← Static content (portfolio.tsx)
│   ├── api/             ← API routes
│   └── globals.css      ← Design system & Tailwind tokens
├── public/              ← Assets & fonts
└── LICENSE              ← MIT License
```

---

## inspiration

- [Nothing OS](https://nothing.tech) — the only phone that made settings screens worth screenshotting.
- [X / Twitter](https://x.com) — solid information architecture for personal profiles.
- [Linear](https://linear.app) — monochrome + good typography is enough.

---

## license

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
MIT — code is free to use, modify, and deploy.

---

<p align="center">· · · nothing-os-portfolio · · ·</p>
