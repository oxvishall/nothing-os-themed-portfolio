'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/app/data/portfolio';

interface ProjectsPanelProps {
  projects: Project[];
}

function drawProjectThumb(canvas: HTMLCanvasElement, seed: number, isDark: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // Seeded pseudo-random
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };

  ctx.fillStyle = isDark ? '#1a1a1a' : '#ebebeb';
  ctx.fillRect(0, 0, W, H);

  const DOT = Math.floor(rand() * 3) + 3;
  const GAP = Math.floor(rand() * 4) + 4;
  const primary = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.14)';
  const accent = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  for (let x = GAP; x < W; x += GAP + DOT) {
    for (let y = GAP; y < H; y += GAP + DOT) {
      const bright = rand() > 0.7;
      ctx.fillStyle = bright ? primary : accent;
      ctx.beginPath();
      ctx.arc(x, y, DOT / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function ProjectCard({ project }: { project: Project }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = () =>
      document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && mq.matches);

    const draw = () => {
      canvas.width = canvas.offsetWidth || 280;
      canvas.height = Math.round((canvas.width * 9) / 16);
      drawProjectThumb(canvas, project.seed, isDark());
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    mq.addEventListener('change', draw);

    return () => {
      ro.disconnect();
      mo.disconnect();
      mq.removeEventListener('change', draw);
    };
  }, [project.seed]);

  return (
    <article className="project-card" aria-label={project.name}>
      <canvas
        ref={canvasRef}
        className="project-thumb"
        aria-hidden="true"
      />
      <div className="project-body">
        <h2 className="project-name">{project.name}</h2>
        <p className="project-desc">{project.description}</p>
        <div className="tag-row" aria-label="Tech stack">
          {project.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="project-footer">
          <span className="project-year">{project.year}</span>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label={`View ${project.name}`}
            >
              View ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPanel({ projects }: ProjectsPanelProps) {
  return (
    <div className="project-grid" role="list" aria-label="Projects">
      {projects.map(p => (
        <div key={p.id} role="listitem">
          <ProjectCard project={p} />
        </div>
      ))}
    </div>
  );
}
