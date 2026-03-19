"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
}

const streakColor = (streak: number) => {
  if (streak === 0) return "text-muted-foreground";
  if (streak <= 2) return "text-orange-500";
  if (streak <= 6) return "text-amber-500";
  if (streak <= 13) return "text-red-500";
  return "text-purple-500";
};

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Flame className={cn("size-5", streakColor(streak))} />
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          streakColor(streak),
        )}
      >
        {streak}
      </span>
    </div>
  );
}
