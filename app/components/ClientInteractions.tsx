'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from '@/app/data/portfolio';
import { trackPageView, trackSplashDismissed } from '@/lib/analytics';

const SPLASH_KEY = 'splash_seen';
const DURATION = 1000; // ms the counter takes to reach 100

// 5×7 dot-matrix glyphs, one string per row ('1' = lit dot)
const GLYPHS: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10011', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

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
    const duration = reduceMotion ? 300 : DURATION;

    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';

    // Drive the counter directly on the DOM node: no re-render per frame
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (t < 1) frame = requestAnimationFrame(step);
    });

    const unlock = () => {
      body.style.overflow = '';
      body.style.touchAction = '';
    };

    const timer = setTimeout(() => {
      setShowSplash(false);
      unlock();
      try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch {}
      trackSplashDismissed();
      trackPageView('home');
    }, duration + 150);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
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
