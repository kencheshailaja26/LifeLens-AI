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
  className,
}: {
  priority: Priority;
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
    </span>
  );
}
