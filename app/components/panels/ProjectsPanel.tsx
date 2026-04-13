'use client';

import { useEffect, useRef, useState } from 'react';
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
  projects: Project[];
  data: any; // Portfolio data
}

const API_URL = "/api";

function drawProjectThumb(canvas: HTMLCanvasElement, seed: number | undefined, isDark: boolean, hasImage: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  let s = seed || 42;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };

  ctx.clearRect(0, 0, W, H);
  
  // Outer frame background - slightly lighter than page in dark mode for visibility
  ctx.fillStyle = isDark ? '#1e1e1e' : '#f0fafe'; 
  ctx.fillRect(0, 0, W, H);

  const GAP = 10;
  
  // Grid opacity - significantly brighter in dark mode for visibility
  const dotColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.1)';

  for (let x = GAP; x < W; x += GAP) {
    for (let y = GAP; y < H; y += GAP) {
      ctx.fillStyle = dotColor;
      ctx.fillRect(x, y, 1, 1);
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

export default function ProjectsPanel({ projects: initialProjects, data }: ProjectsPanelProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then(res => res.json())
      .then(apiProjects => {
        console.log("API Projects:", apiProjects);
        if (Array.isArray(apiProjects)) {
          setProjects(apiProjects);
        }
      })
      .catch(err => console.error("Failed to fetch API projects:", err));
  }, []);

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
