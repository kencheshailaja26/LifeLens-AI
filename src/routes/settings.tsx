import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { PlaceholderPage } from "@/components/common/PlaceholderPage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LifeLens AI" },
      { name: "description", content: "Manage your LifeLens profile, preferences and notifications." },
      { property: "og:title", content: "Settings — LifeLens AI" },
      { property: "og:description", content: "Profile, preferences and notification settings." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      title="Settings"
      subtitle="Profile, preferences and notifications."
      icon={Settings}
      message="Account and workspace preferences will be configurable here."
    />
  ),
});
