import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — LifeLens AI" },
      { name: "description", content: "Everything you drop into LifeLens lands here before it becomes actions." },
      { property: "og:title", content: "Inbox — LifeLens AI" },
      { property: "og:description", content: "Captured documents, screenshots and notes waiting to be turned into actions." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Inbox"
      subtitle="Everything you capture lands here first."
      icon={Inbox}
      message="Uploaded PDFs, screenshots, bills and pasted notes will appear here for review."
    />
  ),
});
