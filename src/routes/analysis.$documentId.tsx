import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Info,
  ListChecks,
  MapPin,
  Pencil,
  Users,
  Wallet,
} from "lucide-react";

import { AIAnalysisSummary } from "@/components/analysis/AIAnalysisSummary";
import { ExtractionCard } from "@/components/analysis/ExtractionCard";
import { GeneratedAction } from "@/components/analysis/GeneratedAction";
import { ImportantDate } from "@/components/analysis/ImportantDate";
import { PipelineSteps } from "@/components/analysis/PipelineSteps";
import { RequirementItem } from "@/components/analysis/RequirementItem";
import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { type AnalysisResult } from "@/data/analysis";
import { loadAnalysis } from "@/lib/analysis-store";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/analysis/$documentId")({
  head: () => ({
    meta: [
      { title: "AI Analysis — LifeLens AI" },
      {
        name: "description",
        content:
          "See what LifeLens extracted from your document and the actions it found for you.",
      },
      { property: "og:title", content: "AI Analysis — LifeLens AI" },
      {
        property: "og:description",
        content: "Extracted dates, requirements and prioritized actions from your document.",
      },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { documentId } = Route.useParams();
  const [result, setResult] = useState<AnalysisResult | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResult(loadAnalysis(documentId));
    setLoaded(true);
  }, [documentId]);

  if (!result) {
    return (
      <PageContainer title="AI Analysis" subtitle="Document analysis">
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <p className="text-sm font-semibold">
            {loaded ? "Document not found" : "Loading…"}
          </p>
          {loaded ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                We don't have an analysis for this document. Add it in the Inbox and analyze it
                to see the results here.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  to="/inbox"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Go to Inbox
                </Link>
                <Link
                  to="/documents"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  View documents
                </Link>
              </div>
            </>
          ) : null}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="AI Analysis"
      subtitle={`${result.documentName} · ${result.analyzedAt}`}
    >

      <div className="space-y-6">
        <PipelineSteps />

        <AIAnalysisSummary summary={result.summary} />

        {result.summaryText ? (
          <section className="surface-card p-5 sm:p-6">
            <SectionHeading title="Summary" />
            <p className="-mt-2 text-sm text-muted-foreground">{result.summaryText}</p>
          </section>
        ) : null}

        {/* Primary emphasis: what the user needs to do */}
        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <SectionHeading title="Actions LifeLens Found" />
              <p className="-mt-2 text-sm text-muted-foreground">
                {result.actions.length} things to do from this document.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-lift)] transition-opacity hover:opacity-90"
              >
                <CheckCircle2 className="h-4 w-4" />
                Add all actions
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <ListChecks className="h-4 w-4" />
                Review actions
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {result.actions.map((action) => (
              <GeneratedAction key={action.id} action={action} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading title="Extracted Information" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ExtractionCard title="Important Dates" icon={CalendarDays}>
              {result.dates.map((d) => (
                <ImportantDate key={d.label} label={d.label} value={d.value} />
              ))}
            </ExtractionCard>

            <ExtractionCard title="Tasks / Requirements" icon={FileText}>
              {result.requirements.map((r) => (
                <RequirementItem key={r.label} label={r.label} note={r.note} />
              ))}
            </ExtractionCard>

            <ExtractionCard title="People / Contacts" icon={Users}>
              {result.contacts.map((c) => (
                <RequirementItem key={c.label} label={c.label} note={c.note} />
              ))}
            </ExtractionCard>

            <ExtractionCard title="Location" icon={MapPin}>
              {result.locations.map((l) => (
                <RequirementItem key={l.label} label={l.label} note={l.note} />
              ))}
            </ExtractionCard>

            {result.amounts && result.amounts.length > 0 ? (
              <ExtractionCard title="Amounts" icon={Wallet}>
                {result.amounts.map((a) => (
                  <RequirementItem key={a.label} label={a.label} note={a.note} />
                ))}
              </ExtractionCard>
            ) : null}

            <ExtractionCard title="Important Instructions" icon={Info}>
              {result.instructions.map((i) => (
                <RequirementItem key={i.label} label={i.label} note={i.note} />
              ))}
            </ExtractionCard>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
