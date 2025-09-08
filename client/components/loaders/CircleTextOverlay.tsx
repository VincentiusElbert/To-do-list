import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThreeDotsWave from "@/components/loaders/ThreeDotsWave";
import { createPortal } from "react-dom";

export default function CircleTextOverlay({
  text = "List To Do",
  durationMs = 900,
  colors = ["bg-blue-500", "bg-red-500", "bg-yellow-400"],
}: {
  text?: string;
  durationMs?: number;
  colors?: string[];
}) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);
  if (!show) return null;

  const repeated = ` ${text} • `.repeat(12);

  const overlay = (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/90 backdrop-blur-sm">
      <div className="relative h-40 w-40">
        <motion.svg
          viewBox="0 0 100 100"
          className="h-full w-full text-foreground"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path
              id="circlePath2"
              d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"
            />
          </defs>
          <text fontSize="7" letterSpacing="1" fill="currentColor">
            <textPath href="#circlePath2">{repeated}</textPath>
          </text>
        </motion.svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <ThreeDotsWave colors={colors} size={10} />
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
