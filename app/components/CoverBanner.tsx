'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from '@/app/data/portfolio';
import ImageLightbox from './ImageLightbox';

const DOT = 2;          // base dot diameter (css px)
const STEP = 10;        // distance between dot centers
const RADIUS = 90;      // how far the glow reaches from the pointer
const BASE_ALPHA = 0.15;

export default function CoverBanner({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const header = headerRef.current;
    if (!canvas || !header) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.18;

    let W = 0, H = 0, dpr = 1;
    // Pre-rendered static dot layer, so each frame only redraws dots near the pointer
    const base = document.createElement('canvas');

    // Pointer state: target (t*) and eased (p*) position + glow intensity
    let tx = 0, ty = 0, px = 0, py = 0;
    let targetI = 0, intensity = 0;
    let frame = 0;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;

    const resize = () => {
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      // Measure the banner, not the canvas: the canvas's own size depends on
      // its pixel buffer, so measuring it would feed back into itself.
      const nextW = header.clientWidth;
      const nextH = header.clientHeight;
      // Only rebuild when the size really changed (guards against resize feedback loops)
      if (nextW === W && nextH === H && nextDpr === dpr) return;
      dpr = nextDpr;
      W = nextW;
      H = nextH;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.width = base.width = Math.round(W * dpr);
      canvas.height = base.height = Math.round(H * dpr);

      const b = base.getContext('2d');
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.fillStyle = `rgba(255, 255, 255, ${BASE_ALPHA})`;
      b.beginPath();
      for (let x = STEP; x < W; x += STEP) {
        for (let y = STEP; y < H; y += STEP) {
          b.moveTo(x + DOT / 2, y);
          b.arc(x, y, DOT / 2, 0, Math.PI * 2);
        }
      }
      b.fill();
      render();
    };

    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (intensity < 0.01) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      const x0 = Math.max(STEP, Math.ceil((px - RADIUS) / STEP) * STEP);
      const y0 = Math.max(STEP, Math.ceil((py - RADIUS) / STEP) * STEP);
      for (let x = x0; x <= px + RADIUS && x < W; x += STEP) {
        for (let y = y0; y <= py + RADIUS && y < H; y += STEP) {
          const d = Math.hypot(x - px, y - py);
          if (d >= RADIUS) continue;
          const f = (1 - d / RADIUS) ** 2 * intensity;
          ctx.globalAlpha = Math.min(1, f * 0.9);
          ctx.beginPath();
          ctx.arc(x, y, DOT / 2 + f * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      px += (tx - px) * ease;
      py += (ty - py) * ease;
      intensity += (targetI - intensity) * (reduceMotion ? 1 : 0.12);
      render();
      const settled =
        Math.abs(tx - px) < 0.2 && Math.abs(ty - py) < 0.2 && Math.abs(targetI - intensity) < 0.01;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      // Jump straight to the pointer when the glow starts, instead of sliding in from the last spot
      if (intensity < 0.02) { px = tx; py = ty; }
      targetI = 1;
      // On touch there's no "leave", so fade out shortly after the last touch
      clearTimeout(fadeTimer);
      if (e.pointerType !== 'mouse') fadeTimer = setTimeout(() => { targetI = 0; kick(); }, 700);
      kick();
    };
    const onLeave = () => { targetI = 0; kick(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(header);
    header.addEventListener('pointermove', onMove, { passive: true });
    header.addEventListener('pointerdown', onMove, { passive: true });
    header.addEventListener('pointerleave', onLeave);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(fadeTimer);
      header.removeEventListener('pointermove', onMove);
      header.removeEventListener('pointerdown', onMove);
      header.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="cover group relative cursor-pointer"
        data-cursor-label="VIEW"
        onClick={() => setBannerOpen(true)}
        aria-label="View cover banner"
      >
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
