'use client';

import { useState, useRef, useCallback } from 'react';
import type { Tool } from '@/app/data/portfolio';

interface ToolsPanelProps {
  tools: Tool[];
}

// NDot Image Generator — dot-matrix-ify any uploaded image
function NdotGenerator() {
  const [dotSize, setDotSize] = useState(6);
  const [gap, setGap] = useState(2);
  const [mono, setMono] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const srcCanvasRef = useRef<HTMLCanvasElement>(null);
  const outCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dotMatrixify = useCallback(() => {
    const srcCanvas = srcCanvasRef.current;
    const outCanvas = outCanvasRef.current;
    if (!srcCanvas || !outCanvas) return;

    const src = srcCanvas.getContext('2d');
    const out = outCanvas.getContext('2d');
    if (!src || !out) return;

    const W = outCanvas.width;
    const H = outCanvas.height;
    const step = dotSize + gap;
    const isDark = document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    out.clearRect(0, 0, W, H);
    out.fillStyle = isDark ? '#0a0a0a' : '#ffffff';
    out.fillRect(0, 0, W, H);

    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        const px = src.getImageData(
          Math.floor((x * srcCanvas.width) / W),
          Math.floor((y * srcCanvas.height) / H),
          1, 1
        ).data;
        const [r, g, b, a] = px;
        if (a < 20) continue;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const radius = (dotSize / 2) * (1 - lum * 0.8);
        if (radius < 0.5) continue;
        out.beginPath();
        out.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
        out.fillStyle = mono
          ? (isDark
            ? `rgba(240,240,240,${0.3 + lum * 0.7})`
            : `rgba(15,15,15,${0.3 + (1 - lum) * 0.7})`)
          : `rgba(${r},${g},${b},${a / 255})`;
        out.fill();
      }
    }
  }, [dotSize, gap, mono]);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const srcCanvas = srcCanvasRef.current;
        const outCanvas = outCanvasRef.current;
        if (!srcCanvas || !outCanvas) return;

        // Scale down for performance
        const maxDim = 600;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const W = Math.round(img.width * scale);
        const H = Math.round(img.height * scale);

        srcCanvas.width = W;
        srcCanvas.height = H;
        srcCanvas.getContext('2d')?.drawImage(img, 0, 0, W, H);

        outCanvas.width = W;
        outCanvas.height = H;

        setHasImage(true);
        dotMatrixify();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [dotMatrixify]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleDownload = useCallback(() => {
    const canvas = outCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ndot-output.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, []);

  return (
    <div className="ndot-generator" aria-label="NDot Image Generator">
      <div className="ndot-header">
        <h2 className="ndot-title">NDot Generator</h2>
        <p className="ndot-subtitle">Transform any image into Nothing&rsquo;s dot-matrix aesthetic</p>
      </div>

      {/* Hidden source canvas */}
      <canvas ref={srcCanvasRef} style={{ display: 'none' }} aria-hidden="true" />

      {/* Drop zone */}
      <div
        className={`ndot-dropzone${isDragging ? ' ndot-dropzone--active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload image drop zone"
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id="ndot-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Upload image file"
        />
        {hasImage ? (
          <canvas ref={outCanvasRef} className="ndot-output" aria-label="Dot-matrix output" />
        ) : (
          <div className="ndot-placeholder">
            <span className="ndot-icon">◻</span>
            <span>Drop an image or click to upload</span>
            <span className="ndot-hint">PNG, JPG, WebP supported</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="ndot-controls" aria-label="Generator controls">
        <div className="ndot-control-row">
          <label htmlFor="dot-size-slider" className="ndot-label">
            Dot Size <span className="ndot-value">{dotSize}px</span>
          </label>
          <input
            id="dot-size-slider"
            type="range"
            min={4}
            max={16}
            value={dotSize}
            onChange={(e) => { setDotSize(Number(e.target.value)); if (hasImage) dotMatrixify(); }}
            className="ndot-slider"
          />
        </div>

        <div className="ndot-control-row">
          <label htmlFor="gap-slider" className="ndot-label">
            Gap <span className="ndot-value">{gap}px</span>
          </label>
          <input
            id="gap-slider"
            type="range"
            min={1}
            max={8}
            value={gap}
            onChange={(e) => { setGap(Number(e.target.value)); if (hasImage) dotMatrixify(); }}
            className="ndot-slider"
          />
        </div>

        <div className="ndot-toggle-row">
          <button
            id="mono-toggle"
            className={`ndot-pill${mono ? ' ndot-pill--active' : ''}`}
            onClick={() => { setMono(true); if (hasImage) dotMatrixify(); }}
            aria-pressed={mono}
          >
            Mono
          </button>
          <button
            id="color-toggle"
            className={`ndot-pill${!mono ? ' ndot-pill--active' : ''}`}
            onClick={() => { setMono(false); if (hasImage) dotMatrixify(); }}
            aria-pressed={!mono}
          >
            Color
          </button>
        </div>

        {hasImage && (
          <button
            id="ndot-download-btn"
            className="ndot-download"
            onClick={handleDownload}
            aria-label="Download dot-matrix image as PNG"
          >
            Download PNG ↓
          </button>
        )}
      </div>
    </div>
  );
}

export default function ToolsPanel({ tools }: ToolsPanelProps) {
  const categories = [...new Set(tools.map(t => t.category))];

  return (
    <div className="tools-panel">
      <div className="tools-grid" aria-label="Tools and skills">
        {categories.map(cat => (
          <div key={cat} className="tools-category">
            <h3 className="tools-cat-label">{cat}</h3>
            <div className="tools-badges">
              {tools.filter(t => t.category === cat).map(tool => (
                <span key={tool.name} className="tool-badge" title={tool.name}>
                  <span className="tool-icon" aria-hidden="true">{tool.icon}</span>
                  <span className="tool-name">{tool.name}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ndot-section">
        <NdotGenerator />
      </div>
    </div>
  );
}
