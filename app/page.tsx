import CoverBanner from "@/app/components/CoverBanner";
import BioSection from "@/app/components/BioSection";
import ProfileTabs from "@/app/components/ProfileTabs";
import Sidebar from "@/app/components/Sidebar";
import ClientInteractions from "@/app/components/ClientInteractions";
import portfolio from "@/app/data/portfolio";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-background min-h-screen">
      <ClientInteractions />

      <main className="layout">
        {/* Main Content Column */}
        <div className="main-content border-x border-border min-h-screen bg-page">
          <CoverBanner name={portfolio.name} />

          <div className="content-wrap">
            <BioSection data={portfolio} />
            <ProfileTabs data={portfolio} />
          </div>

          {/* Mobile-only Sidebar Widgets (displayed below tabs) */}
          <div className="mobile-sidebar-widgets">
            <div className="sidebar-card">
              <h3 className="sidebar-heading">About</h3>
              <p className="sidebar-about-text">
                Full-stack developer based in {portfolio.location}. I build performant web apps
                at the intersection of design and engineering.
              </p>
            </div>
            <ul className="link-list">
              {portfolio.links.map(link => (
                <li key={link.label}>
                  <a href={link.url} className="sidebar-link">
                    <span className="sidebar-link-icon">{link.icon}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Desktop Sidebar Column */}
        <Sidebar data={portfolio} />
      </main>
    </div>
  );
}
