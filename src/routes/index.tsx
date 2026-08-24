import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock,
  CalendarClock,
  CheckCircle2,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";

import { ActionCard } from "@/components/cards/ActionCard";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { StatCard } from "@/components/cards/StatCard";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { sampleActions, sampleDocuments } from "@/data/sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LifeLens AI Action Center" },
      {
        name: "description",
        content:
          "LifeLens AI turns documents, bills and emails into prioritized actions so you never miss a deadline.",
      },
      { property: "og:title", content: "Dashboard — LifeLens AI Action Center" },
      {
        property: "og:description",
        content:
          "See what needs your attention today: urgent actions, upcoming deadlines and recent documents.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <PageContainer
      title={<>Good morning 👋</>}
      subtitle="Here's what needs your attention today."
      actions={
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Upload className="h-4 w-4" />
          Upload information
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Urgent" value={2} hint="Due within 24 hours" icon={AlarmClock} tone="urgent" />
        <StatCard label="Upcoming" value={5} hint="Next 7 days" icon={CalendarClock} tone="upcoming" />
        <StatCard label="Completed" value={12} hint="This month" icon={CheckCircle2} tone="completed" />
        <StatCard label="Documents" value={8} hint="4 analyzed" icon={FileText} tone="neutral" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section>
            <SectionHeading
              title="Today's Actions"
              action={
                <Link to="/actions" className="text-sm font-semibold text-primary hover:underline">
                  View all
                </Link>
              }
            />
            <div className="space-y-3">
              {sampleActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              title="Recent Documents"
              action={
                <Link to="/documents" className="text-sm font-semibold text-primary hover:underline">
                  View all
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sampleDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="surface-card p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ai/15 text-ai">
                <Sparkles className="h-[18px] w-[18px]" />
              </span>
              <h2 className="text-base font-semibold tracking-tight">AI Insights</h2>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
              Your AI insights will appear here after LifeLens analyzes your information.
            </div>
            <button className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-muted">
              <Sparkles className="h-4 w-4 text-ai" />
              Ask LifeLens
            </button>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-base font-semibold tracking-tight">Deadline radar</h2>
            <ul className="mt-4 space-y-4">
              {[
                { label: "Internship documents", when: "Today" },
                { label: "Electricity bill", when: "Tomorrow" },
                { label: "Flight web check-in", when: "In 2 days" },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {item.when}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}
