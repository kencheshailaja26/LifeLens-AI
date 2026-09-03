import type { AnalysisResult } from "@/data/analysis";
import { actionCategories, type ActionCategory, type ActionItem, type Priority } from "@/data/actions";
import type { AiAnalysis } from "./analysis-schema";

const KEY = "lifelens.analyses";

type Store = Record<string, AnalysisResult>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

export function saveAnalysis(result: AnalysisResult) {
  if (typeof window === "undefined") return;
  const store = read();
  store[result.id] = result;
  window.sessionStorage.setItem(KEY, JSON.stringify(store));
}

export function loadAnalysis(id: string): AnalysisResult | undefined {
  return read()[id];
}

export function loadAllAnalyses(): AnalysisResult[] {
  return Object.values(read());
}

// ---- Action Center state (user edits to AI-generated actions) ----

const ACTION_STATE_KEY = "lifelens.actionStates";

type ActionState = {
  completed?: boolean;
  manualPriority?: Priority;
  due?: string;
  deleted?: boolean;
};

function readStates(): Record<string, ActionState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(ACTION_STATE_KEY) ?? "{}") as Record<
      string,
      ActionState
    >;
  } catch {
    return {};
  }
}

export function saveActionState(id: string, patch: ActionState) {
  if (typeof window === "undefined") return;
  const states = readStates();
  states[id] = { ...states[id], ...patch };
  window.sessionStorage.setItem(ACTION_STATE_KEY, JSON.stringify(states));
}

function dueInDaysFrom(due: string): number {
  const lower = due.toLowerCase();
  if (lower.includes("today")) return 0;
  if (lower.includes("tomorrow")) return 1;
  const rel = lower.match(/(\d+)\s*day/);
  if (rel?.[1]) return Number.parseInt(rel[1], 10);
  const parsed = Date.parse(`${due}, ${new Date().getFullYear()}`);
  if (!Number.isNaN(parsed)) {
    const diff = Math.round((parsed - Date.now()) / 86_400_000);
    return diff < -300 ? diff + 365 : diff;
  }
  return 7;
}

const prioritySignals = {
  High: { importance: "critical", consequence: "severe" },
  Medium: { importance: "significant", consequence: "moderate" },
  Low: { importance: "routine", consequence: "minor" },
} as const;

/** Build Action Center items purely from real AI analyses stored in this session. */
export function loadActionItems(): ActionItem[] {
  const states = readStates();
  const items: ActionItem[] = [];

  for (const analysis of loadAllAnalyses()) {
    const category: ActionCategory = (actionCategories as string[]).includes(
      analysis.summary.category,
    )
      ? (analysis.summary.category as ActionCategory)
      : "Personal";

    for (const action of analysis.actions) {
      const state = states[action.id];
      if (state?.deleted) continue;

      const due = state?.due ?? action.due ?? "Not specified";
      const dueInDays = dueInDaysFrom(due);
      const completed = state?.completed ?? false;
      const signals = { dueInDays, ...prioritySignals[action.priority] };

      items.push({
        id: action.id,
        title: action.title,
        description: action.explanation,
        due: completed ? "Completed" : due,
        ...(completed ? { rawDue: due } : {}),
        signals,
        ...(state?.manualPriority ? { manualPriority: state.manualPriority } : {}),
        category,
        source: action.source ?? analysis.documentName,
        explanation: action.explanation,
        status: completed
          ? "completed"
          : dueInDays < 0
            ? "overdue"
            : dueInDays <= 1
              ? "urgent"
              : "upcoming",
        completed,
      });
    }
  }

  return items;
}

// ---- Timeline (real analyzed actions, derived from the same store) ----

import type { TimelineItem } from "@/data/timeline";

