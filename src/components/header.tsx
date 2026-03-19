"use client";

import Link from "next/link";
import { BarChart3, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/">
        <h1 className="text-xl font-bold">Accent Trainer</h1>
      </Link>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/progress" aria-label="View progress">
            <BarChart3 className="size-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
