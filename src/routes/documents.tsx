import { createFileRoute } from "@tanstack/react-router";

import { DocumentCard } from "@/components/cards/DocumentCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { sampleDocuments } from "@/data/sample";

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
  return (
    <PageContainer title="Documents" subtitle="Everything you've added to LifeLens.">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sampleDocuments.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </PageContainer>
  );
}
