'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { GoNorthStar } from "react-icons/go";

type GhDay = { date: string; count: number; level: number };
type GhStats = { thisYear: number; lastYear: number; days: GhDay[] };

function ContributionGraph({ days }: { days: GhDay[] }) {
  const weeks: GhDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="gh-graph" aria-label="GitHub contribution graph">
      {weeks.map((week, wi) => (
        <div className="gh-week" key={wi}>
          {week.map(day => (
            <span
              key={day.date}
              className={`gh-cell gh-cell--${day.level}`}
              title={`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AboutMePanel() {
  const githubUsername = "oxvishall";
  const [stats, setStats] = useState<GhStats | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    fetch('/api/github-stats')
      .then(res => {
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.days)) {
          setStats({ thisYear: data.thisYear, lastYear: data.lastYear, days: data.days });
        } else {
          setStatsError(true);
        }
      })
      .catch(() => setStatsError(true));
  }, []);

  return (
    <div className="about-me-panel">
      {/* Bio / Intro "Post" */}
      <div className="post-wrapper border-t-0 hover:bg-transparent">
        <div className="p-6 md:p-8">
          <p className="text-secondary text-lg leading-relaxed mb-6 font-sans">
            Building decentralized futures at the intersection of design and code. 
            I am a <span className="text-primary font-medium">Full-stack Developer</span> specializing in high-fidelity 
            MERN applications and intuitive Web3 interfaces.
          </p>
          <p className="text-secondary text-lg leading-relaxed font-sans">
            I bridge the gap between <span className="italic font-serif text-primary">blockchain innovation</span> and 
            user experience. By crafting accessible dApps, I translate complex protocols into 
            seamless digital interactions.
          </p>
        </div>
      </div>

      {/* Details Grid - Matching Sidebar Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-y border-border divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6 flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-tertiary group-hover:text-primary transition-colors">
            <FaMapMarkerAlt size={18} />
          </div>
          <div>
            <span className="block font-dot text-[10px] text-tertiary uppercase tracking-widest leading-none mb-1">Based in</span>
            <span className="text-primary font-medium text-sm">Chennai, India</span>
          </div>
        </div>

        <div className="p-6 flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-tertiary group-hover:text-primary transition-colors">
            <FaBriefcase size={18} />
          </div>
          <div>
            <span className="block font-dot text-[10px] text-tertiary uppercase tracking-widest leading-none mb-1">Status</span>
            <span className="text-primary font-medium text-sm">Available for Roles</span>
          </div>
        </div>
      </div>

      {/* GitHub Section - Framed like Project Media */}
      <div className="p-6 md:p-8">
        {/* Section Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <span className="font-dot text-[10px] text-tertiary tracking-widest uppercase block mb-1 opacity-70">Archive Terminal</span>
            <h3 className="font-serif text-3xl tracking-tight text-primary leading-tight">GITHUB ACTIVITY</h3>
          </div>
          <a 
            href={`https://github.com/${githubUsername}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 text-[10px] font-dot uppercase tracking-tighter text-secondary hover:text-primary transition-all px-4 py-2 border border-strong rounded-full bg-surface/50 hover:bg-surface"
          >
            @{githubUsername} ↗
          </a>
        </div>

        {/* Stats Multi-Column */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats ? (
            <>
              <div className="p-5 bg-surface/30 border border-strong rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-dot text-[9px] text-tertiary uppercase tracking-widest mb-2">Year to Date</span>
                <span className="font-serif text-3xl text-primary leading-none">
                  {stats.thisYear.toLocaleString()}
                </span>
                <span className="mt-2 font-dot text-[10px] text-primary/40 uppercase tracking-widest">Commits</span>
              </div>
              <div className="p-5 bg-surface/30 border border-strong rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="font-dot text-[9px] text-tertiary uppercase tracking-widest mb-2">Last 365 Days</span>
                <span className="font-serif text-3xl text-primary leading-none">
                  {stats.lastYear.toLocaleString()}
                </span>
                <span className="mt-2 font-dot text-[10px] text-primary/40 uppercase tracking-widest">Total</span>
              </div>
            </>
          ) : (
             <div className="col-span-2 py-8 text-center bg-surface/30 border border-strong border-dashed rounded-2xl animate-pulse">
               <span className="font-dot text-[10px] text-tertiary uppercase tracking-widest">
                 {statsError ? 'GitHub terminal offline' : 'Connecting to GitHub Terminal...'}
               </span>
             </div>
          )}
        </div>
        
        <div className="github-frame relative border border-strong rounded-2xl overflow-hidden">
           <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
           
           <div className="relative z-10 w-full flex items-center justify-center p-3 md:p-6 overflow-x-auto">
             {stats ? (
               <ContributionGraph days={stats.days} />
             ) : (
               <span className="font-dot text-[10px] text-tertiary uppercase tracking-widest py-8">
                 {statsError ? 'Graph unavailable' : 'Loading graph...'}
               </span>
             )}
           </div>
        </div>
      </div>

      {/* CTA Section - Simplified & Brutalist */}
      <div className="p-6 md:p-8 border-t border-border">
        <div className="bg-primary text-background p-10 rounded-[2rem] text-center relative overflow-hidden group">
          <div className="relative z-10">
            <GoNorthStar className="mx-auto mb-6 text-background/40 group-hover:text-background transition-all duration-700 animate-spin-slow" size={40} />
            <h3 className="text-3xl md:text-4xl font-serif mb-3">Let&apos;s build the future.</h3>
            <p className="text-background/70 mb-8 max-w-sm mx-auto font-sans tracking-tight">
              Open for interesting projects, decentralized collaborations, or just a quick brainstorm.
            </p>
            <a 
              href="mailto:dev.vishalaakash@gmail.com" 
              className="inline-flex items-center gap-2 bg-background text-primary px-8 py-3 rounded-full font-bold text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform"
            >
              Get in Touch <HiOutlineMail size={16} />
            </a>
          </div>
          {/* Subtle noise/grain texture would go here */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>

      <style>{`
        .github-frame { background: var(--bg-page); }
        .gh-graph {
          display: flex;
          gap: 3px;
          width: max-content;
          margin: 0 auto;
        }
        .gh-week {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .gh-cell {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          background: var(--text-primary);
        }
        .gh-cell--0 { opacity: 0.1; }
        .gh-cell--1 { opacity: 0.32; }
        .gh-cell--2 { opacity: 0.52; }
        .gh-cell--3 { opacity: 0.74; }
        .gh-cell--4 { opacity: 1; }
        @media (max-width: 640px) {
          .gh-cell { width: 7px; height: 7px; }
          .gh-graph, .gh-week { gap: 2px; }
        }
      `}</style>
    </div>
  );
}
