'use client';

import { useEffect, useRef } from 'react';
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
            {/* 1. Main Company Header / First Role */}
            <article className="experience-post main-role">
              <div className="thread-aside">
                <div className={`thread-line-above ${expIdx === 0 ? 'thread-line--hidden' : ''}`} />
                <div className="thread-avatar-wrap">
                  <CompanyAvatar name={exp.company} />
                </div>
                <div className={`thread-line-below ${isLastExperience && exp.roles.length === 1 ? 'thread-line--hidden' : ''}`} />
              </div>

              <div className="thread-content">
                <header className="post-header">
                  <div className="post-user-info">
                    <span className="post-name">{exp.company}</span>
                    <span className="post-handle">@{exp.company.replace(/\s+/g, '').toLowerCase()}</span>
                    <span className="post-sep">·</span>
                    <span className="post-time">{exp.roles[0].dateRange.split(' – ')[0]}</span>
                  </div>
                  <button className="post-more">···</button>
                </header>
                
                <p className="post-thread-title">{exp.roles[0].title}</p>
                
                <div className="post-body">
                  <ul className="thread-bullets">
                    {exp.roles[0].bullets.map((bullet, bi) => (
                      <li key={bi} className="thread-bullet">
                        <span className="bullet-text">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="thread-actions">
                  <div className="post-action-group"><span>🗨</span><span className="post-action-count">12</span></div>
                  <div className="post-action-group"><span>⇄</span><span className="post-action-count">2</span></div>
                  <div className="post-action-group"><span>♡</span><span className="post-action-count">24</span></div>
                </div>
              </div>
            </article>

            {/* 2. Sub-roles (Pushed right with nested thread) */}
            {exp.roles.slice(1).map((role, roleIdx) => {
              const isLastInCompany = roleIdx === exp.roles.length - 2;
              const shouldShowLineBelow = !isLastInCompany || !isLastExperience;

              return (
                <article key={roleIdx} className="experience-post sub-role">
                  <div className="thread-aside">
                    <div className="thread-line-above" />
                    <div className="thread-avatar-wrap">
                      <div className="thread-role-dot" />
                    </div>
                    <div className={`thread-line-below ${shouldShowLineBelow ? '' : 'thread-line--hidden'}`} />
                  </div>

                  <div className="thread-content sub-content">
                    <header className="post-header">
                      <div className="post-user-info">
                        <span className="post-time">{role.dateRange}</span>
                      </div>
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
