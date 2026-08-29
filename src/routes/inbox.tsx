import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileUp, Info, Inbox as InboxIcon, Sparkles, Type } from "lucide-react";

import { PageContainer, SectionHeading } from "@/components/layout/PageContainer";
import { FileUploadItem, type UploadItem } from "@/components/inbox/FileUploadItem";
import { PasteTextBox } from "@/components/inbox/PasteTextBox";
import { UploadDropzone } from "@/components/inbox/UploadDropzone";
import { Button } from "@/components/ui/button";
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

function InboxPage() {
  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [text, setText] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const queue = (entries: UploadItem[]) => {
    setItems((prev) => [...entries, ...prev]);
    entries.forEach((entry, index) => {
      timers.current.push(
        setTimeout(
          () =>
            setItems((prev) =>
              prev.map((i) => (i.id === entry.id ? { ...i, status: "analyzed" } : i)),
            ),
          1600 + index * 500,
        ),
      );
    });
  };

  const addFiles = (files: File[]) =>
    queue(
      files.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        type: extOf(file.name),
        uploadedAt: timeNow(),
        status: "processing" as const,
        source: "file" as const,
      })),
    );

  const analyzeText = () => {
    const value = text.trim();
    if (!value) return;
    queue([
      {
        id: `${Date.now()}-text`,
        name: `${value.slice(0, 40).replace(/\s+/g, " ")}${value.length > 40 ? "…" : ""}`,
        type: "txt",
        uploadedAt: timeNow(),
        status: "processing",
        source: "text",
      },
    ]);
    setText("");
  };

  const canAnalyze = tab === "paste" ? text.trim().length > 0 : items.length > 0;

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
            onClick={tab === "paste" ? analyzeText : undefined}
            className="w-full bg-brand-gradient text-primary-foreground shadow-[var(--shadow-lift)] sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Analyze with AI
          </Button>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            Real AI analysis isn&apos;t wired up yet — uploads are simulated locally so you can
            preview the experience.
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
                <FileUploadItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
