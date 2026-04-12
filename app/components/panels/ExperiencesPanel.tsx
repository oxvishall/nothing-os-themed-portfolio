import type { Experience } from '@/app/data/portfolio';

interface ExperiencesPanelProps {
  experiences: Experience[];
}

export default function ExperiencesPanel({ experiences }: ExperiencesPanelProps) {
  return (
    <div className="experiences-list" aria-label="Work experiences">
      {experiences.map((exp, i) => (
        <article key={i} className="experience-item" aria-label={`${exp.role} at ${exp.company}`}>
          <div className="experience-line-wrap">
            <div className="experience-dot" aria-hidden="true" />
            {i < experiences.length - 1 && <div className="experience-line" aria-hidden="true" />}
          </div>
          <div className="experience-content">
            <header className="experience-header">
              <h2 className="experience-company">{exp.company}</h2>
              <div className="experience-meta">
                <span className="experience-role">{exp.role}</span>
                <span className="experience-sep" aria-hidden="true">·</span>
                <span className="experience-dates">{exp.dateRange}</span>
              </div>
            </header>
            <ul className="experience-bullets">
              {exp.bullets.map((bullet, bi) => (
                <li key={bi}>{bullet}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
