import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlarmClock,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  FileText,
  Info,
  Sparkles,
  Upload,
} from "lucide-react";

import { ActionCard, type Action } from "@/components/cards/ActionCard";
import { DocumentCard, type DocumentItem } from "@/components/cards/DocumentCard";
import { StatCard } from "@/components/cards/StatCard";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import {
  loadActionItems,
  loadDocumentItems,
  loadInsights,
  loadReminders,
  type Insight,
  type InsightTone,
  type Reminder,
} from "@/lib/analysis-store";
import { formatLongDate } from "@/components/timeline/TimelineEntry";
import { cn } from "@/lib/utils";

const insightIcons: Record<InsightTone, React.ElementType> = {
  urgent: AlarmClock,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const insightToneStyles: Record<InsightTone, string> = {
  urgent: "bg-destructive/10 text-destructive",
  warning: "bg-warning/20 text-warning-foreground",
  info: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
};

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
  const [insights, setInsights] = useState<Insight[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [counts, setCounts] = useState({ urgent: 0, upcoming: 0, completed: 0, documents: 0 });

  useEffect(() => {
    const items = loadActionItems();
    const docs = loadDocumentItems();
    setInsights(loadInsights());
    setReminders(loadReminders().slice(0, 5));
    setDocuments(docs);
    setCounts({
      urgent: items.filter((i) => !i.completed && (i.status === "urgent" || i.status === "overdue"))
        .length,
      upcoming: items.filter(
        (i) => !i.completed && i.signals.dueInDays > 1 && i.signals.dueInDays <= 7,
      ).length,
      completed: items.filter((i) => i.completed).length,
      documents: docs.length,
    });
    setActions(
      items.slice(0, 5).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        due: item.due,
        source: item.source,
        priority:
          item.status === "urgent" || item.status === "overdue"
            ? "urgent"
            : item.signals.dueInDays <= 7
              ? "soon"
              : "later",
        done: item.completed,
      })),
    );
  }, []);

  return (
    <PageContainer
      title={<>Good morning 👋</>}
      subtitle="Here's what needs your attention today."
      actions={
        <Link
          to="/inbox"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="h-4 w-4" />
          Upload information
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Urgent"
          value={counts.urgent}
          hint="Due within 24 hours"
          icon={AlarmClock}
          tone="urgent"
        />
        <StatCard
          label="Upcoming"
          value={counts.upcoming}
          hint="Next 7 days"
          icon={CalendarClock}
          tone="upcoming"
        />
        <StatCard
          label="Completed"
          value={counts.completed}
          hint="Marked done"
          icon={CheckCircle2}
          tone="completed"
        />
        <StatCard
          label="Documents"
          value={counts.documents}
          hint="Analyzed"
          icon={FileText}
          tone="neutral"
        />
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
            {actions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                No actions yet. Add something in the Inbox and LifeLens will find what you need to
                do.
              </div>
            ) : (
              <div className="space-y-3">
                {actions.map((action) => (
                  <ActionCard key={action.id} action={action} />
                ))}
              </div>
            )}
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
            {documents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                No documents yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {documents.map((doc) => (
                  <Link key={doc.id} to="/analysis/$documentId" params={{ documentId: doc.id }}>
                    <DocumentCard document={doc} />
                  </Link>
                ))}
              </div>
            )}
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
            {insights.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                Your AI insights will appear here after LifeLens analyzes your information.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {insights.map((insight: Insight) => {
                  const Icon = insightIcons[insight.tone];
                  return (
                    <Link
                      key={insight.id}
                      to="/actions"
                      className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors hover:border-primary/40 hover:bg-muted/60"
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          insightToneStyles[insight.tone],
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{insight.text}</p>
                        {insight.detail ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">{insight.detail}</p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              to="/assistant"
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold transition-colors hover:bg-muted"
            >
              <Sparkles className="h-4 w-4 text-ai" />
              Ask LifeLens
            </Link>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-base font-semibold tracking-tight">Deadline radar</h2>
            {reminders.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center text-sm text-muted-foreground">
                No upcoming deadlines.
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {reminders.map((reminder) => (
                  <li key={reminder.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate">{reminder.title}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {formatLongDate(reminder.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}
