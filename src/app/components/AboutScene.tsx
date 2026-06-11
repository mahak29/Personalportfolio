import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

function useInView(threshold = 0.08) {
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

function useCountUp(target: number, active: boolean, duration = 1.6, prefix = "", suffix = "") {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = duration * 60;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress === 1) window.clearInterval(timer);
    }, 1000 / 60);
    return () => window.clearInterval(timer);
  }, [active, duration, target]);

  return `${prefix}${value}${suffix}`;
}

const STATS = [
  { label: "Years of\nExperience", target: 3, suffix: "+", accent: "#F0C040" },
  { label: "Lead Capture\nAutomated", target: 100, suffix: "%", accent: "#C9971C" },
  { label: "Follow-up\nTime Reduced", target: 70, prefix: "-", suffix: "%", accent: "#D4834A" },
  { label: "Payment\nDowntime", target: 0, suffix: "", accent: "#F0C040" },
];

const skills = [
  { name: "System Design", category: "Architecture", accent: "#F0C040" },
  { name: "React.js", category: "Frontend", accent: "#61DAFB" },
  { name: "Next.js", category: "Frontend", accent: "#F5F0E6" },
  { name: "Node.js", category: "Backend", accent: "#68A063" },
  { name: "TypeScript", category: "Language", accent: "#3178C6" },
  { name: "MongoDB", category: "Database", accent: "#47A248" },
  { name: "Redis", category: "Database", accent: "#DC382D" },
  { name: "AWS Lambda", category: "Cloud", accent: "#FF9900" },
  { name: "WebSockets", category: "Realtime", accent: "#F0C040" },
  { name: "BullMQ", category: "Queues", accent: "#D4834A" },
  { name: "Stripe", category: "Payments", accent: "#635BFF" },
  { name: "WhatsApp API", category: "Integration", accent: "#25D366" },
  { name: "CI/CD", category: "DevOps", accent: "#C9971C" },
];

const principles = [
  {
    id: "01",
    title: "Design the system",
    label: "Architecture",
    accent: "#F0C040",
    description: "Turn product requirements into clear service boundaries, data flows, failure modes, and scalable APIs.",
    nodes: ["Client", "Gateway", "Services", "Data"],
  },
  {
    id: "02",
    title: "Scale the pressure",
    label: "Performance",
    accent: "#D4834A",
    description: "Use caching, queues, workers, and real-time channels to keep critical paths fast as traffic grows.",
    nodes: ["Cache", "Queue", "Workers", "Events"],
  },
  {
    id: "03",
    title: "Ship with confidence",
    label: "Reliability",
    accent: "#C9971C",
    description: "Build observability, resilient integrations, automated delivery, and graceful recovery into production systems.",
    nodes: ["CI/CD", "Metrics", "Alerts", "Recovery"],
  },
];

function StatBox({ stat, active, index }: { stat: typeof STATS[number]; active: boolean; index: number }) {
  const value = useCountUp(stat.target, active, 1.6, stat.prefix ?? "", stat.suffix);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.08 + index * 0.09 }}
      style={{
        minHeight: 145,
        padding: "clamp(1.25rem,3vw,2rem)",
        background: index % 2 === 0 ? "#0A0800" : "#100C00",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#F5F0E6", letterSpacing: "-0.045em" }}>
        {value}
      </span>
      <div>
        <motion.div
          initial={{ width: 0 }}
          animate={active ? { width: "100%" } : {}}
          transition={{ duration: 1.2, delay: 0.15 + index * 0.08 }}
          style={{ height: 2, maxWidth: 80, background: stat.accent, marginBottom: "0.6rem" }}
        />
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.75rem", color: "#9A8758", whiteSpace: "pre-line", lineHeight: 1.45 }}>
          {stat.label}
        </span>
      </div>
    </motion.div>
  );
}

