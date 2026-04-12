'use client';

import { useEffect, useRef } from 'react';
import type { Contribution } from '@/app/data/portfolio';

interface ContribPanelProps {
  contributions: Contribution[];
}

// Generate 52-week × 7-day fake contribution data using seeded random
function generateContribData(): number[][] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  const weeks: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      const r = rand();
      const count = r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.80 ? 2 : r < 0.92 ? 3 : 4;
      week.push(count);
    }
    weeks.push(week);
  }
  return weeks;
}

const CONTRIB_DATA = generateContribData();
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ContribGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = () =>
      document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && mq.matches);

    const draw = () => {
      const CELL = 11;
      const GAP = 2;
      const cols = CONTRIB_DATA.length;
      const rows = 7;
      const W = cols * (CELL + GAP);
      const H = rows * (CELL + GAP);

      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      const dark = isDark();

      CONTRIB_DATA.forEach((week, wi) => {
        week.forEach((count, di) => {
          const opacity = count === 0
            ? (dark ? 0.08 : 0.06)
            : Math.min(dark ? 0.15 + count * 0.2 : 0.1 + count * 0.22, 1);
          ctx.fillStyle = dark
            ? `rgba(240,240,240,${opacity})`
            : `rgba(15,15,15,${opacity})`;
          const x = wi * (CELL + GAP);
          const y = di * (CELL + GAP);
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, CELL, CELL, 2);
          } else {
            ctx.rect(x, y, CELL, CELL);
          }
          ctx.fill();
        });
      });
    };

    draw();
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    mq.addEventListener('change', draw);

    return () => {
      mo.disconnect();
      mq.removeEventListener('change', draw);
    };
  }, []);

  return (
    <div className="contrib-canvas-wrap">
      <div className="contrib-months" aria-hidden="true">
        {MONTHS.map(m => <span key={m}>{m}</span>)}
      </div>
      <canvas
        ref={canvasRef}
        className="contrib-canvas"
        aria-label="Contribution activity grid"
      />
    </div>
  );
}

export default function ContribPanel({ contributions }: ContribPanelProps) {
  return (
    <div className="contrib-panel">
      <div className="contrib-summary">
        <span className="contrib-count">{contributions.length}</span>
        <span className="contrib-label">contributions in the last year</span>
      </div>

      <ContribGrid />

      <ul className="contrib-list" aria-label="Contributions">
        {contributions.map((c, i) => (
          <li key={i} className="contrib-item">
            <div className="contrib-item-dot" aria-hidden="true" />
            <div className="contrib-item-content">
              <a
                href={c.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="contrib-name"
              >
                {c.name}
              </a>
              <span className="contrib-desc">{c.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
