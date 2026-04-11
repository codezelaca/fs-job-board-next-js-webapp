"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark 
            ? "opacity-0 -rotate-90 scale-0 text-zinc-200" 
            : "opacity-100 rotate-0 scale-100 text-zinc-800"
        }`} 
      />
      <Moon 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark 
            ? "opacity-100 rotate-0 scale-100 text-zinc-200" 
            : "opacity-0 rotate-90 scale-0 text-zinc-800"
        }`} 
      />
    </button>
  );
}
