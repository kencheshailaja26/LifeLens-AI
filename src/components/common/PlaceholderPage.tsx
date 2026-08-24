import type { LucideIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";

export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
  message,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  message: string;
}) {
  return (
    <PageContainer title={title} subtitle={subtitle}>
      <div className="surface-card flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
    </PageContainer>
  );
}
