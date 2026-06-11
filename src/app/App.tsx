import { useEffect } from "react";
import { Navigation }       from "./components/Navigation";
import { HeroScene }        from "./components/HeroScene";
import { MarqueeStrip }     from "./components/MarqueeStrip";
import { AboutScene }       from "./components/AboutScene";
import { ProjectsScene }    from "./components/ProjectsScene";
import { ExperienceScene }  from "./components/ExperienceScene";
import { CapabilitiesScene } from "./components/CapabilitiesScene";
import { ContactScene }     from "./components/ContactScene";
import { CustomCursor }     from "./components/CustomCursor";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.background  = "#0A0800";
    document.body.style.overflowX   = "hidden";

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-padding-top: 76px; }
      body { margin: 0; }
      ::-webkit-scrollbar { display: none; }
      * { scrollbar-width: none; }
      h1, h2, h3 { margin: 0; }
      img, svg, canvas { max-width: 100%; }
      button, a { -webkit-tap-highlight-color: transparent; }

      @media (hover: hover) and (pointer: fine) {
        body, a, button, [data-cursor] { cursor: none !important; }
      }

      @media (max-width: 768px) {
        .about-grid,
        .proj-grid,
        .cap-grid,
        .contact-grid { grid-template-columns: 1fr !important; }
        .project-copy,
        .project-metrics { order: initial !important; }
        .stat-grid { grid-template-columns: 1fr 1fr !important; }
        .skill-detail-grid { grid-template-columns: 1fr !important; }
        .skill-detail-item {
          border-right: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .contact-footer { align-items: flex-start !important; flex-direction: column; }
      }

      @media (max-width: 480px) {
        .stat-grid,
        .project-metric-grid { grid-template-columns: 1fr !important; }
        .skill-card-grid { grid-template-columns: 1fr 1fr !important; }
        .experience-detail-grid { grid-template-columns: 1fr !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto !important; }
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: "#0A0800", minHeight: "100vh", color: "#F5F0E6", overflowX: "hidden" }}>
      <CustomCursor />
      <Navigation />
      <main>
        {/* 1 — Hero: name, role, summary, CTAs */}
        <HeroScene />

        {/* Tech marquee bridge */}
        <MarqueeStrip />

        {/* 2 — About: summary paragraph + impact stats + skill chips */}
        <AboutScene />

        {/* 3 — Projects: 4 real projects */}
        <ProjectsScene />

        {/* 4 — Experience: 3 companies */}
        <ExperienceScene />

        {/* 5 — Stack: interactive capabilities */}
        <CapabilitiesScene />

        {/* 6 — Contact */}
        <ContactScene />
      </main>
    </div>
  );
}
