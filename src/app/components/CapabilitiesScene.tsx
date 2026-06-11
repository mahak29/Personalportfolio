import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

function useInView(threshold = 0.06) {
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

const stacks = [
  {
    area: "System Design",
    code: "ARCH",
    items: ["High-Level Design", "Low-Level Design", "Scalability Patterns", "Load Balancing", "Caching Strategies", "Message Queues", "Event-Driven Architecture", "API Gateway Patterns", "Observability"],
    accent: "#F0C040",
    summary: "Designing resilient distributed systems from service boundaries and data flow to scaling, failure recovery, and observability.",
  },
  {
    area: "Frontend",
    code: "UI",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "RTK Query", "TanStack Query", "HTML5 / CSS3", "Flutter & Dart"],
    accent: "#61DAFB",
    summary: "Production-grade interfaces with thoughtful state management, accessibility, and real-world performance optimization.",
  },
  {
    area: "Backend",
    code: "API",
    items: ["Node.js", "Express.js", "REST API Design", "JWT Auth", "Serverless Architecture", "Microservices", "BullMQ", "Worker Threads", "WebSockets"],
    accent: "#C9971C",
    summary: "Scalable APIs and event-driven architectures engineered to remain reliable under peak load.",
  },
  {
    area: "Databases",
    code: "DATA",
    items: ["MongoDB", "MySQL / SQL", "Firebase / Firestore", "Redis (Pub/Sub & Cache)"],
    accent: "#D4834A",
    summary: "Data modeling, query optimization, indexing, caching, and persistence strategies shaped around product behavior.",
  },
  {
    area: "Cloud & DevOps",
    code: "OPS",
    items: ["AWS Lambda", "Amazon API Gateway", "CloudFront", "GCP", "CI/CD Pipelines", "Git / GitHub", "Agile / Scrum"],
    accent: "#E8D4A3",
    summary: "Serverless-first cloud architecture supported by observable infrastructure and automated delivery pipelines.",
  },
  {
    area: "Integrations",
    code: "EXT",
    items: ["WhatsApp Business API", "Meta Ads API", "Google Ads API", "Razorpay", "Cashfree", "Stripe", "RevenueCat", "Agora SDK"],
    accent: "#25D366",
    summary: "Third-party services integrated cleanly across payments, messaging, advertising, and real-time media.",
  },
  {
    area: "AI & Tools",
    code: "AI",
    items: ["LLM Agents", "GitHub Copilot", "Prompt Engineering", "Automated Scaffolding"],
    accent: "#C9971C",
    summary: "Using AI as an engineering multiplier for exploration, delivery, and repeatable development workflows.",
  },
];

