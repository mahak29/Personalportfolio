import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";

function useInView(t = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

const stages = [
  { step: "01", label: "Understand", glyph: "◇", color: "#F0C040", desc: "Map the problem. Define constraints, stakeholders, and what production success looks like — before any code." },
  { step: "02", label: "Architect",  glyph: "⬡", color: "#C9971C", desc: "Data flows, API contracts, service boundaries. AWS Lambda, Redis, MongoDB — boring tech that scales gracefully." },
  { step: "03", label: "Build",      glyph: "{}", color: "#F0C040", desc: "Small, reviewable increments. RTK Query for server state, Redux Toolkit for client state. Clean separation." },
  { step: "04", label: "Harden",     glyph: "✓",  color: "#D4834A", desc: "JWT auth, rate limiting, input validation, IndexedDB offline fallback. Security and edge cases first." },
  { step: "05", label: "Deploy",     glyph: "▲",  color: "#C9971C", desc: "AWS Lambda + API Gateway + CloudFront. CI/CD pipelines. Zero-downtime is the minimum viable deployment." },
  { step: "06", label: "Observe",    glyph: "∞",  color: "#F0C040", desc: "Redis Pub/Sub for decoupled events. BullMQ with retry logic and zero message loss. Production is a feedback loop." },
];

function StageRow({ stage, index }: { stage: typeof stages[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start end", "center center"] });
  const op  = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const xL  = useTransform(scrollYProgress, [0, 0.6], [-50, 0]);
  const xR  = useTransform(scrollYProgress, [0, 0.6], [50, 0]);
  const isLeft = index % 2 === 0;

  return (
    <div ref={rowRef} style={{ display: "grid", gridTemplateColumns: "1fr 72px 1fr", alignItems: "center", minHeight: 130 }}>
      <motion.div style={{ opacity: op, x: isLeft ? xL : 0 }}>
        {isLeft ? (
          <div style={{ padding: "1.75rem 2.5rem 1.75rem 0", textAlign: "right" }}>
            <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(1rem,2vw,1.3rem)", color: "#F5F0E6", letterSpacing: "-0.015em", margin: "0 0 0.5rem" }}>{stage.label}</h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.84rem", color: "#7A6A45", lineHeight: 1.75, margin: 0, maxWidth: 300, marginLeft: "auto" }}>{stage.desc}</p>
          </div>
        ) : <div />}
      </motion.div>

      {/* Spine node */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 5 }}>
        <motion.div style={{ opacity: op }} whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
          <div style={{ width: 48, height: 48, clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)", border: `1.5px solid ${stage.color}45`, background: `${stage.color}0E`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.95rem", color: stage.color }}>{stage.glyph}</span>
          </div>
        </motion.div>
        <motion.span style={{ opacity: op }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: stage.color, letterSpacing: "0.1em", display: "block", textAlign: "center", marginTop: "0.4rem", opacity: 0.6 }}>{stage.step}</span>
        </motion.span>
      </div>

      <motion.div style={{ opacity: op, x: !isLeft ? xR : 0 }}>
        {!isLeft ? (
          <div style={{ padding: "1.75rem 0 1.75rem 2.5rem" }}>
            <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "clamp(1rem,2vw,1.3rem)", color: "#F5F0E6", letterSpacing: "-0.015em", margin: "0 0 0.5rem" }}>{stage.label}</h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.84rem", color: "#7A6A45", lineHeight: 1.75, margin: 0, maxWidth: 300 }}>{stage.desc}</p>
          </div>
        ) : <div />}
      </motion.div>
    </div>
  );
}

export function SystemScene() {
  const { ref, inView } = useInView(0.05);
  const spineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spineRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 2.6, ease: "power2.inOut" });
    }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <section id="system" style={{ background: "#0F0B00", padding: "clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>006</span>
          <div style={{ height: 1, background: "rgba(201,151,28,0.15)", maxWidth: 50, flex: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>HOW I WORK</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: 0.92, letterSpacing: "-0.04em", color: "#F5F0E6", marginBottom: "clamp(4rem,8vw,6rem)" }}>
          From first thought<br />
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,151,28,0.45)" }}>to production.</span>
        </motion.h2>

        <div style={{ position: "relative" }}>
          {/* Animated gold spine */}
          <div ref={spineRef} style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, transparent, rgba(201,151,28,0.3) 15%, rgba(240,192,64,0.2) 50%, rgba(212,131,74,0.25) 85%, transparent)", transform: "translateX(-50%)", transformOrigin: "top" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {stages.map((s, i) => <StageRow key={s.step} stage={s} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
