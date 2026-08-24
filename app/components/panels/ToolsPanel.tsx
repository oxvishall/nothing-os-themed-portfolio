'use client';

import type { ReactNode } from 'react';
import { FaAws } from 'react-icons/fa';
import {
  SiTypescript,
  SiJavascript,
  SiSolidity,
  SiRust,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiEthereum,
  SiDocker,
  SiVercel,
  SiGit,
  SiFigma,
} from 'react-icons/si';
import type { Tool } from '@/app/data/portfolio';

interface ToolsPanelProps {
  tools: Tool[];
}

const ICONS: Record<string, ReactNode> = {
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  Solidity: <SiSolidity />,
  Rust: <SiRust />,
  React: <SiReact />,
  'Next.js': <SiNextdotjs />,
  Tailwind: <SiTailwindcss />,
  'Framer Motion': <SiFramer />,
  'Node.js': <SiNodedotjs />,
  PostgreSQL: <SiPostgresql />,
  MongoDB: <SiMongodb />,
  'Ethers.js': <SiEthereum />,
  Docker: <SiDocker />,
  AWS: <FaAws />,
  Vercel: <SiVercel />,
  Git: <SiGit />,
  Figma: <SiFigma />,
};

const CATEGORY_COPY: Record<string, string> = {
  Languages: 'What I write in',
  Frontend: 'Interfaces & motion',
  Backend: 'Services & data',
  Web3: 'Onchain primitives',
  Infra: 'Ship & operate',
  Design: 'Shape before code',
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

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border-t border-border">
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
