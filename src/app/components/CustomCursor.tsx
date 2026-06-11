import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 5;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>(Array(TRAIL_COUNT).fill(null));
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    const history = Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }));
    let hovered = false;
    let clicked = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
    };
    const onOver = (event: PointerEvent) => {
      hovered = Boolean((event.target as Element | null)?.closest("a, button, [data-cursor]"));
    };
    const onDown = () => { clicked = true; };
    const onUp = () => { clicked = false; };

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0) scale(${clicked ? 0.65 : 1})`;
        dotRef.current.style.background = hovered ? "#F0C040" : "#F5F0E6";
      }
      if (ringRef.current) {
        const size = hovered ? 46 : 34;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = hovered ? "rgba(201,151,28,0.8)" : "rgba(245,240,230,0.22)";
        ringRef.current.style.transform = `translate3d(${ring.x - size / 2}px, ${ring.y - size / 2}px, 0)`;
      }

      history.unshift({ ...pos });
      history.pop();
      trailRefs.current.forEach((element, index) => {
        if (!element) return;
        const point = history[index];
        element.style.transform = `translate3d(${point.x - 2}px, ${point.y - 2}px, 0)`;
        element.style.opacity = String((1 - index / TRAIL_COUNT) * (hovered ? 0.3 : 0.12));
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <div
          key={index}
          ref={element => { trailRefs.current[index] = element; }}
          style={{
            position: "fixed", top: 0, left: 0, width: 4, height: 4,
            borderRadius: "50%", background: "#C9971C", opacity: 0,
            pointerEvents: "none", zIndex: 99996, willChange: "transform",
          }}
        />
      ))}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 34, height: 34,
          borderRadius: "50%", border: "1px solid rgba(245,240,230,0.22)",
          pointerEvents: "none", zIndex: 99998, willChange: "transform",
          transition: "width 0.2s, height 0.2s, border-color 0.2s",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 8, height: 8,
          borderRadius: "50%", background: "#F5F0E6", pointerEvents: "none",
          zIndex: 99999, mixBlendMode: "difference", willChange: "transform",
        }}
      />
    </>
  );
}
