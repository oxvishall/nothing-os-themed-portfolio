'use client';

import { useEffect, useState } from 'react';
import type { PortfolioData } from '@/app/data/portfolio';

interface SidebarProps {
  data: PortfolioData;
}

function LocalTime() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="local-time-wrapper select-none">
      <span className="font-serif text-5xl tracking-tighter text-primary">{time}</span>
    </div>
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
      className="theme-btn border-strong transition-all duration-300 hover:bg-elevated/80 active:scale-95"
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
      {/* Time card - Enhanced Serif UI */}
      <div className="sidebar-card border-strong group hover:bg-elevated transition-colors duration-300">
        <span className="sidebar-heading !mb-4">· LOCAL TIME (UTC+5:30) ·</span>
        <LocalTime />
      </div>

      {/* About card */}
      <div className="sidebar-card border-strong group hover:bg-elevated transition-colors duration-300">
        <h3 className="sidebar-heading">About</h3>
        <p className="sidebar-about-text">
          Full-stack developer based in {data.location}. I build performant, pixel-perfect web apps
          with particular focus on high-fidelity UIs and Web3 interfaces.
          Obsessed with monochrome design and the 2% of polish that makes products feel premium.
        </p>
      </div>

      {/* Links */}
      <div className="sidebar-card border-strong group hover:bg-elevated transition-colors duration-300">
        <h3 className="sidebar-heading">Links</h3>
        <ul className="link-list" aria-label="Social and external links">
          {data.links.map(link => (
            <li key={link.label}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link hover:translate-x-1 transition-all"
                aria-label={link.label}
              >
                <span className="sidebar-link-icon opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true">{link.icon}</span>
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
