import { useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FileUp, Info, Inbox as InboxIcon, Sparkles, Type } from "lucide-react";

import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { FileUploadItem, type UploadItem } from "@/components/inbox/FileUploadItem";
import { PasteTextBox } from "@/components/inbox/PasteTextBox";
import { UploadDropzone } from "@/components/inbox/UploadDropzone";
import { Button } from "@/components/ui/button";
import { analyzeDocument } from "@/lib/analyze.functions";
import { saveAnalysis, toAnalysisResult } from "@/lib/analysis-store";
import { readFileContent } from "@/lib/read-file";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — LifeLens AI" },
      {
        name: "description",
        content: "Everything you drop into LifeLens lands here before it becomes actions.",
      },
      { property: "og:title", content: "Inbox — LifeLens AI" },
      {
        property: "og:description",
        content: "Captured documents, screenshots and notes waiting to be turned into actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InboxPage,
});

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "file";

type InboxItem = UploadItem & { analysisId?: string; error?: string };

function InboxPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [items, setItems] = useState<InboxItem[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const files = useRef(new Map<string, File>());
  const texts = useRef(new Map<string, string>());

  const patch = (id: string, changes: Partial<InboxItem>) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const addFiles = (incoming: File[]) => {
    const entries: InboxItem[] = incoming.map((file, index) => {
      const id = `${Date.now()}-${index}-${file.name}`;
      files.current.set(id, file);
      return {
        id,
        name: file.name,
        type: extOf(file.name),
        uploadedAt: timeNow(),
        status: "ready" as const,
        source: "file" as const,
      };
    });
    setItems((prev) => [...entries, ...prev]);
  };

  const analyzeOne = async (item: InboxItem) => {
    patch(item.id, { status: "processing", error: undefined });
    try {
      let payload: { text?: string; dataUrl?: string; mimeType?: string };
      if (item.source === "text") {
        payload = { text: texts.current.get(item.id) ?? "" };
      } else {
        const file = files.current.get(item.id);
        if (!file) throw new Error("File is no longer available.");
        payload = await readFileContent(file);
      }

      const ai = await analyzeDocument({ data: { documentName: item.name, ...payload } });
      const result = toAnalysisResult(item.id, item.name, ai);
      saveAnalysis(result);
      patch(item.id, { status: "analyzed", analysisId: result.id });
      return result.id;
    } catch (error) {
      patch(item.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Analysis failed.",
      });
      return undefined;
    }
  };

  const runAnalysis = async () => {
    setBusy(true);
    try {
      let targets: InboxItem[] = [];

      if (tab === "paste") {
        const value = text.trim();
        if (!value) return;
        const id = `${Date.now()}-text`;
        texts.current.set(id, value);
        const entry: InboxItem = {
          id,
          name: `${value.slice(0, 40).replace(/\s+/g, " ")}${value.length > 40 ? "…" : ""}`,
          type: "txt",
          uploadedAt: timeNow(),
          status: "ready",
          source: "text",
        };
        setItems((prev) => [entry, ...prev]);
        setText("");
        targets = [entry];
      } else {
        targets = items.filter((item) => item.status === "ready" || item.status === "error");
      }

      if (targets.length === 0) return;

      let firstId: string | undefined;
      for (const target of targets) {
        const analysisId = await analyzeOne(target);
        firstId ??= analysisId;
      }
      if (firstId) void navigate({ to: "/analysis/$documentId", params: { documentId: firstId } });
    } finally {
      setBusy(false);
    }
  };

  const canAnalyze =
    !busy &&
    (tab === "paste"
      ? text.trim().length > 0
      : items.some((item) => item.status === "ready" || item.status === "error"));

  return (
    <PageContainer
      title="Your Inbox"
      subtitle="Upload or paste information and let LifeLens turn it into actions."
    >
      <div className="space-y-5">
        <div className="inline-flex rounded-xl bg-muted p-1">
          {[
            { key: "upload" as const, label: "Upload files", Icon: FileUp },
            { key: "paste" as const, label: "Paste text", Icon: Type },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                tab === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "upload" ? (
          <UploadDropzone onFiles={addFiles} />
        ) : (
          <PasteTextBox value={text} onChange={setText} />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            size="lg"
            disabled={!canAnalyze}
            onClick={() => void runAnalysis()}
            className="w-full bg-brand-gradient text-primary-foreground shadow-[var(--shadow-lift)] sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            {busy ? "Analyzing…" : "Analyze with AI"}
          </Button>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Your document content is read and analyzed by AI — nothing is guessed from the file
            name.
          </p>
        </div>

        <div>
          <SectionHeading title="Recent uploads" />
          {items.length === 0 ? (
            <div className="surface-card flex flex-col items-center gap-2 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <InboxIcon className="h-6 w-6" />
              </span>
              <h3 className="text-base font-semibold">Nothing here yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Drop a document or paste some text above and it will show up here while LifeLens
                processes it.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  {item.analysisId ? (
                    <Link
                      to="/analysis/$documentId"
                      params={{ documentId: item.analysisId }}
                      className="block"
                    >
                      <ul>
                        <FileUploadItem item={item} />
                      </ul>
                    </Link>
                  ) : (
                    <ul>
                      <FileUploadItem item={item} />
                    </ul>
                  )}
                  {item.error ? (
                    <p className="mt-1.5 px-1 text-xs text-destructive">{item.error}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
