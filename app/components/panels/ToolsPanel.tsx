'use client';

import type { ReactNode } from 'react';
import { FaAws } from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiSolidity,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiGreensock,
  SiShadcnui,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiEthereum,
  SiVercel,
  SiDigitalocean,
  SiHetzner,
  SiGit,
  SiFigma,
  SiCanva,
  SiGooglegemini,
  SiClaude,
  SiOpenai,
} from 'react-icons/si';
import type { Tool } from '@/app/data/portfolio';

function CursorLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  );
}

function AptosLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 479.3 481.2" fill="currentColor" aria-hidden>
      <path d="M371.2 161h-42.4c-4.9 0-9.6-2.1-12.9-5.8l-17.2-19.4c-2.6-2.9-6.2-4.6-10.1-4.6s-7.5 1.7-10.1 4.6l-14.8 16.7c-4.8 5.4-11.8 8.6-19 8.6H12.6C6 179.8 1.7 199.7 0 220.4h219.1c3.9 0 7.5-1.6 10.2-4.4l20.4-21.3c2.5-2.7 6.1-4.2 9.7-4.2h.8c3.9 0 7.5 1.7 10.1 4.6l17.2 19.4c3.3 3.7 8 5.8 12.9 5.8h178.8c-1.7-20.6-6-40.6-12.6-59.4z" />
      <path d="M132.6 345.2c3.9 0 7.5-1.6 10.2-4.4l20.4-21.3c2.6-2.7 6.1-4.2 9.8-4.2h.8c3.9 0 7.6 1.7 10.1 4.5l17.2 19.4c3.3 3.7 8 5.8 12.9 5.8h242.4c9.1-18.8 15.7-38.9 19.7-60H243.4c-4.9 0-9.6-2.1-12.9-5.8L213.3 260c-2.6-2.9-6.2-4.5-10.1-4.5s-7.6 1.7-10.1 4.5l-14.8 16.7c-4.8 5.5-11.8 8.6-19.1 8.6H3.3c4 21.1 10.6 41.2 19.7 60z" />
      <path d="M304.5 96.1c3.9 0 7.5-1.6 10.2-4.4l20.4-21.3c2.5-2.7 6.1-4.2 9.8-4.2h.8c3.9 0 7.5 1.7 10.1 4.6L373 90.3c3.3 3.7 8 5.8 12.9 5.8H432C388.1 37.7 318.3 0 239.7 0S91.2 37.7 47.3 96.1z" />
      <path d="M212 404.7h-63c-4.9 0-9.6-2.1-12.9-5.8l-17.2-19.4c-2.6-2.9-6.2-4.5-10.1-4.5s-7.6 1.7-10.1 4.5l-14.8 16.7c-4.8 5.5-11.8 8.6-19.1 8.6h-1c43.9 47 106.4 76.5 175.9 76.5s131.9-29.5 175.9-76.5z" />
    </svg>
  );
}

interface ToolsPanelProps {
  tools: Tool[];
}

const ICONS: Record<string, ReactNode> = {
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  Solidity: <SiSolidity />,
  React: <SiReact />,
  'Next.js': <SiNextdotjs />,
  Tailwind: <SiTailwindcss />,
  'Framer Motion': <SiFramer />,
  GSAP: <SiGreensock />,
  'shadcn/ui': <SiShadcnui />,
  'Node.js': <SiNodedotjs />,
  PostgreSQL: <SiPostgresql />,
  MongoDB: <SiMongodb />,
  'Ethers.js': <SiEthereum />,
  'Aptos TS SDK': <AptosLogo />,
  AWS: <FaAws />,
  Vercel: <SiVercel />,
  DigitalOcean: <SiDigitalocean />,
  Hetzner: <SiHetzner />,
  Git: <SiGit />,
  Figma: <SiFigma />,
  Canva: <SiCanva />,
  'Gemini 3.6 Flash': <SiGooglegemini />,
  'Gemini 3.1 Pro': <SiGooglegemini />,
  'Cursor Composer 2.5': <CursorLogo />,
  'Cursor Grok 4.6': <CursorLogo />,
  'Claude Opus 5': <SiClaude />,
  'GPT-5.6 Sol': <SiOpenai />,
};

const CATEGORY_COPY: Record<string, string> = {
  Languages: 'What I write in',
  Frontend: 'Interfaces & motion',
  Backend: 'Services & data',
  Onchain: 'EVM and Aptos',
  'Ship & Operate': 'Cloud, edge & servers',
  Shape: 'Before it ships',
  'AI Tools': 'Daily copilots',
};

export default function ToolsPanel({ tools }: ToolsPanelProps) {
  const categories = [...new Set(tools.map(t => t.category))];

  return (
    <div className="tools-panel">
      <header className="px-6 md:px-8 pt-8 pb-6 flex items-end justify-between gap-4">
        <div>
          <span className="font-dot text-[10px] text-tertiary tracking-widest uppercase block mb-1 opacity-70">
            Operating system
          </span>
          <h3 className="font-serif text-3xl tracking-tight text-primary leading-tight">THE STACK</h3>
        </div>
        <span className="font-dot text-[10px] text-tertiary uppercase tracking-widest">
          {tools.length} tools
        </span>
      </header>

      <div className="border-t border-border" aria-label="Tools and skills">
        {categories.map((cat, ci) => {
          const items = tools.filter(t => t.category === cat);
          return (
            <section
              key={cat}
              className={ci === 0 ? '' : 'border-t border-border'}
              aria-labelledby={`tools-${cat}`}
            >
              <div className="px-6 md:px-8 pt-6 pb-3 flex items-baseline justify-between gap-4">
                <div>
                  <h4
                    id={`tools-${cat}`}
                    className="font-dot text-[10px] text-tertiary uppercase tracking-widest"
                  >
                    {cat}
                  </h4>
                  {CATEGORY_COPY[cat] && (
                    <p className="text-secondary text-sm mt-1">{CATEGORY_COPY[cat]}</p>
                  )}
                </div>
                <span className="font-dot text-[9px] text-tertiary/70 uppercase tracking-widest">
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border-t border-border">
                {items.map((tool) => (
                  <li
                    key={tool.name}
                    className="tool-card group list-none bg-page"
                  >
                    <div className="flex items-start gap-4 p-5 md:p-6 h-full hover:bg-surface/70 transition-colors">
                      <span
                        className="tool-mark shrink-0 w-11 h-11 rounded-xl border border-strong bg-surface flex items-center justify-center text-[18px] text-primary group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-colors"
                        aria-hidden
                      >
                        {ICONS[tool.name] ?? tool.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-primary font-medium text-sm leading-tight">
                          {tool.name}
                        </span>
                        {tool.blurb && (
                          <span className="block text-tertiary text-xs mt-1 leading-snug">
                            {tool.blurb}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
