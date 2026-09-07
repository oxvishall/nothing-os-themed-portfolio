'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaGithub, FaExternalLinkAlt, FaShareAlt } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import ExpandableText from '@/app/components/ExpandableText';
import { trackProjectLinkClick } from '@/lib/analytics';
import { ArrowUp } from 'lucide-react';
import { sfxScrollTop, sfxClick } from '@/lib/sfx';

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

const API_URL = "/api";

function ProjectMenu({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const liveUrl = project.liveUrl || project.url;
  const sourceUrl = project.sourceUrl || project.githubUrl;

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    }
    setIsOpen(prev => !prev);
    try {
      sfxClick();
    } catch (err) {
      console.warn("SFX error:", err);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=projects&project=${project._id || project.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Project link copied to clipboard!');
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        className="post-more hover:bg-elevated rounded-full transition-colors flex items-center justify-center text-secondary hover:text-primary"
        onClick={openMenu}
        aria-label="More options"
        aria-expanded={isOpen}
      >
        <HiDotsHorizontal size={20} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] pointer-events-auto">
              {/* Invisible backdrop to capture outside clicks safely */}
              <div
                className="fixed inset-0 bg-black/10 backdrop-blur-[0.5px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              />

              {/* Dropdown Menu */}
              <motion.div
                key="project-dropdown"
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  top: menuPos.top,
                  right: menuPos.right,
                }}
                className="w-56 bg-page border border-strong rounded-2xl shadow-2xl overflow-hidden z-[100000]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col p-1.5">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface rounded-xl transition-colors text-[14px] font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        trackProjectLinkClick(project.title || project.name || '', 'live');
                      }}
                    >
                      <FaExternalLinkAlt className="text-tertiary" size={14} />
                      <span>Project Demo</span>
                    </a>
                  )}
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface rounded-xl transition-colors text-[14px] font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        trackProjectLinkClick(project.title || project.name || '', 'github');
                      }}
                    >
                      <FaGithub className="text-tertiary" size={16} />
                      <span>Source Code</span>
                    </a>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface rounded-xl transition-colors text-[14px] font-medium text-left w-full"
                  >
                    <FaShareAlt className="text-tertiary" size={14} />
                    <span>Share Project</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
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
            className="absolute inset-0 w-full h-full object-cover md:grayscale transition-all duration-700 md:group-hover:grayscale-0 group-hover:scale-105" 
          />
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start mb-3 gap-4">
          <h3 className="font-serif text-[21px] font-bold tracking-tight leading-tight flex-1">{title}</h3>
          <ProjectMenu project={project} />
        </div>
        
        <ExpandableText className="text-secondary text-[14px] leading-relaxed mb-4 flex-1 rich-text">
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        </ExpandableText>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md border border-border/50 font-dot text-[8px] uppercase tracking-wider text-secondary bg-elevated/30">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-auto flex items-center gap-1 font-serif text-[18px]">
          <span className="opacity-50 tracking-tighter">{project.year}</span>
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

  return (
    <article
      className="project-post"
      aria-label={title}
      data-project-id={project._id || project.id}
    >
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
            <span className="post-sep">·</span>
            <span className="post-handle">{data.handle}</span>
          </div>
          <ProjectMenu project={project} />
        </header>

        <div className="post-body">
          {title && (
            <p className="post-thread-title">
              {title}
            </p>
          )}
          <ExpandableText className="post-text rich-text">
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          </ExpandableText>
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

        {/* Removed redundant action row as everything is in the dots menu */}
      </div>
    </article>
  );
}

export default function ProjectsPanel({ data, layout = 'list', projects = [], loading = false }: ProjectsPanelProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    sfxScrollTop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
          {projects.map((p, i) => (
            <div key={p._id || p.id || i} className="h-full" data-project-id={p._id || p.id}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
        {showTop && (
          <button
            onClick={scrollTop}
            aria-label="Scroll to top"
            className="md:hidden fixed bottom-6 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="project-feed" role="list">
        {projects.map((p, i) => (
          <div key={p._id || p.id || i} role="listitem" className="post-wrapper" data-project-id={p._id || p.id}>
            <ProjectPost project={p} data={data} />
          </div>
        ))}
      </div>
      {showTop && (
        <button
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="md:hidden fixed bottom-6 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
