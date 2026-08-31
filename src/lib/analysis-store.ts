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
  if (rel) return Number.parseInt(rel[1], 10);
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
        signals,
        manualPriority: state?.manualPriority,
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

const clean = (items: { label: string; note?: string | null | undefined }[]) =>
  items.map((item) => ({ label: item.label, ...(item.note ? { note: item.note } : {}) }));

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
