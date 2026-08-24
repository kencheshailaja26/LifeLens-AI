import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Brain,
  CalendarClock,
  CheckCircle2,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  ListChecks,
  Mail,
  MessageSquare,
  Plane,
  Receipt,
  ScanLine,
  Sparkles,
  Upload,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "LifeLens AI — Turn information into action" },
      {
        name: "description",
        content:
          "LifeLens AI reads the documents, bills and emails you already have and turns them into prioritized actions and deadlines.",
      },
      { property: "og:title", content: "LifeLens AI — Turn information into action" },
      {
        property: "og:description",
        content:
          "An AI-powered personal action assistant that converts your information into the actions you need to take.",
      },
    ],
  }),
  component: LandingPage,
});

const inputs: { label: string; icon: LucideIcon }[] = [
  { label: "Internship Offer", icon: FileText },
  { label: "Electricity Bill", icon: Receipt },
  { label: "Flight Ticket", icon: Plane },
  { label: "College Application", icon: GraduationCap },
];

const generatedActions = [
  { title: "Submit internship documents", due: "Due tomorrow", priority: "High Priority" as const },
  { title: "Pay electricity bill", due: "Due tomorrow", priority: "High Priority" as const },
  { title: "Complete scholarship application", due: "Due Friday", priority: "Medium Priority" as const },
];

const sources: { label: string; icon: LucideIcon }[] = [
  { label: "Emails", icon: Mail },
  { label: "PDFs", icon: FileText },
  { label: "Screenshots", icon: ImageIcon },
  { label: "Bills", icon: Receipt },
  { label: "Messages", icon: MessageSquare },
  { label: "Forms", icon: ListChecks },
  { label: "Notes", icon: FileText },
  { label: "Job documents", icon: BriefcaseBusiness },
  { label: "Travel documents", icon: Plane },
];

const steps: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Upload",
    body: "Upload a document, screenshot, note, or paste information.",
    icon: Upload,
  },
  {
    title: "Understand",
    body: "AI identifies important dates, requirements, tasks, people, amounts, and instructions.",
    icon: Brain,
  },
  {
    title: "Turn into actions",
    body: "LifeLens converts information into actionable tasks.",
    icon: ListChecks,
  },
  {
    title: "Stay on track",
    body: "Priorities, timelines, and reminders help you complete what matters.",
    icon: Bell,
  },
];

const audiences: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Students", body: "Applications, fees, scholarships and exam deadlines in one place.", icon: GraduationCap },
  { title: "Job Seekers", body: "Offers, interviews and joining documents tracked automatically.", icon: BriefcaseBusiness },
  { title: "Young Professionals", body: "Bills, renewals and paperwork handled before they pile up.", icon: Wallet },
  { title: "Freelancers", body: "Contracts, invoices and client follow-ups turned into tasks.", icon: FileText },
  { title: "Travelers", body: "Check-ins, visas and bookings surfaced at the right moment.", icon: Plane },
  { title: "Busy Families", body: "School forms, appointments and household admin, organized.", icon: Users },
];

function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/landing" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
            <ScanLine className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[15px] font-bold tracking-tight">LifeLens AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <a
            href="#how-it-works"
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </a>
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open app
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-app-glow">
      <LandingNav />

      {/* Hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-ai" />
              AI-Powered Personal Action Assistant
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Turn information into action.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              LifeLens AI reads the information you already have and turns it into the actions you
              need to take.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition-opacity hover:opacity-90"
              >
                Start with LifeLens
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Hero visual: Information -> AI -> Actions */}
          <div className="surface-card p-5 sm:p-6">
            <div className="grid gap-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Information
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {inputs.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs font-medium"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Understanding
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Actions
                </p>
                <div className="space-y-2">
                  {generatedActions.map((a) => (
                    <div
                      key={a.title}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card px-3 py-3"
                    >
                      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-border" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.due}</p>
                      </div>
                      <span
                        className={
                          a.priority === "High Priority"
                            ? "shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-semibold text-destructive"
                            : "shrink-0 rounded-full bg-warning/20 px-2 py-1 text-[11px] font-semibold text-warning-foreground"
                        }
                      >
                        {a.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section>
        <div className="surface-card p-6 sm:p-10">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Information is everywhere. Action shouldn't be.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Important information reaches you from every direction — and every piece of it hides
            something you're supposed to do.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {sources.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-2 text-sm font-medium"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </span>
            ))}
          </div>
          <p className="mt-7 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Deadlines get missed and requirements get forgotten — not because people are careless,
            but because the actions are buried inside the information.
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How LifeLens works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="surface-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Audiences */}
      <Section>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Built for real life</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className="surface-card p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <a.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Differentiation */}
      <Section>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Not just a document analyzer.
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="surface-card p-6">
            <p className="text-sm font-semibold text-muted-foreground">Document AI</p>
            <p className="mt-3 text-base">Summarizes information.</p>
          </div>
          <div className="surface-card p-6">
            <p className="text-sm font-semibold text-muted-foreground">Task Manager</p>
            <p className="mt-3 text-base">Stores tasks you manually create.</p>
          </div>
          <div className="relative rounded-3xl bg-brand-gradient p-[2px] shadow-[var(--shadow-lift)]">
            <div className="h-full rounded-[calc(var(--radius-3xl))] bg-card p-6">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4 text-ai" />
                LifeLens AI
              </p>
              <p className="mt-3 text-base font-medium">
                Understands information and automatically turns it into actions.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {["Extracts deadlines and requirements", "Prioritizes what matters", "Reminds you in time"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="surface-card overflow-hidden">
          <div className="bg-brand-gradient px-6 py-14 text-center sm:px-10">
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              Stop managing information. Start managing what matters.
            </h2>
            <Link
              to="/"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-card px-6 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
              <ScanLine className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">LifeLens AI</span>
            <span className="text-sm text-muted-foreground">— Turn information into action.</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
