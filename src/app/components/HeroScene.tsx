import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "motion/react";

const ThreeScene = lazy(() => import("./ThreeScene").then(module => ({ default: module.ThreeScene })));

// ── Text scramble hook ────────────────────────────────────────────────────────
const SC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
function useScramble(text: string, active: boolean, delay = 0) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, SC[0]));
  useEffect(() => {
    if (!active) return;
    const t0 = setTimeout(() => {
      let iter = 0;
      const iv = setInterval(() => {
        setDisplay(text.split("").map((c, i) => c === " " ? " " : i < Math.floor(iter) ? c : SC[Math.floor(Math.random() * SC.length)]).join(""));
        iter += 0.5;
        if (iter > text.length + 2) { clearInterval(iv); setDisplay(text); }
      }, 28);
    }, delay);
    return () => clearTimeout(t0);
  }, [active, text, delay]);
  return display;
}

// ── Char-by-char name ─────────────────────────────────────────────────────────
function AnimatedName({ ready }: { ready: boolean }) {
  const v = {
    hidden:  { opacity: 1, y: 24, rotateX: -12 },
    visible: (i: number) => ({ opacity: 1, y: 0, rotateX: 0, transition: { delay: 0.45 + i * 0.055, duration: 0.75, ease: [0.16, 1, 0.3, 1] } }),
  };
  const first = "Mahak".split("");
  const last  = "Bansal".split("");
  return (
    <div style={{ perspective: 900 }}>
      <div>
        <h1 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem, 11vw, 10rem)", letterSpacing: "-0.05em", color: "#F5F0E6", margin: 0, lineHeight: 0.88, display: "flex" }}>
          {first.map((ch, i) => <motion.span key={i} custom={i} variants={v} initial="hidden" animate={ready ? "visible" : "hidden"} style={{ display: "inline-block" }}>{ch}</motion.span>)}
        </h1>
      </div>
      <div>
        <h1 style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem, 11vw, 10rem)", letterSpacing: "-0.05em", margin: 0, lineHeight: 0.88, display: "flex", color: "transparent", WebkitTextStroke: "1.5px rgba(201,151,28,0.65)" }}>
          {last.map((ch, i) => <motion.span key={i} custom={first.length + i} variants={v} initial="hidden" animate={ready ? "visible" : "hidden"} style={{ display: "inline-block" }}>{ch}</motion.span>)}
        </h1>
      </div>
    </div>
  );
}

// ── Cycling roles (right panel) ───────────────────────────────────────────────
const ROLES = [
  { text: "Full Stack\nEngineer",        sub: "React · Node.js · TypeScript" },
  { text: "AWS Serverless\nArchitect",   sub: "Lambda · API Gateway · CloudFront" },
  { text: "Real-Time\nSystems Builder",  sub: "Redis · WebSockets · BullMQ" },
  { text: "API Integration\nSpecialist", sub: "WhatsApp · Stripe · Agora SDK" },
];

function CyclingRole({ ready }: { ready: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, [ready]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={ready ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "100%",
        /* Frosted gold backdrop so text is always readable against 3D scene */
        background: "rgba(10,8,0,0.55)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(201,151,28,0.12)",
        borderRadius: 8,
        padding: "clamp(2rem,4vw,3rem)",
      }}
    >
      {/* Cycling text */}
      <div style={{ position: "relative", height: "clamp(7rem,14vw,12rem)", overflow: "hidden", marginBottom: "1.25rem" }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0,  opacity: 1, filter: "blur(0px)" }}
            exit={{   y: -36, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "absolute", inset: 0, fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,3rem)", letterSpacing: "-0.035em", color: "#F5F0E6", margin: 0, lineHeight: 1.1, whiteSpace: "pre-line" }}
          >
            {ROLES[idx].text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indicator dots */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
        {ROLES.map((_, i) => (
          <motion.div key={i}
            animate={{ width: i === idx ? 22 : 7, background: i === idx ? "#C9971C" : "rgba(201,151,28,0.22)" }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ height: 7, borderRadius: 4 }}
          />
        ))}
      </div>

      {/* Sub label */}
      <AnimatePresence mode="wait">
        <motion.p key={`s-${idx}`}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ fontFamily: "Inter,sans-serif", fontSize: "0.85rem", color: "#7A6A45", margin: 0 }}>
          {ROLES[idx].sub}
        </motion.p>
      </AnimatePresence>

      {/* Gold accent bar at bottom */}
      <div style={{ height: 2, background: "linear-gradient(to right,rgba(201,151,28,0.6),transparent)", borderRadius: 1, marginTop: "1.5rem" }} />
    </motion.div>
  );
}

