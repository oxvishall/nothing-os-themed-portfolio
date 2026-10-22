'use client';

import { useEffect } from 'react';

const INTERACTIVE = 'a, button, [role="button"], label, summary, select, .clickable, .cursor-pointer';
const TEXT_INPUT = 'input, textarea, [contenteditable="true"]';

// Dot cursor that eases toward the pointer in a single rAF loop.
// No React state, so moving the mouse never triggers a re-render.
export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.35;

    let targetX = -100, targetY = -100;
    let x = targetX, y = targetY;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = `translate3d(${x - 5}px, ${y - 5}px, 0)`;
      // Stop the loop once settled; the next mousemove restarts it
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const isText = !!target.closest(TEXT_INPUT);
      const isHover = !isText && !!target.closest(INTERACTIVE);
      cursor.classList.toggle('cursor-text', isText);
      cursor.classList.toggle('cursor-hover', isHover);
    };

    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = ''; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return null;
}
