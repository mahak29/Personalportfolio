import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const projects = [
  {
    index: "01",
    title: "Real Estate CRM",
    sub: "Lead-to-Conversion Platform",
    year: "2024-2026",
    type: "Production SaaS",
    desc: "A scalable real estate CRM and SaaS platform built with React, Node.js, MongoDB, Redis, and AWS. It automates lead capture, sales follow-ups, WhatsApp messages, team roles, and online payments.",
    stack: ["React.js", "Node.js", "MongoDB", "Redis", "AWS Lambda", "WhatsApp API", "Razorpay"],
    numbers: [
      { v: "100%", l: "Manual entry cut" },
      { v: "-70%", l: "Follow-up time" },
      { v: "<200ms", l: "API at peak" },
      { v: "0", l: "Payment downtime" },
    ],
    accent: "#C9971C",
  },
  {
    index: "02",
    title: "Live Streaming",
    sub: "Real-Time SaaS Module",
    year: "2025",
    type: "Real-Time Infrastructure",
    desc: "A secure live streaming module built with Node.js, Agora SDK, JWT, MongoDB, and WebSockets. It supports multi-user video sessions with sub-second latency and reliable access control.",
    stack: ["Node.js", "Agora SDK", "MongoDB", "JWT", "WebSockets"],
    numbers: [
      { v: "<1s", l: "Video latency" },
      { v: "100+", l: "Concurrent users" },
      { v: "JWT", l: "Secure sessions" },
      { v: "0", l: "Stream failures" },
    ],
    accent: "#D4834A",
  },
  {
    index: "03",
    title: "B2C Marketplace",
    sub: "Tech Solutions Platform",
    year: "2022-2023",
    type: "Full-Stack Product",
    desc: "A full-stack B2C marketplace built with React, Node.js, MongoDB, and Firebase. Customers can find vendors, while vendors and admins manage products, users, orders, and inventory.",
    stack: ["React.js", "Node.js", "MongoDB", "Firebase"],
    numbers: [
      { v: "1", l: "Sole developer" },
      { v: "0-1", l: "Built from scratch" },
      { v: "Full", l: "Order lifecycle" },
      { v: "3", l: "User role types" },
    ],
    accent: "#F0C040",
  },
  {
    index: "04",
    title: "Agriculture Export",
    sub: "Indian Client Project",
    year: "2022",
    type: "SEO-Focused Delivery",
    desc: "An SEO-friendly agriculture export project delivered for an Indian client. The responsive experience presents products and company information clearly and is ready for real customer enquiries.",
    stack: ["HTML5", "CSS3", "Node.js"],
    numbers: [
      { v: "Live", l: "In production" },
      { v: "SEO", l: "Optimized" },
      { v: "India", l: "Client location" },
      { v: "Solo", l: "Built and deployed" },
    ],
    accent: "#C9971C",
  },
];

