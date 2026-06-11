import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
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

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let interactive = false;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;
    };
    const onOver = (event: PointerEvent) => {
      interactive = Boolean((event.target as Element | null)?.closest("a, button, [data-cursor]"));
    };
    const onLeave = () => { visible = false; };
    const onEnter = () => { visible = true; };
    const onDown = () => { pressed = true; };
    const onUp = () => { pressed = false; };

    const tick = () => {
      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;

      if (cursorRef.current) {
        const size = interactive ? 50 : 34;
        const scale = pressed ? 0.82 : 1;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
        cursorRef.current.style.opacity = visible ? "1" : "0";
        cursorRef.current.style.transform = `translate3d(${current.x - size / 2}px, ${current.y - size / 2}px, 0) scale(${scale})`;
        cursorRef.current.style.setProperty("--cursor-color", interactive ? "#F0C040" : "#C9971C");
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${target.x - 2}px, ${target.y - 2}px, 0) scale(${pressed ? 1.7 : 1})`;
        coreRef.current.style.opacity = visible ? "1" : "0";
        coreRef.current.style.background = interactive ? "#F0C040" : "#F5F0E6";
      }
      if (labelRef.current) {
        labelRef.current.style.opacity = interactive && visible ? "1" : "0";
        labelRef.current.style.transform = interactive ? "translateY(0)" : "translateY(3px)";
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const corner = {
    position: "absolute" as const,
    width: 8,
    height: 8,
    borderColor: "var(--cursor-color)",
    transition: "border-color 0.2s",
  };

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          "--cursor-color": "#C9971C",
          position: "fixed", top: 0, left: 0, width: 34, height: 34,
          pointerEvents: "none", zIndex: 99998, opacity: 0,
          willChange: "transform,width,height", transition: "width 0.2s,height 0.2s,opacity 0.18s",
        } as React.CSSProperties}
      >
        <span style={{ ...corner, top: 0, left: 0, borderTop: "1px solid", borderLeft: "1px solid" }} />
        <span style={{ ...corner, top: 0, right: 0, borderTop: "1px solid", borderRight: "1px solid" }} />
        <span style={{ ...corner, bottom: 0, left: 0, borderBottom: "1px solid", borderLeft: "1px solid" }} />
        <span style={{ ...corner, bottom: 0, right: 0, borderBottom: "1px solid", borderRight: "1px solid" }} />
        <span
          ref={labelRef}
          style={{
            position: "absolute", left: "50%", top: "calc(100% + 7px)",
            transform: "translate(-50%,3px)", opacity: 0,
            fontFamily: "JetBrains Mono,monospace", fontSize: "0.48rem",
            color: "#F0C040", letterSpacing: "0.12em",
            transition: "opacity 0.16s,transform 0.16s",
          }}
        >
          OPEN
        </span>
      </div>
      <div
        ref={coreRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 4, height: 4,
          borderRadius: "50%", background: "#F5F0E6",
          pointerEvents: "none", zIndex: 99999, opacity: 0,
          boxShadow: "0 0 8px rgba(240,192,64,0.45)",
          willChange: "transform", transition: "opacity 0.18s,background 0.18s",
        }}
      />
    </>
  );
}
