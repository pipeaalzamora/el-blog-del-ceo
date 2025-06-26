"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar hidration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center rounded-md w-9 h-9 bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        disabled
      >
        <span className="sr-only">Toggle theme</span>
        <div className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      className="inline-flex items-center justify-center rounded-md w-9 h-9 bg-background hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
