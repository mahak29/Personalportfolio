import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(threshold = 0.06) {
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

const stacks = [
  {
    area: "Frontend",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "RTK Query", "TanStack Query", "HTML5 / CSS3", "Flutter & Dart"],
    accent: "#F0C040",
    summary: "Production-grade UIs with real-world performance optimization.",
  },
  {
    area: "Backend",
    items: ["Node.js", "Express.js", "REST API Design", "JWT Auth", "Serverless Architecture", "Microservices", "BullMQ", "Worker Threads", "WebSockets"],
    accent: "#C9971C",
    summary: "Scalable APIs and event-driven architectures that survive peak load.",
  },
  {
    area: "Databases",
    items: ["MongoDB", "MySQL / SQL", "Firebase / Firestore", "Redis (Pub/Sub & Cache)"],
    accent: "#D4834A",
    summary: "Schema design through to query optimization and caching strategies.",
  },
  {
    area: "Cloud & DevOps",
    items: ["AWS Lambda", "Amazon API Gateway", "CloudFront", "GCP", "CI/CD Pipelines", "Git / GitHub", "Agile / Scrum"],
    accent: "#E8D4A3",
    summary: "Serverless-first cloud architecture with automated delivery pipelines.",
  },
  {
    area: "Integrations",
    items: ["WhatsApp Business API", "Meta Ads API", "Google Ads API", "Razorpay", "Cashfree", "Stripe", "RevenueCat", "Agora SDK"],
    accent: "#F0C040",
    summary: "Third-party APIs wired cleanly — payments, messaging, advertising, streaming.",
  },
  {
    area: "AI & Tools",
    items: ["LLM Agents", "GitHub Copilot", "Prompt Engineering", "Automated Scaffolding"],
    accent: "#C9971C",
    summary: "Using AI as an engineering multiplier — not a shortcut.",
  },
];

export function CapabilitiesScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView(0.05);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const sectionRotateX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [6, 0, 0, -4]);
  const sectionY = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      id="capabilities"
      ref={(node) => { (sectionRef as any).current = node; (ref as any).current = node; }}
      style={{ background: "#0F0B00", padding: "clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 8rem)" }}
    >
      <motion.div
        style={{ rotateX: sectionRotateX, y: sectionY, opacity: sectionOpacity, transformPerspective: 1400 }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Scene marker */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(3rem, 7vw, 5rem)" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>005</span>
            <div style={{ height: 1, background: "rgba(201,151,28,0.1)", maxWidth: 60, flex: 1 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>CAPABILITIES</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(2.5rem, 7vw, 7rem)", alignItems: "start" }}
            className="cap-grid"
          >
            {/* Left: heading + area selector */}
            <div>
              <h2 style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800,
                fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 0.95,
                letterSpacing: "-0.04em", color: "#F5F0E6",
                marginBottom: "2.5rem",
              }}>
                The full
                <br />
                <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,151,28,0.5)" }}>stack.</span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {stacks.map((s, i) => (
                  <button
                    key={s.area}
                    onClick={() => setActive(i)}
                    data-cursor
                    style={{
                      background: "none", border: "none", cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: "1rem",
                      padding: "1rem 0",
                      borderTop: "1px solid rgba(201,151,28,0.1)",
                      transition: "all 0.25s",
                    }}
                  >
                    <div style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: active === i ? s.accent : "rgba(201,151,28,0.12)",
                      transition: "all 0.3s",
                      transform: active === i ? "scale(1.4)" : "scale(1)",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: active === i ? 600 : 400,
                      fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                      color: active === i ? "#F5F0E6" : "#7A6A45",
                      transition: "color 0.25s",
                      letterSpacing: "-0.01em",
                    }}>
                      {s.area}
                    </span>
                    {active === i && (
                      <motion.span
                        layoutId="area-arrow"
                        style={{ marginLeft: "auto", color: s.accent, fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}
                      >
                        →
                      </motion.span>
                    )}
                  </button>
                ))}
                <div style={{ borderTop: "1px solid rgba(201,151,28,0.1)" }} />
              </div>
            </div>

            {/* Right: active area detail */}
            <div style={{ paddingTop: "0.5rem" }}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{
                  display: "inline-block",
                  padding: "0.3rem 0.875rem",
                  background: `${stacks[active].accent}12`,
                  border: `1px solid ${stacks[active].accent}28`,
                  borderRadius: "2px",
                  marginBottom: "1.25rem",
                }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem", color: stacks[active].accent, letterSpacing: "0.15em" }}>
                    {stacks[active].area.toUpperCase()}
                  </span>
                </div>

                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#7A6A45", lineHeight: 1.75, marginBottom: "2rem" }}>
                  {stacks[active].summary}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                  {stacks[active].items.map((item, j) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: j * 0.05 }}
                      style={{
                        padding: "0.9rem 0",
                        borderBottom: "1px solid rgba(201,151,28,0.1)",
                        borderRight: j % 2 === 0 ? "1px solid rgba(201,151,28,0.1)" : "none",
                        paddingRight: j % 2 === 0 ? "1.5rem" : 0,
                        paddingLeft: j % 2 === 1 ? "1.5rem" : 0,
                        display: "flex", alignItems: "center", gap: "0.6rem",
                      }}
                    >
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: stacks[active].accent, opacity: 0.6, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "#F5F0E6", fontWeight: 400, letterSpacing: "-0.005em" }}>
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
