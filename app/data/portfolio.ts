export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  year: number;
  url?: string;
  seed: number; // for canvas thumbnail seeded random
}

export interface Experience {
  company: string;
  role: string;
  dateRange: string;
  bullets: string[];
}

export interface Contribution {
  name: string;
  description: string;
  url?: string;
}

export interface Tool {
  name: string;
  icon: string;
  category: string;
}

export interface Link {
  label: string;
  url: string;
  icon: string;
}

export interface PortfolioData {
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

const portfolio: PortfolioData = {
  name: "Vishal Aakash",
  handle: "@oxvishall",
  bio: "Building interfaces & systems at the intersection of design and engineering. Full-stack dev who writes clean code and obsesses over the last 2% of polish.",
  location: "Chennai, India",
  website: "vishalaakash.dev",
  joinedYear: 2021,

  projects: [
    {
      id: "xyra",
      name: "Xyra Perps",
      description: "High-performance perpetuals DEX with Upbit-style trading UI and real-time order books.",
      tags: ["Next.js", "TypeScript", "WebSocket", "DeFi"],
      year: 2025,
      url: "#",
      seed: 42,
    },
    {
      id: "polymarket",
      name: "Polymarket Clone",
      description: "High-fidelity prediction market platform with live Gamma API integration and portfolio tracking.",
      tags: ["React", "REST API", "Recharts", "Tailwind"],
      year: 2025,
      url: "#",
      seed: 137,
    },
    {
      id: "mimix",
      name: "Mimix Waitlist",
      description: "Viral waitlist application deployed on DigitalOcean with referral mechanics and real-time counters.",
      tags: ["Next.js", "PostgreSQL", "DigitalOcean", "Bun"],
      year: 2024,
      url: "#",
      seed: 23,
    },
    {
      id: "portfolio",
      name: "Nothing × X Portfolio",
      description: "This very portfolio — a Nothing OS aesthetic fused with X's profile shell. Zero external images.",
      tags: ["Next.js", "Canvas API", "CSS Custom Props", "TypeScript"],
      year: 2026,
      url: "#",
      seed: 91,
    },
  ],

  experiences: [
    {
      company: "Freelance / Indie",
      role: "Full-Stack Developer",
      dateRange: "Jan 2024 – Present",
      bullets: [
        "Built and shipped 4+ production-grade web apps for DeFi protocols and startups.",
        "Architected real-time trading UIs handling WebSocket streams at sub-100ms latency.",
        "Designed end-to-end systems from Figma mockup to deployed container on DigitalOcean.",
      ],
    },
    {
      company: "Open Source",
      role: "Contributor",
      dateRange: "2022 – Present",
      bullets: [
        "Regular contributor to developer tooling and UI component libraries.",
        "Authored 12+ PRs merged across multiple repositories in the React ecosystem.",
        "Maintained personal forks of perps protocol adapters and API proxy utilities.",
      ],
    },
    {
      company: "Self-Directed Learning",
      role: "Engineer / Student",
      dateRange: "2021 – 2023",
      bullets: [
        "Taught myself TypeScript, Next.js, and systems design through building real projects.",
        "Studied distributed systems, consensus algorithms, and smart contract architecture.",
        "Built a WebSocket-based live price aggregator as a learning capstone project.",
      ],
    },
  ],

  contributions: [
    { name: "next-font-optimizer", description: "PR: Added Dot Gothic 16 subset support", url: "#" },
    { name: "react-canvas-hooks", description: "Issue: Fixed ResizeObserver memory leak", url: "#" },
    { name: "tailwind-v4-compat", description: "PR: @theme inline variable docs fix", url: "#" },
    { name: "perps-sdk", description: "PR: Added Aptos withdrawal address validation", url: "#" },
    { name: "polymarket-api-ts", description: "PR: Typed Gamma API response schemas", url: "#" },
    { name: "ws-price-feed", description: "PR: Reconnect exponential backoff", url: "#" },
    { name: "nothing-ui-css", description: "Repo: CSS variables matching Nothing OS design tokens", url: "#" },
    { name: "bun-deploy-scripts", description: "PR: DigitalOcean App Platform build fix", url: "#" },
    { name: "wagmi-aptos-connector", description: "PR: Multi-wallet Aptos support", url: "#" },
    { name: "recharts-candlestick", description: "PR: OHLCV charting component", url: "#" },
    { name: "canvas-dot-matrix", description: "Lib: Dot-matrix image filter library", url: "#" },
    { name: "next-ws-proxy", description: "Plugin: Next.js WebSocket dev proxy", url: "#" },
  ],

  tools: [
    { name: "TypeScript", icon: "⬡", category: "Language" },
    { name: "Next.js", icon: "▲", category: "Framework" },
    { name: "React", icon: "⚛", category: "Framework" },
    { name: "Node.js", icon: "⬢", category: "Runtime" },
    { name: "Bun", icon: "🍞", category: "Runtime" },
    { name: "PostgreSQL", icon: "🐘", category: "Database" },
    { name: "Prisma", icon: "◈", category: "ORM" },
    { name: "WebSockets", icon: "⚡", category: "Protocol" },
    { name: "Canvas API", icon: "◻", category: "Browser API" },
    { name: "Tailwind CSS", icon: "◎", category: "Styling" },
    { name: "Figma", icon: "○", category: "Design" },
    { name: "Docker", icon: "🐳", category: "DevOps" },
    { name: "DigitalOcean", icon: "◉", category: "Cloud" },
    { name: "Git", icon: "⎇", category: "VCS" },
    { name: "Vercel", icon: "△", category: "Cloud" },
    { name: "REST / GraphQL", icon: "≋", category: "API" },
  ],

  links: [
    { label: "GitHub", url: "https://github.com/oxvishall", icon: "⌥" },
    { label: "LinkedIn", url: "https://linkedin.com/in/vishalaakash", icon: "in" },
    { label: "Resume PDF", url: "#resume", icon: "↓" },
    { label: "X / Twitter", url: "https://x.com/oxvishall", icon: "✕" },
  ],
};

export default portfolio;
