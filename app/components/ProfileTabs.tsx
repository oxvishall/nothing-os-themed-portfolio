'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';
import ProjectsPanel from './panels/ProjectsPanel';
import ExperiencesPanel from './panels/ExperiencesPanel';
import AboutMePanel from './panels/AboutMePanel';
import ToolsPanel from './panels/ToolsPanel';
import { trackTabSwitch, trackLayoutToggle } from '@/lib/analytics';

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
  const [layout, setLayout] = useState<'list' | 'grid'>('list');
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch all data once on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [projectsRes, experiencesRes] = await Promise.all([
          fetch('/api/projects').then(res => res.json()),
          fetch('/api/experience').then(res => res.json())
        ]);
        
        if (Array.isArray(projectsRes)) setProjects(projectsRes);
        if (Array.isArray(experiencesRes)) setExperiences(experiencesRes);
      } catch (err) {
        console.error("Critical fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  useEffect(() => {
    const tabUrl = searchParams.get('tab') as TabId;
    if (tabUrl && tabUrl !== active) {
      setActive(tabUrl);
    }
  }, [searchParams, active]);

  // Scroll to a specific project when ?project=<id> is in the URL
  useEffect(() => {
    if (loading) return;
    const projectId = searchParams.get('project');
    if (!projectId || active !== 'projects') return;

    // Give the DOM a tick to render the project list
    const timeout = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-project-id="${projectId}"]`);
      if (!el) return;

      // Scroll element into view
      const elTop = el.getBoundingClientRect().top + window.scrollY;
      const offset = 80; // account for sticky tabs bar height
      window.scrollTo({ top: elTop - offset, behavior: 'smooth' });

      // Brief highlight pulse so the user knows which card was linked
      el.style.transition = 'background 0.3s ease';
      el.style.background = 'var(--bg-elevated)';
      setTimeout(() => {
        el.style.background = '';
      }, 1800);
    }, 300);

    return () => clearTimeout(timeout);
  }, [loading, projects, searchParams, active]);

  const handleTabClick = (id: TabId) => {
    setActive(id);
    trackTabSwitch(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', id);
    router.replace(`?${params.toString()}`, { scroll: false });
    
    // Conditional scroll: Only scroll to the tabs if the user has already scrolled past them
    if (tabsContainerRef.current) {
      const rect = tabsContainerRef.current.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY - 5;
      
      // If we are currently scrolled past the tabs (sticky mode active or deep in content)
      if (window.scrollY > absoluteTop) {
        window.scrollTo({
          top: absoluteTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div ref={tabsContainerRef} className="tabs-anchor" />
      <div 
        className="sticky top-0 z-40 bg-page/90 backdrop-blur-md flex items-center justify-between border-b border-border pr-2 pt-2 -mt-px"
      >
        <nav 
          className="profile-tabs px-4 flex gap-4 pb-4 overflow-x-auto scrollbar-hide relative" 
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

        {active === 'projects' && (
          <div className="hidden md:flex items-center gap-1 pb-4">
            <button 
              onClick={() => { setLayout('list'); trackLayoutToggle('list'); }}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                layout === 'list' 
                  ? 'bg-primary text-background scale-110' 
                  : 'text-secondary hover:text-primary hover:bg-surface'
              }`}
              title="List View"
            >
              <List size={14} />
            </button>
            <button 
              onClick={() => { setLayout('grid'); trackLayoutToggle('grid'); }}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                layout === 'grid' 
                  ? 'bg-primary text-background scale-110' 
                  : 'text-secondary hover:text-primary hover:bg-surface'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="tab-content min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {active === 'projects' && (
              <ProjectsPanel 
                data={data} 
                layout={layout} 
                projects={projects} 
                loading={loading} 
              />
            )}
            {active === 'experiences' && (
              <ExperiencesPanel 
                data={data} 
                experiences={experiences} 
                loading={loading} 
              />
            )}
            {active === 'about' && <AboutMePanel />}
            {active === 'tools' && <ToolsPanel tools={data.tools} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
