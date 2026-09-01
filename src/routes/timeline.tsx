import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ListTree, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  TimelineEntry,
  formatGroupHeading,
  formatShortDate,
  priorityStyles,
} from "@/components/timeline/TimelineEntry";
import type { ActionCategory } from "@/data/actions";
import type { TimelineItem } from "@/data/timeline";
import { loadTimelineItems } from "@/lib/analysis-store";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Your Timeline — LifeLens AI" },
      {
        name: "description",
        content: "See what's coming before it becomes urgent — a chronological view of your deadlines.",
      },
      { property: "og:title", content: "Your Timeline — LifeLens AI" },
      {
        property: "og:description",
        content: "Deadlines grouped by date, in timeline or calendar view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

type Filter = "all" | "week" | "month" | ActionCategory;
type ViewMode = "timeline" | "calendar";

/** Real "today" for relative filters. */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "Career", label: "Career" },
  { value: "Education", label: "Education" },
  { value: "Bills", label: "Bills" },
  { value: "Travel", label: "Travel" },
];

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function TimelinePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("timeline");

  const items = useMemo(() => loadTimelineItems(), []);

  const visible = useMemo(() => {
    const today = todayISO();
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.filter((item) => {
      if (filter === "all") return true;
      if (filter === "week") return item.date >= today && item.date <= addDays(today, 7);
      if (filter === "month") return item.date.slice(0, 7) === today.slice(0, 7);
      return item.category === filter;
    });
  }, [items, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof visible>();
    for (const item of visible) {
      const list = map.get(item.date) ?? [];
      list.push(item);
      map.set(item.date, list);
    }
    return [...map.entries()];
  }, [visible]);

  return (
    <PageContainer
      title="Your Timeline"
      subtitle="See what's coming before it becomes urgent."
      actions={
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Dates extracted by LifeLens AI
          </span>
          <div className="surface-card flex rounded-xl p-1">
            {(
              [
                { value: "timeline", label: "Timeline", icon: ListTree },
                { value: "calendar", label: "Calendar", icon: CalendarDays },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                aria-pressed={view === value}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  view === value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === f.value
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays className="h-6 w-6" />
            </span>
            <h2 className="text-base font-semibold">Nothing on the horizon</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              No deadlines match this filter. Upload documents to your inbox and LifeLens will place
              their dates here.
            </p>
          </div>
        ) : view === "timeline" ? (
          <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-border sm:before:left-[67px]">
            {groups.map(([date, items]) => (
              <section key={date} className="space-y-3">
                <h2 className="pl-10 text-xs font-bold uppercase tracking-widest text-muted-foreground sm:pl-14">
                  {formatGroupHeading(date)}
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <TimelineEntry key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <CalendarView items={visible} />
        )}
      </div>
    </PageContainer>
  );
}

function CalendarView({ items }: { items: typeof timelineItems }) {
  const month = "2026-06";
  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Build weeks (Mon–Sun) covering the month.
  const first = new Date(`${month}-01T00:00:00`);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const byDate = new Map<string, typeof items>();
  for (const item of items) {
    const list = byDate.get(item.date) ?? [];
    list.push(item);
    byDate.set(item.date, list);
  }

  return (
    <div className="surface-card p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {monthLabel}
      </h2>
      <div className="grid grid-cols-7 gap-1.5">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <p key={d} className="pb-1 text-center text-[11px] font-semibold text-muted-foreground">
            {d}
          </p>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <div key={`empty-${i}`} />;
          const dayItems = byDate.get(iso) ?? [];
          const isToday = iso === TODAY;
          return (
            <div
              key={iso}
              className={cn(
                "min-h-20 rounded-lg border border-border bg-muted/30 p-1.5",
                isToday && "border-primary/50 bg-primary/5",
              )}
            >
              <p
                className={cn(
                  "text-[11px] font-semibold",
                  isToday ? "text-primary" : "text-muted-foreground",
                )}
              >
                {Number(iso.slice(-2))}
                {isToday ? <span className="sr-only"> (today)</span> : null}
              </p>
              <div className="mt-1 space-y-1">
                {dayItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    title={`${item.title} — ${formatShortDate(item.date)}`}
                    className={cn(
                      "flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-medium",
                      priorityStyles[item.priority].chip,
                      item.completed && "opacity-60 line-through",
                    )}
                  >
                    <span
                      className={cn("h-1 w-1 shrink-0 rounded-full", priorityStyles[item.priority].dot)}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
                {dayItems.length > 3 ? (
                  <p className="px-1 text-[10px] text-muted-foreground">+{dayItems.length - 3} more</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
