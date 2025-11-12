"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export const ThemeProvider = ({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
export const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="hover:bg-mantle p-2 rounded-full text-black/80 dark:text-white hover:text-red-400 transition-all">
      {resolvedTheme === "dark" ? <Sun size={18} className="rounded-full" /> : <Moon size={18} className="rounded-full" />}
    </button>
  );
};