/** Parse a human/AI due string into an ISO date. Returns undefined when no valid date exists. */
export function actionDueToISODate(due: string): string | undefined {
  const trimmed = due.trim();
  if (!trimmed || /not specified|completed/i.test(trimmed)) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();
  const now = new Date();
  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  if (lower.includes("today")) return toISO(now);
  if (lower.includes("tomorrow")) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }
  const rel = lower.match(/(?:in\s+)?(\d+)\s*day/);
  if (rel?.[1]) {
    const d = new Date(now);
    d.setDate(d.getDate() + Number.parseInt(rel[1], 10));
    return toISO(d);
  }

  let parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) parsed = Date.parse(`${trimmed}, ${now.getFullYear()}`);
  if (Number.isNaN(parsed)) return undefined;
  const d = new Date(parsed);
  // Roll forward a year if the date is far in the past (year was omitted).
  if (d.getTime() < now.getTime() - 300 * 86_400_000) d.setFullYear(d.getFullYear() + 1);
  return toISO(d);
}

/** Timeline entries built purely from real AI-analyzed actions in this session. */
export function loadTimelineItems(): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const action of loadActionItems()) {
    const date = actionDueToISODate(action.rawDue ?? action.due);
    if (!date) continue;
    items.push({
      id: action.id,
      title: action.title,
      date,
      category: action.category,
      priority:
        action.manualPriority ??
        (action.signals.importance === "critical"
          ? "high"
          : action.signals.importance === "significant"
            ? "medium"
            : "low"),
      source: action.source,
      completed: action.completed,
    });
  }
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

const clean = (items: { label: string; note?: string | null | undefined }[]) =>
  items.map((item) => ({ label: item.label, ...(item.note ? { note: item.note } : {}) }));

// ---- Smart Reminders (derived from the same persisted action store) ----

export type ReminderUrgency = "urgent" | "reminder" | "upcoming";

export type Reminder = {
  id: string;
  title: string;
  dueDate: string; // ISO
  dueLabel: string; // original due text from the document
  urgency: ReminderUrgency;
  daysUntil: number;
  category: ActionCategory;
  priority: Priority;
  source: string;
};

function daysUntilISODate(iso: string): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000);
}

/**
 * Build reminders purely from real, non-completed actions that have a valid
 * due date extracted from an analyzed document. No dates are invented.
 */
