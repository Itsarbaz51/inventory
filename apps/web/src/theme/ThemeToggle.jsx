"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);

  // Read localStorage only on client
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";

    setTheme(savedTheme);
    setMounted(true);
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      root.classList.toggle("dark", systemDark);
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((current) => {
      if (current === "dark") {
        return "light";
      }

      return "dark";
    });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </Button>
  );
}