export function CapabilitiesScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stacks[activeIndex];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 0.25], [40, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.16], [0, 1]);
  const selectChannel = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section
      id="capabilities"
      ref={(node) => {
        (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#080700",
        padding: "clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.45,
          background: "linear-gradient(115deg, transparent 0 48%, rgba(201,151,28,0.035) 48% 48.15%, transparent 48.15% 100%)",
          pointerEvents: "none",
        }}
      />

      <motion.div style={{ position: "relative", zIndex: 1, y: sectionY, opacity: sectionOpacity }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(2.5rem,6vw,4rem)" }}
          >
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "#C9971C", letterSpacing: "0.1em" }}>005</span>
            <span style={{ width: 60, height: 1, background: "rgba(201,151,28,0.14)" }} />
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "#9A8758", letterSpacing: "0.1em" }}>CAPABILITY ROUTER / LIVE</span>
          </motion.div>

          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "2rem", marginBottom: "clamp(2rem,5vw,3.5rem)", flexWrap: "wrap" }}>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              style={{ maxWidth: 720, margin: 0, fontFamily: "Inter,sans-serif", fontSize: "clamp(2.4rem,6vw,5rem)", fontWeight: 800, lineHeight: 0.94, letterSpacing: "-0.05em", color: "#F5F0E6" }}
            >
              One stack.
              <br />
              <span style={{ color: active.accent }}>Multiple signals.</span>
            </motion.h2>
            <p style={{ maxWidth: 310, margin: 0, fontFamily: "Inter,sans-serif", fontSize: "0.9rem", color: "#9A8758", lineHeight: 1.7 }}>
              Select a channel to inspect the tools, patterns, and engineering depth behind each layer.
            </p>
          </div>

          <div
            className="capability-channel-nav"
            role="tablist"
            aria-label="Capability categories"
            style={{
              display: "flex",
              overflowX: "auto",
              borderTop: "1px solid rgba(201,151,28,0.14)",
              borderBottom: "1px solid rgba(201,151,28,0.14)",
              marginBottom: "1rem",
            }}
          >
            {stacks.map((stack, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={stack.area}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  data-cursor
                  onClick={() => selectChannel(index)}
                  onMouseEnter={() => selectChannel(index)}
                  style={{
                    position: "relative",
                    minWidth: "clamp(120px,14vw,175px)",
                    minHeight: 86,
                    padding: "1rem",
                    border: "none",
                    borderRight: "1px solid rgba(201,151,28,0.1)",
                    background: selected ? `${stack.accent}0B` : "transparent",
                    textAlign: "left",
                  }}
                >
                  <span style={{ display: "block", marginBottom: "0.7rem", fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem", color: selected ? stack.accent : "#7A6A45", letterSpacing: "0.12em" }}>
                    CH-{String(index + 1).padStart(2, "0")} / {stack.code}
                  </span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: selected ? 650 : 450, color: selected ? "#F5F0E6" : "#9A8758", whiteSpace: "nowrap" }}>
                    {stack.area}
                  </span>
                  {selected && (
                    <motion.span
                      layoutId="capability-channel"
                      style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 2, background: stack.accent, boxShadow: `0 0 14px ${stack.accent}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            className="capability-console"
            style={{
              position: "relative",
              minHeight: 520,
              overflow: "hidden",
              border: "1px solid rgba(201,151,28,0.14)",
              background: "linear-gradient(150deg, rgba(19,14,0,0.98), rgba(5,5,0,0.98))",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="capability-console-layout"
                style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "0.72fr 1.28fr", minHeight: 520 }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "clamp(1.5rem,4vw,3rem)",
                    borderRight: "1px solid rgba(201,151,28,0.12)",
                  }}
                >
                  <motion.span
                    initial={{ y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55 }}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: "-0.04em",
                      bottom: "-0.18em",
                      fontFamily: "Inter,sans-serif",
                      fontSize: "clamp(10rem,22vw,20rem)",
                      fontWeight: 800,
                      lineHeight: 1,
                      color: "transparent",
                      WebkitTextStroke: `1px ${active.accent}18`,
                      pointerEvents: "none",
                    }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")}
                  </motion.span>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2rem" }}>
                      <motion.span
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: active.accent, boxShadow: `0 0 12px ${active.accent}` }}
                      />
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: active.accent, letterSpacing: "0.14em" }}>SIGNAL ACTIVE</span>
                    </div>
                    <motion.span
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{ duration: 0.55 }}
                      style={{ display: "block", marginBottom: "0.65rem", fontFamily: "JetBrains Mono,monospace", fontSize: "0.68rem", color: active.accent, letterSpacing: "0.12em" }}
                    >
                      {active.code} / CHANNEL {String(activeIndex + 1).padStart(2, "0")}
                    </motion.span>
                    <motion.h3
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      style={{ margin: "0 0 1.25rem", fontFamily: "Inter,sans-serif", fontSize: "clamp(2rem,4vw,3.6rem)", fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.045em", color: "#F5F0E6" }}
                    >
                      {active.area}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.12 }}
                      style={{ maxWidth: 390, margin: 0, fontFamily: "Inter,sans-serif", fontSize: "0.9rem", color: "#9A8758", lineHeight: 1.75 }}
                    >
                      {active.summary}
                    </motion.p>
                  </div>

                  <div style={{ position: "relative", zIndex: 1, marginTop: "2.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.55rem" }}>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem", color: "#7A6A45" }}>CHANNEL LOAD</span>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem", color: active.accent }}>{active.items.length} MODULES</span>
                    </div>
                    <div style={{ height: 3, overflow: "hidden", background: "rgba(201,151,28,0.09)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.9, delay: 0.15 }}
                        style={{ height: "100%", background: `linear-gradient(90deg, ${active.accent}, transparent)` }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "clamp(1.5rem,4vw,3rem)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#9A8758", letterSpacing: "0.12em" }}>CAPABILITY STREAM</span>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: active.accent }}>
                      {active.items.length} MODULES
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {active.items.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 34 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.42, delay: 0.07 + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ x: 5 }}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "42px minmax(0,1fr) 60px",
                          alignItems: "center",
                          gap: "0.8rem",
                          width: "100%",
                          minHeight: 48,
                          padding: "0 0.75rem",
                          borderTop: "1px solid rgba(201,151,28,0.09)",
                        }}
                      >
                        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.58rem", color: active.accent }}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(0.8rem,1.3vw,0.92rem)", color: "#F5F0E6", overflowWrap: "anywhere" }}>
                          {item}
                        </span>
                        <span aria-hidden="true" style={{ height: 1, background: `linear-gradient(90deg, ${active.accent}70, transparent)` }} />
                      </motion.div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(201,151,28,0.09)" }} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <style>{`
        .capability-channel-nav { scrollbar-width: none; }
        .capability-channel-nav::-webkit-scrollbar { display: none; }
        @media (max-width: 820px) {
          .capability-console-layout { grid-template-columns: 1fr !important; }
          .capability-console-layout > div:first-child {
            min-height: 360px;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,151,28,0.12);
          }
        }
        @media (max-width: 480px) {
          .capability-console-layout > div { padding: 1.25rem !important; }
        }
      `}</style>
    </section>
  );
}
