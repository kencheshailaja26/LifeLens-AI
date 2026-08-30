import { z } from "zod";

const entry = z.object({
  label: z.string(),
  note: z.string().nullable().optional(),
});

const dated = z.object({
  label: z.string(),
  value: z.string(),
});

export const aiAnalysisSchema = z.object({
  documentType: z.string(),
  category: z.string(),
  confidence: z.enum(["High", "Medium", "Low"]),
  summary: z.string(),
  dates: z.array(dated).default([]),
  deadlines: z.array(dated).default([]),
  requirements: z.array(entry).default([]),
  requiredDocuments: z.array(entry).default([]),
  contacts: z.array(entry).default([]),
  amounts: z.array(entry).default([]),
  locations: z.array(entry).default([]),
  instructions: z.array(entry).default([]),
  actions: z
    .array(
      z.object({
        title: z.string(),
        due: z.string().nullable().optional(),
        priority: z.enum(["High", "Medium", "Low"]),
        explanation: z.string(),
      }),
    )
    .default([]),
});

export type AiAnalysis = z.infer<typeof aiAnalysisSchema>;

export const ANALYSIS_JSON_INSTRUCTIONS = `You extract structured, actionable information from a real document or text supplied by the user.

Return ONLY a JSON object with exactly these keys:
{
  "documentType": string,
  "category": string,
  "confidence": "High" | "Medium" | "Low",
  "summary": string,
  "dates": [{ "label": string, "value": string }],
  "deadlines": [{ "label": string, "value": string }],
  "requirements": [{ "label": string, "note": string }],
  "requiredDocuments": [{ "label": string, "note": string }],
  "contacts": [{ "label": string, "note": string }],
  "amounts": [{ "label": string, "note": string }],
  "locations": [{ "label": string, "note": string }],
  "instructions": [{ "label": string, "note": string }],
  "actions": [{ "title": string, "due": string, "priority": "High" | "Medium" | "Low", "explanation": string }]
}

Rules:
- Use ONLY information that is actually present in the supplied content. Never invent names, dates, amounts, organisations or tasks.
- If a section has nothing in the document, return an empty array for it.
- Keep values verbatim where possible (dates exactly as written in the document).
- "actions" must be concrete things the reader has to do, derived from the content only.
- Set confidence to Low when the content is short, unclear or unreadable.`;