export function ProjectsScene() {
  const { ref, inView } = useInView();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex];

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0A0800",
        padding: "clamp(5rem,9vw,8rem) clamp(1.25rem,7vw,7rem)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "min(52vw,720px)",
          aspectRatio: "1",
          right: "-20%",
          top: "8%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${active.accent}12, transparent 68%)`,
          transition: "background 0.5s ease",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.4rem" }}
        >
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "#C9971C", letterSpacing: "0.12em" }}>
            003 / SELECTED WORK
          </span>
          <span style={{ width: 54, height: 1, background: "rgba(201,151,28,0.22)" }} />
        </motion.div>

        <div className="projects-heading-grid">
          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Inter,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.6rem,6.5vw,5.4rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.045em",
              color: "#F5F0E6",
              margin: 0,
            }}
          >
            Full-stack projects
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.3px rgba(201,151,28,0.58)" }}>built for real users.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ alignSelf: "end", maxWidth: 430, margin: 0, color: "#8E7C52", fontFamily: "Inter,sans-serif", fontSize: "0.95rem", lineHeight: 1.75 }}
          >
            Selected React and Node.js projects covering SaaS development, CRM automation, live streaming, marketplaces, and SEO-friendly client work.
          </motion.p>
        </div>

        <div className="projects-showcase">
          <div className="projects-index" role="tablist" aria-label="Portfolio projects">
            {projects.map((project, index) => {
              const selected = activeIndex === index;
              return (
                <motion.button
                  key={project.index}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + index * 0.07 }}
                  className="project-index-button"
                  style={{ color: selected ? "#F5F0E6" : "#7A6A45" }}
                >
                  <span style={{ color: selected ? project.accent : "#574B31" }}>{project.index}</span>
                  <span>
                    <strong>{project.title}</strong>
                    <small>{project.sub}</small>
                  </span>
                  <motion.span animate={{ x: selected ? 4 : 0, opacity: selected ? 1 : 0.28 }} style={{ color: project.accent }}>
                    -&gt;
                  </motion.span>
                  {selected && (
                    <motion.span
                      layoutId="project-active-line"
                      style={{ position: "absolute", insetBlock: 0, left: 0, width: 2, background: project.accent }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="project-case-study">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="project-case-topline">
                  <span style={{ color: active.accent }}>{active.type}</span>
                  <span>{active.year}</span>
                </div>

                <h3>{active.title}</h3>
                <p>{active.desc}</p>

                <div className="project-metrics-row">
                  {active.numbers.map((metric) => (
                    <div key={metric.l}>
                      <strong style={{ color: active.accent }}>{metric.v}</strong>
                      <span>{metric.l}</span>
                    </div>
                  ))}
                </div>

                <div className="project-stack-row">
                  {active.stack.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>

            <div className="project-case-number" aria-hidden="true" style={{ color: active.accent }}>
              {active.index}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .projects-heading-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(2rem,6vw,6rem);
          margin-bottom: clamp(2.75rem,6vw,4.5rem);
        }
        .projects-showcase {
          display: grid;
          grid-template-columns: minmax(260px,0.78fr) minmax(0,1.42fr);
          min-height: 540px;
          border: 1px solid rgba(201,151,28,0.14);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(15,11,0,0.72);
          box-shadow: 0 24px 70px rgba(0,0,0,0.2);
        }
        .projects-index {
          border-right: 1px solid rgba(201,151,28,0.12);
          background: rgba(10,8,0,0.58);
        }
        .project-index-button {
          position: relative;
          display: grid;
          grid-template-columns: 30px minmax(0,1fr) auto;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          min-height: 25%;
          padding: 1.35rem 1.25rem;
          border: 0;
          border-bottom: 1px solid rgba(201,151,28,0.1);
          background: transparent;
          text-align: left;
          cursor: pointer;
        }
        .project-index-button:last-child { border-bottom: 0; }
        .project-index-button strong {
          display: block;
          font: 700 clamp(0.95rem,1.5vw,1.12rem)/1.2 Inter,sans-serif;
          letter-spacing: -0.02em;
        }
        .project-index-button small {
          display: block;
          margin-top: 0.35rem;
          color: #66593A;
          font: 0.68rem/1.3 Inter,sans-serif;
          letter-spacing: 0.04em;
        }
        .project-case-study {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 0;
          padding: clamp(2rem,5vw,4.25rem);
          overflow: hidden;
        }
        .project-case-study article { position: relative; z-index: 1; width: 100%; }
        .project-case-topline {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: #7A6A45;
          font: 600 0.68rem/1 Inter,sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .project-case-study h3 {
          max-width: 680px;
          margin: 0 0 1rem;
          color: #F5F0E6;
          font: 800 clamp(2rem,4vw,3.65rem)/1.02 Inter,sans-serif;
          letter-spacing: -0.045em;
        }
        .project-case-study p {
          max-width: 690px;
          margin: 0 0 2rem;
          color: #8E7C52;
          font: 0.9rem/1.8 Inter,sans-serif;
        }
        .project-metrics-row {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          border-block: 1px solid rgba(201,151,28,0.12);
          margin-bottom: 1.75rem;
        }
        .project-metrics-row div {
          padding: 1.1rem 0.75rem 1.1rem 0;
          border-right: 1px solid rgba(201,151,28,0.1);
        }
        .project-metrics-row div:not(:first-child) { padding-left: 0.75rem; }
        .project-metrics-row div:last-child { border-right: 0; }
        .project-metrics-row strong {
          display: block;
          margin-bottom: 0.38rem;
          font: 800 clamp(1.25rem,2.4vw,1.9rem)/1 Inter,sans-serif;
          letter-spacing: -0.035em;
        }
        .project-metrics-row span {
          display: block;
          color: #66593A;
          font: 0.62rem/1.35 Inter,sans-serif;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .project-stack-row { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .project-stack-row span {
          padding: 0.32rem 0.65rem;
          border: 1px solid rgba(201,151,28,0.14);
          border-radius: 3px;
          color: #8E7C52;
          background: rgba(201,151,28,0.035);
          font: 0.68rem/1 Inter,sans-serif;
        }
        .project-case-number {
          position: absolute;
          right: -0.04em;
          bottom: -0.22em;
          opacity: 0.035;
          font: 800 clamp(12rem,23vw,22rem)/1 Inter,sans-serif;
          letter-spacing: -0.08em;
          pointer-events: none;
          transition: color 0.4s ease;
        }
        @media(max-width:820px) {
          .projects-heading-grid { grid-template-columns: 1fr; gap: 1.25rem; }
          .projects-showcase { grid-template-columns: 1fr; min-height: 0; }
          .projects-index {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-right: 0;
            border-bottom: 1px solid rgba(201,151,28,0.12);
          }
          .project-index-button {
            min-height: 112px;
            border-right: 1px solid rgba(201,151,28,0.1);
          }
          .project-case-study { min-height: 500px; }
        }
        @media(max-width:560px) {
          .projects-index { grid-template-columns: 1fr; }
          .project-index-button { min-height: 88px; }
          .project-case-study { min-height: 0; padding: 1.5rem 1.2rem 1.8rem; }
          .project-metrics-row { grid-template-columns: 1fr 1fr; }
          .project-metrics-row div:nth-child(2) { border-right: 0; }
          .project-metrics-row div:nth-child(-n+2) { border-bottom: 1px solid rgba(201,151,28,0.1); }
        }
      `}</style>
    </section>
  );
}
