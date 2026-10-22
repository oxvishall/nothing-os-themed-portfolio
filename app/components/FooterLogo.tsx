'use client';

import { useRef } from 'react';

// Footer wordmark. Triple-tap it for a hidden dot wave (the touch-friendly easter egg).
export default function FooterLogo({ children }: { children: React.ReactNode }) {
  const taps = useRef<number[]>([]);

  const onClick = (e: React.MouseEvent) => {
    const now = performance.now();
    taps.current = [...taps.current.filter(t => now - t < 600), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      window.dispatchEvent(new CustomEvent('portfolio:wave', { detail: { x: e.clientX, y: e.clientY } }));
    }
  };

  return (
    <span className="footer-logo select-none" onClick={onClick}>
      {children}
    </span>
  );
}
