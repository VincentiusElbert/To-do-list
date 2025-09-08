import { motion } from "framer-motion";

export default function ThreeDotsWave({
  colors = ["bg-blue-500", "bg-green-500", "bg-red-500"],
  size = 10,
}: {
  colors?: string[];
  size?: number;
}) {
  const dot = {
    initial: { y: 0, opacity: 0.7 },
    animate: (i: number) => ({
      y: [0, -6, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.15,
      },
    }),
  } as const;

  const px = `${size}px`;

  return (
    <div className="flex items-center gap-2">
      {colors.slice(0, 3).map((c, i) => (
        <motion.span
          key={i}
          className={`inline-block rounded-full ${c}`}
          style={{ width: px, height: px }}
          variants={dot}
          custom={i}
          initial="initial"
          animate="animate"
          aria-hidden
        />
      ))}
    </div>
  );
}
