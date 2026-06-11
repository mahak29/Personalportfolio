import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

function useInView(t = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    obs.observe(el); return () => obs.disconnect();
  }, [t]);
  return { ref, inView };
}

// Count-up hook
function useCountUp(target: number, active: boolean, duration = 1.8, prefix = "", suffix = "") {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const fps = 60;
    const steps = duration * fps;
    const step = target / steps;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.round(start));
      if (start >= target) clearInterval(timer);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return `${prefix}${val}${suffix}`;
}

// Fill-bar (for 100%)
function FillBar({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div style={{ height: 2, background: "rgba(201,151,28,0.15)", borderRadius: 1, marginTop: "0.6rem", overflow: "hidden" }}>
      <motion.div
        animate={active ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ height: "100%", background: accent, borderRadius: 1 }}
      />
    </div>
  );
}

const STATS = [
  { label: "Years of\nExperience",    target: 3,   suffix: "+",  accent: "#F0C040" },
  { label: "Lead Capture\nAutomated", target: 100, suffix: "%",  accent: "#C9971C" },
  { label: "Follow-up\nTime Reduced", target: 70,  prefix: "−", suffix: "%", accent: "#D4834A" },
  { label: "Payment\nDowntime",       target: 0,   suffix: "",   accent: "#F0C040" },
];

function StatBox({ s, active, i }: { s: typeof STATS[0]; active: boolean; i: number }) {
  const val = useCountUp(s.target, active, 1.8, s.prefix ?? "", s.suffix);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "clamp(1.5rem,3vw,2rem)",
        background: i % 2 === 0 ? "#0A0800" : "#0F0B00",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        minHeight: 130, position: "relative",
      }}
    >
      <div style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3rem)", color: "#F5F0E6", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {val}
      </div>
      <div>
        <FillBar active={active} accent={s.accent} />
        <div style={{ fontFamily: "Inter,sans-serif", fontSize: "0.8rem", color: "#7A6A45", lineHeight: 1.5, whiteSpace: "pre-line", marginTop: "0.5rem" }}>
          {s.label}
        </div>
      </div>
    </motion.div>
  );
}

