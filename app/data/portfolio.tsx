import { FaGithub, FaLinkedin, FaFilePdf } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import React from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  year: number;
  tags: string[];
  url: string;
  githubUrl?: string;
  seed: number; // for canvas thumbnail seeded random
}

export interface Role {
  title: string;
  dateRange: string;
  bullets: string[];
}

export interface Experience {
  company: string;
  roles: Role[];
}

export interface Contribution {
  name: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Tool {
  name: string;
  icon: string;
  category: string;
  blurb?: string;
}

export interface PortfolioData {
  name: string;
  handle: string;
  bio: string;
  location: string;
  website: string;
  joinedYear: number;
  avatarUrl: string;
  bannerUrl: string;
  projects: Project[];
  experiences: Experience[];
  contributions: Contribution[];
  tools: Tool[];
  links: {
    label: string;
    url: string;
    icon: React.ReactNode;
  }[];
  stats: {
    projects: string;
    experience: string;
    contributions: string;
  };
}

const portfolio: PortfolioData = {
  name: "Vishal Aakash",
  handle: "@oxvishall",
  bio: "Building interfaces & systems at the intersection of design and engineering. Full-stack dev who writes clean code and obsesses over the last 2% of polish.",
  location: "Chennai, India",
  website: "vishalaakash.dev",
  joinedYear: 2022,
  avatarUrl: "/pp.png",
  bannerUrl: "/bp.png",

  stats: {
    projects: "30+",
    experience: "3+ Yrs",
    contributions: "4.7k+"
  },

  projects: [
    {
      id: "xyra-perps",
      name: "Xyra Perps",
      description: "High-performance decentralized perpetuals exchange with sub-100ms latency and institutional-grade trading UI.",
      year: 2024,
      tags: ["Next.js", "Canvas API", "CSS Custom Props", "TypeScript"],
      url: "https://xyra.trade",
      githubUrl: "https://github.com/oxvishall/xyra-perps",
      seed: 42
    },
    {
      id: "mimix",
      name: "Mimix",
      description: "A waitlist management engine for early-stage startups with elegant, brutalist aesthetics.",
      year: 2024,
      tags: ["React", "Node.js", "PostgreSQL", "Tailwind"],
      url: "https://mimix.so",
      githubUrl: "https://github.com/oxvishall/mimix",
      seed: 123
    },
    {
      id: "nothing-os-ui",
      name: "Nothing OS UI",
      description: "Open-source component library replicating the Nothing OS design system for web applications.",
      year: 2023,
      tags: ["React", "CSS", "Storybook"],
      url: "https://nothing-ui.dev",
      githubUrl: "https://github.com/oxvishall/nothing-os-ui",
      seed: 789
    },
    {
      id: "perps-aggregator",
      name: "Liquidity Aggregator",
      description: "Smart contract based liquidity hub for cross-chain perpetual swaps.",
      year: 2023,
      tags: ["Solidity", "Ethers.js", "Foundry"],
      url: "https://aggregator.trade",
      githubUrl: "https://github.com/oxvishall/perps-aggregator",
      seed: 555
    }
  ],

  experiences: [
    {
      company: "Freelance",
      roles: [
        {
          title: "Full-Stack Developer",
          dateRange: "Jan 2024 – Present",
          bullets: [
            "Built and shipped 4+ production-grade web apps for DeFi protocols and startups.",
            "Architected real-time trading UIs handling WebSocket streams at sub-100ms latency."
          ]
        },
        {
          title: "Frontend Engineer",
          dateRange: "Jun 2023 – Dec 2023",
          bullets: [
            "Developed responsive dashboard interfaces for fintech clients.",
            "Optimized React performance reducing TTI by 40%."
          ]
        }
      ]
    },
    {
      company: "X-Protocol",
      roles: [
        {
          title: "Lead Systems Architect",
          dateRange: "2023 – 2024",
          bullets: [
            "Designed and implemented a high-throughput consensus engine handling 50k+ TPS.",
            "Led a team of 6 engineers to deliver the mainnet launch on schedule."
          ]
        },
        {
          title: "Senior Software Engineer",
          dateRange: "2022 – 2023",
          bullets: [
            "Refactored core state-machine logic reducing memory footprint by 60%.",
            "Implemented P2P networking layer with custom gossip protocol."
          ]
        },
        {
          title: "Core Contributor",
          dateRange: "2021 – 2022",
          bullets: [
            "Contributed to early whitepaper and initial prototype implementation.",
            "Built the first CLI tool for validator node orchestration."
          ]
        }
      ]
    },
    {
      company: "Open Source",
      roles: [
        {
          title: "Contributor",
          dateRange: "2022 – Present",
          bullets: [
            "Regular contributor to developer tooling and UI component libraries.",
            "Authored 12+ PRs merged across multiple repositories in the React ecosystem."
          ]
        }
      ]
    },
    {
      company: "Nothing Corp",
      roles: [
        {
          title: "Product Engineer",
          dateRange: "2020 – 2021",
          bullets: [
            "Crafted high-fidelity UI components following strict brutalist design guidelines.",
            "Integrated real-time hardware telemetry into the web dashboard."
          ]
        }
      ]
    }
  ],

  contributions: [
    {
      name: "React Core",
      description: "Performance optimizations for concurrent rendering.",
      tags: ["React", "Performance"],
      link: "#"
    },
    {
      name: "Tailwind CSS",
      description: "Added support for new brutalist utility classes.",
      tags: ["CSS", "Tooling"],
      link: "#"
    }
  ],

  tools: [
    { name: "TypeScript", icon: "TS", category: "Languages", blurb: "Typed across the stack" },
    { name: "JavaScript", icon: "JS", category: "Languages", blurb: "Runtime of the web" },
    { name: "Solidity", icon: "SL", category: "Languages", blurb: "Smart contracts" },
    { name: "React", icon: "RE", category: "Frontend", blurb: "Component-driven UIs" },
    { name: "Next.js", icon: "NX", category: "Frontend", blurb: "App Router & SSR" },
    { name: "Tailwind", icon: "TW", category: "Frontend", blurb: "Utility-first CSS" },
    { name: "Framer Motion", icon: "FM", category: "Frontend", blurb: "Motion & presence" },
    { name: "GSAP", icon: "GS", category: "Frontend", blurb: "Timeline animation" },
    { name: "shadcn/ui", icon: "UI", category: "Frontend", blurb: "Accessible component kit" },
    { name: "Node.js", icon: "ND", category: "Backend", blurb: "APIs & tooling" },
    { name: "PostgreSQL", icon: "PG", category: "Backend", blurb: "Relational source of truth" },
    { name: "MongoDB", icon: "MG", category: "Backend", blurb: "Document stores" },
    { name: "Ethers.js", icon: "ET", category: "Onchain", blurb: "EVM reads & writes" },
    { name: "Aptos TS SDK", icon: "AP", category: "Onchain", blurb: "@aptos-labs/ts-sdk" },
    { name: "AWS", icon: "AW", category: "Ship & Operate", blurb: "Cloud & deploys" },
    { name: "Vercel", icon: "VC", category: "Ship & Operate", blurb: "Edge & previews" },
    { name: "DigitalOcean", icon: "DO", category: "Ship & Operate", blurb: "Droplets & apps" },
    { name: "Hetzner", icon: "HZ", category: "Ship & Operate", blurb: "Bare metal & VPS" },
    { name: "Git", icon: "GT", category: "Ship & Operate", blurb: "Version control" },
    { name: "Figma", icon: "FG", category: "Shape", blurb: "Interface systems" },
    { name: "Canva", icon: "CV", category: "Shape", blurb: "Visuals & decks" },
    { name: "Gemini 3.6 Flash", icon: "G6", category: "AI Tools", blurb: "Fast multimodal drafts" },
    { name: "Gemini 3.1 Pro", icon: "G3", category: "AI Tools", blurb: "Long-context reasoning" },
    { name: "Cursor Composer 2.5", icon: "C2", category: "AI Tools", blurb: "Multi-file edits" },
    { name: "Cursor Grok 4.6", icon: "GX", category: "AI Tools", blurb: "Agent coding loop" },
    { name: "Claude Opus 5", icon: "OP", category: "AI Tools", blurb: "Deep architecture work" },
    { name: "GPT-5.6 Sol", icon: "GP", category: "AI Tools", blurb: "General problem solving" },
  ],

  links: [
    { label: "GitHub", url: "https://github.com/oxvishall", icon: <FaGithub /> },
    { label: "LinkedIn", url: "https://linkedin.com/in/vishal-aakash", icon: <FaLinkedin /> },
    { label: "X / Twitter", url: "https://x.com/oxvishall", icon: <FaXTwitter /> },
    // { label: "Resume PDF", url: "/resume.pdf", icon: <FaFilePdf /> }
  ]
};

export default portfolio;
