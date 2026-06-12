import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

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
      transition={{ delay: 0.15, duration: 0.45 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        padding: "1.1rem clamp(1.5rem, 8vw, 8rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,8,0,0.94)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(201,151,28,0.1)" : "1px solid transparent",
        backdropFilter: scrolled || mobileOpen ? "blur(18px)" : "none",
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
          Full Stack Developer
        </span>
      </a>

      {/* Desktop links */}
      <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
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

      <button
        className="mobile-menu-button"
        type="button"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(open => !open)}
        style={{
          width: 42, height: 42, padding: 0, borderRadius: 4,
          border: "1px solid rgba(201,151,28,0.25)",
          background: "rgba(10,8,0,0.7)", color: "#C9971C",
          alignItems: "center", justifyContent: "center",
        }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              padding: "0.75rem 1.5rem 1.25rem",
              background: "rgba(10,8,0,0.98)",
              borderBottom: "1px solid rgba(201,151,28,0.14)",
            }}
          >
            {[...NAV, { label: "Skills", href: "#capabilities" }].map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block", padding: "0.9rem 0",
                  borderBottom: "1px solid rgba(201,151,28,0.08)",
                  color: "#F5F0E6", fontFamily: "Inter, sans-serif",
                  fontSize: "0.95rem", textDecoration: "none",
                }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mobile-menu-button, .mobile-menu { display: none; }
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-button { display: flex !important; }
          .mobile-menu { display: block !important; }
        }
        @media (max-width: 420px) {
          nav > a span:last-child { display: none; }
        }
      `}</style>
    </motion.nav>
  );
}
