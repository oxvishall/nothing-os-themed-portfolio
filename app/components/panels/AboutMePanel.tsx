'use client';

import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { GoNorthStar } from "react-icons/go";

export default function AboutMePanel() {
  const githubUsername = "oxvishall";
  const chartUrl = `https://ghchart.rshah.org/0f0f0f/${githubUsername}`;

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
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="font-dot text-[10px] text-tertiary tracking-widest uppercase block mb-1">Live Activity</span>
            <h3 className="font-serif text-2xl">GITHUB METRICS</h3>
          </div>
          <a 
            href={`https://github.com/${githubUsername}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-dot uppercase tracking-widest text-secondary hover:text-primary transition-colors px-3 py-1 border border-border rounded-full"
          >
            @{githubUsername} ↗
          </a>
        </div>
        
        <div className="github-frame relative border border-border rounded-2xl overflow-hidden bg-black aspect-[4/1] md:aspect-[5/1]">
           {/* Dot-matrix style background for the chart frame */}
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
             backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.5px, transparent 0.5px)',
             backgroundSize: '10px 10px'
           }} />
           <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
             <img 
               src={chartUrl} 
               alt="GitHub Contributions" 
               className="w-full h-auto filter invert brightness-200 pointer-events-none"
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
