import { CheckCircle2, Clock, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

export type ActionPriority = "urgent" | "soon" | "later";

const priorityStyles: Record<ActionPriority, string> = {
  urgent: "bg-destructive/10 text-destructive",
  soon: "bg-warning/20 text-warning-foreground",
  later: "bg-muted text-muted-foreground",
};

const priorityLabel: Record<ActionPriority, string> = {
  urgent: "Urgent",
  soon: "Due soon",
  later: "Later",
};

export type Action = {
  id: string;
  title: string;
  description: string;
  due: string;
  source: string;
  priority: ActionPriority;
  done?: boolean;
};

export function ActionCard({ action }: { action: Action }) {
  return (
    <article className="surface-card flex gap-4 p-4 transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-5">
      <button
        aria-label={action.done ? "Mark as not done" : "Mark as done"}
        className={cn(
          "mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 transition-colors",
          action.done ? "border-success bg-success" : "border-border hover:border-primary",
        )}
      >
        {action.done ? (
          <CheckCircle2 className="h-full w-full text-success-foreground" />
        ) : null}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              "text-sm font-semibold sm:text-[15px]",
              action.done && "text-muted-foreground line-through",
            )}
          >
            {action.title}
          </h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              priorityStyles[action.priority],
            )}
          >
            {priorityLabel[action.priority]}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{action.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {action.due}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            {action.source}
          </span>
        </div>
      </div>
    </article>
  );
}
