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
  SiAnthropic,
  SiOpenai,
} from 'react-icons/si';
import { Hexagon } from 'lucide-react';
import type { Tool } from '@/app/data/portfolio';

function CursorLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
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
  'Aptos TS SDK': <Hexagon size={18} strokeWidth={2} />,
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
  'Claude Opus 5': <SiAnthropic />,
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
