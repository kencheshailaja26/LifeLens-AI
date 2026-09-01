import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Sparkles } from "lucide-react";

import { ActionFilters, type CategoryFilter, type StatusFilter } from "@/components/actions/ActionFilters";
import { ActionListItem } from "@/components/actions/ActionListItem";
import { ActionSummary, type SummaryCounts } from "@/components/actions/ActionSummary";
import { PageContainer } from "@/components/layout/PageContainer";
import { type ActionItem, type Priority } from "@/data/actions";
import { loadActionItems, saveActionState } from "@/lib/analysis-store";
import { prioritize } from "@/lib/prioritize";


export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Action Center — LifeLens AI" },
      {
        name: "description",
        content:
          "Everything important, organized by what needs your attention — prioritized by LifeLens AI from your documents.",
      },
      { property: "og:title", content: "Action Center — LifeLens AI" },
      {
        property: "og:description",
        content: "Smart task prioritization from deadlines, importance and consequences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ActionsPage,
});

const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // Single source of truth: real analyzed documents in the session store.
  useEffect(() => {
    setActions(loadActionItems());
  }, []);


  const counts = useMemo<SummaryCounts>(
    () =>
      actions.reduce(
        (acc, action) => {
          acc[action.status] += 1;
          return acc;
        },
        { urgent: 0, upcoming: 0, completed: 0, overdue: 0 } as SummaryCounts,
      ),
    [actions],
  );

  const visible = useMemo(
    () =>
      actions
        .filter((a) => (status === "all" ? true : a.status === status))
        .filter((a) => (category === "all" ? true : a.category === category))
        .sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const pa = prioritize(a.signals, a.manualPriority);
          const pb = prioritize(b.signals, b.manualPriority);
          if (rank[pa.priority] !== rank[pb.priority]) return rank[pa.priority] - rank[pb.priority];
          return a.signals.dueInDays - b.signals.dueInDays;
        }),
    [actions, status, category],
  );

  const update = (id: string, patch: Partial<ActionItem>) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const toggleComplete = (id: string) =>
    setActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const completed = !a.completed;
        return {
          ...a,
          completed,
          status: completed
            ? "completed"
            : a.signals.dueInDays < 0
              ? "overdue"
              : a.signals.dueInDays <= 1
                ? "urgent"
                : "upcoming",
          due: completed ? "Completed" : a.due === "Completed" ? "Due soon" : a.due,
        };
      }),
    );

  return (
    <PageContainer
      title="Your Action Center"
      subtitle="Everything important, organized by what needs your attention."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Prioritized by LifeLens AI
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            {actions.length} actions
          </span>
        </div>
      }
    >
      <div className="space-y-5">
        <ActionSummary
          counts={counts}
          active={status}
          onSelect={(next) => setStatus((cur) => (cur === next ? "all" : next))}
        />

        <ActionFilters
          status={status}
          category={category}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
        />

        {visible.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ListChecks className="h-6 w-6" />
            </span>
            <h2 className="text-base font-semibold">Nothing needs your attention here</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              No actions match this filter. Upload something to your inbox and LifeLens will turn it
              into prioritized actions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((action) => (
              <ActionListItem
                key={action.id}
                action={action}
                onToggleComplete={toggleComplete}
                onPriorityChange={(id, priority) => update(id, { manualPriority: priority })}
                onDueChange={(id, due) => update(id, { due })}
                onDelete={(id) => setActions((prev) => prev.filter((a) => a.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
