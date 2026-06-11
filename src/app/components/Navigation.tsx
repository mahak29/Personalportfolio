import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV = [
  { label: "About",      href: "#about" },
  { label: "Work",       href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.7 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        padding: "1.1rem clamp(1.5rem, 8vw, 8rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,8,0,0.94)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(201,151,28,0.1)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        transition: "background 0.45s, border-color 0.45s",
      }}
    >
      {/* Logo */}
      <a href="#identity" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#C9971C", letterSpacing: "-0.02em" }}>
          MB
        </span>
        <span style={{ width: 1, height: 14, background: "rgba(201,151,28,0.2)", flexShrink: 0 }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "#7A6A45", fontWeight: 400 }}>
          Full Stack Engineer
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {NAV.map(item => (
          <a
            key={item.href}
            href={item.href}
            style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
              color: "#7A6A45", textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#F5F0E6"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#7A6A45"}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#contact"
          style={{
            fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.82rem",
            color: "#C9971C", textDecoration: "none",
            border: "1px solid rgba(201,151,28,0.3)",
            padding: "0.45rem 1.1rem", borderRadius: "3px",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,151,28,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,151,28,0.55)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,151,28,0.3)";
          }}
        >
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
}
