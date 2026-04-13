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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const html = document.documentElement;
    if (stored) {
      setTheme(stored);
    } else if (html.classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);

  const setThemeMode = (mode: 'light' | 'dark') => {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  return (
    <div className="sidebar-card border-strong p-5">
      <span className="sidebar-heading !mb-4 block">· INTERFACE ·</span>
      <div className="flex bg-surface border border-strong rounded-full p-1 relative">
        <button 
          onClick={() => setThemeMode('light')}
          className={`flex-1 py-1.5 px-4 rounded-full text-[10px] font-dot tracking-widest transition-all duration-300 z-10 ${
            theme === 'light' ? 'text-background' : 'text-secondary hover:text-primary'
          }`}
        >
          LIGHT
        </button>
        <button 
          onClick={() => setThemeMode('dark')}
          className={`flex-1 py-1.5 px-4 rounded-full text-[10px] font-dot tracking-widest transition-all duration-300 z-10 ${
            theme === 'dark' ? 'text-background' : 'text-secondary hover:text-primary'
          }`}
        >
          DARK
        </button>
        {/* Active Indicator Slider */}
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            theme === 'dark' ? 'left-[calc(50%+2px)]' : 'left-1'
          }`}
        />
      </div>
    </div>
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
