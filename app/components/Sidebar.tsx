'use client';

import { useEffect, useState, useRef } from 'react';
import type { PortfolioData } from '@/app/data/portfolio';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

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
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);

    // Close on escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const sidebarContent = (
    <>
      {/* Mobile Close Button */}
      <div className="flex justify-end p-4 lg:hidden">
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 bg-surface border border-strong rounded-full text-secondary hover:text-primary transition-all"
          aria-label="Close Sidebar"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* Time card - Enhanced Serif UI */}
      <div className="sidebar-card border-strong group hover:bg-elevated transition-colors duration-300">
        <span className="sidebar-heading !mb-4">· LOCAL TIME (UTC+5:30) ·</span>
        <LocalTime />
      </div>

      {/* Hackathons & Events card */}
      <div className="sidebar-card border-strong group hover:bg-elevated transition-colors duration-300">
        <h3 className="sidebar-heading">Hackathons & Events</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <span className="font-serif text-3xl block">7+</span>
            <span className="font-dot text-[10px] text-secondary uppercase tracking-widest leading-tight block mt-1" style={{fontWeight:700,fontVariationSettings:'"ROND" 0'}}>Won</span>
          </div>
          <div className="text-center border-x border-border">
            <span className="font-serif text-3xl block">2</span>
            <span className="font-dot text-[10px] text-secondary uppercase tracking-widest leading-tight block mt-1" style={{fontWeight:700,fontVariationSettings:'"ROND" 0'}}>Global</span>
          </div>
          <div className="text-center border-r border-border">
            <span className="font-serif text-3xl block">6</span>
            <span className="font-dot text-[10px] text-secondary uppercase tracking-widest leading-tight block mt-1" style={{fontWeight:700,fontVariationSettings:'"ROND" 0'}}>Hosted</span>
          </div>
          <div className="text-center">
            <span className="font-serif text-3xl block">70+</span>
            <span className="font-dot text-[10px] text-secondary uppercase tracking-widest leading-tight block mt-1" style={{fontWeight:700,fontVariationSettings:'"ROND" 0'}}>Attended</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
            ETHGlobal Delhi
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
            Walrus Haulout
          </div>
        </div>
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex sidebar" aria-label="Profile sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (with AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-page/80 backdrop-blur-md z-[100] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-page border-l border-strong z-[101] overflow-y-auto lg:hidden"
            >
              <div className="flex flex-col gap-4 p-4">
                {sidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
