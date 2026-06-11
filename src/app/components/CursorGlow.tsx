import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, mass: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "screen",
      }}
    />
  );
}
