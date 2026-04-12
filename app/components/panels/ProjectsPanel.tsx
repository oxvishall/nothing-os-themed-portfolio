'use client';

import { useEffect, useRef, useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaShareAlt } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
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

  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };

  ctx.fillStyle = isDark ? '#1a1a1a' : '#ebebeb';
  ctx.fillRect(0, 0, W, H);

  const DOT = 2; // Fixed small dots for premium look
  const GAP = 8;
  const primary = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const accent = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  for (let x = GAP; x < W; x += GAP + DOT) {
    for (let y = GAP; y < H; y += GAP + DOT) {
      const noise = rand();
      if (noise < 0.2) continue; // Sparse look
      ctx.fillStyle = noise > 0.8 ? primary : accent;
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
    const isDark = () => document.documentElement.classList.contains('dark') || (!document.documentElement.classList.contains('light') && mq.matches);

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
    return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener('change', draw); };
  }, [project.seed]);

  return (
    <article className="project-post" aria-label={project.name}>
      <div className="post-avatar-col">
        <div className="post-avatar">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="" className="post-avatar-img" />
          ) : (
            <span className="avatar-initials">{data.name.charAt(0)}</span>
          )}
        </div>
      </div>

      <div className="post-content">
        <header className="post-header">
          <div className="post-user-info">
            <span className="post-name">{data.name}</span>
            <span className="post-handle">{data.handle}</span>
            <span className="post-sep">·</span>
            <span className="post-time">{project.year}</span>
          </div>
          <button className="post-more" aria-label="More options">
            <HiDotsHorizontal size={18} />
          </button>
        </header>

        <div className="post-body">
          <p className="post-text">
            <strong>{project.name}</strong> — {project.description}
          </p>
          <div className="post-media">
            <canvas ref={canvasRef} className="post-canvas" aria-hidden="true" />
            <div className="post-hashtags">
              {project.tags.map(tag => (
                <span key={tag} className="post-hashtag">#{tag.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="post-actions project-redirection">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="post-action-group" title="External Website">
              <FaExternalLinkAlt size={16} className="post-action-icon" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="post-action-group" title="View Source on GitHub">
              <FaGithub size={18} className="post-action-icon" />
            </a>
          )}
          <button className="post-action-group" title="Share Project">
            <FaShareAlt size={16} className="post-action-icon" />
          </button>
          <div className="post-action-group">
            <div className="post-action-dummy-space" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPanel({ projects, data }: ProjectsPanelProps) {
  return (
    <div className="project-feed" role="list">
      {projects.map(p => (
        <div key={p.id} role="listitem" className="post-wrapper">
          <ProjectPost project={p} data={data} />
        </div>
      ))}
    </div>
  );
}
