'use client';

import { useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaShareAlt } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';

interface Project {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  description: string;
  year?: number;
  tags: string[];
  url?: string;
  liveUrl?: string;
  githubUrl?: string;
  sourceUrl?: string;
  seed?: number;
  image?: string;
}

interface ProjectsPanelProps {
  projects?: Project[];
  data: any;
  layout?: 'list' | 'grid';
  loading?: boolean;
}

function drawProjectThumb(canvas: HTMLCanvasElement, seed: number | undefined, isDark: boolean, hasImage: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = isDark ? '#141414' : '#f0f2f5'; 
  ctx.fillRect(0, 0, W, H);

  const GAP = 10;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  for (let x = GAP; x < W; x += GAP) {
    for (let y = GAP; y < H; y += GAP) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function ProjectCard({ project }: { project: Project }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const title = project.title || project.name;
  const liveUrl = project.liveUrl || project.url;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isDark = document.documentElement.classList.contains('dark');
    
    const draw = () => {
      canvas.width = canvas.offsetWidth || 400;
      canvas.height = Math.round((canvas.width * 9) / 16);
      drawProjectThumb(canvas, project.seed, isDark, !!project.image);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [project.seed]);

  return (
    <div className="project-card flex flex-col bg-surface border border-strong rounded-[24px] overflow-hidden h-full group transition-all duration-500 hover:bg-elevated/20 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/5">
      <div className="aspect-[16/9] relative overflow-hidden bg-page border-b border-strong">
        <canvas ref={canvasRef} className="w-full h-full block" />
        {project.image && (
          <img 
            src={project.image} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" 
          />
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[21px] mb-3 tracking-tight">{title}</h3>
        <p className="text-secondary text-[14px] leading-relaxed mb-4 flex-1 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md border border-border/50 font-dot text-[8px] uppercase tracking-wider text-secondary bg-elevated/30">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex items-center gap-1 font-serif text-[18px]">
          <span className="opacity-50 tracking-tighter">{project.year}</span>
          <a 
            href={liveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:italic hover:translate-x-0.5 transition-all text-primary"
          >
            View ↗
          </a>
        </div>
      </div>
    </div>
  );
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
      drawProjectThumb(canvas, project.seed, isDark(), !!project.image);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    mq.addEventListener('change', draw);
    return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener('change', draw); };
  }, [project.seed]);

  const title = project.title || project.name;
  const liveUrl = project.liveUrl || project.url;
  const sourceUrl = project.sourceUrl || project.githubUrl;

  return (
    <article className="project-post" aria-label={title}>
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
            <span className="post-time">{project.year || '2024'}</span>
          </div>
          <button className="post-more" aria-label="More options">
            <HiDotsHorizontal size={18} />
          </button>
        </header>

        <div className="post-body">
          <p className="post-text">
            <strong>{title}</strong> — {project.description}
          </p>
          <div className="post-media">
            <canvas ref={canvasRef} className="post-canvas" aria-hidden="true" />
            {project.image && (
              <div className="post-media-inner">
                <img src={project.image} alt="" className="post-media-img" aria-hidden="true" />
                <div className="post-hashtags">
                  {project.tags.map(tag => (
                    <span key={tag} className="post-hashtag">#{tag.replace(/\s+/g, '')}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="post-actions project-redirection">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="post-action-group" title="External Website">
              <FaExternalLinkAlt size={16} className="post-action-icon" />
            </a>
          )}
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="post-action-group" title="View Source on GitHub">
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

export default function ProjectsPanel({ data, layout = 'list', projects = [], loading = false }: ProjectsPanelProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="font-dot text-[10px] uppercase tracking-[0.2em] text-secondary">
          Booting System...
        </div>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
        {projects.map((p, i) => (
          <div key={p._id || p.id || i} className="h-full">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="project-feed" role="list">
      {projects.map((p, i) => (
        <div key={p._id || p.id || i} role="listitem" className="post-wrapper">
          <ProjectPost project={p} data={data} />
        </div>
      ))}
    </div>
  );
}
