import { AlertTriangle, CalendarClock, CheckCircle2, Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ActionStatus } from "@/data/actions";

export type SummaryCounts = Record<ActionStatus, number>;

const cards: {
  status: ActionStatus;
  label: string;
  icon: typeof Flame;
  tone: string;
}[] = [
  { status: "urgent", label: "Urgent", icon: Flame, tone: "bg-destructive/10 text-destructive" },
  {
    status: "upcoming",
    label: "Upcoming",
    icon: CalendarClock,
    tone: "bg-warning/20 text-warning-foreground",
  },
  { status: "completed", label: "Completed", icon: CheckCircle2, tone: "bg-success/15 text-success" },
  { status: "overdue", label: "Overdue", icon: AlertTriangle, tone: "bg-destructive/15 text-destructive" },
];

export function ActionSummary({
  counts,
  active,
  onSelect,
}: {
  counts: SummaryCounts;
  active: ActionStatus | "all";
  onSelect: (status: ActionStatus) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ status, label, icon: Icon, tone }) => (
        <button
          key={status}
          type="button"
          onClick={() => onSelect(status)}
          aria-pressed={active === status}
          className={cn(
            "surface-card p-4 text-left transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-5",
            active === status && "ring-2 ring-primary/60",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tone)}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{counts[status]}</p>
        </button>
      ))}
    </div>
  );
}
