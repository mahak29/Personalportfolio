import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(t = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

const contacts = [
  { label: "Email",    value: "mahakbansal017@gmail.com", copy: true,  href: null,                              accent: "#F0C040" },
  { label: "Phone",    value: "+91 70674 10527",           copy: true,  href: null,                              accent: "#C9971C" },
  { label: "LinkedIn", value: "linkedin.com/in/mahakbansal", copy: false, href: "https://linkedin.com/in/mahakbansal", accent: "#D4834A" },
];

export function ContactScene() {
  const sRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView(0.06);
  const [copied, setCopied] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end end"] });
  const headScale = useTransform(scrollYProgress, [0, 0.5], [0.88, 1]);
  const headOp    = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  const copy = (val: string, label: string) => {
    navigator.clipboard.writeText(val.replace(/\s/g, ""));
    setCopied(label);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <div id="contact" ref={(n) => { (sRef as any).current = n; (ref as any).current = n; }}
      style={{ background: "#0A0800", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* Ambient */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 65% 55% at 15% 75%, rgba(201,151,28,0.07) 0%, transparent 65%)" }} />
      {/* Ghost "HI." */}
      <div style={{ position: "absolute", bottom: "-4%", left: "-2%", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(7rem,24vw,28rem)", color: "#C9971C", opacity: 0.025, lineHeight: 1, letterSpacing: "-0.07em", userSelect: "none", pointerEvents: "none" }}>HI.</div>

      {/* Scene label */}
      <div style={{ padding: "clamp(5rem,10vw,7rem) clamp(2rem,8vw,8rem) 0", position: "relative", zIndex: 5 }}>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#C9971C", letterSpacing: "0.1em" }}>007</span>
          <div style={{ height: 1, width: 50, background: "rgba(201,151,28,0.15)" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em" }}>CONTACT</span>
        </motion.div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem clamp(2rem,8vw,8rem)", position: "relative", zIndex: 5 }}>
        {/* Headline */}
        <motion.h2 style={{ scale: headScale, opacity: headOp, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "clamp(3.5rem,13vw,12rem)", lineHeight: 0.87, letterSpacing: "-0.05em", color: "#F5F0E6", margin: "0 0 clamp(2.5rem,5vw,4rem)" }}>
          Let's build<br />something<br /><span style={{ color: "#C9971C" }}>meaningful.</span>
        </motion.h2>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,6rem)", alignItems: "start" }}>
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "#7A6A45", lineHeight: 1.85, margin: "0 0 2.5rem", maxWidth: 380 }}>
              I'm interested in problems worth solving — complex distributed systems, product ideas that need engineering clarity, or just a conversation about architecture.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { dot: "#F0C040", pulse: true,  text: "OPEN TO WORK" },
                { dot: "rgba(255,255,255,0.12)", pulse: false, text: "AHMEDABAD · INDIA · REMOTE OK" },
                { dot: "rgba(255,255,255,0.12)", pulse: false, text: "3+ YRS · FULL STACK · MERN + AWS" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {row.pulse
                    ? <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 7, height: 7, borderRadius: "50%", background: row.dot, flexShrink: 0 }} />
                    : <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.dot, flexShrink: 0 }} />
                  }
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7A6A45", letterSpacing: "0.1em" }}>{row.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — contact rows */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: "flex", flexDirection: "column" }}>
            {contacts.map((c, i) => (
              <motion.div key={c.label} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ borderTop: i === 0 ? "1px solid rgba(201,151,28,0.1)" : "none" }}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0", borderBottom: "1px solid rgba(201,151,28,0.1)", textDecoration: "none", cursor: "none" }}>
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{c.label.toUpperCase()}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.85rem,1.8vw,1.05rem)", color: "#F5F0E6", fontWeight: 500 }}>{c.value}</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${c.accent}35`, background: `${c.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, fontSize: "1rem", flexShrink: 0 }}>↗</div>
                  </a>
                ) : (
                  <button onClick={() => copy(c.value, c.label)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 0", background: "none", border: "none", borderBottom: "1px solid rgba(201,151,28,0.1)" as any, width: "100%", textAlign: "left", cursor: "none" }}>
                    <div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#7A6A45", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{c.label.toUpperCase()}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.85rem,1.8vw,1.05rem)", color: "#F5F0E6", fontWeight: 500 }}>{copied === c.label ? "Copied ✓" : c.value}</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${copied === c.label ? c.accent : "rgba(201,151,28,0.2)"}`, background: copied === c.label ? `${c.accent}18` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: copied === c.label ? c.accent : "#7A6A45", fontSize: "0.72rem", flexShrink: 0, fontFamily: "Inter, sans-serif", letterSpacing: "0.05em", transition: "all 0.3s" }}>
                      {copied === c.label ? "✓" : "COPY"}
                    </div>
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
        style={{ padding: "2rem clamp(2rem,8vw,8rem)", borderTop: "1px solid rgba(201,151,28,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 5, flexWrap: "wrap", gap: "0.75rem" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7A6A45", opacity: 0.5, letterSpacing: "0.1em" }}>MAHAK BANSAL © 2022</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#7A6A45", opacity: 0.5, letterSpacing: "0.1em" }}>FULL STACK ENGINEER · AHMEDABAD, INDIA</span>
      </motion.div>
    </div>
  );
}
