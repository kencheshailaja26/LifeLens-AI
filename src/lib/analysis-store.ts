import type { AnalysisResult } from "@/data/analysis";
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

const clean = (items: { label: string; note?: string | null }[]) =>
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
