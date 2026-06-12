import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "motion/react";

const ThreeScene = lazy(() =>
  import("./ThreeScene").then((module) => ({ default: module.ThreeScene })),
);

// ── Text scramble hook ────────────────────────────────────────────────────────
// ── Char-by-char name ─────────────────────────────────────────────────────────
function AnimatedName({ ready }: { ready: boolean }) {
  const v = {
    hidden:  { opacity: 0, y: 56, rotateX: -35 },
    visible: (i: number) => ({ opacity: 1, y: 0, rotateX: 0, transition: { delay: 0.45 + i * 0.055, duration: 0.75, ease: [0.16, 1, 0.3, 1] } }),
  };
  const first = "Mahak".split("");
  const last  = "Bansal".split("");
  return (
    <div style={{ perspective: 900 }}>
      <h1 aria-label="Mahak Bansal, Full Stack Developer" style={{ margin: 0 }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem, 11vw, 10rem)", letterSpacing: "-0.05em", color: "#F5F0E6", lineHeight: 0.88, display: "flex" }}>
          {first.map((ch, i) => <motion.span key={i} custom={i} variants={v} initial="hidden" animate={ready ? "visible" : "hidden"} style={{ display: "inline-block" }}>{ch}</motion.span>)}
        </span>
        <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(4rem, 11vw, 10rem)", letterSpacing: "-0.05em", lineHeight: 0.88, display: "flex", color: "transparent", WebkitTextStroke: "1.5px rgba(201,151,28,0.65)" }}>
          {last.map((ch, i) => <motion.span key={i} custom={first.length + i} variants={v} initial="hidden" animate={ready ? "visible" : "hidden"} style={{ display: "inline-block" }}>{ch}</motion.span>)}
        </span>
      </h1>
    </div>
  );
}

