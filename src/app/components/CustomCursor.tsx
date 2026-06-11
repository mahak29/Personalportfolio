import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 8;

export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>(Array(TRAIL_COUNT).fill(null));
  const history   = useRef<{ x: number; y: number }[]>(Array(TRAIL_COUNT + 1).fill({ x: -200, y: -200 }));
  const pos       = useRef({ x: -200, y: -200 });
  const raf       = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onDown = () => setClicked(true);
    const onUp   = () => setClicked(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    const tick = () => {
      // Shift history
      history.current = [pos.current, ...history.current.slice(0, TRAIL_COUNT)];

      // Move dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px) scale(${clicked ? 0.6 : 1})`;
      }

      // Move trail dots
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const h = history.current[i + 1] ?? pos.current;
        const progress = 1 - i / TRAIL_COUNT;
        el.style.transform = `translate(${h.x - 3}px,${h.y - 3}px)`;
        el.style.opacity   = String(progress * (hovered ? 0.5 : 0.18));
        el.style.width     = `${4 + (1 - progress) * 10}px`;
        el.style.height    = `${4 + (1 - progress) * 10}px`;
      });

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    const addH   = () => setHovered(true);
    const removeH = () => setHovered(false);
    const els = document.querySelectorAll("a, button, [data-cursor]");
    els.forEach(el => { el.addEventListener("mouseenter", addH); el.addEventListener("mouseleave", removeH); });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(raf.current);
      els.forEach(el => { el.removeEventListener("mouseenter", addH); el.removeEventListener("mouseleave", removeH); });
    };
  }, [hovered, clicked]);

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div key={i}
          ref={el => { trailRefs.current[i] = el; }}
          style={{
            position: "fixed", top: 0, left: 0,
            width: 6, height: 6, borderRadius: "50%",
            background: "#C9971C", pointerEvents: "none",
            zIndex: 99996, willChange: "transform",
            transition: "opacity 0.1s",
          }}
        />
      ))}

      {/* Main dot */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0,
        width: 8, height: 8, borderRadius: "50%",
        background: hovered ? "#F0C040" : "#F5F0E6",
        pointerEvents: "none", zIndex: 99999,
        mixBlendMode: "difference",
        transition: "background 0.2s, transform 0.08s",
        willChange: "transform",
      }} />

      {/* Ring */}
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: hovered ? 48 : 36, height: hovered ? 48 : 36,
        borderRadius: "50%",
        border: `1px solid ${hovered ? "rgba(201,151,28,0.8)" : "rgba(245,240,230,0.22)"}`,
        background: hovered ? "rgba(201,151,28,0.06)" : "transparent",
        pointerEvents: "none", zIndex: 99998,
        transform: `translate(${pos.current.x - (hovered?24:18)}px,${pos.current.y - (hovered?24:18)}px)`,
        transition: "width 0.3s, height 0.3s, border-color 0.3s",
        willChange: "transform",
      }} />
    </>
  );
}
