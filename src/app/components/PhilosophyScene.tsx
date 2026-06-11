import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(t = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: t }
    );
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

const principles = [
  {
    num: "01",
    title: "Automation beats discipline.",
    body: "I built a pipeline that ingests 100% of Meta and Google Ads leads into the CRM in under 5 seconds — no human in the loop. A rule that runs itself is worth ten people following it.",
    accent: "#F0C040",
    tag: "Lead Ingestion · WhatsApp Drip · Zero Manual Entry",
  },
  {
    num: "02",
    title: "Standards beat reviews.",
    body: "The React component library I built didn't just speed things up — it made the wrong thing hard to do. Forms, modals, data tables — all sharing a single contract. UI dev time dropped 35%.",
    accent: "#C9971C",
    tag: "Component Library · Design System · 35% Faster Delivery",
  },
  {
    num: "03",
    title: "Scalability is a day-one decision.",
    body: "I designed the Redis Pub/Sub architecture into the CRM before the first user touched it. When load increased, we scaled horizontally — with zero service-level code changes. That's the point.",
    accent: "#D4834A",
    tag: "Redis Pub/Sub · BullMQ · Horizontal Scaling",
  },
  {
    num: "04",
    title: "Payments are a trust problem.",
    body: "Razorpay, Cashfree, and Stripe — three gateways, one unified layer, zero downtime post-launch. Webhook-driven reconciliation was in the architecture spec before a single API was called.",
    accent: "#F0C040",
    tag: "Razorpay · Cashfree · Stripe · Webhook Reconciliation",
  },
];

export function PhilosophyScene() {
  const sRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView(0.05);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const hOp = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);
  const hY  = useTransform(scrollYProgress, [0.05, 0.3], [50, 0]);

  return (
    <section
      ref={(n) => { (sRef as any).current = n; (ref as any).current = n; }}
      id="philosophy"
      style={{ background: "#0A0800", padding: "clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Scene marker */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>003</span>
          <div style={{ height: 1, background: "rgba(201,151,28,0.15)", maxWidth: 50, flex: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>ENGINEERING PHILOSOPHY</span>
        </div>

        {/* Heading */}
        <motion.div style={{ opacity: hOp, y: hY, marginBottom: "clamp(3rem,7vw,5rem)" }}>
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "clamp(2.5rem,7vw,5.5rem)", lineHeight: 0.92,
            letterSpacing: "-0.04em", color: "#F5F0E6", margin: "0 0 1.25rem",
          }}>
            Lessons earned
            <br />
            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,151,28,0.45)" }}>
              in production.
            </span>
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#7A6A45", lineHeight: 1.8, maxWidth: 520, margin: 0 }}>
            Not principles I read about — things I learned by shipping real systems to real users,
            watching them under load, and fixing them at 2am.
          </p>
        </motion.div>

        {/* Principles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0 }}>
          {principles.map((p, i) => {
            const cRef = useRef<HTMLDivElement>(null);
            const { scrollYProgress: cs } = useScroll({ target: cRef, offset: ["start end", "center center"] });
            const cy = useTransform(cs, [0, 0.65], [50, 0]);
            const co = useTransform(cs, [0, 0.5], [0, 1]);

            return (
              <motion.div
                key={p.num}
                ref={cRef}
                style={{ y: cy, opacity: co }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(201,151,28,0.03)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{
                  padding: "2.75rem 2rem",
                  borderLeft: "1px solid rgba(201,151,28,0.1)",
                  transition: "background 0.3s",
                  height: "100%", boxSizing: "border-box",
                  position: "relative", cursor: "default",
                  display: "flex", flexDirection: "column", gap: "1rem",
                }}>
                  {/* Top accent bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.accent, opacity: 0.5 }} />

                  {/* Number */}
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: p.accent, letterSpacing: "0.1em", opacity: 0.6 }}>
                    {p.num}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 700,
                    fontSize: "clamp(1rem,2vw,1.2rem)", color: "#F5F0E6",
                    letterSpacing: "-0.015em", lineHeight: 1.3, margin: 0,
                  }}>
                    {p.title}
                  </h3>

                  {/* Body */}
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.84rem", color: "#7A6A45", lineHeight: 1.82, margin: 0, flex: 1 }}>
                    {p.body}
                  </p>

                  {/* Evidence tag */}
                  <div style={{
                    padding: "0.3rem 0.7rem",
                    background: `${p.accent}0C`,
                    border: `1px solid ${p.accent}20`,
                    borderRadius: "2px",
                    alignSelf: "flex-start",
                    marginTop: "auto",
                  }}>
                    <span style={{
                      fontFamily: "JetBrains Mono, monospace", fontSize: "0.68rem",
                      color: p.accent, letterSpacing: "0.08em", opacity: 0.8,
                    }}>
                      {p.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {/* Close the grid border */}
          <div style={{ borderLeft: "1px solid rgba(201,151,28,0.1)" }} />
        </div>

      </div>
    </section>
  );
}
