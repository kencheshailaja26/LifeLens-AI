import { useState } from "react";
import {
  CalendarClock,
  Check,
  FileText,
  Info,
  Link2,
  Pencil,
  Trash2,
} from "lucide-react";

import { AIPriorityIndicator, PriorityBadge } from "@/components/actions/PriorityBadge";
import { cn } from "@/lib/utils";
import type { ActionItem, Priority } from "@/data/actions";
import { prioritize } from "@/lib/prioritize";

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function ActionListItem({
  action,
  onToggleComplete,
  onPriorityChange,
  onDueChange,
  onDelete,
}: {
  action: ActionItem;
  onToggleComplete: (id: string) => void;
  onPriorityChange: (id: string, priority: Priority) => void;
  onDueChange: (id: string, due: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const result = prioritize(action.signals, action.manualPriority);

  return (
    <article className="surface-card p-4 transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-5">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onToggleComplete(action.id)}
          aria-label={action.completed ? "Mark as not done" : "Mark as done"}
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            action.completed
              ? "border-success bg-success text-success-foreground"
              : "border-border hover:border-primary",
          )}
        >
          {action.completed ? <Check className="h-3.5 w-3.5" /> : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "text-sm font-semibold sm:text-[15px]",
                action.completed && "text-muted-foreground line-through",
              )}
            >
              {action.title}
            </h3>
            <PriorityBadge priority={result.priority} source={result.source} />
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {action.category}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              {action.due}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              From {action.source}
            </span>
            {action.signals.blocks ? (
              <span className="inline-flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                Blocks {action.signals.blocks}
              </span>
            ) : null}
          </div>

          <div className="mt-3 rounded-xl bg-muted/50 px-3 py-2">
            <AIPriorityIndicator manual={result.source === "manual"} />
            <p className="mt-1.5 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {result.explanation}
            </p>
          </div>

          {editing ? (
            <div className="mt-3 space-y-3 rounded-xl border border-border p-3">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Override priority
                </p>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onPriorityChange(action.id, option.value)}
                      aria-pressed={result.priority === option.value}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        result.priority === option.value
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`due-${action.id}`}
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Due date
                </label>
                <input
                  id={`due-${action.id}`}
                  value={action.due}
                  onChange={(event) => onDueChange(action.id, event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More options: ${action.title}`}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => onToggleComplete(action.id)}>
                <Check className="h-4 w-4" />
                {action.completed ? "Mark as not done" : "Complete"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Change priority
              </DropdownMenuLabel>
              {priorityOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => onPriorityChange(action.id, option.value)}
                >
                  <Flag className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <CalendarClock className="h-4 w-4" />
                Change due date
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(action.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            aria-label={`Edit action: ${action.title}`}
            className={cn(
              "rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              editing && "bg-accent text-foreground",
            )}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

      </div>
    </article>
  );
}