const skills = [
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

export function AboutScene() {
  const sRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView(0.08);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const y  = useTransform(scrollYProgress, [0.05, 0.4], [40, 0]);
  const op = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);

  return (
    <section id="about" ref={(n) => { (sRef as any).current = n; (ref as any).current = n; }}
      style={{ background: "#0F0B00", padding: "clamp(5rem,12vw,9rem) clamp(1.5rem,8vw,8rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:0.5}}
          style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"3rem"}}>
          <span style={{fontFamily:"Inter,sans-serif",fontWeight:500,fontSize:"0.72rem",color:"#C9971C",letterSpacing:"0.1em"}}>About</span>
          <div style={{height:1,width:48,background:"rgba(201,151,28,0.2)"}} />
        </motion.div>

        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:"clamp(3rem,8vw,7rem)",alignItems:"start"}}>

          {/* Summary */}
          <motion.div style={{y,opacity:op}}>
            <h2 style={{fontFamily:"Inter,sans-serif",fontWeight:800,fontSize:"clamp(1.75rem,4vw,2.75rem)",lineHeight:1.1,letterSpacing:"-0.03em",color:"#F5F0E6",margin:"0 0 1.75rem"}}>
              Full Stack Engineer with a bias for systems that{" "}
              <span style={{color:"#C9971C"}}>scale under pressure.</span>
            </h2>

            <p style={{fontFamily:"Inter,sans-serif",fontSize:"1rem",color:"#7A6A45",lineHeight:1.85,margin:"0 0 1.5rem",maxWidth:480}}>
              3+ years building production-grade web applications — from real-time CRM dashboards
              to live-streaming infrastructure, automated lead pipelines, and multi-gateway
              payment systems. Specializing in React.js, Node.js, TypeScript, and AWS Serverless.
            </p>

            <p style={{fontFamily:"Inter,sans-serif",fontSize:"1rem",color:"#7A6A45",lineHeight:1.85,margin:"0 0 2.5rem",maxWidth:480}}>
              I design the systems behind the features — every project has left measurable impact:
              faster pipelines, lower latency, zero downtime, and teams that ship quicker.
            </p>

            {/* Curated skill chips */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))",gap:"0.65rem",maxWidth:520}}>
              {skills.map((s, i) => (
                <motion.a
                  key={s.name}
                  href="#capabilities"
                  data-cursor
                  initial={{opacity:0,y:8}} animate={inView?{opacity:1,y:0}:{}}
                  transition={{duration:0.35,delay:0.25+i*0.04,ease:[0.16,1,0.3,1]}}
                  whileHover={{y:-4,scale:1.02,borderColor:`${s.accent}80`,boxShadow:`0 10px 30px ${s.accent}12`}}
                  whileFocus={{y:-4,scale:1.02,borderColor:`${s.accent}80`}}
                  whileTap={{scale:0.98}}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",
                    minHeight:84,padding:"0.8rem 0.85rem",border:"1px solid rgba(201,151,28,0.14)",
                    borderRadius:"4px",background:"linear-gradient(145deg, rgba(201,151,28,0.055), rgba(10,8,0,0.35))",
                    fontFamily:"Inter,sans-serif",textDecoration:"none",outline:"none",
                  }}
                  aria-label={`View ${s.name} in the full skills section`}
                >
                  <span style={{position:"absolute",top:0,left:0,width:"45%",height:2,background:`linear-gradient(90deg, ${s.accent}, transparent)`}} />
                  <span style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.8rem"}}>
                    <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.62rem",color:s.accent,letterSpacing:"0.08em"}}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      initial={{x:0,opacity:0.45}}
                      whileHover={{x:3,opacity:1}}
                      style={{fontSize:"0.8rem",color:s.accent}}
                    >
                      →
                    </motion.span>
                  </span>
                  <span style={{fontSize:"0.84rem",fontWeight:600,color:"#F5F0E6",lineHeight:1.2,marginBottom:"0.25rem"}}>
                    {s.name}
                  </span>
                  <span style={{fontSize:"0.62rem",color:"#7A6A45",letterSpacing:"0.08em",textTransform:"uppercase"}}>
                    {s.category}
                  </span>
                </motion.a>
              ))}
            </div>

            <motion.a
              href="#capabilities"
              data-cursor
              initial={{opacity:0,y:8}}
              animate={inView?{opacity:1,y:0}:{}}
              transition={{duration:0.45,delay:0.75,ease:[0.16,1,0.3,1]}}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                display:"inline-flex",alignItems:"center",gap:"0.75rem",
                marginTop:"1.5rem",padding:"0.75rem 1rem",
                border:"1px solid rgba(201,151,28,0.3)",borderRadius:"3px",
                color:"#C9971C",fontFamily:"Inter,sans-serif",fontSize:"0.82rem",
                fontWeight:600,letterSpacing:"0.04em",textDecoration:"none",
                transition:"background 0.25s, border-color 0.25s, color 0.25s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(201,151,28,0.1)";
                e.currentTarget.style.borderColor = "rgba(201,151,28,0.55)";
                e.currentTarget.style.color = "#F0C040";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(201,151,28,0.3)";
                e.currentTarget.style.color = "#C9971C";
              }}
            >
              Explore full stack
              <span aria-hidden="true">→</span>
            </motion.a>
          </motion.div>

          {/* Count-up stat grid */}
          <motion.div
            initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}}
            transition={{duration:0.8,delay:0.2,ease:[0.16,1,0.3,1]}}
            style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"rgba(201,151,28,0.1)",border:"1px solid rgba(201,151,28,0.1)"}}>
            {STATS.map((s,i) => <StatBox key={i} s={s} active={inView} i={i} />)}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
