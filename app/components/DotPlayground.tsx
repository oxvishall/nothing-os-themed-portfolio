'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GLYPHS, GLYPH_W, GLYPH_H } from '@/lib/dotGlyphs';
import { sfxClick } from '@/lib/sfx';
import { trackPlayground } from '@/lib/analytics';

const COLS = 28;
const ROWS = 18;
const LIFE_SPEED = 110; // ms per generation

const PRESETS: Record<string, string[]> = {
  heart: [
    '01100110',
    '11111111',
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00011000',
  ],
  smile: [
    '0011111100',
    '0100000010',
    '1001001001',
    '1000000001',
    '1010000101',
    '1001111001',
    '0100000010',
    '0011111100',
  ],
  // A Game of Life classic: press play and watch it shoot gliders
  glider: [
    '0010000000',
    '0001000000',
    '0111000000',
    '0000000000',
    '0000000000',
    '0000000100',
    '0000001000',
    '0000001110',
  ],
};

const idx = (x: number, y: number) => y * COLS + x;

// Draw `rows` of '0'/'1' strings centered on the grid
function stamp(rows: string[]): Uint8Array {
  const out = new Uint8Array(COLS * ROWS);
  const w = Math.max(...rows.map(r => r.length));
  const ox = Math.floor((COLS - w) / 2);
  const oy = Math.floor((ROWS - rows.length) / 2);
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const gx = ox + x, gy = oy + y;
      if (row[x] === '1' && gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) out[idx(gx, gy)] = 1;
    }
  });
  return out;
}

// Turn text into glyph rows (max 4 letters fit across the grid)
function textRows(text: string): string[] {
  const chars = text.toUpperCase().split('').filter(c => c === ' ' || GLYPHS[c]).slice(0, 4);
  if (!chars.length) return [];
  return Array.from({ length: GLYPH_H }, (_, y) =>
    chars.map(c => (c === ' ' ? '0'.repeat(GLYPH_W) : GLYPHS[c][y])).join('0'),
  );
}

// One Conway's Game of Life generation, edges wrap around
function lifeStep(cells: Uint8Array): Uint8Array {
  const next = new Uint8Array(cells.length);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx || dy) n += cells[idx((x + dx + COLS) % COLS, (y + dy + ROWS) % ROWS)];
        }
      }
      const alive = cells[idx(x, y)];
      next[idx(x, y)] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
  return next;
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    on: s.getPropertyValue('--text-primary').trim() || '#0f0f0f',
    off: s.getPropertyValue('--bg-elevated').trim() || '#ebebeb',
    bg: s.getPropertyValue('--bg-page').trim() || '#ffffff',
  };
}

