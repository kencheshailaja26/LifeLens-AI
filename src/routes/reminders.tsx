import { createFileRoute } from "@tanstack/react-router";
import { BellRing } from "lucide-react";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — LifeLens AI" },
      { name: "description", content: "Nudges for deadlines LifeLens finds in your documents." },
      { property: "og:title", content: "Reminders — LifeLens AI" },
      { property: "og:description", content: "Set and manage reminders for extracted deadlines." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Reminders"
      subtitle="Never miss a deadline again."
      icon={BellRing}
      message="Reminder scheduling and notification preferences will appear here."
    />
  ),
});
