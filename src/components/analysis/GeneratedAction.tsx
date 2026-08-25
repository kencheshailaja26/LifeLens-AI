import { CalendarClock, FileText, Info, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

export type ActionPriorityLevel = "High" | "Medium" | "Low";

export type GeneratedActionItem = {
  id: string;
  title: string;
  due: string;
  dueLabel?: string | undefined;
  priority: ActionPriorityLevel;
  source: string;
  explanation: string;
};

const dot: Record<ActionPriorityLevel, string> = {
  High: "bg-destructive",
  Medium: "bg-warning",
  Low: "bg-muted-foreground",
};

const chip: Record<ActionPriorityLevel, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-warning/20 text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
};

export function GeneratedAction({ action }: { action: GeneratedActionItem }) {
  return (
    <article className="surface-card p-4 transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", dot[action.priority])} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold sm:text-[15px]">{action.title}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                chip[action.priority],
              )}
            >
              {action.priority} priority
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              {action.dueLabel ?? "Due"}: {action.due}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {action.source}
            </span>
          </div>

          <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            {action.explanation}
          </p>
        </div>

        <button
          type="button"
          aria-label={`Edit action: ${action.title}`}
          className="shrink-0 rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
