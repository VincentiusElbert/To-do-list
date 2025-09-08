import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  const text = " to do list • ";
  const repeated = text.repeat(12);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/95 backdrop-blur-sm">
      <div className="relative h-40 w-40">
        <motion.svg
          viewBox="0 0 100 100"
          className="h-full w-full text-foreground"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path
              id="circlePath"
              d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"
            />
          </defs>
          <text fontSize="7" letterSpacing="1" fill="currentColor">
            <textPath href="#circlePath">{repeated}</textPath>
          </text>
        </motion.svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-sm font-semibold tracking-wide text-foreground">
            Loading
          </div>
        </motion.div>
      </div>
    </div>
  );
}
