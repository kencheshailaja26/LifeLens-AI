import { Brain, ChevronRight, ListChecks, ScanText, Upload } from "lucide-react";

const steps = [
  { label: "Upload", Icon: Upload },
  { label: "Understand", Icon: Brain },
  { label: "Extract", Icon: ScanText },
  { label: "Act", Icon: ListChecks },
];

export function PipelineSteps({ activeIndex = 3 }: { activeIndex?: number }) {
  return (
    <ol className="surface-card flex flex-wrap items-center gap-2 p-3 sm:gap-3 sm:p-4">
      {steps.map(({ label, Icon }, i) => (
        <li key={label} className="flex items-center gap-2 sm:gap-3">
          <div
            className={
              i <= activeIndex
                ? "flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary"
                : "flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-muted-foreground"
            }
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
          </div>
          {i < steps.length - 1 ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
