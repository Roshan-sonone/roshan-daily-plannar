import { motion } from "framer-motion";

const rotations = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]", "-rotate-[1.5deg]"];

export default function StickyNote({
  color = "bg-pastel-yellow",
  title,
  tapeColor = "bg-washi-red",
  children,
  className = "",
  index = 0,
  testId,
}) {
  const rot = rotations[index % rotations.length];
  return (
    <motion.div
      data-testid={testId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={`sticky-note ${color} ${rot} ${className}`}
    >
      <div className={`washi-tape ${tapeColor}`} />
      {title && <h3 className="card-title">{title}</h3>}
      <div className="mt-1">{children}</div>
    </motion.div>
  );
}
