'use client';

import { useEffect, useState } from 'react';

export default function ClientInteractions() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1. Custom Cursor Movement
    const cursor = document.getElementById('cursor');
    if (cursor) {
      const moveCursor = (e: MouseEvent) => {
        cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
      };
      window.addEventListener('mousemove', moveCursor);

      // Effect on hover
      const handlePointerOver = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
          cursor.style.transform += ' scale(2.5)';
        }
      };
      const handlePointerOut = () => {
        // We'll let moveCursor reset the base transform, but we need to reset scale
      };

      window.addEventListener('mouseover', handlePointerOver);

      return () => {
        window.removeEventListener('mousemove', moveCursor);
        window.removeEventListener('mouseover', handlePointerOver);
      };
    }
  }, []);

  useEffect(() => {
    // 2. Splash Screen Timeout
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div id="splash" className={showSplash ? '' : 'splash--hidden'} aria-hidden="true">
        <div className="splash-dots">
          <div className="splash-dot" />
          <div className="splash-dot" />
          <div className="splash-dot" />
        </div>
        <div className="splash-text">BOOTING...</div>
      </div>
    </>
  );
}
