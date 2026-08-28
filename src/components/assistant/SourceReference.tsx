import { FileText } from "lucide-react";

export function SourceReference({ sources }: { sources: string[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
      <span className="text-xs font-medium text-muted-foreground">Source:</span>
      {sources.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80"
        >
          <FileText className="size-3.5 text-primary" aria-hidden />
          {s}
        </span>
      ))}
    </div>
  );
}
