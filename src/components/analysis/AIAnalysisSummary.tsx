import { BadgeCheck, FolderTree, Sparkles } from "lucide-react";

export type AnalysisSummary = {
  documentType: string;
  category: string;
  confidence: "High" | "Medium" | "Low";
};

const confidenceTone: Record<AnalysisSummary["confidence"], string> = {
  High: "bg-success/15 text-success",
  Medium: "bg-warning/20 text-warning-foreground",
  Low: "bg-destructive/10 text-destructive",
};

export function AIAnalysisSummary({ summary }: { summary: AnalysisSummary }) {
  const items = [
    { label: "Document Type", value: summary.documentType, Icon: Sparkles },
    { label: "Category", value: summary.category, Icon: FolderTree },
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-3">
        {items.map(({ label, value, Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              AI Confidence
            </p>
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${confidenceTone[summary.confidence]}`}
            >
              {summary.confidence}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
