import { ArrowUpRight } from "lucide-react";

export function SuggestedQuestion({
  question,
  onSelect,
}: {
  question: string;
  onSelect: (q: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(question)}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-left text-sm text-foreground/80 transition hover:border-primary/50 hover:text-foreground hover:shadow-sm"
    >
      {question}
      <ArrowUpRight className="size-3.5 text-muted-foreground transition group-hover:text-primary" aria-hidden />
    </button>
  );
}
