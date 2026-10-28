'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from '@/app/data/portfolio';
import { GLYPHS } from '@/lib/dotGlyphs';
import { trackPageView, trackSplashDismissed } from '@/lib/analytics';

const SPLASH_KEY = 'splash_seen';
const MIN_SHOW = 1000;   // never flash the loader for less than this (ms)
const MAX_WAIT = 12000;  // give up waiting for the API after this (ms)
const FINISH = 350;      // the last stretch to 100 once the data is in (ms)



const initials = portfolio.name
  .split(/\s+/)
  .map(w => w.charAt(0).toUpperCase())
  .filter(c => GLYPHS[c])
  .slice(0, 2);

// Deterministic scatter so server and client render identical delays
const scatter = (i: number) => ((i * 7919) % 97) / 97;

export default function ClientInteractions() {
  const [showSplash, setShowSplash] = useState(true);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Already shown this session: the inline script in layout.tsx hid it before paint
    if (root.classList.contains('splash-seen')) {
      trackPageView('home');
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';

    // The counter creeps toward 90 while the projects load, then runs to 100
    // once they're in. Driven on the DOM node: no re-render per frame.
    const start = performance.now();
    let readyAt = 0;
    let finished = false;
    const setCount = (v: number) => {
      if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, '0');
    };
    let frame = requestAnimationFrame(function step(now) {
      const waited = now - start;
      let value: number;
      if (!readyAt) {
        value = 90 * (1 - Math.exp(-waited / 900));
      } else {
        const from = 90 * (1 - Math.exp(-(readyAt - start) / 900));
        const t = Math.min(1, (now - readyAt) / (reduceMotion ? 1 : FINISH));
        value = from + (100 - from) * (1 - (1 - t) ** 3);
        if (t >= 1) { setCount(100); finish(); return; }
      }
      setCount(value);
      frame = requestAnimationFrame(step);
    });

    const unlock = () => {
      body.style.overflow = '';
      body.style.touchAction = '';
    };

    function finish() {
      if (finished) return;
      finished = true;
      setShowSplash(false);
      unlock();
      try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch {}
      trackSplashDismissed();
      trackPageView('home');
    }

    // Data ready → wait out the minimum time, then run the last stretch
    const markReady = () => {
      if (readyAt) return;
      const wait = Math.max(0, MIN_SHOW - (performance.now() - start));
      setTimeout(() => { readyAt = performance.now(); }, wait);
    };
    const w = window as Window & { __portfolioReady?: boolean };
    if (w.__portfolioReady) markReady();
    window.addEventListener('portfolio:ready', markReady);
    const giveUp = setTimeout(markReady, MAX_WAIT);
    const timer = giveUp;

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener('portfolio:ready', markReady);
      unlock();
    };
  }, []);

  return (
    <div id="splash" className={showSplash ? '' : 'splash--hidden'} aria-hidden="true">
      <div className="splash-inner">
        <div className="splash-monogram">
          {initials.map((letter, li) => (
            <div key={li} className="splash-glyph">
              {GLYPHS[letter].join('').split('').map((bit, i) => (
                <span
                  key={i}
                  className={bit === '1' ? 'splash-px splash-px--on' : 'splash-px'}
                  style={bit === '1' ? { animationDelay: `${Math.round(scatter(i + li * 35) * 600)}ms` } : undefined}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="splash-meta">
          <span className="splash-label">{portfolio.name}</span>
          <span className="splash-counter">
            <span ref={counterRef}>000</span>
          </span>
        </div>
      </div>
    </div>
  );
}
