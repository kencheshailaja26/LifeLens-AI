import { Check } from "lucide-react";

export function RequirementItem({ label, note }: { label: string; note?: string | undefined }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Check className="h-3 w-3" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}
