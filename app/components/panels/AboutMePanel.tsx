'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { GoNorthStar } from "react-icons/go";

export default function AboutMePanel() {
  const githubUsername = "oxvishall";
  const [stats, setStats] = useState<{ lastYear: number; thisYear: number } | null>(null);

  useEffect(() => {
    fetch(`https://github-contributions-api.deno.dev/${githubUsername}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.contributions) {
          const currentYear = new Date().getFullYear().toString();
          let thisYearCount = 0;
          data.contributions.forEach((week: any[]) => {
            week.forEach((day: any) => {
              if (day.date.startsWith(currentYear)) {
                thisYearCount += day.contributionCount;
              }
            });
          });
          setStats({
            lastYear: data.totalContributions,
            thisYear: thisYearCount
          });
        }
      })
      .catch(err => console.error("Could not fetch GitHub stats:", err));
  }, [githubUsername]);

  // Use the B&W color scheme and simply invert the image mathematically in dark mode.
  const chartUrl = `https://ghchart.rshah.org/000000/${githubUsername}`;

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
               <span className="font-dot text-[10px] text-tertiary uppercase tracking-widest">Connecting to GitHub Terminal...</span>
             </div>
          )}
        </div>
        
        <div className="github-frame relative border border-strong rounded-2xl overflow-hidden bg-white dark:bg-black aspect-[4/1] md:aspect-[5/1]">
           {/* Subtle terminal-style scanline effect in dark mode */}
           <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
           
           <div className="relative z-10 w-full h-full flex items-center justify-center p-3 md:p-6">
             <img 
               src={chartUrl} 
               alt="GitHub Contributions" 
               className="w-full h-auto pointer-events-none dark:invert dark:brightness-125 transition-all duration-700"
             />
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
    </div>
  );
}
