import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CircleTextOverlay from "@/components/loaders/CircleTextOverlay";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = (theme === "system" ? systemTheme : theme) || "light";
  const isDark = current === "dark";

  const trigger = (next: "light" | "dark") => {
    setLoading(true);
    setTheme(next);
    setTimeout(() => setLoading(false), 900);
  };

  return (
    <>
      {loading && (
        <CircleTextOverlay
          text="List To Do"
          durationMs={900}
          colors={["bg-blue-500", "bg-red-500", "bg-yellow-400"]}
        />
      )}
      <div
        role="group"
        aria-label="Theme switch"
        className="relative h-9 w-[76px] rounded-full border bg-muted/60 backdrop-blur px-1 flex items-center gap-1 shadow-inner"
      >
        <motion.div
          layout
          className="absolute h-7 w-7 rounded-full bg-primary shadow-sm"
          style={{ left: isDark ? 40 : 4, top: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <button
          type="button"
          aria-pressed={!isDark}
          onClick={() => trigger("light")}
          className="relative z-10 grid place-items-center h-7 w-7 rounded-full"
        >
          <Sun
            className={`h-4 w-4 ${!isDark ? "text-primary-foreground" : "text-muted-foreground"}`}
          />
          <span className="sr-only">Bright</span>
        </button>
        <button
          type="button"
          aria-pressed={isDark}
          onClick={() => trigger("dark")}
          className="relative z-10 grid place-items-center h-7 w-7 rounded-full"
        >
          <Moon
            className={`h-4 w-4 ${isDark ? "text-primary-foreground" : "text-muted-foreground"}`}
          />
          <span className="sr-only">Dark</span>
        </button>
      </div>
    </>
  );
}
