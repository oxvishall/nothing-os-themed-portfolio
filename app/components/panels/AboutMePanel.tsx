'use client';

import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { GoNorthStar } from "react-icons/go";

export default function AboutMePanel() {
  const githubUsername = "oxvishall";
  const chartUrl = `https://ghchart.rshah.org/0f0f0f/${githubUsername}`;

  return (
    <div className="about-me-panel">
      {/* Intro Section */}
      <section className="about-intro mb-10">
        <h2 className="font-serif text-3xl mb-4">About Me</h2>
        <p className="text-secondary text-lg leading-relaxed mb-6">
          Hey, I&apos;m <span className="text-primary font-medium">Vishal Aakash</span>. 
          A full-stack developer (MERN) with a focus on building user-friendly front-ends 
          using ReactJS, Next.js, and Tailwind CSS.
        </p>
        <p className="text-secondary text-lg leading-relaxed">
          I bridge the gap between <span className="italic font-serif">blockchain innovation</span> and user experience. 
          By crafting intuitive interfaces for decentralized applications, making the complex world 
          of Web3 accessible to everyone.
        </p>
      </section>

      {/* GitHub Chart */}
      <section className="about-github mb-10">
        <header className="flex justify-between items-center mb-4">
          <h3 className="font-dot text-[10px] tracking-widest uppercase text-tertiary">GitHub Contributions</h3>
          <a 
            href={`https://github.com/${githubUsername}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-dot uppercase tracking-tighter hover:text-primary transition-colors"
          >
            @{githubUsername} →
          </a>
        </header>
        <div className="github-chart-wrap bg-surface border border-border p-4 rounded-2xl overflow-hidden">
          <img 
            src={chartUrl} 
            alt="GitHub Contributions" 
            className="w-full h-auto filter dark:invert"
          />
        </div>
      </section>

      {/* Bio Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4 group hover:border-primary transition-colors">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
            <FaMapMarkerAlt size={18} />
          </div>
          <div>
            <span className="block font-dot text-[10px] text-secondary uppercase tracking-widest">Based in</span>
            <span className="text-primary font-medium">Chennai, India</span>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4 group hover:border-primary transition-colors">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
            <FaBriefcase size={18} />
          </div>
          <div>
            <span className="block font-dot text-[10px] text-secondary uppercase tracking-widest">Availability</span>
            <span className="text-primary font-medium">Actively looking for roles</span>
          </div>
        </div>
      </div>

      {/* Connect CTA */}
      <section className="about-connect bg-primary text-background p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <GoNorthStar className="mx-auto mb-4 animate-spin-slow opacity-50" size={32} />
          <h3 className="text-2xl font-serif mb-2">Let&apos;s build the future together.</h3>
          <p className="opacity-80 mb-6">I&apos;m always open to discussing new projects and opportunities.</p>
          <div className="flex justify-center gap-4">
            <a 
              href="mailto:dev.vishalaakash@gmail.com" 
              className="bg-background text-primary px-6 py-2 rounded-full font-bold text-sm tracking-wide uppercase hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </div>
        </div>
        {/* Subtle decorative dots */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </section>
    </div>
  );
}
