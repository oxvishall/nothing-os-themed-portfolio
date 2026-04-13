'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [type, setType] = useState<'default' | 'pointer' | 'text'>('default');

  useEffect(() => {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
      });
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check for text inputs
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        setType('text');
        cursor.classList.add('cursor-text');
        cursor.classList.remove('cursor-hover');
        return;
      }

      // Check for clickable elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('clickable') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setType('pointer');
        cursor.classList.add('cursor-hover');
        cursor.classList.remove('cursor-text');
        return;
      }

      // Default
      setType('default');
      cursor.classList.remove('cursor-hover', 'cursor-text');
    };

    const handlePointerOut = () => {
      cursor.classList.remove('cursor-hover', 'cursor-text');
      setType('default');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handlePointerOver as any);
    window.addEventListener('mouseout', handlePointerOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handlePointerOver as any);
      window.removeEventListener('mouseout', handlePointerOut);
    };
  }, []);

  return null;
}
