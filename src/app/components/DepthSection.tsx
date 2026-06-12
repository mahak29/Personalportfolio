import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type DepthSectionProps = {
  children: ReactNode;
  index: number;
  accent?: string;
  gentle?: boolean;
};

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 820px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
}

export function DepthSection({ children, index, accent = "#C9971C", gentle = false }: DepthSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const compact = useCompactViewport();
  const [stickyTop, setStickyTop] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 30,
    mass: 0.45,
    restDelta: 0.001,
  });

  const amount = gentle ? 0.55 : 1;
  const scale = useTransform(progress, [0, 0.72, 1], [1, 1 - 0.012 * amount, 1 - 0.035 * amount]);
  const shadeOpacity = useTransform(progress, [0, 0.72, 1], [0, 0.025, 0.18]);
  const lineOpacity = useTransform(progress, [0, 0.7, 1], [0.3, 0.12, 0.26]);

  useEffect(() => {
    const element = ref.current;
    if (!element || compact) {
      setStickyTop(0);
      return;
    }

    const updateStickyTop = () => {
      const sectionHeight = element.getBoundingClientRect().height;
      setStickyTop(Math.min(0, window.innerHeight - sectionHeight));
    };

    const observer = new ResizeObserver(updateStickyTop);
    observer.observe(element);
    window.addEventListener("resize", updateStickyTop);
    updateStickyTop();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateStickyTop);
    };
  }, [compact]);

  if (reducedMotion) return <div ref={ref}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className="depth-section"
      style={{
        position: compact ? "relative" : "sticky",
        top: compact ? "auto" : stickyTop,
        zIndex: index,
        minHeight: compact ? "auto" : "100svh",
        scale,
        transformOrigin: "center top",
        borderRadius: compact || index === 1 ? 0 : "18px 18px 0 0",
        boxShadow: compact || index === 1
          ? "none"
          : "0 -28px 70px rgba(0,0,0,0.58), 0 -1px 0 rgba(201,151,28,0.12)",
        overflow: "clip",
        willChange: "transform",
      }}
    >
      {!compact && (
        <motion.span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 18,
            opacity: shadeOpacity,
            background: "#000",
            pointerEvents: "none",
          }}
        />
      )}
      <motion.span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "7%",
          right: "7%",
          height: 1,
          zIndex: 20,
          opacity: lineOpacity,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          pointerEvents: "none",
        }}
      />
      {children}
    </motion.div>
  );
}
