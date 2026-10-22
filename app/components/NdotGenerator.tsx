'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sfxClick } from '@/lib/sfx';

type Shape = 'round' | 'square';

interface Options {
  cols: number;      // dots across
  contrast: number;  // 0.5 – 2.5
  shape: Shape;
  dark: boolean;     // light dots on a dark background
  invert: boolean;
}

const MAX_SOURCE = 1600; // downscale huge photos before sampling
const EXPORT_CELL = 16;  // px per dot in the downloaded PNG
const EXPORT_MAX = 4096; // cap on exported width/height

/**
 * Converts an image into a dot-matrix rendering on `out`.
 * Each cell's average brightness sets its dot size.
 */
function dotMatrixify(src: CanvasImageSource, srcW: number, srcH: number, out: HTMLCanvasElement, cell: number, o: Options) {
  const cols = o.cols;
  const rows = Math.max(1, Math.round((cols * srcH) / srcW));

  // Let the browser average each cell by drawing the image at grid size
  const sample = document.createElement('canvas');
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext('2d', { willReadFrequently: true });
  if (!sctx) return;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(src, 0, 0, cols, rows);
  const px = sctx.getImageData(0, 0, cols, rows).data;

  out.width = Math.round(cols * cell);
  out.height = Math.round(rows * cell);
  const ctx = out.getContext('2d');
  if (!ctx) return;

  const bg = o.dark ? '#0a0a0a' : '#ffffff';
  const fg = o.dark ? '#f0f0f0' : '#0f0f0f';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.fillStyle = fg;

  const maxR = cell * 0.48;
  ctx.beginPath();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const a = px[i + 3] / 255;
      // Perceived brightness; transparent pixels count as background
      let b = ((0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255) * a + (o.dark ? 0 : 1) * (1 - a);
      b = Math.min(1, Math.max(0, (b - 0.5) * o.contrast + 0.5));
      // Dark background: bright areas get big dots. Light background: dark areas do.
      let v = o.dark ? b : 1 - b;
      if (o.invert) v = 1 - v;
      if (v < 0.06) continue;

      const cx = (x + 0.5) * cell, cy = (y + 0.5) * cell;
      if (o.shape === 'round') {
        const r = maxR * Math.sqrt(v); // sqrt keeps dot area proportional to tone
        ctx.moveTo(cx + r, cy);
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      } else {
        const s = maxR * 2 * Math.sqrt(v);
        ctx.rect(cx - s / 2, cy - s / 2, s, s);
      }
    }
  }
  ctx.fill();
}