export default function DotPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cells = useRef(stamp(textRows('HI')));
  const glow = useRef(Float32Array.from(cells.current)); // eased brightness per dot
  const hover = useRef(-1);
  const frame = useRef(0);
  const kickRef = useRef<() => void>(() => {});

  const [lit, setLit] = useState(() => cells.current.reduce((a, b) => a + b, 0));
  const [playing, setPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [text, setText] = useState('HI');

  const commit = useCallback((next: Uint8Array) => {
    cells.current = next;
    setLit(next.reduce((a, b) => a + b, 0));
    kickRef.current();
  }, []);

  // Rendering: one rAF loop that runs only while dots are still easing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let colors = readColors();
    let step = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Content width of the frame (clientWidth includes its padding)
      const wrap = canvas.parentElement;
      const pad = wrap ? parseFloat(getComputedStyle(wrap).paddingLeft) * 2 : 0;
      const w = Math.floor((wrap?.clientWidth || 600) - pad);
      step = w / COLS;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${step * ROWS}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(step * ROWS * dpr);
      kick();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const base = step * 0.14;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = idx(x, y);
          const cx = (x + 0.5) * step, cy = (y + 0.5) * step;
          const g = glow.current[i];
          ctx.globalAlpha = 1;
          ctx.fillStyle = colors.off;
          ctx.beginPath();
          ctx.arc(cx, cy, base, 0, Math.PI * 2);
          ctx.fill();
          if (g > 0.01) {
            ctx.globalAlpha = g;
            ctx.fillStyle = colors.on;
            ctx.beginPath();
            ctx.arc(cx, cy, base + step * 0.2 * g, 0, Math.PI * 2);
            ctx.fill();
          }
          if (i === hover.current) {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = colors.on;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, step * 0.42, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      let moving = false;
      const g = glow.current, c = cells.current;
      for (let i = 0; i < g.length; i++) {
        const d = c[i] - g[i];
        if (Math.abs(d) > 0.01) { g[i] += reduceMotion ? d : d * 0.3; moving = true; }
        else g[i] = c[i];
      }
      draw();
      frame.current = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!frame.current) frame.current = requestAnimationFrame(tick); };
    kickRef.current = kick;

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    // Re-read colors when the theme flips
    const mo = new MutationObserver(() => { colors = readColors(); kick(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Painting: drag to draw; starting on a lit dot erases instead
    let painting = false, paintValue = 1, last = -1, lastSound = 0;
    const cellAt = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX - r.left) / r.width) * COLS);
      const y = Math.floor(((e.clientY - r.top) / r.height) * ROWS);
      return x >= 0 && x < COLS && y >= 0 && y < ROWS ? idx(x, y) : -1;
    };
    const paintLine = (from: number, to: number) => {
      // Fill the cells between two pointer samples so fast drags leave no gaps
      const next = cells.current.slice();
      let changed = false;
      let x0 = from % COLS, y0 = Math.floor(from / COLS);
      const x1 = to % COLS, y1 = Math.floor(to / COLS);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        const i = idx(x0, y0);
        if (next[i] !== paintValue) { next[i] = paintValue; changed = true; }
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
      if (!changed) return;
      const now = performance.now();
      if (now - lastSound > 45) { sfxClick(); lastSound = now; }
      commit(next);
    };

    const onDown = (e: PointerEvent) => {
      const i = cellAt(e);
      if (i < 0) return;
      canvas.setPointerCapture(e.pointerId);
      painting = true;
      paintValue = cells.current[i] ? 0 : 1;
      last = i;
      paintLine(i, i);
    };
    const onMove = (e: PointerEvent) => {
      const i = cellAt(e);
      if (hover.current !== i && e.pointerType === 'mouse') { hover.current = i; kick(); }
      if (!painting || i < 0 || i === last) return;
      paintLine(last < 0 ? i : last, i);
      last = i;
    };
    let drewOnce = false;
    const onUp = () => {
      if (painting && !drewOnce) { drewOnce = true; trackPlayground('draw'); }
      painting = false;
      last = -1;
    };
    const onLeave = () => { hover.current = -1; kick(); };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [commit]);

  // Game of Life loop; stops itself when the board dies or stops changing
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = lifeStep(cells.current);
      const same = next.every((v, i) => v === cells.current[i]);
      commit(next);
      setGeneration(g => g + 1);
      if (same || !next.some(Boolean)) {
        setPlaying(false);
        trackPlayground('life_stop', { reason: next.some(Boolean) ? 'stable' : 'died' });
      }
    }, LIFE_SPEED);
    return () => clearInterval(id);
  }, [playing, commit]);

  const act = (fn: () => void) => () => { sfxClick(); fn(); };

  const load = (next: Uint8Array) => { setPlaying(false); setGeneration(0); commit(next); };

  const download = () => {
    trackPlayground('download', { lit });
    const { on, off, bg } = readColors();
    const step = 24;
    const c = document.createElement('canvas');
    c.width = COLS * step;
    c.height = ROWS * step;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
    cells.current.forEach((v, i) => {
      const x = (i % COLS + 0.5) * step, y = (Math.floor(i / COLS) + 0.5) * step;
      ctx.fillStyle = v ? on : off;
      ctx.beginPath();
      ctx.arc(x, y, v ? step * 0.34 : step * 0.14, 0, Math.PI * 2);
      ctx.fill();
    });
    const a = document.createElement('a');
    a.download = 'dot-matrix.png';
    a.href = c.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="lab-card">
      <div className="lab-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="lab-canvas"
          data-cursor="crosshair"
          role="img"
          aria-label="Dot matrix drawing board. Click or drag to light dots."
        />
      </div>

      <div className="lab-status">
        <span>{String(lit).padStart(3, '0')} / {COLS * ROWS} lit</span>
        <span>{playing ? `Gen ${String(generation).padStart(3, '0')}` : 'Click or drag to draw'}</span>
      </div>

      <form
        className="lab-row"
        onSubmit={e => {
          e.preventDefault();
          sfxClick();
          load(stamp(textRows(text)));
          trackPlayground('stamp', { text_length: text.trim().length });
        }}
      >
        <input
          value={text}
          onChange={e => setText(e.target.value.replace(/[^a-zA-Z ]/g, '').slice(0, 4))}
          maxLength={4}
          placeholder="TEXT"
          aria-label="Text to stamp, up to 4 letters"
          className="lab-input"
        />
        <button type="submit" className="lab-btn">Stamp</button>
        <span className="lab-divider" aria-hidden />
        {Object.keys(PRESETS).map(name => (
          <button key={name} type="button" className="lab-btn" onClick={act(() => { load(stamp(PRESETS[name])); trackPlayground('preset', { preset: name }); })}>
            {name}
          </button>
        ))}
      </form>

      <div className="lab-row">
        <button
          type="button"
          className={`lab-btn ${playing ? 'lab-btn--active' : ''}`}
          onClick={act(() => {
            trackPlayground(playing ? 'life_stop' : 'life_start', playing ? { reason: 'user', generation } : { lit });
            setPlaying(p => !p);
          })}
          title="Run Conway's Game of Life on your drawing"
        >
          {playing ? '■ Pause' : '▶ Life'}
        </button>
        <button
          type="button"
          className="lab-btn"
          onClick={act(() => {
            load(Uint8Array.from({ length: COLS * ROWS }, () => (Math.random() < 0.28 ? 1 : 0)));
            trackPlayground('random');
          })}
        >
          Random
        </button>
        <button type="button" className="lab-btn" onClick={act(() => { load(cells.current.map(v => 1 - v)); trackPlayground('invert'); })}>
          Invert
        </button>
        <button type="button" className="lab-btn" onClick={act(() => { load(new Uint8Array(COLS * ROWS)); trackPlayground('clear'); })}>
          Clear
        </button>
        <button type="button" className="lab-btn lab-btn--push" onClick={act(download)}>
          ↓ PNG
        </button>
      </div>
    </div>
  );
}
