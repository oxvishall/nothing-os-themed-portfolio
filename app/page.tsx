import CoverBanner from "@/app/components/CoverBanner";
import BioSection from "@/app/components/BioSection";
import ProfileTabs from "@/app/components/ProfileTabs";
import Sidebar from "@/app/components/Sidebar";
import ClientInteractions from "@/app/components/ClientInteractions";
import BackgroundField from "@/app/components/BackgroundField";
import KeyboardShortcuts from "@/app/components/KeyboardShortcuts";
import FooterLogo from "@/app/components/FooterLogo";
import HelpButton from "@/app/components/HelpButton";
import FeedSkeleton from "@/app/components/FeedSkeleton";
import SeasonalThemes from "@/app/components/seasons/SeasonalThemes";
import portfolio from "@/app/data/portfolio";

import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background min-h-screen">
      <BackgroundField />
      <ClientInteractions />
      <KeyboardShortcuts />
      <SeasonalThemes />

      <main className="layout" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Content Column */}
        <div className="main-content border-x border-strong min-h-screen">
          <CoverBanner name={portfolio.name} />

          <div className="content-wrap">
            <BioSection data={portfolio} />
            <Suspense fallback={
              <FeedSkeleton />
            }>
              <ProfileTabs data={portfolio} />
            </Suspense>
          </div>

          {/* Polished Site Footer */}
          <footer className="mobile-footer">
            <FooterLogo>NOTHING × X</FooterLogo>
            <div className="footer-links">
              {portfolio.links.map(link => (
                <a key={link.label} href={link.url} className="footer-link">
                  {link.label}
                </a>
              ))}
              <HelpButton />
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
