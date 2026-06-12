import { useEffect } from "react";
import { AboutScene } from "./components/AboutScene";
import { CapabilitiesScene } from "./components/CapabilitiesScene";
import { ContactScene } from "./components/ContactScene";
import { DepthSection } from "./components/DepthSection";
import { ExperienceScene } from "./components/ExperienceScene";
import { HeroScene } from "./components/HeroScene";
import { MarqueeStrip } from "./components/MarqueeStrip";
import { Navigation } from "./components/Navigation";
import { ProjectsScene } from "./components/ProjectsScene";

const SECTIONS = [
  { id: "identity", accent: "#F0C040", gentle: true, content: <><HeroScene /><MarqueeStrip /></> },
  { id: "about", accent: "#C9971C", content: <AboutScene /> },
  { id: "projects", accent: "#D4834A", gentle: true, content: <ProjectsScene /> },
  { id: "experience", accent: "#F0C040", content: <ExperienceScene /> },
  { id: "capabilities", accent: "#C9971C", content: <CapabilitiesScene /> },
  { id: "contact", accent: "#D4834A", gentle: true, content: <ContactScene /> },
] as const;

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
      @media (max-width: 768px) {
        .about-grid,
        .cap-grid,
        .contact-grid { grid-template-columns: 1fr !important; }
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
        .stat-grid { grid-template-columns: 1fr !important; }
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

  useEffect(() => {
    const sections = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );
    let frame = 0;
    let activeId = "";

    const updateHash = () => {
      frame = 0;
      const marker = Math.min(window.innerHeight * 0.38, 320);
      let nextId = SECTIONS[0].id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) nextId = section.id;
      }

      const nextHash = nextId === "identity" ? "" : `#${nextId}`;
      if (nextId === activeId && window.location.hash === nextHash) return;

      activeId = nextId;
      const url = `${window.location.pathname}${window.location.search}${nextHash}`;
      window.history.replaceState(window.history.state, "", url);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHash);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div style={{ background: "#0A0800", minHeight: "100vh", color: "#F5F0E6", overflowX: "clip" }}>
      <Navigation />

      <main className="depth-stage">
        {SECTIONS.map((section, index) => (
          <DepthSection
            key={section.id}
            index={index + 1}
            accent={section.accent}
            gentle={"gentle" in section && section.gentle}
          >
            {section.content}
          </DepthSection>
        ))}
      </main>
    </div>
  );
}