// ── Magnetic button ───────────────────────────────────────────────────────────
function MagBtn({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width  / 2) * 0.35);
    y.set((e.clientY - r.top  - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.a ref={ref} href={href}
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "Inter,sans-serif", fontWeight: primary ? 600 : 500, fontSize: "0.9rem", color: primary ? "#0A0800" : "#F5F0E6", background: primary ? "#C9971C" : "transparent", border: primary ? "none" : "1px solid rgba(201,151,28,0.3)", padding: "0.8rem 1.75rem", borderRadius: "3px", textDecoration: "none", cursor: "none" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.04, background: primary ? "#F0C040" : "rgba(201,151,28,0.08)", boxShadow: primary ? "0 8px 28px rgba(201,151,28,0.35)" : "none" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {children}
    </motion.a>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef(0);
  const [ready, setReady] = useState(false);
  const [sp, setSp]       = useState(0);
  const [showThree, setShowThree] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yShift  = useTransform(scrollYProgress, [0, 0.5], [0, -55]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const nameX  = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 55, damping: 18 });
  const nameY2 = useSpring(useTransform(mouseY, [0, 1], [-5,  5]),  { stiffness: 55, damping: 18 });

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    const update = () => setShowThree(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => scrollYProgress.on("change", setSp), [scrollYProgress]);
  useEffect(() => {
    const mm = (e: MouseEvent) => { mouseX.set(e.clientX / window.innerWidth); mouseY.set(e.clientY / window.innerHeight); };
    window.addEventListener("mousemove", mm);
    return () => window.removeEventListener("mousemove", mm);
  }, [mouseX, mouseY]);

  // Canvas grid
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, mx = 0.5, my = 0.5;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(W * pixelRatio));
      canvas.height = Math.max(1, Math.round(H * pixelRatio));
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const mm = (e: MouseEvent) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight; };
    window.addEventListener("mousemove", mm);
    let t = 0;
    let visible = !document.hidden;
    const draw = () => {
      if (!visible) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      t += 0.005; ctx.clearRect(0, 0, W, H);
      for (let r = 0; r <= 16; r++) {
        const fy = r / 16, w = Math.sin(t + r * 0.4 + mx * 2.5) * H * 0.01;
        ctx.beginPath(); ctx.moveTo(0, fy * H + w); ctx.lineTo(W, fy * H - w * 0.5);
        ctx.strokeStyle = `rgba(201,151,28,0.035)`; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let c = 0; c <= 10; c++) {
        const fx = c / 10, w = Math.sin(t * 0.8 + c * 0.5 + my * 2) * W * 0.006;
        ctx.beginPath(); ctx.moveTo(fx * W + w, 0); ctx.lineTo(fx * W - w, H);
        ctx.strokeStyle = `rgba(201,151,28,0.02)`; ctx.lineWidth = 0.4; ctx.stroke();
      }
      const g = ctx.createRadialGradient(mx * W, my * H, 0, mx * W, my * H, Math.min(W, H) * 0.45);
      g.addColorStop(0, "rgba(201,151,28,0.08)"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (!reducedMotion) rafRef.current = requestAnimationFrame(draw);
    };
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mm);
    };
  }, []);

  return (
    <section id="identity" ref={sectionRef}
      style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "hidden", background: "#0A0800", display: "flex", alignItems: "center" }}>

      {/* Canvas grid — full bg */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} />

      {/* Three.js — far right third only, so it doesn't clash with right panel */}
      <div className="three-scene-wrap" style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", zIndex: 2, opacity: 0.5, pointerEvents: "none" }}>
        {showThree && (
          <Suspense fallback={null}>
            <ThreeScene scrollProgress={sp} />
          </Suspense>
        )}
      </div>

      {/* Gradient only protects the far right where Three.js lives */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "linear-gradient(to right, transparent 45%, rgba(10,8,0,0.3) 65%, rgba(10,8,0,0.7) 100%)" }} />

      {/* Content — above everything */}
      <motion.div style={{ opacity, y: yShift, position: "relative", zIndex: 10, width: "100%" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          alignItems: "center",
          gap: "clamp(2rem, 5vw, 4rem)",
          padding: "0 clamp(1.5rem, 7vw, 7rem)",
          paddingTop: "5rem",        /* clear fixed nav */
          paddingBottom: "3rem",
          boxSizing: "border-box",
          width: "100%",
        }} className="hero-grid">

          {/* LEFT — identity */}
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>

            {/* Availability */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2rem" }}>
              <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#C9971C", boxShadow: "0 0 10px rgba(201,151,28,0.55)", flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.83rem", color: "#7A6A45" }}>
                Open to opportunities &nbsp;·&nbsp; Ahmedabad, India
              </span>
            </motion.div>

            {/* Name */}
            <motion.div style={{ x: nameX, y: nameY2, marginBottom: "1.5rem" }}>
              <AnimatedName ready={ready} />
            </motion.div>

            {/* Role */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.45, duration: 0.55 }}
              style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 28, height: 1.5, background: "#C9971C", borderRadius: 1 }} />
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "clamp(0.875rem,1.5vw,1.05rem)", color: "#C9971C" }}>
                Full Stack Engineer
              </span>
            </motion.div>

            {/* Summary */}
            <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.55, duration: 0.6 }}
              style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(0.875rem,1.4vw,1rem)", color: "#7A6A45", lineHeight: 1.8, margin: "0 0 2.5rem", maxWidth: 420 }}>
              3+ years building scalable web applications, real-time systems,
              and cloud-native APIs that hold up in production.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65, duration: 0.55 }}
              style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <MagBtn href="#projects" primary>
                View Work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </MagBtn>
              <MagBtn href="#contact">Say Hello</MagBtn>
            </motion.div>
          </div>

          {/* RIGHT — cycling role panel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <div style={{ width: "100%", maxWidth: 380 }}>
              <CyclingRole ready={ready} />
            </div>
          </div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1 }}
        style={{ position: "absolute", bottom: "2rem", left: "clamp(1.5rem,7vw,7rem)", zIndex: 20 }}>
        <motion.div animate={{ scaleY: [1, 0.12, 1] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          style={{ width: 1, height: 48, background: "linear-gradient(to bottom,rgba(201,151,28,0.7),transparent)", transformOrigin: "top" }} />
      </motion.div>

      <style>{`
        @media(max-width:900px){
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none !important; }
          #identity { min-height: 100svh !important; height: auto !important; }
          #identity .three-scene-wrap { display: none !important; }
        }
        @media(max-width:600px){
          .hero-grid {
            padding: 6.5rem 1.25rem 4.5rem !important;
            gap: 1.5rem !important;
          }
          .hero-grid h1 { font-size: clamp(3.25rem, 18vw, 5.25rem) !important; }
        }
      `}</style>
    </section>
  );
}
