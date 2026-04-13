// src/components/layout/ThemeToggle.tsx

"use client";

import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="btn btn-ghost btn-circle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Change Theme"
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}
