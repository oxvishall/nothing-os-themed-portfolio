'use client';

import { useEffect, useRef, useState } from 'react';
import ExpandableText from '@/app/components/ExpandableText';
import FeedSkeleton from '@/app/components/FeedSkeleton';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { trackExperienceExpand } from '@/lib/analytics';
import { ArrowUp } from 'lucide-react';
import { sfxScrollTop } from '@/lib/sfx';

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
                {(role.website || exp.website) && (
                  <a
                    href={role.website || exp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="post-more hover:bg-elevated rounded-full transition-colors flex items-center justify-center text-secondary hover:text-primary"
                    title="Visit Website"
                    onClick={() => trackExperienceExpand(org)}
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                )}
              </header>

              <p className="post-thread-title">{roleTitle}</p>

              <div className="post-body">
                {roleDesc && (
                  <ExpandableText className="post-text rich-text">
                    <div dangerouslySetInnerHTML={{ __html: roleDesc }} />
                  </ExpandableText>
                )}
                {/* Legacy bullets fallback for entries without HTML descriptions */}
                {!roleDesc && bullets.length > 0 && (
                  <ExpandableText>
                    <ul className="thread-bullets">
                      {bullets.map((bullet, bi) => (
                        <li key={bi} className="thread-bullet">
                          <span className="bullet-text">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </ExpandableText>
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
      <FeedSkeleton media={false} />
    );
  }

  return (
    <div className="relative">
      <div className="experience-thread" role="list">
        {experiences.map((exp, expIdx) => (
          <ExperiencePost 
            key={exp._id || exp.id || expIdx} 
            exp={exp} 
            isLastExperience={expIdx === experiences.length - 1} 
          />
        ))}
      </div>

      {/* Mobile-only Scroll to Top FAB */}
      {showTop && (
        <button
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="md:hidden fixed bottom-6 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background shadow-lg transition-transform duration-150 hover:scale-110 active:scale-95"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
