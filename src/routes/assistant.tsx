import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — LifeLens AI" },
      { name: "description", content: "Ask LifeLens about your documents, deadlines and next steps." },
      { property: "og:title", content: "AI Assistant — LifeLens AI" },
      { property: "og:description", content: "Your conversational assistant for documents and deadlines." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="AI Assistant"
      subtitle="Ask anything about your information."
      icon={Sparkles}
      message="Conversational answers about your documents, deadlines and next steps will live here."
    />
  ),
});
