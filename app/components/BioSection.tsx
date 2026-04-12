import type { PortfolioData } from '@/app/data/portfolio';

interface BioSectionProps {
  data: PortfolioData;
}

export default function BioSection({ data }: BioSectionProps) {
  const totalContributions = data.contributions.length;

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

      <h1 className="display-name">{data.name}</h1>
      <p className="handle">{data.handle}</p>

      <p className="bio-text">{data.bio}</p>

      <ul className="meta-chips" aria-label="Profile metadata">
        <li>📍 {data.location}</li>
        <li>🔗 <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer">{data.website}</a></li>
        <li>Ⓙ Joined {data.joinedYear}</li>
      </ul>

      <div className="stats-row" role="list" aria-label="Profile stats">
        <span role="listitem"><strong>{data.projects.length}</strong> Projects</span>
        <span role="listitem"><strong>{data.experiences.length}</strong> Experiences</span>
        <span role="listitem"><strong>{totalContributions}</strong> Contributions</span>
      </div>
    </section>
  );
}
