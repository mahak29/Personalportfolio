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
    document.body.style.cursor      = "none";

    const style = document.createElement("style");
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      * { scrollbar-width: none; }
      a, button { cursor: none !important; }
      h1, h2, h3 { margin: 0; }

      @media (max-width: 768px) {
        .about-grid,
        .proj-grid,
        .cap-grid,
        .contact-grid { grid-template-columns: 1fr !important; }
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
