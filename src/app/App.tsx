import { useEffect } from "react";
import { AboutScene } from "./components/AboutScene";
import { CapabilitiesScene } from "./components/CapabilitiesScene";
import { ContactScene } from "./components/ContactScene";
import { CustomCursor } from "./components/CustomCursor";
import { DepthSection } from "./components/DepthSection";
import { ExperienceScene } from "./components/ExperienceScene";
import { HeroScene } from "./components/HeroScene";
import { MarqueeStrip } from "./components/MarqueeStrip";
import { Navigation } from "./components/Navigation";
import { ProjectsScene } from "./components/ProjectsScene";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.background = "#0A0800";
    document.body.style.overflowX = "clip";

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-padding-top: 76px; }
      html, body { overflow-x: clip; }
      body { margin: 0; }
      ::-webkit-scrollbar { display: none; }
      * { scrollbar-width: none; }
      h1, h2, h3 { margin: 0; }
      img, svg, canvas { max-width: 100%; }
      button, a { -webkit-tap-highlight-color: transparent; }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      .depth-stage {
        position: relative;
      }
      .depth-section {
        isolation: isolate;
        backface-visibility: hidden;
      }
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
        .contact-footer {
          align-items: flex-start !important;
          flex-direction: column;
        }
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
    <div style={{ background: "#0A0800", minHeight: "100vh", color: "#F5F0E6", overflowX: "clip" }}>
      <CustomCursor />
      <Navigation />

      <main className="depth-stage">
        <DepthSection index={1} accent="#F0C040" gentle>
          <HeroScene />
          <MarqueeStrip />
        </DepthSection>
        <DepthSection index={2} accent="#C9971C">
          <AboutScene />
        </DepthSection>
        <DepthSection index={3} accent="#D4834A" gentle>
          <ProjectsScene />
        </DepthSection>
        <DepthSection index={4} accent="#F0C040">
          <ExperienceScene />
        </DepthSection>
        <DepthSection index={5} accent="#C9971C">
          <CapabilitiesScene />
        </DepthSection>
        <DepthSection index={6} accent="#D4834A" gentle>
          <ContactScene />
        </DepthSection>
      </main>
    </div>
  );
}
