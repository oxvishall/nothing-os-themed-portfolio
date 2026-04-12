'use client';

import { useEffect, useRef, useState } from 'react';
import type { PortfolioData } from '@/app/data/portfolio';

interface SidebarProps {
  data: PortfolioData;
}

function DotClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const isDark = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold 36px 'Dot Gothic 16', monospace`;
      ctx.fillStyle = isDark ? '#f0f0f0' : '#0f0f0f';
      ctx.fillText(timeStr, 4, 42);
    };

    draw();
    const id = setInterval(draw, 1000);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      clearInterval(id);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="dot-clock"
      width={240}
      height={52}
      aria-label="Current time in dot matrix style"
    />
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
    else setTheme('system');
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const icon = theme === 'dark' ? '◑' : theme === 'light' ? '◐' : '◐';

  return (
    <button
      id="theme-toggle"
      className="theme-btn"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-btn-dot-label">· THEME ·</span>
      <span className="theme-btn-icon" aria-hidden="true">{icon}</span>
    </button>
  );
}

export default function Sidebar({ data }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Profile sidebar">
      {/* About card */}
      <div className="sidebar-card">
        <h3 className="sidebar-heading">About</h3>
        <p className="sidebar-about-text">
          Full-stack developer based in {data.location}. I build performant, pixel-perfect web apps
          with particular focus on trading UIs, DeFi protocols, and developer tooling.
          Obsessed with monochrome design and the 2% of polish that makes products feel premium.
        </p>
      </div>

      {/* Dot-matrix clock */}
      <div className="sidebar-card sidebar-clock">
        <span className="sidebar-clock-label">· LOCAL TIME ·</span>
        <DotClock />
      </div>

      {/* Links */}
      <div className="sidebar-card">
        <h3 className="sidebar-heading">Links</h3>
        <ul className="link-list" aria-label="Social and external links">
          {data.links.map(link => (
            <li key={link.label}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
                aria-label={link.label}
              >
                <span className="sidebar-link-icon" aria-hidden="true">{link.icon}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme toggle */}
      <ThemeToggle />
    </aside>
  );
}
