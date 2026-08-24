'use client';

import { useEffect, useRef } from 'react';
import { FaExternalLinkAlt, FaRegComment, FaRetweet, FaRegHeart, FaChartBar } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';

interface Role {
  role?: string;
  title?: string;
  description?: string;
  bullets?: string[];
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  website?: string;
}

interface Experience {
  id?: string;
  _id?: string;
  organization?: string;
  company?: string;
  logo?: string;
  website?: string;
  roles: Role[];
}

interface ExperiencesPanelProps {
  experiences?: Experience[];
  data: any;
  loading?: boolean;
}

function CompanyAvatar({ name, logo }: { name: string; logo?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (logo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 48;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.font = `bold 22px "DM Serif Display"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name[0], size / 2, size / 2);
  }, [name, logo]);

  if (logo) {
    return (
      <div className="company-logo" style={{ width: 48, height: 48, overflow: 'hidden', borderRadius: '8px' }}>
        <img src={logo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return <canvas ref={canvasRef} className="company-logo" style={{ borderRadius: '8px', width: 48, height: 48 }} />;
}

function ExperiencePost({ exp, isLastExperience }: { exp: Experience; isLastExperience: boolean }) {
  const org = exp.organization || exp.company || 'Unknown';
  const roles = [...exp.roles].reverse();

  return (
    <div className="company-group">
      {roles.map((role, roleIdx) => {
        const isFirstInCompany = roleIdx === 0;
        const isLastInCompany = roleIdx === roles.length - 1;
        const isLastOverall = isLastExperience && isLastInCompany;

        const roleTitle = role.role || role.title || '';
        const roleDesc = role.description || '';
        const rolePeriod = role.dateRange || `${role.startDate} — ${role.endDate}`;
        const bullets = role.bullets || [];

        return (
          <article key={roleIdx} className={`experience-post ${!isFirstInCompany ? 'sub-role' : ''}`}>
            <div className="thread-aside">
              <div className="thread-avatar-wrap">
                {isFirstInCompany ? (
                  <CompanyAvatar name={org} logo={exp.logo} />
                ) : (
                  <div className="thread-role-dot" />
                )}
              </div>
              <div className={`thread-line-below ${isLastOverall ? 'thread-line--hidden' : ''}`} />
            </div>

            <div className={`thread-content ${!isFirstInCompany ? 'sub-content' : ''}`}>
              <header className="post-header">
                <div className="post-user-info">
                  {isFirstInCompany && <span className="post-name">{org}</span>}
                  {isFirstInCompany && <span className="post-handle">@{org.replace(/\s+/g, '').toLowerCase()}</span>}
                  <span className="post-sep">·</span>
                  <span className="post-time">{rolePeriod}</span>
                </div>
                <button className="post-more" title="View options">
                  <HiDotsHorizontal size={18} />
                </button>
              </header>

              <p className="post-thread-title">{roleTitle}</p>

              <div className="post-body">
                {roleDesc && (
                  <div
                    className="post-text rich-text"
                    dangerouslySetInnerHTML={{ __html: roleDesc }}
                  />
                )}
                {/* Legacy bullets fallback for entries without HTML descriptions */}
                {!roleDesc && bullets.length > 0 && (
                  <ul className="thread-bullets">
                    {bullets.map((bullet, bi) => (
                      <li key={bi} className="thread-bullet">
                        <span className="bullet-text">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="thread-actions">
                <button className="post-action-group" title="Reply">
                  <FaRegComment size={16} />
                </button>
                <button className="post-action-group" title="Repost">
                  <FaRetweet size={18} />
                </button>
                <button className="post-action-group" title="Like">
                  <FaRegHeart size={16} />
                </button>
                <button className="post-action-group" title="View Stats">
                  <FaChartBar size={16} />
                </button>
                {(exp.website || role.website) && (
                  <a href={exp.website || role.website} target="_blank" rel="noopener noreferrer" className="post-action-group" title="Visit Website">
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function ExperiencesPanel({ data, experiences = [], loading = false }: ExperiencesPanelProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="font-dot text-[10px] uppercase tracking-[0.2em] text-secondary">
          Booting System...
        </div>
      </div>
    );
  }

  return (
    <div className="experience-thread" role="list">
      {experiences.map((exp, expIdx) => (
        <ExperiencePost 
          key={exp._id || exp.id || expIdx} 
          exp={exp} 
          isLastExperience={expIdx === experiences.length - 1} 
        />
      ))}
    </div>
  );
}
