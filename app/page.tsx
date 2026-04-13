import CoverBanner from "@/app/components/CoverBanner";
import BioSection from "@/app/components/BioSection";
import ProfileTabs from "@/app/components/ProfileTabs";
import Sidebar from "@/app/components/Sidebar";
import ClientInteractions from "@/app/components/ClientInteractions";
import portfolio from "@/app/data/portfolio";

import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background min-h-screen">
      <ClientInteractions />

      <main className="layout">
        {/* Main Content Column */}
        <div className="main-content border-x border-strong min-h-screen">
          <CoverBanner name={portfolio.name} />

          <div className="content-wrap">
            <BioSection data={portfolio} />
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <div className="font-dot text-[10px] uppercase tracking-[0.2em] text-secondary">
                  Booting Tabs...
                </div>
              </div>
            }>
              <ProfileTabs data={portfolio} />
            </Suspense>
          </div>

          {/* Polished Site Footer */}
          <footer className="mobile-footer">
            <span className="footer-logo">NOTHING × X</span>
            <div className="footer-links">
              {portfolio.links.map(link => (
                <a key={link.label} href={link.url} className="footer-link">
                  {link.label}
                </a>
              ))}
            </div>
            <p className="">
              Ideated, Designed & Developed by <span className="font-serif italic">Vishal</span>  
            </p>
          </footer>
        </div>

        {/* Desktop Sidebar Column */}
        <Sidebar data={portfolio} />
      </main>
    </div>
  );
}
