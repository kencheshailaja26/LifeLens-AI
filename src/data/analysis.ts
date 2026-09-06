import type { AnalysisSummary } from "@/components/analysis/AIAnalysisSummary";
import type { GeneratedActionItem } from "@/components/analysis/GeneratedAction";

export type AnalysisResult = {
  id: string;
  documentName: string;
  analyzedAt: string;
  summary: AnalysisSummary;
  summaryText?: string;
  dates: { label: string; value: string }[];
  requirements: { label: string; note?: string }[];
  contacts: { label: string; note?: string }[];
  amounts?: { label: string; note?: string }[];
  locations: { label: string; note?: string }[];
  instructions: { label: string; note?: string }[];
  actions: GeneratedActionItem[];
};
