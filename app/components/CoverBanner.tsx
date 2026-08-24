'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from '@/app/data/portfolio';
import ImageLightbox from './ImageLightbox';

export default function CoverBanner({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bannerOpen, setBannerOpen] = useState(false);

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
    <>
      <header className="cover group relative cursor-pointer" onClick={() => setBannerOpen(true)} aria-label="View cover banner">
        <img
          src={portfolio.bannerUrl}
          alt={`${name}'s banner`}
          className="cover-img w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="cover-dots-overlay"
          aria-hidden="true"
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="font-dot font-bold text-[10px] tracking-widest uppercase text-white bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
            View Banner
          </span>
        </div>
      </header>

      {/* Banner lightbox */}
      <ImageLightbox
        src={portfolio.bannerUrl}
        alt={`${name}'s banner`}
        isOpen={bannerOpen}
        onClose={() => setBannerOpen(false)}
        shape="rect"
      />
    </>
  );
}
