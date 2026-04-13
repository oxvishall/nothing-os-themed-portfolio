'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsPanel from './panels/ProjectsPanel';
import ExperiencesPanel from './panels/ExperiencesPanel';
import AboutMePanel from './panels/AboutMePanel';
import ToolsPanel from './panels/ToolsPanel';

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'about', label: 'About' },
  { id: 'tools', label: 'Tools' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ProfileTabs({ data }: { data: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') as TabId || 'projects';
  const [active, setActive] = useState<TabId>(initialTab);

  useEffect(() => {
    const tabUrl = searchParams.get('tab') as TabId;
    if (tabUrl && tabUrl !== active) {
      setActive(tabUrl);
    }
  }, [searchParams]);

  const handleTabClick = (id: TabId) => {
    setActive(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <nav 
        className="profile-tabs px-4 flex gap-4 border-b border-border pb-4 overflow-x-auto scrollbar-hide relative" 
        role="tablist"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative font-dot text-[10px] uppercase tracking-widest px-6 py-2.5 transition-colors duration-300 z-10 ${
              active === tab.id ? 'text-background' : 'text-secondary hover:text-primary'
            }`}
          >
            {active === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="tab-content min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {active === 'projects' && <ProjectsPanel data={data} />}
            {active === 'experiences' && <ExperiencesPanel data={data} />}
            {active === 'about' && <AboutMePanel />}
            {active === 'tools' && <ToolsPanel tools={data.tools} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
