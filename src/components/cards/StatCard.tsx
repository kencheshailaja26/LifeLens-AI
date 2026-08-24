import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatTone = "urgent" | "upcoming" | "completed" | "neutral";

const toneStyles: Record<StatTone, string> = {
  urgent: "bg-destructive/10 text-destructive",
  upcoming: "bg-warning/15 text-warning-foreground",
  completed: "bg-success/15 text-success",
  neutral: "bg-primary/10 text-primary",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
}) {
  return (
    <div className="surface-card p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneStyles[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
