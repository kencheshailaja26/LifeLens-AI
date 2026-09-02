import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, CalendarDays, FileText } from "lucide-react";

import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { formatLongDate } from "@/components/timeline/TimelineEntry";
import { cn } from "@/lib/utils";
import { loadReminders, type Reminder, type ReminderUrgency } from "@/lib/analysis-store";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — LifeLens AI" },
      { name: "description", content: "Nudges for deadlines LifeLens finds in your documents." },
      { property: "og:title", content: "Reminders — LifeLens AI" },
      { property: "og:description", content: "Set and manage reminders for extracted deadlines." },
    ],
  }),
  component: RemindersPage,
});

const urgencyStyles: Record<ReminderUrgency, string> = {
  urgent: "bg-destructive/10 text-destructive",
  reminder: "bg-warning/20 text-warning-foreground",
  upcoming: "bg-primary/10 text-primary",
};

const urgencyLabels: Record<ReminderUrgency, string> = {
  urgent: "Urgent",
  reminder: "Reminder",
  upcoming: "Upcoming",
};

const sections: { key: ReminderUrgency; title: string }[] = [
  { key: "urgent", title: "Due today" },
  { key: "reminder", title: "Due tomorrow" },
  { key: "upcoming", title: "Upcoming" },
];

function RemindersPage() {
  const reminders = loadReminders();

  return (
    <PageContainer
      title="Reminders"
      subtitle="Deadlines LifeLens found in your analyzed documents."
    >
      {reminders.length === 0 ? (
        <div className="surface-card flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BellRing className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-semibold">No reminders yet</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Reminders appear here when a document you analyze contains an upcoming deadline.
          </p>
          <Link
            to="/inbox"
            className="mt-2 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Analyze a document
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => {
            const items = reminders.filter((r) => r.urgency === section.key);
            if (items.length === 0) return null;
            return (
              <section key={section.key}>
                <SectionHeading
                  title={section.title}
                  action={
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {items.length}
                    </span>
                  }
                />
                <div className="space-y-3">
                  {items.map((reminder) => (
                    <ReminderRow key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

function ReminderRow({ reminder }: { reminder: Reminder }) {
  return (
    <article className="surface-card flex flex-wrap items-center gap-3 p-4 transition-colors hover:border-primary/40">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          urgencyStyles[reminder.urgency],
        )}
      >
        <BellRing className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold">{reminder.title}</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              urgencyStyles[reminder.urgency],
            )}
          >
            {urgencyLabels[reminder.urgency]}
          </span>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Due {formatLongDate(reminder.dueDate)}
          {reminder.daysUntil > 1 ? <span>· in {reminder.daysUntil} days</span> : null}
          <span aria-hidden>·</span>
          {reminder.category}
        </p>
      </div>

      <Link
        to="/actions"
        className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        title={`Source: ${reminder.source}`}
      >
        <FileText className="h-3.5 w-3.5" />
        <span className="max-w-32 truncate">{reminder.source}</span>
      </Link>
    </article>
  );
}
