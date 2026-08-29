import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { ChatWindow } from "@/components/assistant/ChatWindow";
import { PageContainer } from "@/components/layout/PageContainer";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — LifeLens AI" },
      {
        name: "description",
        content: "Ask LifeLens about your documents, deadlines and next steps.",
      },
      { property: "og:title", content: "AI Assistant — LifeLens AI" },
      {
        property: "og:description",
        content: "Your conversational assistant for documents and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <PageContainer
      title="AI Assistant"
      subtitle="Ask LifeLens what you need to know or do."
      actions={
        <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          Grounded in your LifeLens data
        </span>
      }
    >
      <ChatWindow />
    </PageContainer>
  );
}
