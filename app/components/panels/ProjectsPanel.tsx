'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/app/data/portfolio';

interface ProjectsPanelProps {
  projects: Project[];
  data: any; // Portfolio data
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

function ProjectPost({ project, data }: { project: Project; data: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = () =>
      document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') && mq.matches);

    const draw = () => {
      canvas.width = canvas.offsetWidth || 500;
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
    <article className="project-post" aria-label={project.name}>
      {/* Post-style Avatar */}
      <div className="post-avatar-col">
        <div className="post-avatar">
          <img src={data.avatarUrl} alt="" className="post-avatar-img" />
        </div>
      </div>

      <div className="post-content">
        {/* Post Metadata */}
        <header className="post-header">
          <div className="post-user-info">
            <span className="post-name">{data.name}</span>
            <span className="post-handle">{data.handle}</span>
            <span className="post-sep">·</span>
            <span className="post-time">{project.year}</span>
          </div>
          <button className="post-more" aria-label="More options">···</button>
        </header>

        {/* Post Body */}
        <div className="post-body">
          <p className="post-text">
            <strong>{project.name}</strong> — {project.description}
          </p>
          
          {/* Post Image (Canvas) */}
          <div className="post-media">
            <canvas
              ref={canvasRef}
              className="post-canvas"
              aria-hidden="true"
            />
            {/* Tags as Hashtags inside/on the image */}
            <div className="post-hashtags">
              {project.tags.map(tag => (
                <span key={tag} className="post-hashtag">#{tag.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Post Actions (Simulation) */}
        <div className="post-actions">
          <div className="post-action-group">
            <span className="post-action-icon">⬀</span>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="post-action-link">
                View Project
              </a>
            )}
          </div>
          <div className="post-action-group">
            <span className="post-action-icon">⌥</span>
            <span className="post-action-count">GitHub</span>
          </div>
          <div className="post-action-group">
            <span className="post-action-icon">✧</span>
            <span className="post-action-count">Details</span>
          </div>
          <div className="post-action-group">
            <span className="post-action-icon">□</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPanel({ projects, data }: ProjectsPanelProps) {
  return (
    <div className="project-feed" role="list" aria-label="Projects Feed">
      {projects.map(p => (
        <div key={p.id} role="listitem" className="post-wrapper">
          <ProjectPost project={p} data={data} />
        </div>
      ))}
    </div>
  );
}
