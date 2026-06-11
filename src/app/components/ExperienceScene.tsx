import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const jobs = [
  {
    title: "Full Stack Engineer",
    company: "CodnestX Tech Dynamics",
    period: "May 2024 – Apr 2026",
    location: "Ahmedabad, India",
    accent: "#C9971C",
    tag: "CURRENT",
    highlights: [
      { metric: "−40%", label: "Agent task-switching", detail: "Production React.js CRM with RBAC for 4+ user types, dynamic lead pipelines, real-time status updates" },
      { metric: "−35%", label: "UI dev time", detail: "Built reusable component library — forms, modals, data tables — enforcing a consistent design system" },
      { metric: "<2s", label: "Initial load", detail: "Memoization, lazy loading, code splitting under real-world network conditions" },
      { metric: "<5s", label: "Lead data lag", detail: "Real-time lead-ingestion pipeline: 100% of Facebook & Google Ads leads captured with zero manual CRM entry" },
      { metric: "+70%", label: "Sales response time", detail: "WhatsApp Business API drip sequences — automated customer conversion touchpoints" },
      { metric: "0", label: "Payment downtime", detail: "Unified Razorpay, Cashfree, Stripe layer with webhook-driven reconciliation" },
    ],
    stack: ["React.js", "Node.js", "TypeScript", "Redux Toolkit", "MongoDB", "Redis", "BullMQ", "AWS Lambda", "API Gateway", "CloudFront", "Agora SDK", "WhatsApp API"],
  },
  {
    title: "MERN Stack Developer",
    company: "CleverPush",
    period: "May 2023 – Jan 2024",
    location: "Ahmedabad, India",
    accent: "#F0C040",
    tag: "",
    highlights: [
      { metric: "0", label: "Data loss offline", detail: "Advanced IndexedDB storage strategies — zero data loss during network interruptions across all browsers" },
      { metric: "↑↑", label: "UI responsiveness", detail: "Audited and refactored React component trees, eliminating unnecessary re-renders, reducing interaction latency" },
      { metric: "AAA", label: "API security", detail: "RESTful APIs with JWT auth, input validation, rate limiting, and secure header enforcement across all endpoints" },
    ],
    stack: ["React.js", "Node.js", "Express.js", "JWT", "MongoDB", "IndexedDB", "REST APIs"],
  },
  {
    title: "Flutter & MERN Stack Developer",
    company: "AppsDeployer",
    period: "May 2022 – Apr 2023",
    location: "Indore, India",
    accent: "#D4834A",
    tag: "FIRST ROLE",
    highlights: [
      { metric: "−40%", label: "User-facing errors", detail: "Diagnosed React state mismatches and Node.js API defects — full client sign-off delivered" },
      { metric: "+50%", label: "App efficiency", detail: "Revamped legacy Flutter Android app with new UI and performance-optimized rendering" },
    ],
    stack: ["React.js", "Node.js", "MongoDB", "Flutter", "Dart", "REST APIs"],
  },
];

function JobCard({ job, index }: { job: typeof jobs[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { inView, ref } = useInView(0.05);
  const [expanded, setExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const cardRotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [6, 0, 0, -4]);
  const cardY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div
      ref={(node) => {
        (cardRef as any).current = node;
        (ref as any).current = node;
      }}
      style={{ rotateX: cardRotateX, y: cardY, opacity: cardOpacity, transformPerspective: 1000 }}
      className="group"
    >
      <div
        style={{
          background: "#1A1400",
          border: "1px solid rgba(201,151,28,0.1)",
          borderTop: `2px solid ${job.accent}`,
          padding: "clamp(2rem, 4vw, 3rem)",
          cursor: "pointer",
          transition: "border-color 0.4s, background 0.4s",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#201800"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#1A1400"}
      >
        {/* Ghost index */}
        <div style={{
          position: "absolute", right: "1.5rem", top: "1rem",
          fontFamily: "Inter, sans-serif", fontWeight: 800,
          fontSize: "6rem", color: job.accent, opacity: 0.035,
          lineHeight: 1, letterSpacing: "-0.05em", userSelect: "none",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            {job.tag && (
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
                  color: job.accent, letterSpacing: "0.1em",
                  padding: "0.2rem 0.6rem", border: `1px solid ${job.accent}40`,
                  borderRadius: "2px",
                }}>
                  {job.tag}
                </span>
              </div>
            )}
            <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", color: "#F5F0E6", letterSpacing: "-0.02em", margin: "0 0 0.3rem" }}>
              {job.title}
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: job.accent, margin: "0 0 0.25rem", fontWeight: 500 }}>
              {job.company}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7A6A45", letterSpacing: "0.05em", margin: 0 }}>
              {job.period} · {job.location}
            </p>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid rgba(201,151,28,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#7A6A45", fontSize: "1.1rem", flexShrink: 0,
            transition: "transform 0.3s, border-color 0.3s",
            transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
          }}>
            +
          </div>
        </div>

        {/* Metrics row — always visible */}
        <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2.5rem)", marginTop: "2rem", flexWrap: "wrap" }}>
          {job.highlights.slice(0, 3).map((h) => (
            <div key={h.label} style={{ borderTop: `1px solid ${job.accent}40`, paddingTop: "0.75rem", minWidth: 80 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "#F5F0E6", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {h.metric}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#7A6A45", letterSpacing: "0.08em", marginTop: "0.35rem" }}>
                {h.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded detail */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(201,151,28,0.1)", paddingTop: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                {job.highlights.map((h, hi) => (
                  <div key={hi} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: job.accent, flexShrink: 0, marginTop: 6 }} />
                    <div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: job.accent }}>{h.metric} {h.label}</span>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#7A6A45", margin: "0.2rem 0 0", lineHeight: 1.65 }}>{h.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {job.stack.map(s => (
                  <span key={s} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem", color: "#7A6A45", border: "1px solid rgba(201,151,28,0.1)", padding: "0.25rem 0.6rem", borderRadius: "2px", letterSpacing: "0.06em" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function ExperienceScene() {
  const { ref, inView } = useInView(0.05);

  return (
    <section
      id="experience"
      style={{ background: "#0A0800", padding: "clamp(5rem, 12vw, 9rem) clamp(1.5rem, 8vw, 8rem)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Scene marker */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(3rem, 7vw, 5rem)" }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>003</span>
          <div style={{ height: 1, background: "rgba(201,151,28,0.1)", maxWidth: 60, flex: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>EXPERIENCE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.92,
            letterSpacing: "-0.04em", color: "#F5F0E6",
            marginBottom: "clamp(3rem, 7vw, 5rem)",
          }}
        >
          Where I've
          <br />
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(201,151,28,0.5)" }}>
            shipped.
          </span>
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {jobs.map((job, i) => (
            <JobCard key={job.company} job={job} index={i} />
          ))}
        </div>

        {/* Education footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: "3rem", paddingTop: "2rem",
            borderTop: "1px solid rgba(201,151,28,0.02)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
          }}
        >
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em", margin: "0 0 0.3rem" }}>EDUCATION</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#F5F0E6", fontWeight: 500, margin: 0 }}>B.Tech — Computer Science & Engineering</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#7A6A45", margin: "0.15rem 0 0" }}>Mandsaur University · 2018–2022 · CGPA 8.5/10</p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Hindi (Native)", "English (Professional)"].map(l => (
              <span key={l} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>{l.toUpperCase()}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
