'use client';

import { useEffect, useRef } from 'react';
import { FaExternalLinkAlt, FaRegComment, FaRetweet, FaRegHeart, FaChartBar } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import type { Experience, Role } from '@/app/data/portfolio';

interface ExperiencesPanelProps {
  experiences: Experience[];
}

function CompanyAvatar({ name }: { name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
  }, [name]);

  return <canvas ref={canvasRef} className="company-logo" style={{ borderRadius: '8px' }} />;
}

export default function ExperiencesPanel({ experiences }: ExperiencesPanelProps) {
  return (
    <div className="experience-thread" role="list">
      {experiences.map((exp, expIdx) => {
        const isLastExperience = expIdx === experiences.length - 1;

        return (
          <div key={expIdx} className="company-group">
            {exp.roles.map((role, roleIdx) => {
              const isFirstInCompany = roleIdx === 0;
              const isLastInCompany = roleIdx === exp.roles.length - 1;
              const isFirstOverall = expIdx === 0 && isFirstInCompany;
              const isLastOverall = isLastExperience && isLastInCompany;

              return (
                <article key={roleIdx} className={`experience-post ${!isFirstInCompany ? 'sub-role' : ''}`}>
                  <div className="thread-aside">
                    <div className={`thread-line-above ${isFirstOverall ? 'thread-line--hidden' : ''}`} />
                    <div className="thread-avatar-wrap">
                      {isFirstInCompany ? (
                        <CompanyAvatar name={exp.company} />
                      ) : (
                        <div className="thread-role-dot" />
                      )}
                    </div>
                    <div className={`thread-line-below ${isLastOverall ? 'thread-line--hidden' : ''}`} />
                  </div>

                  <div className={`thread-content ${!isFirstInCompany ? 'sub-content' : ''}`}>
                    <header className="post-header">
                      <div className="post-user-info">
                        {isFirstInCompany && <span className="post-name">{exp.company}</span>}
                        {isFirstInCompany && <span className="post-handle">@{exp.company.replace(/\s+/g, '').toLowerCase()}</span>}
                        <span className="post-sep">·</span>
                        <span className="post-time">{role.dateRange}</span>
                      </div>
                      <button className="post-more" title="View options">
                        <HiDotsHorizontal size={18} />
                      </button>
                    </header>
                    
                    <p className="post-thread-title">{role.title}</p>
                    
                    <div className="post-body">
                      <ul className="thread-bullets">
                        {role.bullets.map((bullet, bi) => (
                          <li key={bi} className="thread-bullet">
                            <span className="bullet-text">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="thread-actions">
                      <button className="post-action-group" title="Reply">
                        <FaRegComment size={16} />
                      </button>
                      <button className="post-action-group" title="Repost">
                        <FaRetweet size={16} />
                      </button>
                      <button className="post-action-group" title="Like">
                        <FaRegHeart size={16} />
                      </button>
                      <button className="post-action-group" title="View Stats">
                        <FaChartBar size={16} />
                      </button>
                      <a href="#" className="post-action-group" title="Visit Company Website">
                        <FaExternalLinkAlt size={14} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
