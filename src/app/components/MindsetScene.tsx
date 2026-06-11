import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(t = 0.08) {
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

const lines = [
  {
    num: "01",
    headline: "Automate what steals time.",
    detail: "100% of ad leads now flow into the CRM without a human touching them.",
    c: "#F5F0E6",
  },
  {
    num: "02",
    headline: "Build for the next engineer.",
    detail: "A component library that cut UI dev time by 35% — because the system enforces quality.",
    c: "#F0C040",
  },
  {
    num: "03",
    headline: "Scale is an architecture decision.",
    detail: "Redis Pub/Sub was designed in from day one so scaling never required code changes.",
    c: "#D4834A",
  },
  {
    num: "04",
    headline: "Reliability is planned, not patched.",
    detail: "Zero payment downtime across three gateways — because reconciliation was in the spec, not the hotfix.",
    c: "#F5F0E6",
  },
];

export function MindsetScene() {
  const sRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView(0.06);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const qOp = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);
  const qY  = useTransform(scrollYProgress, [0.05, 0.3], [40, 0]);
  const lOp = useTransform(scrollYProgress, [0.15, 0.42], [0, 1]);
  const lY  = useTransform(scrollYProgress, [0.15, 0.42], [32, 0]);

  return (
    <section
      ref={(n) => { (sRef as any).current = n; (ref as any).current = n; }}
      id="mindset"
      style={{ background: "#0F0B00", padding: "clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Scene marker */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "clamp(3rem,8vw,6rem)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>002</span>
          <div style={{ height: 1, background: "rgba(201,151,28,0.15)", maxWidth: 50, flex: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>MINDSET</span>
        </div>

        <div className="mindset-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2.5rem,7vw,7rem)", alignItems: "start" }}>

          {/* Left — opening statement */}
          <motion.div style={{ opacity: qOp, y: qY }}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontWeight: 800,
              fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.05,
              letterSpacing: "-0.035em", color: "#F5F0E6", margin: "0 0 2rem",
            }}>
              Good engineers
              <br />
              <span style={{ color: "#C9971C" }}>ship features.</span>
              <br />
              Great engineers
              <br />
              <span style={{ color: "#F0C040" }}>ship systems.</span>
            </p>

            <div style={{ width: 40, height: 1, background: "rgba(201,151,28,0.4)", margin: "2rem 0" }} />

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#7A6A45", lineHeight: 1.85, maxWidth: 380, margin: 0 }}>
              At CodnestX, I didn't just build a CRM — I built the pipeline that
              eliminated 100% of manual lead entry, the automation that cut
              follow-up time by 70%, and the payment infrastructure that has
              never gone down. Features age. Systems compound.
            </p>
          </motion.div>

          {/* Right — principles with detail */}
          <motion.div style={{ opacity: lOp, y: lY }}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.12 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderTop: "1px solid rgba(201,151,28,0.1)",
                  padding: "1.5rem 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", opacity: 0.5, letterSpacing: "0.1em", minWidth: 22, paddingTop: "0.3rem" }}>
                    {line.num}
                  </span>
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "clamp(0.9rem,2vw,1.2rem)", color: line.c, letterSpacing: "-0.01em", margin: "0 0 0.4rem" }}>
                      {line.headline}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#7A6A45", lineHeight: 1.7, margin: 0 }}>
                      {line.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid rgba(201,151,28,0.1)" }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
