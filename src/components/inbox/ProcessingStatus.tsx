import { CheckCircle2, CircleAlert, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export type UploadStatus = "ready" | "processing" | "analyzed" | "error";

const config: Record<
  UploadStatus,
  { label: string; className: string; spin?: boolean; Icon: typeof CheckCircle2 }
> = {
  ready: {
    label: "Ready",
    className: "bg-accent text-accent-foreground",
    Icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    className: "bg-primary/10 text-primary",
    spin: true,
    Icon: Loader2,
  },
  analyzed: {
    label: "Analyzed",
    className: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    Icon: Sparkles,
  },
  error: {
    label: "Error",
    className: "bg-destructive/10 text-destructive",
    Icon: CircleAlert,
  },
};

export function ProcessingStatus({
  status,
  className,
}: {
  status: UploadStatus;
  className?: string;
}) {
  const { label, className: tone, spin, Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone,
        className,
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", spin && "animate-spin")} />
      {label}
    </span>
  );
}
