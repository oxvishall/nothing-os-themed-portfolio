'use client';

import { useState, useEffect } from 'react';
import ProjectsPanel from '@/app/components/panels/ProjectsPanel';
import ExperiencesPanel from '@/app/components/panels/ExperiencesPanel';
import AboutMePanel from '@/app/components/panels/AboutMePanel';
import ToolsPanel from '@/app/components/panels/ToolsPanel';
import type { PortfolioData } from '@/app/data/portfolio';

type TabId = 'projects' | 'experiences' | 'about' | 'tools';

const TABS: { id: TabId; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'about', label: 'About' },
  { id: 'tools', label: 'Tools' },
];

interface ProfileTabsProps {
  data: PortfolioData;
}

export default function ProfileTabs({ data }: ProfileTabsProps) {
  const [active, setActive] = useState<TabId>('projects');

  // URL-based deep linking support (stretch goal §13.5)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as TabId | null;
    if (tab && TABS.some(t => t.id === tab)) {
      setActive(tab);
    }
  }, []);

  const handleTabClick = (id: TabId) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <>
      <nav className="profile-tabs" role="tablist" aria-label="Portfolio sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="tab-panels">
        <div
          id="panel-projects"
          role="tabpanel"
          aria-labelledby="tab-projects"
          className={`tab-panel${active === 'projects' ? ' tab-panel--active' : ''}`}
          hidden={active !== 'projects'}
        >
          <ProjectsPanel projects={data.projects} data={data} />
        </div>

        <div
          id="panel-experiences"
          role="tabpanel"
          aria-labelledby="tab-experiences"
          className={`tab-panel${active === 'experiences' ? ' tab-panel--active' : ''}`}
          hidden={active !== 'experiences'}
        >
          <ExperiencesPanel experiences={data.experiences} />
        </div>

        <div
          id="panel-about"
          role="tabpanel"
          aria-labelledby="tab-about"
          className={`tab-panel${active === 'about' ? ' tab-panel--active' : ''}`}
          hidden={active !== 'about'}
        >
          <AboutMePanel />
        </div>

        <div
          id="panel-tools"
          role="tabpanel"
          aria-labelledby="tab-tools"
          className={`tab-panel${active === 'tools' ? ' tab-panel--active' : ''}`}
          hidden={active !== 'tools'}
        >
          <ToolsPanel tools={data.tools} />
        </div>
      </main>
    </>
  );
}
