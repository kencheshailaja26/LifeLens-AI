import type { AnalysisSummary } from "@/components/analysis/AIAnalysisSummary";
import type { GeneratedActionItem } from "@/components/analysis/GeneratedAction";

export type AnalysisResult = {
  id: string;
  documentName: string;
  analyzedAt: string;
  summary: AnalysisSummary;
  dates: { label: string; value: string }[];
  requirements: { label: string; note?: string }[];
  contacts: { label: string; note?: string }[];
  locations: { label: string; note?: string }[];
  instructions: { label: string; note?: string }[];
  actions: GeneratedActionItem[];
};

const internshipOffer: AnalysisResult = {
  id: "d1",
  documentName: "Internship_Offer.pdf",
  analyzedAt: "Analyzed 2 hours ago",
  summary: { documentType: "Internship Offer", category: "Career", confidence: "High" },
  dates: [
    { label: "Joining Date", value: "June 15, 2026" },
    { label: "Submission Deadline", value: "June 5, 2026" },
  ],
  requirements: [
    { label: "Submit ID proof", note: "Government-issued photo ID" },
    { label: "Submit academic certificate", note: "Latest semester marksheet" },
    { label: "Submit bank details", note: "Cancelled cheque or passbook copy" },
    { label: "Submit photograph", note: "Passport size, white background" },
  ],
  contacts: [
    { label: "HR contact", note: "Priya Nair · hr@company.com · +91 98765 43210" },
  ],
  locations: [
    { label: "Office location", note: "Tower B, Prestige Tech Park, Bengaluru 560103" },
  ],
  instructions: [
    {
      label: "Complete onboarding before joining",
      note: "Portal onboarding must be finished before the joining date.",
    },
  ],
  actions: [
    {
      id: "ga1",
      title: "Submit internship documents",
      due: "June 5",
      priority: "High",
      source: "Internship_Offer.pdf",
      explanation:
        "Required documents must be submitted before the onboarding deadline.",
    },
    {
      id: "ga2",
      title: "Prepare for internship joining",
      due: "June 15",
      dueLabel: "Date",
      priority: "Medium",
      source: "Internship_Offer.pdf",
      explanation:
        "Onboarding and reporting details are confirmed for the joining date at the Bengaluru office.",
    },
  ],
};

export function getAnalysis(documentId: string): AnalysisResult {
  return { ...internshipOffer, id: documentId };
}
