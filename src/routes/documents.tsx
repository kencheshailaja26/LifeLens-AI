import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { DocumentCard, type DocumentItem } from "@/components/cards/DocumentCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { loadDocumentItems } from "@/lib/analysis-store";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — LifeLens AI" },
      { name: "description", content: "All the files, screenshots and notes you've added to LifeLens." },
      { property: "og:title", content: "Documents — LifeLens AI" },
      { property: "og:description", content: "Browse every document LifeLens has analyzed for you." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  useEffect(() => setDocuments(loadDocumentItems()), []);

  return (
    <PageContainer title="Documents" subtitle="Everything you've added to LifeLens.">
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <p className="text-sm font-semibold">No documents yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a file or paste text in the Inbox and LifeLens will analyze it for you.
          </p>
          <Link
            to="/inbox"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go to Inbox
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <Link key={doc.id} to="/analysis/$documentId" params={{ documentId: doc.id }}>
              <DocumentCard document={doc} />
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
