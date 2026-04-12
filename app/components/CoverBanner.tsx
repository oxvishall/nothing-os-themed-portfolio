'use client';

import { useEffect, useRef } from 'react';

interface CoverBannerProps {
  name: string;
}

function drawNDotBanner(canvas: HTMLCanvasElement, isDark: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = isDark ? '#141414' : '#f5f5f5';
  ctx.fillRect(0, 0, W, H);

  const DOT = 3;
  const GAP = 8;
  const COLOR = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';

  ctx.fillStyle = COLOR;
  for (let x = GAP; x < W; x += GAP + DOT) {
    for (let y = GAP; y < H; y += GAP + DOT) {
      ctx.beginPath();
      ctx.arc(x, y, DOT / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle watermark text
  ctx.font = `bold 22px 'Dot Gothic 16', monospace`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  ctx.fillText('NOTHING × X', 24, H - 16);
}

export default function CoverBanner({ name }: CoverBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = () =>
      document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && mq.matches);

    const draw = () => {
      canvas.width = canvas.offsetWidth || 680;
      canvas.height = 180;
      drawNDotBanner(canvas, isDark());
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(canvas);

    const mqHandler = draw;
    mq.addEventListener('change', mqHandler);

    // Watch for class changes on html (manual dark toggle)
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      ro.disconnect();
      mq.removeEventListener('change', mqHandler);
      mo.disconnect();
    };
  }, []);

  return (
    <header className="cover">
      <canvas
        ref={canvasRef}
        className="cover-canvas"
        aria-label={`Cover banner for ${name}`}
      />
    </header>
  );
}
