import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  Heart,
  Plane,
  Receipt,
  Ticket,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ActionCategory, Priority } from "@/data/actions";
import type { TimelineItem } from "@/data/timeline";

export const categoryIcons: Record<ActionCategory, LucideIcon> = {
  Career: Briefcase,
  Education: GraduationCap,
  Bills: Receipt,
  Travel: Plane,
  Events: Ticket,
  Personal: Heart,
};

export const priorityStyles: Record<Priority, { dot: string; label: string; chip: string }> = {
  high: { dot: "bg-destructive", label: "High", chip: "bg-destructive/10 text-destructive" },
  medium: { dot: "bg-warning", label: "Medium", chip: "bg-warning/20 text-warning-foreground" },
  low: { dot: "bg-success", label: "Low", chip: "bg-success/15 text-success" },
};

export function TimelineEntry({ item }: { item: TimelineItem }) {
  const Icon = categoryIcons[item.category];
  const priority = priorityStyles[item.priority];

  return (
    <div className="relative pl-10 sm:pl-14">
      {/* Date marker */}
      <span className="absolute left-0 top-1 hidden w-11 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:block">
        {formatShortDate(item.date)}
      </span>
      {/* Node on the line */}
      <span
        className={cn(
          "absolute left-2 top-2 h-3 w-3 rounded-full ring-4 ring-background sm:left-[52px]",
          priority.dot,
        )}
      />

      <div
        className={cn(
          "surface-card flex flex-wrap items-center gap-3 p-4 transition-colors hover:border-primary/40",
          item.completed && "opacity-60",
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                item.completed && "line-through",
              )}
            >
              {item.title}
            </p>
            {item.completed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            ) : null}
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatLongDate(item.date)}
            <span aria-hidden>·</span>
            {item.category}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            priority.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
          {priority.label}
        </span>

        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          title={`Source: ${item.source}`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span className="max-w-32 truncate">{item.source}</span>
        </Link>
      </div>
    </div>
  );
}

export function formatShortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;
}

export function formatLongDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

export function formatGroupHeading(iso: string) {
  return new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-US", { month: "long", day: "numeric" })
    .toUpperCase();
}
