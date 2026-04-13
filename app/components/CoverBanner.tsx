'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from '@/app/data/portfolio';

export default function CoverBanner({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width;
      const H = canvas.height;

      // Overlay Nothing Dots
      const DOT = 2;
      const GAP = 8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Very subtle white dots
      
      for (let x = GAP; x < W; x += GAP + DOT) {
        for (let y = GAP; y < H; y += GAP + DOT) {
          ctx.beginPath();
          ctx.arc(x, y, DOT / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <header className="cover">
      <img
        src={portfolio.bannerUrl}
        alt={`${name}'s banner`}
        className="cover-img"
      />
      <canvas
        ref={canvasRef}
        className="cover-dots-overlay"
        aria-hidden="true"
      />
    </header>
  );
}
