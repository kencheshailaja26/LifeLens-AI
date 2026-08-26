import { Sparkles, UserRoundCog } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Priority } from "@/data/actions";

const styles: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/20 text-warning-foreground",
  low: "bg-success/15 text-success",
};

const dots: Record<Priority, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};

const labels: Record<Priority, string> = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

export function PriorityBadge({
  priority,
  source,
  className,
}: {
  priority: Priority;
  source?: "ai" | "manual";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        styles[priority],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[priority])} />
      {labels[priority]}
      {source === "manual" ? <UserRoundCog className="h-3 w-3 opacity-70" /> : null}
    </span>
  );
}

export function AIPriorityIndicator({
  manual,
  className,
}: {
  manual?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {manual ? "Priority set by you" : "Prioritized by LifeLens AI"}
    </span>
  );
}
