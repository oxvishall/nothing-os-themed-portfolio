'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';
import { HiDotsVertical } from 'react-icons/hi';
import type { PortfolioData } from '@/app/data/portfolio';
import ImageLightbox from './ImageLightbox';

interface BioSectionProps {
  data: PortfolioData;
}

export default function BioSection({ data }: BioSectionProps) {
  const [realtimeContributions, setRealtimeContributions] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/github-stats')
      .then(res => res.json())
      .then(d => {
        const count = d?.lastYear;
        if (typeof count === 'number') {
          setRealtimeContributions(
            count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k+` : count.toLocaleString(),
          );
        }
      })
      .catch(() => {});

    fetch('https://api.github.com/repos/oxvishall/nothing-os-themed-portfolio')
      .then(res => res.json())
      .then(d => {
        if (typeof d?.stargazers_count === 'number') {
          setStarCount(d.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <>
      <section className="bio" aria-label="Profile bio">
        <div className="avatar-wrap">
          {/* Clickable avatar */}
          <button
            className="avatar group relative"
            onClick={() => setAvatarOpen(true)}
            aria-label="View profile picture"
          >
            <img src={data.avatarUrl} alt={data.name} className="avatar-img" />
            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-dot font-bold tracking-widest uppercase">View</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/oxvishall/nothing-os-themed-portfolio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-follow h-10 px-4 flex items-center gap-2 justify-center mb-0 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
              title="Star repository on GitHub"
            >
              <Star size={15} className="fill-current text-amber-400 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-dot text-[13px] font-bold tracking-widest">
                {starCount !== null ? starCount : 'STAR'}
              </span>
            </a>
            <button 
              onClick={toggleSidebar}
              className="lg:hidden h-10 w-10 flex items-center justify-center border border-strong rounded-full text-secondary hover:text-primary hover:bg-surface transition-all"
              aria-label="Toggle Sidebar"
            >
              <HiDotsVertical size={20} />
            </button>
          </div>
        </div>

        <h1 className="display-name italic">{data.name}</h1>
        <p className="handle">{data.handle}</p>

        <p className="bio-text">{data.bio}</p>

        <ul className="meta-chips" aria-label="Profile metadata">
          <li className="flex items-center gap-1.5 opacity-70">
            <MapPin size={14} className="text-secondary" />
            <span>{data.location}</span>
          </li>
          <li className="flex items-center gap-1.5 opacity-70">
            <Calendar size={14} className="text-secondary" />
            <span>Joined 2023</span>
          </li>
        </ul>

        <div className="stats-row" role="list" aria-label="Profile stats">
          <span role="listitem"><strong>{data.stats.projects}</strong> Projects</span>
          <span role="listitem"><strong>{data.stats.experience}</strong> Experience</span>
          <span role="listitem"><strong>{realtimeContributions || data.stats.contributions}</strong> Contributions</span>
        </div>
      </section>

      {/* Avatar lightbox */}
      <ImageLightbox
        src={data.avatarUrl}
        alt={`${data.name}'s profile picture`}
        isOpen={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        shape="circle"
      />
    </>
  );
}
