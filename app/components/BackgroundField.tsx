'use client';

import { useEffect, useRef } from 'react';

const STEP = 24;          // distance between dots
const BASE_R = 1;         // resting dot radius
const GLOW_RADIUS = 160;  // pointer influence
const RIPPLE_SPEED = 0.9; // px per ms
const RIPPLE_BAND = 46;
const RIPPLE_LIFE = 1100; // ms

// A ripple starts from clicks on empty background and from any button or link
const PRESSABLE = 'button, a, [role="button"], summary, label, .expand-toggle, .clickable, .cursor-pointer';
// Clicks inside content that aren't on a control (reading, selecting text) don't ripple
const CONTENT = '.main-content, .sidebar-card, input, textarea, select, #splash, .shortcuts-backdrop';

/**
 * Full-page dot field behind the layout. Dots swell toward the pointer and a
 * click on empty background or on any button/link sends a ripple out from the
 * click point, behind the page. Only affected dots are redrawn each frame;
 * the resting grid is pre-rendered once.
 */
export default function BackgroundField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const base = document.createElement('canvas');
    let W = 0, H = 0, dpr = 1;
    let color = '#0f0f0f';

    // Pointer: target (t*) and eased (p*) position, plus glow intensity
    let tx = -9999, ty = -9999, px = tx, py = ty;
    let targetI = 0, intensity = 0;
    const ripples: { x: number; y: number; start: number }[] = [];
    let frame = 0;

    const buildBase = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#0f0f0f';
      base.width = canvas.width;
      base.height = canvas.height;
      const b = base.getContext('2d');
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, W, H);
      b.globalAlpha = 0.12;
      b.fillStyle = color;
      b.beginPath();
      for (let x = STEP / 2; x < W; x += STEP) {
        for (let y = STEP / 2; y < H; y += STEP) {
          b.moveTo(x + BASE_R, y);
          b.arc(x, y, BASE_R, 0, Math.PI * 2);
        }
      }
      b.fill();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      buildBase();
      kick();
    };

    // Extra brightness (0..1) for the dot at x,y from pointer and ripples
    const boost = (x: number, y: number, now: number) => {
      let v = 0;
      if (intensity > 0.01) {
        const d = Math.hypot(x - px, y - py);
        if (d < GLOW_RADIUS) v = (1 - d / GLOW_RADIUS) ** 2 * intensity;
      }
      for (const r of ripples) {
        const age = now - r.start;
        const ring = age * RIPPLE_SPEED;
        const d = Math.abs(Math.hypot(x - r.x, y - r.y) - ring);
        if (d < RIPPLE_BAND) v = Math.max(v, (1 - d / RIPPLE_BAND) * (1 - age / RIPPLE_LIFE));
      }
      return v;
    };

    const render = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (intensity < 0.01 && !ripples.length) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = color;

      // Only visit dots that something can affect
      const boxes: [number, number, number, number][] = [];
      if (intensity > 0.01) boxes.push([px - GLOW_RADIUS, py - GLOW_RADIUS, px + GLOW_RADIUS, py + GLOW_RADIUS]);
      for (const r of ripples) {
        const reach = (now - r.start) * RIPPLE_SPEED + RIPPLE_BAND;
        boxes.push([r.x - reach, r.y - reach, r.x + reach, r.y + reach]);
      }
      const x0 = Math.max(STEP / 2, Math.min(...boxes.map(b => b[0])));
      const y0 = Math.max(STEP / 2, Math.min(...boxes.map(b => b[1])));
      const x1 = Math.min(W, Math.max(...boxes.map(b => b[2])));
      const y1 = Math.min(H, Math.max(...boxes.map(b => b[3])));
      const sx = Math.ceil((x0 - STEP / 2) / STEP) * STEP + STEP / 2;
      const sy = Math.ceil((y0 - STEP / 2) / STEP) * STEP + STEP / 2;

      for (let x = sx; x <= x1; x += STEP) {
        for (let y = sy; y <= y1; y += STEP) {
          const v = boost(x, y, now);
          if (v < 0.02) continue;
          ctx.globalAlpha = 0.12 + v * 0.55;
          ctx.beginPath();
          ctx.arc(x, y, BASE_R + v * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      px += (tx - px) * (reduceMotion ? 1 : 0.2);
      py += (ty - py) * (reduceMotion ? 1 : 0.2);
      intensity += (targetI - intensity) * (reduceMotion ? 1 : 0.1);
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].start > RIPPLE_LIFE) ripples.splice(i, 1);
      }
      render(now);
      const busy =
        ripples.length > 0 ||
        Math.abs(tx - px) > 0.3 || Math.abs(ty - py) > 0.3 ||
        Math.abs(targetI - intensity) > 0.01;
      frame = busy ? requestAnimationFrame(tick) : 0;
    };
    function kick() { if (!frame) frame = requestAnimationFrame(tick); }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      if (intensity < 0.02) { px = tx; py = ty; }
      targetI = 1;
      kick();
    };
    const onLeave = () => { targetI = 0; kick(); };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (reduceMotion || !target?.closest) return;
      const pressed = target.closest(PRESSABLE);
      if (pressed ? pressed.matches(':disabled') || pressed.closest('#splash') : target.closest(CONTENT)) return;
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
      if (ripples.length > 4) ripples.shift();
      kick();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    // Rebuild colors when the theme changes
    const mo = new MutationObserver(() => { buildBase(); kick(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      mo.disconnect();
    };
  }, []);

  // Positioning is inline on purpose: if the stylesheet is missing or late,
  // the canvas must still never sit in the page flow and push content down.
  return (
    <canvas
      ref={canvasRef}
      className="background-field"
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