export function loadReminders(): Reminder[] {
  const reminders: Reminder[] = [];

  for (const action of loadActionItems()) {
    if (action.completed) continue;
    const iso = actionDueToISODate(action.due);
    if (!iso) continue; // no valid date → no reminder

    const days = daysUntilISODate(iso);
    if (days < 0) continue; // already past — not a pending reminder

    const urgency: ReminderUrgency =
      days === 0 ? "urgent" : days === 1 ? "reminder" : "upcoming";

    reminders.push({
      id: action.id,
      title: action.title,
      dueDate: iso,
      dueLabel: action.due,
      urgency,
      daysUntil: days,
      category: action.category,
      priority:
        action.manualPriority ??
        (action.signals.importance === "critical"
          ? "high"
          : action.signals.importance === "significant"
            ? "medium"
            : "low"),
      source: action.source,
    });
  }

  return reminders.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

// ---- Smart Insights (derived from the same persisted store) ----

export type InsightTone = "urgent" | "warning" | "info" | "success";

export type Insight = {
  id: string;
  text: string;
  detail?: string;
  tone: InsightTone;
};

function effectivePriority(action: ActionItem): Priority {
  return (
    action.manualPriority ??
    (action.signals.importance === "critical"
      ? "high"
      : action.signals.importance === "significant"
        ? "medium"
        : "low")
  );
}

/**
 * Build concise, actionable insights purely from real analyzed documents and
 * their persisted actions. Nothing is invented: every insight cites data that
 * exists in the store. Returns an empty array when there is no real data.
 */
export function loadInsights(): Insight[] {
  const insights: Insight[] = [];
  const analyses = loadAllAnalyses();
  const actions = loadActionItems();
  const pending = actions.filter((a) => !a.completed);
  if (analyses.length === 0 && pending.length === 0) return insights;

  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString([], { dateStyle: "long" });

  const dated = pending
    .map((a) => ({ action: a, iso: actionDueToISODate(a.due) }))
    .filter((x): x is { action: ActionItem; iso: string } => Boolean(x.iso))
    .map((x) => ({ ...x, days: daysUntilISODate(x.iso) }))
    .sort((a, b) => a.days - b.days);

  // Overdue actions
  const overdue = dated.filter((x) => x.days < 0);
  for (const { action, iso, days } of overdue) {
    insights.push({
      id: `overdue-${action.id}`,
      text: `${action.title} is overdue`,
      detail: `Was due ${fmt(iso)} (${-days} ${days === -1 ? "day" : "days"} ago) · ${action.source}`,
      tone: "urgent",
    });
  }

  // Due today / tomorrow
  for (const { action, iso, days } of dated.filter((x) => x.days >= 0 && x.days <= 1)) {
    insights.push({
      id: `soon-${action.id}`,
      text: `${action.title} by ${fmt(iso)}`,
      detail: `${days === 0 ? "Due today" : "Due tomorrow"} · ${action.source}`,
      tone: days === 0 ? "urgent" : "warning",
    });
  }

  // Due within the next week
  const thisWeek = dated.filter((x) => x.days > 1 && x.days <= 7);
  for (const { action, iso, days } of thisWeek) {
    insights.push({
      id: `week-${action.id}`,
      text: `${action.title} by ${fmt(iso)}`,
      detail: `Due in ${days} days · ${action.source}`,
      tone: "info",
    });
  }

  // Highest-priority pending action
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  const top = [...pending].sort((a, b) => {
    const r = rank[effectivePriority(a)] - rank[effectivePriority(b)];
    return r !== 0 ? r : a.signals.dueInDays - b.signals.dueInDays;
  })[0];
  if (top) {
    insights.push({
      id: `top-${top.id}`,
      text: `Your next priority: ${top.title}`,
      detail: top.explanation || top.source,
      tone: effectivePriority(top) === "high" ? "urgent" : "info",
    });
  }

  // Documents requiring attention (have overdue or due-soon actions)
  const attentionSources = new Set(
    dated.filter((x) => x.days <= 1).map((x) => x.action.source),
  );
  for (const source of attentionSources) {
    insights.push({
      id: `doc-${source}`,
      text: `${source} needs your attention`,
      detail: "It contains actions that are due soon or overdue.",
      tone: "warning",
    });
  }

  // Important dates extracted from documents (e.g. joining dates)
  for (const analysis of analyses) {
    for (const date of analysis.dates) {
      const iso = date.value ? actionDueToISODate(date.value) : undefined;
      if (!iso) continue;
      const days = daysUntilISODate(iso);
      if (days < 0) continue;
      insights.push({
        id: `date-${analysis.id}-${date.label}`,
        text: `${date.label}: ${fmt(iso)}`,
        detail: `${analysis.documentName}${days > 7 ? ` · in ${days} days` : ""}`,
        tone: "info",
      });
    }
  }

  return insights;
}

export function toAnalysisResult(
  id: string,
  documentName: string,
  ai: AiAnalysis,
): AnalysisResult {
  return {
    id,
    documentName,
    analyzedAt: `Analyzed ${new Date().toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    })}`,
    summary: {
      documentType: ai.documentType,
      category: ai.category,
      confidence: ai.confidence,
    },
    summaryText: ai.summary,
    dates: [...ai.dates, ...ai.deadlines],
    requirements: clean([...ai.requirements, ...ai.requiredDocuments]),
    contacts: clean(ai.contacts),
    amounts: clean(ai.amounts),
    locations: clean(ai.locations),
    instructions: clean(ai.instructions),
    actions: ai.actions.map((action, index) => ({
      id: `${id}-a${index}`,
      title: action.title,
      due: action.due || "Not specified",
      priority: action.priority,
      source: documentName,
      explanation: action.explanation,
    })),
  };
}