// ── Cycling roles (right panel) ───────────────────────────────────────────────
const ROLES = [
  {
    text: "Full Stack\nDevelopment",
    sub: "React · Next.js · Node.js · TypeScript",
    detail: "Building complete, responsive web applications from user interface to API, database, and deployment.",
  },
  {
    text: "SaaS & CRM\nAutomation",
    sub: "Lead Capture · WhatsApp · Payments",
    detail: "Creating business platforms that automate sales workflows, team access, follow-ups, and payment operations.",
  },
  {
    text: "Real-Time\nSystems",
    sub: "Agora · WebSockets · Redis · BullMQ",
    detail: "Developing live video, instant updates, queues, and event-driven features designed for speed and reliability.",
  },
  {
    text: "Cloud & API\nIntegrations",
    sub: "AWS · Meta · Google · Razorpay · Stripe",
    detail: "Connecting cloud services and third-party APIs through secure, scalable, and production-ready workflows.",
  },
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
      transition={{ delay: 1.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "100%",
        /* Frosted gold backdrop so text is always readable against 3D scene */
        background: "rgba(10,8,0,0.55)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(201,151,28,0.12)",
        borderRadius: 8,
        padding: "clamp(2rem,4vw,3rem)",
        containerType: "inline-size",
      }}
    >
      <div style={{ marginBottom: "1.15rem", fontFamily: "JetBrains Mono,monospace", fontSize: "0.62rem", color: "#C9971C", letterSpacing: "0.14em" }}>
        CORE SPECIALTY / {String(idx + 1).padStart(2, "0")}
      </div>

      {/* Cycling text */}
      <div
        style={{
          display: "grid",
          alignItems: "start",
          minHeight: "clamp(6.25rem,30cqw,7.4rem)",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridArea: "1 / 1",
              padding: "0.06em 0 0.28em",
              boxSizing: "border-box",
              fontFamily: "Inter,sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.45rem,7.2cqw,2.1rem)",
              letterSpacing: "-0.035em",
              color: "#F5F0E6",
              margin: 0,
              lineHeight: 1.14,
              whiteSpace: "pre-line",
              overflowWrap: "normal",
            }}
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
          style={{ fontFamily: "Inter,sans-serif", fontSize: "0.78rem", color: "#C9971C", margin: 0, lineHeight: 1.5 }}>
          {ROLES[idx].sub}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={`d-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, delay: 0.04 }}
          style={{ maxWidth: 360, margin: "0.85rem 0 0", fontFamily: "Inter,sans-serif", fontSize: "0.8rem", color: "#8E7C52", lineHeight: 1.65 }}
        >
          {ROLES[idx].detail}
        </motion.p>
      </AnimatePresence>

      {/* Gold accent bar at bottom */}
      <div style={{ height: 2, background: "linear-gradient(to right,rgba(201,151,28,0.6),transparent)", borderRadius: 1, marginTop: "1.25rem" }} />
    </motion.div>
  );
}

// ── Hero button ───────────────────────────────────────────────────────────────
function HeroButton({ href, children, primary }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      className={primary ? "hero-button hero-button-primary" : "hero-button hero-button-secondary"}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <span className="hero-button-fill" aria-hidden="true" />
      <span className="hero-button-label">{children}</span>
      <span className="hero-button-arrow" aria-hidden="true">
        <span>→</span>
        <span>→</span>
      </span>
    </motion.a>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const [ready, setReady] = useState(false);
  const [threeStatus, setThreeStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yShift  = useTransform(scrollYProgress, [0, 0.5], [0, -55]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const nameX  = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), { stiffness: 55, damping: 18 });
  const nameY2 = useSpring(useTransform(mouseY, [0, 1], [-5,  5]),  { stiffness: 55, damping: 18 });

  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const mm = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      pointerRef.current = { x, y };
      mouseX.set(x);
      mouseY.set(y);
      sectionRef.current?.style.setProperty("--hero-pointer-x", `${(x - 0.5) * 18}px`);
      sectionRef.current?.style.setProperty("--hero-pointer-y", `${(y - 0.5) * 14}px`);
    };
    window.addEventListener("mousemove", mm, { passive: true });
    return () => window.removeEventListener("mousemove", mm);
  }, [mouseX, mouseY]);

  // Canvas grid
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setThreeStatus("unavailable");
      return;
    }
    let W = 0, H = 0;
    let visible = !document.hidden;
    let inViewport = true;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      if (!visible || !inViewport) return;

      const { x: mx, y: my } = pointerRef.current;
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
      const g = ctx.createLinearGradient(
        mx * W - W * 0.18,
        my * H - H * 0.2,
        mx * W + W * 0.25,
        my * H + H * 0.24,
      );
      g.addColorStop(0, "transparent");
      g.addColorStop(0.48, "rgba(201,151,28,0.075)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    };
    const onVisibilityChange = () => {
      visible = !document.hidden;
    };
    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    document.addEventListener("visibilitychange", onVisibilityChange);
    viewportObserver.observe(canvas);
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      viewportObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="identity" ref={sectionRef}
      style={{ position: "relative", width: "100%", minHeight: "100svh", overflow: "hidden", background: "#0A0800", display: "flex", alignItems: "center" }}>

      {/* Canvas grid — full bg */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} />

      <div className="hero-ambient" aria-hidden="true">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-signal-map">
          <div className="hero-lattice hero-lattice-back" />
          <div className="hero-lattice hero-lattice-front" />
          <div className="hero-beam hero-beam-one" />
          <div className="hero-beam hero-beam-two" />
          <i className="hero-node hero-node-one" />
          <i className="hero-node hero-node-two" />
          <i className="hero-node hero-node-three" />
          <div className="hero-signal-core"><span /></div>
        </div>
        <div className="hero-noise" />
      </div>

      {/* Three.js — far right third only, so it doesn't clash with right panel */}
      <div className="three-scene-wrap" style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", zIndex: 2, opacity: 0.5, pointerEvents: "none" }}>
        <Suspense fallback={null}>
          <ThreeScene scrollProgress={scrollYProgress} onStatusChange={setThreeStatus} />
        </Suspense>
        <AnimatePresence>
          {threeStatus === "unavailable" && (
            <motion.div
              className="hero-visual-fallback"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hero-fallback-frame hero-fallback-frame-one" />
              <span className="hero-fallback-frame hero-fallback-frame-two" />
              <span className="hero-fallback-core" />
            </motion.div>
          )}
        </AnimatePresence>
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
                style={{ display: "inline-block", width: 8, height: 8, transform: "rotate(45deg)", background: "#C9971C", boxShadow: "0 0 10px rgba(201,151,28,0.55)", flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: "0.83rem", color: "#7A6A45" }}>
                Open to opportunities &nbsp;·&nbsp; Ahmedabad, India
              </span>
            </motion.div>

            {/* Name */}
            <motion.div style={{ x: nameX, y: nameY2, marginBottom: "1.5rem" }}>
              <AnimatedName ready={ready} />
            </motion.div>

            {/* Role */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.1, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 28, height: 1.5, background: "#C9971C", borderRadius: 1 }} />
              <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 500, fontSize: "clamp(0.875rem,1.5vw,1.05rem)", color: "#C9971C" }}>
                Full Stack Developer
              </span>
            </motion.div>

            {/* Summary */}
            <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.25, duration: 0.7 }}
              style={{ fontFamily: "Inter,sans-serif", fontSize: "clamp(0.875rem,1.4vw,1rem)", color: "#7A6A45", lineHeight: 1.8, margin: "0 0 2.5rem", maxWidth: 420 }}>
              Full stack developer with 3+ years of experience building React and Next.js
              applications, SaaS products, backend services, and cloud integrations.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4, duration: 0.6 }}
              style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <HeroButton href="#projects" primary>
                Explore Projects
              </HeroButton>
              <HeroButton href="#contact">Start a Conversation</HeroButton>
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
      <motion.a
        href="#about"
        className="hero-scroll-cue"
        aria-label="Scroll to the about section"
        initial={{ opacity: 0, y: 8 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.span
          className="hero-scroll-arrow"
          aria-hidden="true"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
        >
          <span />
        </motion.span>
      </motion.a>

      <style>{`
        .hero-ambient {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
          background:
            linear-gradient(115deg, rgba(10,8,0,0.18) 10%, transparent 55%),
            linear-gradient(132deg, transparent 45%, rgba(201,151,28,0.08) 72%, transparent 72.2%);
        }
        .hero-glow {
          position: absolute;
          filter: blur(24px);
          will-change: transform;
          clip-path: polygon(8% 0, 100% 18%, 82% 100%, 0 74%);
        }
        .hero-glow-one {
          width: min(58vw, 760px);
          height: min(68vw, 820px);
          right: -12%;
          top: -18%;
          background: linear-gradient(135deg, rgba(201,151,28,0.18), rgba(201,151,28,0.035) 48%, transparent 72%);
          animation: hero-drift 12s ease-in-out infinite alternate;
        }
        .hero-glow-two {
          width: min(38vw, 520px);
          height: min(42vw, 560px);
          left: 34%;
          bottom: -30%;
          background: linear-gradient(45deg, rgba(212,131,74,0.13), transparent 68%);
          animation: hero-drift 15s ease-in-out -5s infinite alternate-reverse;
        }
        .hero-signal-map {
          position: absolute;
          width: min(56vw, 760px);
          height: min(76vw, 780px);
          right: clamp(-15rem, -8vw, -4rem);
          top: 50%;
          transform: translate3d(var(--hero-pointer-x, 0), calc(-50% + var(--hero-pointer-y, 0)), 0);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.82;
          will-change: transform;
          perspective: 900px;
        }
        .hero-signal-map::before,
        .hero-signal-map::after {
          content: "";
          position: absolute;
          left: 46%;
          top: 4%;
          bottom: 4%;
          width: 1px;
          background: linear-gradient(transparent, rgba(201,151,28,0.16), transparent);
          transform: rotate(18deg);
        }
        .hero-signal-map::after {
          left: 2%;
          right: 2%;
          top: 50%;
          bottom: auto;
          width: auto;
          height: 1px;
          transform: rotate(-12deg);
        }
        .hero-lattice {
          position: absolute;
          inset: 12% 8%;
          border: 1px solid rgba(201,151,28,0.16);
          background-image:
            linear-gradient(rgba(201,151,28,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,151,28,0.08) 1px, transparent 1px);
          background-size: 52px 52px;
          clip-path: polygon(15% 0, 100% 12%, 86% 100%, 0 82%);
          transform: rotateX(58deg) rotateZ(-18deg);
          transform-style: preserve-3d;
          box-shadow: inset 0 0 70px rgba(201,151,28,0.035);
        }
        .hero-lattice-back {
          opacity: 0.38;
          transform: translate3d(-5%, -3%, -80px) rotateX(58deg) rotateZ(-18deg);
          animation: hero-lattice-shift 11s ease-in-out infinite alternate;
        }
        .hero-lattice-front {
          inset: 21% 17%;
          background-size: 34px 34px;
          border-color: rgba(240,192,64,0.24);
          animation: hero-lattice-shift 8s ease-in-out -3s infinite alternate-reverse;
        }
        .hero-beam {
          position: absolute;
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(90deg, transparent, rgba(240,192,64,0.8), transparent);
          box-shadow: 0 0 12px rgba(240,192,64,0.28);
        }
        .hero-beam-one {
          width: 72%;
          left: 10%;
          top: 31%;
          transform: rotate(31deg);
          animation: hero-beam-pulse 4.8s ease-in-out infinite;
        }
        .hero-beam-two {
          width: 58%;
          left: 25%;
          bottom: 28%;
          transform: rotate(-38deg);
          animation: hero-beam-pulse 5.6s ease-in-out -2s infinite;
        }
        .hero-node {
          position: absolute;
          display: block;
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
          background: #F0C040;
          box-shadow: 0 0 0 4px rgba(240,192,64,0.07), 0 0 20px rgba(240,192,64,0.72);
          animation: hero-node-pulse 3s ease-in-out infinite;
        }
        .hero-node-one { left: 17%; top: 21%; }
        .hero-node-two { right: 10%; bottom: 24%; width: 5px; height: 5px; animation-delay: -1s; }
        .hero-node-three { right: 19%; top: 22%; animation-delay: -2s; }
        .hero-signal-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 68px;
          height: 68px;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%) rotate(45deg);
          border: 1px solid rgba(240,192,64,0.34);
          background: linear-gradient(135deg, rgba(201,151,28,0.08), rgba(10,8,0,0.15));
          box-shadow: 0 0 42px rgba(201,151,28,0.1);
          animation: hero-core-pulse 3.6s ease-in-out infinite;
        }
        .hero-signal-core span {
          width: 11px;
          height: 11px;
          background: #F0C040;
          box-shadow: 0 0 24px rgba(240,192,64,0.85);
        }
        @media(hover:hover) {
          .hero-signal-map:hover .hero-lattice-front {
            border-color: rgba(240,192,64,0.4);
            background-size: 30px 30px;
          }
        }
        .hero-noise {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: repeating-linear-gradient(115deg, rgba(245,240,230,0.1) 0 1px, transparent 1px 8px);
          mask-image: linear-gradient(to right, transparent 5%, black 70%, transparent);
        }
        .hero-visual-fallback {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
        }
        .hero-fallback-frame,
        .hero-fallback-core {
          position: absolute;
          border: 1px solid rgba(201,151,28,0.26);
          clip-path: polygon(14% 0, 100% 10%, 86% 100%, 0 82%);
        }
        .hero-fallback-frame-one {
          inset: 29% 21%;
          animation: hero-fallback-drift 7s ease-in-out infinite alternate;
        }
        .hero-fallback-frame-two {
          inset: 21% 31%;
          border-color: rgba(212,131,74,0.32);
          animation: hero-fallback-drift 9s ease-in-out -3s infinite alternate-reverse;
        }
        .hero-fallback-core {
          left: 50%;
          top: 50%;
          width: 42px;
          height: 42px;
          border-color: rgba(240,192,64,0.55);
          background: rgba(240,192,64,0.08);
          animation: hero-core-pulse 3.6s ease-in-out infinite;
        }
        .hero-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          padding: 0.72rem 0.9rem 0.72rem 1rem;
          border-radius: 3px;
          font-family: Inter,sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          overflow: hidden;
          isolation: isolate;
          transition: color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .hero-button::after {
          content: "";
          position: absolute;
          left: 1rem;
          right: 2.7rem;
          bottom: 0.48rem;
          height: 1px;
          background: currentColor;
          opacity: 0.45;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s ease;
        }
        .hero-button:hover {
          transform: translateY(-2px);
        }
        .hero-button:hover::after {
          transform: scaleX(1);
        }
        .hero-button-fill {
          position: absolute;
          inset: 0;
          z-index: -1;
          transform: translateX(-102%);
          transition: transform 0.34s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-button:hover .hero-button-fill {
          transform: translateX(0);
        }
        .hero-button-label {
          position: relative;
          z-index: 1;
        }
        .hero-button-primary {
          color: #0A0800;
          background: #C9971C;
          border: 1px solid #D9A72B;
          box-shadow: 0 7px 22px rgba(201,151,28,0.18);
        }
        .hero-button-primary .hero-button-fill {
          background: #F0C040;
        }
        .hero-button-primary:hover {
          box-shadow: 0 11px 28px rgba(201,151,28,0.3);
        }
        .hero-button-secondary {
          color: #F5F0E6;
          background: rgba(201,151,28,0.035);
          border: 1px solid rgba(201,151,28,0.28);
        }
        .hero-button-secondary .hero-button-fill {
          background: rgba(201,151,28,0.13);
        }
        .hero-button-secondary:hover {
          color: #F0C040;
          border-color: rgba(240,192,64,0.5);
        }
        .hero-button-arrow {
          position: relative;
          width: 17px;
          height: 16px;
          overflow: hidden;
          font-size: 0.95rem;
          line-height: 16px;
        }
        .hero-button-arrow span {
          position: absolute;
          inset: 0;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-button-arrow span:last-child {
          transform: translateX(-130%);
        }
        .hero-button:hover .hero-button-arrow span:first-child {
          transform: translateX(130%);
        }
        .hero-button:hover .hero-button-arrow span:last-child {
          transform: translateX(0);
        }
        .hero-scroll-cue {
          position: absolute;
          left: calc(50% - 17px);
          bottom: 1.6rem;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          color: #9A8758;
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .hero-scroll-cue:hover {
          color: #F0C040;
        }
        .hero-scroll-arrow {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(201,151,28,0.3);
          background: rgba(201,151,28,0.05);
          clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
          box-shadow: 0 0 0 0 rgba(201,151,28,0);
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .hero-scroll-cue:hover .hero-scroll-arrow {
          border-color: rgba(240,192,64,0.65);
          background: rgba(201,151,28,0.12);
          box-shadow: 0 0 18px rgba(201,151,28,0.15);
          transform: rotate(45deg);
        }
        .hero-scroll-arrow > span {
          width: 7px;
          height: 7px;
          border-right: 1.5px solid currentColor;
          border-bottom: 1.5px solid currentColor;
          transform: translateY(-2px) rotate(45deg);
        }
        .hero-scroll-cue:hover .hero-scroll-arrow > span {
          transform: translateY(-2px) rotate(0deg);
        }
        @keyframes hero-drift {
          from { transform: translate3d(-2%, -2%, 0) scale(0.96); }
          to { transform: translate3d(4%, 5%, 0) scale(1.06); }
        }
        @keyframes hero-lattice-shift {
          from { transform: translate3d(-3%, -2%, -40px) rotateX(58deg) rotateZ(-18deg); }
          to { transform: translate3d(3%, 2%, 20px) rotateX(61deg) rotateZ(-14deg); }
        }
        @keyframes hero-beam-pulse {
          0%, 100% { opacity: 0.18; transform-origin: left center; }
          50% { opacity: 0.9; transform-origin: right center; }
        }
        @keyframes hero-node-pulse {
          0%, 100% { opacity: 0.45; box-shadow: 0 0 0 2px rgba(240,192,64,0.04), 0 0 10px rgba(240,192,64,0.35); }
          50% { opacity: 1; box-shadow: 0 0 0 6px rgba(240,192,64,0.08), 0 0 24px rgba(240,192,64,0.78); }
        }
        @keyframes hero-fallback-drift {
          from { transform: translate3d(-8px, -6px, 0) rotate(-8deg); }
          to { transform: translate3d(10px, 8px, 0) rotate(7deg); }
        }
        @keyframes hero-core-pulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) rotate(45deg) scale(0.92); }
          50% { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) scale(1.06); }
        }
        @media(max-width:900px){
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none !important; }
          #identity { min-height: 100svh !important; height: auto !important; }
          #identity .three-scene-wrap { display: none !important; }
          .hero-signal-map {
            width: min(110vw, 680px);
            right: -48%;
            opacity: 0.5;
          }
        }
        @media(max-width:600px){
          .hero-grid {
            padding: 6.5rem 1.25rem 4.5rem !important;
            gap: 1.5rem !important;
          }
          .hero-grid h1 { font-size: clamp(3.25rem, 18vw, 5.25rem) !important; }
          .hero-button {
            width: auto;
          }
          .hero-scroll-cue {
            left: calc(50% - 17px);
            right: auto;
            bottom: 1rem;
          }
        }
        @media(prefers-reduced-motion:reduce){
          .hero-glow,
          .hero-lattice,
          .hero-beam,
          .hero-node,
          .hero-fallback-frame,
          .hero-fallback-core,
          .hero-signal-core {
            animation: none !important;
          }
          .hero-signal-map {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
