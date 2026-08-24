import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

import { ActionCard } from "@/components/cards/ActionCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { sampleActions } from "@/data/sample";

export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Actions — LifeLens AI" },
      { name: "description", content: "Every task LifeLens extracted from your information, sorted by priority." },
      { property: "og:title", content: "Actions — LifeLens AI" },
      { property: "og:description", content: "A prioritized list of what you need to do next." },
    ],
  }),
  component: ActionsPage,
});

function ActionsPage() {
  return (
    <PageContainer
      title="Actions"
      subtitle="Every task LifeLens found, sorted by priority."
      actions={
        <span className="inline-flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
          <ListChecks className="h-4 w-4" />
          {sampleActions.length} actions
        </span>
      }
    >
      <div className="space-y-3">
        {sampleActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </PageContainer>
  );
}
