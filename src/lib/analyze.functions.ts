import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { ANALYSIS_JSON_INSTRUCTIONS, aiAnalysisSchema } from "./analysis-schema";

const inputSchema = z.object({
  documentName: z.string().min(1),
  /** Plain text extracted client-side (pasted text, .txt, .docx). */
  text: z.string().optional(),
  /** data:<mime>;base64,... for PDFs and images. */
  dataUrl: z.string().optional(),
  mimeType: z.string().optional(),
});

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

export const analyzeDocument = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      throw new Error("AI is not configured for this project.");
    }

    const content: ContentBlock[] = [
      {
        type: "text",
        text: `Analyze this content named "${data.documentName}" and extract the structured JSON described in your instructions.`,
      },
    ];

    if (data.text && data.text.trim().length > 0) {
      content.push({ type: "text", text: data.text.slice(0, 120_000) });
    } else if (data.dataUrl) {
      const mime = data.mimeType ?? "application/octet-stream";
      if (mime.startsWith("image/")) {
        content.push({ type: "image_url", image_url: { url: data.dataUrl } });
      } else {
        content.push({
          type: "file",
          file: { filename: data.documentName, file_data: data.dataUrl },
        });
      }
    } else {
      throw new Error("Nothing to analyze — no readable content was provided.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: ANALYSIS_JSON_INSTRUCTIONS },
          { role: "user", content },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      if (response.status === 429) {
        throw new Error("AI is rate limited right now. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits are exhausted for this workspace.");
      }
      throw new Error(`AI analysis failed (${response.status}): ${body.slice(0, 300)}`);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) throw new Error("AI returned an empty response.");

    let parsedJson: unknown;
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "");
      parsedJson = JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned a response that could not be read.");
    }

    const result = aiAnalysisSchema.safeParse(parsedJson);
    if (!result.success) {
      throw new Error("AI response did not match the expected analysis format.");
    }

    return result.data;
  });
