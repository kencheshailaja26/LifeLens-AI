import { cn } from "@/lib/utils";
import { actionCategories, type ActionCategory, type ActionStatus } from "@/data/actions";

export type StatusFilter = ActionStatus | "all";
export type CategoryFilter = ActionCategory | "all";

const statuses: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "urgent", label: "Urgent" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function ActionFilters({
  status,
  category,
  onStatusChange,
  onCategoryChange,
}: {
  status: StatusFilter;
  category: CategoryFilter;
  onStatusChange: (value: StatusFilter) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}) {
  return (
    <div className="surface-card space-y-3 p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Chip
              key={s.value}
              label={s.label}
              active={status === s.value}
              onClick={() => onStatusChange(s.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip label="All" active={category === "all"} onClick={() => onCategoryChange("all")} />
          {actionCategories.map((c) => (
            <Chip
              key={c}
              label={c}
              active={category === c}
              onClick={() => onCategoryChange(c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