export default function NdotGenerator() {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<{ bmp: ImageBitmap; name: string; url: string } | null>(null);
  const [opts, setOpts] = useState<Options>({ cols: 64, contrast: 1.2, shape: 'round', dark: true, invert: false });
  const [dragging, setDragging] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState('');

  const loadFile = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('That file isn’t an image.'); return; }
    try {
      const full = await createImageBitmap(file);
      const scale = Math.min(1, MAX_SOURCE / Math.max(full.width, full.height));
      const bmp = scale < 1
        ? await createImageBitmap(full, { resizeWidth: Math.round(full.width * scale), resizeHeight: Math.round(full.height * scale), resizeQuality: 'high' })
        : full;
      if (bmp !== full) full.close();
      sfxClick();
      setError('');
      setSource(prev => {
        if (prev) { prev.bmp.close(); URL.revokeObjectURL(prev.url); }
        return { bmp, name: file.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(file) };
      });
    } catch {
      setError('Couldn’t read that image. Try a JPG, PNG or WebP.');
    }
  }, []);

  // Release the decoded image and its URL when leaving the Lab
  const sourceRef = useRef(source);
  useEffect(() => { sourceRef.current = source; }, [source]);
  useEffect(() => () => {
    const prev = sourceRef.current;
    if (prev) { prev.bmp.close(); URL.revokeObjectURL(prev.url); }
  }, []);

  // Paste an image from the clipboard anywhere while the Lab is open
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
      if (item) loadFile(item.getAsFile());
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadFile]);

  // Re-render the preview whenever the image, options or size change
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !source) return;
    const render = () => {
      const w = canvas.parentElement?.clientWidth || 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dotMatrixify(source.bmp, source.bmp.width, source.bmp.height, canvas, (w * dpr) / opts.cols, opts);
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
    };
    const raf = requestAnimationFrame(render);
    const ro = new ResizeObserver(() => requestAnimationFrame(render));
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [source, opts]);

  const download = () => {
    if (!source) return;
    sfxClick();
    const rows = Math.round((opts.cols * source.bmp.height) / source.bmp.width);
    const cell = Math.min(EXPORT_CELL, EXPORT_MAX / Math.max(opts.cols, rows));
    const out = document.createElement('canvas');
    dotMatrixify(source.bmp, source.bmp.width, source.bmp.height, out, cell, opts);
    out.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${source.name || 'image'}-dotmatrix.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  const set = <K extends keyof Options>(key: K, value: Options[K]) => setOpts(o => ({ ...o, [key]: value }));
  const toggle = (key: 'dark' | 'invert') => { sfxClick(); setOpts(o => ({ ...o, [key]: !o[key] })); };

  return (
    <div className="lab-card">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => { loadFile(e.target.files?.[0]); e.target.value = ''; }}
      />

      {!source ? (
        <button
          type="button"
          className={`gen-drop ${dragging ? 'gen-drop--active' : ''}`}
          data-cursor-label="UPLOAD"
          onClick={() => { sfxClick(); inputRef.current?.click(); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files?.[0]); }}
        >
          <span className="gen-drop-dots" aria-hidden>
            {Array.from({ length: 25 }).map((_, i) => <i key={i} />)}
          </span>
          <span className="font-dot text-[11px] uppercase tracking-widest text-primary">
            {dragging ? 'Drop it' : 'Upload an image'}
          </span>
          <span className="text-tertiary text-xs">Click, drop, or paste · JPG, PNG, WebP</span>
        </button>
      ) : (
        <div
          className="gen-preview"
          data-cursor-label={comparing ? 'ORIGINAL' : 'HOLD'}
          onPointerDown={() => setComparing(true)}
          onPointerUp={() => setComparing(false)}
          onPointerLeave={() => setComparing(false)}
          onPointerCancel={() => setComparing(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files?.[0]); }}
          title="Hold to see the original"
        >
          <canvas ref={previewRef} className="gen-canvas" role="img" aria-label="Dot matrix version of your image" />
          {comparing && <img src={source.url} alt="Original image" className="gen-original" draggable={false} />}
          <span className="gen-badge">{comparing ? 'Original' : 'Hold to compare'}</span>
        </div>
      )}

      {error && <p className="text-secondary text-xs">{error}</p>}

      <div className="gen-controls">
        <label className="gen-slider">
          <span>Density <b>{opts.cols}</b></span>
          <input type="range" min={24} max={140} step={2} value={opts.cols} onChange={e => set('cols', +e.target.value)} />
        </label>
        <label className="gen-slider">
          <span>Contrast <b>{opts.contrast.toFixed(1)}</b></span>
          <input type="range" min={0.5} max={2.5} step={0.1} value={opts.contrast} onChange={e => set('contrast', +e.target.value)} />
        </label>
      </div>

      <div className="lab-row">
        <button type="button" className={`lab-btn ${opts.shape === 'round' ? 'lab-btn--active' : ''}`} onClick={() => { sfxClick(); set('shape', 'round'); }}>
          ● Round
        </button>
        <button type="button" className={`lab-btn ${opts.shape === 'square' ? 'lab-btn--active' : ''}`} onClick={() => { sfxClick(); set('shape', 'square'); }}>
          ■ Square
        </button>
        <span className="lab-divider" aria-hidden />
        <button type="button" className={`lab-btn ${opts.dark ? 'lab-btn--active' : ''}`} onClick={() => toggle('dark')}>
          Dark bg
        </button>
        <button type="button" className={`lab-btn ${opts.invert ? 'lab-btn--active' : ''}`} onClick={() => toggle('invert')}>
          Invert
        </button>
        {source && (
          <button type="button" className="lab-btn" onClick={() => { sfxClick(); inputRef.current?.click(); }}>
            New image
          </button>
        )}
        <button type="button" className="lab-btn lab-btn--primary lab-btn--push" disabled={!source} onClick={download}>
          ↓ PNG
        </button>
      </div>

      <p className="lab-note">Processed on your device. Your image is never uploaded.</p>
    </div>
  );
}
