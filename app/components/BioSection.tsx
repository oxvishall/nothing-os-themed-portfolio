'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { HiDotsVertical } from 'react-icons/hi';
import type { PortfolioData } from '@/app/data/portfolio';

interface BioSectionProps {
  data: PortfolioData;
}

export default function BioSection({ data }: BioSectionProps) {
  const [realtimeContributions, setRealtimeContributions] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://github-contributions-api.deno.dev/${data.handle.replace('@', '')}.json`)
      .then(res => res.json())
      .then(d => {
        if (d && d.totalContributions) {
          const count = d.totalContributions;
          if (count > 1000) {
            setRealtimeContributions(`${(count / 1000).toFixed(1)}k+`);
          } else {
            setRealtimeContributions(count.toLocaleString());
          }
        }
      })
      .catch(() => {}); 
  }, [data.handle]);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <section className="bio" aria-label="Profile bio">
      <div className="avatar-wrap">
        <div className="avatar" aria-label="Profile avatar">
          <img src={data.avatarUrl} alt={data.name} className="avatar-img" />
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={data.links.find(l => l.label === 'GitHub')?.url ?? '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-follow h-10 flex items-center justify-center mb-0"
          >
            Follow
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
  );
}
