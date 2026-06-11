import { motion } from "motion/react";

const items = [
  "React.js", "·", "Node.js", "·", "TypeScript", "·", "MongoDB", "·",
  "Redis Pub/Sub", "·", "AWS Lambda", "·", "WhatsApp API", "·", "Agora SDK", "·",
  "BullMQ", "·", "Next.js", "·", "Razorpay", "·", "Firebase", "·",
  "Stripe", "·", "RTK Query", "·", "WebSockets", "·", "TanStack Query", "·",
];

export function MarqueeStrip() {
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#0F0B00", borderTop: "1px solid rgba(201,151,28,0.08)", borderBottom: "1px solid rgba(201,151,28,0.08)", padding: "0.875rem 0", overflow: "hidden" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: "1.75rem", whiteSpace: "nowrap", width: "max-content", alignItems: "center" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: item === "·" ? "sans-serif" : "JetBrains Mono, monospace",
            fontSize: item === "·" ? "0.8rem" : "0.7rem",
            color: item === "·" ? "rgba(201,151,28,0.4)" : "#7A6A45",
            letterSpacing: item === "·" ? 0 : "0.14em",
            textTransform: item === "·" ? "none" : "uppercase",
            flexShrink: 0,
          }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
