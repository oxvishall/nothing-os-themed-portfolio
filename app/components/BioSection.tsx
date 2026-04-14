'use client';

import { useState, useEffect } from 'react';
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
          // Format with 'k' if needed or just use toLocaleString
          const count = d.totalContributions;
          if (count > 1000) {
            setRealtimeContributions(`${(count / 1000).toFixed(1)}k+`);
          } else {
            setRealtimeContributions(count.toLocaleString());
          }
        }
      })
      .catch(() => {}); // Fallback to provided data
  }, [data.handle]);

  return (
    <section className="bio" aria-label="Profile bio">
      {/* Avatar placeholder */}
      <div className="avatar-wrap">
        <div className="avatar" aria-label="Profile avatar">
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="avatar-img"
          />
        </div>
        <a
          href={data.links.find(l => l.label === 'GitHub')?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-follow"
        >
          Follow
        </a>
      </div>

      <h1 className="display-name italic">{data.name}</h1>
      <p className="handle">{data.handle}</p>

      <p className="bio-text">{data.bio}</p>

      <ul className="meta-chips" aria-label="Profile metadata">
        <li>📍 {data.location}</li>
        <li>🔗 <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">{data.website}</a></li>
        <li>Ⓙ Joined {data.joinedYear}</li>
      </ul>

      <div className="stats-row" role="list" aria-label="Profile stats">
        <span role="listitem"><strong>{data.stats.projects}</strong> Projects</span>
        <span role="listitem"><strong>{data.stats.experience}</strong> Experience</span>
        <span role="listitem"><strong>{realtimeContributions || data.stats.contributions}</strong> Contributions</span>
      </div>
    </section>
  );
}
