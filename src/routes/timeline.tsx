import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — LifeLens AI" },
      { name: "description", content: "A chronological view of your deadlines and upcoming commitments." },
      { property: "og:title", content: "Timeline — LifeLens AI" },
      { property: "og:description", content: "See how your deadlines stack up across the coming weeks." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Timeline"
      subtitle="Your deadlines across the coming weeks."
      icon={CalendarClock}
      message="A chronological view of extracted deadlines will be shown here."
    />
  ),
});