export function AboutScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = principles[activeIndex];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0.05, 0.35], [36, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0.05, 0.28], [0, 1]);

  const scrollToCapabilities = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="about"
      ref={(node) => {
        (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0F0B00",
        padding: "clamp(5rem,12vw,9rem) clamp(1.5rem,8vw,8rem)",
      }}
    >
      <motion.div
        aria-hidden="true"
        animate={inView ? { rotate: 360 } : {}}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "clamp(24rem,44vw,44rem)",
          aspectRatio: "1",
          right: "-16%",
          top: "5%",
          borderRadius: "50%",
          border: "1px solid rgba(201,151,28,0.05)",
          background: "radial-gradient(circle, rgba(201,151,28,0.05), transparent 67%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(2.5rem,5vw,4rem)" }}
        >
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "#C9971C", letterSpacing: "0.1em" }}>002</span>
          <span style={{ width: 48, height: 1, background: "rgba(201,151,28,0.2)" }} />
          <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.72rem", color: "#9A8758", letterSpacing: "0.1em" }}>ABOUT / SYSTEMS THINKING</span>
        </motion.div>

        <motion.div style={{ y: headingY, opacity: headingOpacity, maxWidth: 940, marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <h2 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(2.35rem,6vw,5rem)", lineHeight: 0.98, letterSpacing: "-0.045em", color: "#F5F0E6", margin: "0 0 1.5rem" }}>
            I build beyond the interface.
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1.2px rgba(201,151,28,0.65)" }}>
              I design the system behind it.
            </span>
          </h2>
          <p style={{ maxWidth: 700, margin: 0, fontFamily: "Inter,sans-serif", fontSize: "clamp(0.95rem,1.5vw,1.08rem)", color: "#9A8758", lineHeight: 1.85 }}>
            Full Stack Engineer focused on system design, real-time products, and cloud-native platforms.
            I connect product intent to architecture, then carry it through APIs, data, infrastructure,
            observability, and the final user experience.
          </p>
        </motion.div>

        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "stretch", marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(201,151,28,0.16)" }}
          >
            {principles.map((principle, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={principle.id}
                  type="button"
                  data-cursor
                  aria-pressed={selected}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "42px 1fr auto",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "1.25rem 0.75rem",
                    border: "none",
                    borderBottom: "1px solid rgba(201,151,28,0.12)",
                    background: selected ? "linear-gradient(90deg, rgba(201,151,28,0.09), transparent)" : "transparent",
                    color: selected ? "#F5F0E6" : "#9A8758",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.65rem", color: selected ? principle.accent : "#7A6A45" }}>{principle.id}</span>
                  <span>
                    <span style={{ display: "block", fontFamily: "Inter,sans-serif", fontSize: "clamp(0.95rem,1.6vw,1.12rem)", fontWeight: 600, marginBottom: "0.25rem" }}>{principle.title}</span>
                    <span style={{ display: "block", fontFamily: "Inter,sans-serif", fontSize: "0.66rem", color: selected ? principle.accent : "#7A6A45", letterSpacing: "0.1em", textTransform: "uppercase" }}>{principle.label}</span>
                  </span>
                  <motion.span animate={{ x: selected ? 4 : 0, opacity: selected ? 1 : 0.35 }} style={{ color: principle.accent }}>→</motion.span>
                  {selected && <motion.span layoutId="about-active-line" style={{ position: "absolute", left: 0, insetBlock: 0, width: 2, background: principle.accent }} />}
                </button>
              );
            })}

            <motion.a
              href="#capabilities"
              data-cursor
              onClick={scrollToCapabilities}
              whileHover={{ x: 4, borderColor: "rgba(201,151,28,0.6)" }}
              style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem", padding: "0.75rem 1rem", border: "1px solid rgba(201,151,28,0.3)", borderRadius: 3, color: "#C9971C", fontFamily: "Inter,sans-serif", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}
            >
              Explore all capabilities <span aria-hidden="true">→</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.18 }}
            style={{ position: "relative", minHeight: 390, overflow: "hidden", border: "1px solid rgba(201,151,28,0.16)", borderRadius: 6, background: "linear-gradient(145deg, rgba(201,151,28,0.055), rgba(10,8,0,0.76))", padding: "clamp(1.5rem,4vw,2.5rem)" }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0, overflow: "hidden",
                background: `radial-gradient(circle at 82% 20%, ${active.accent}12, transparent 34%)`,
                pointerEvents: "none",
              }}
            >
              {[220, 150, 84].map((size, index) => (
                <motion.span
                  key={size}
                  animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 24 + index * 8, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute", width: size, height: size,
                    right: 28 + index * 35, top: 18 + index * 34,
                    borderRadius: "50%", border: `1px solid ${active.accent}${index === 0 ? "18" : "10"}`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute", width: 6, height: 6,
                      left: "50%", top: -3, borderRadius: "50%",
                      background: active.accent, opacity: 0.45,
                      boxShadow: `0 0 12px ${active.accent}`,
                    }}
                  />
                </motion.span>
              ))}
              <span style={{ position: "absolute", width: 1, height: "44%", right: 136, top: 62, background: `linear-gradient(${active.accent}30, transparent)` }} />
              <span style={{ position: "absolute", width: "34%", height: 1, right: 48, top: 172, background: `linear-gradient(90deg, transparent, ${active.accent}28, transparent)` }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.65rem", color: active.accent, letterSpacing: "0.14em" }}>SYSTEM MAP / {active.id}</span>
                  <motion.span animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: active.accent, boxShadow: `0 0 14px ${active.accent}` }} />
                </div>
                <h3 style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(1.5rem,3vw,2.35rem)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", color: "#F5F0E6", margin: "0 0 1rem" }}>{active.title}</h3>
                <p style={{ maxWidth: 520, margin: "0 0 2.25rem", fontFamily: "Inter,sans-serif", fontSize: "0.9rem", color: "#9A8758", lineHeight: 1.75 }}>{active.description}</p>

                <div className="about-system-flow" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", alignItems: "center", gap: "0.5rem" }}>
                  {active.nodes.map((node, index) => (
                    <div key={node} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                      <motion.div
                        initial={{ scale: 0.75, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.08 }}
                        style={{ width: "100%", minHeight: 74, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.45rem", padding: "0.65rem 0.4rem", border: `1px solid ${active.accent}35`, borderRadius: 4, background: `${active.accent}0B`, textAlign: "center" }}
                      >
                        <motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 2.4, delay: index * 0.25, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: active.accent }} />
                        <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#F5F0E6", overflowWrap: "anywhere" }}>{node}</span>
                      </motion.div>
                      {index < active.nodes.length - 1 && <motion.span className="system-arrow" animate={{ opacity: [0.25, 1, 0.25], x: [-2, 2, -2] }} transition={{ duration: 1.8, delay: index * 0.2, repeat: Infinity }} style={{ color: active.accent, fontSize: "0.72rem", marginLeft: "0.5rem" }}>→</motion.span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div style={{ marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.65rem", color: "#C9971C", letterSpacing: "0.12em" }}>TOOLKIT</span>
              <h3 style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(1.25rem,2.5vw,1.8rem)", color: "#F5F0E6", margin: "0.45rem 0 0" }}>From architecture to delivery.</h3>
            </div>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.75rem", color: "#9A8758" }}>{skills.length} CORE CAPABILITIES</span>
          </div>

          <div className="skill-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: "0.65rem" }}>
            {skills.map((skill, index) => (
              <motion.a
                key={skill.name}
                href="#capabilities"
                data-cursor
                onClick={scrollToCapabilities}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.15 + index * 0.035 }}
                whileHover={{ y: -5, borderColor: `${skill.accent}75`, boxShadow: `0 12px 28px ${skill.accent}12` }}
                whileTap={{ scale: 0.98 }}
                style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 94, padding: "0.9rem", border: "1px solid rgba(201,151,28,0.14)", borderRadius: 4, background: "rgba(10,8,0,0.42)", fontFamily: "Inter,sans-serif", textDecoration: "none" }}
              >
                <span style={{ position: "absolute", top: 0, left: 0, width: "55%", height: 2, background: `linear-gradient(90deg,${skill.accent},transparent)` }} />
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: "0.6rem", color: skill.accent, marginBottom: "auto" }}>{String(index + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "#F5F0E6", marginTop: "0.8rem" }}>{skill.name}</span>
                <span style={{ fontSize: "0.6rem", color: "#9A8758", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.25rem" }}>{skill.category}</span>
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="stat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(201,151,28,0.1)", border: "1px solid rgba(201,151,28,0.1)" }}
        >
          {STATS.map((stat, index) => <StatBox key={stat.label} stat={stat} active={inView} index={index} />)}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .about-system-flow { grid-template-columns: 1fr 1fr !important; gap: 0.65rem !important; }
          .about-system-flow .system-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
