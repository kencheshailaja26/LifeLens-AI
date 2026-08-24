import { FileText, Image as ImageIcon, Receipt, Plane, type LucideIcon } from "lucide-react";

export type DocumentKind = "pdf" | "image" | "bill" | "travel";

const kindIcon: Record<DocumentKind, LucideIcon> = {
  pdf: FileText,
  image: ImageIcon,
  bill: Receipt,
  travel: Plane,
};

export type DocumentItem = {
  id: string;
  name: string;
  kind: DocumentKind;
  meta: string;
  status: string;
};

export function DocumentCard({ document: doc }: { document: DocumentItem }) {
  const Icon = kindIcon[doc.kind];

  return (
    <article className="surface-card flex items-center gap-4 p-4 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold">{doc.name}</h3>
        <p className="truncate text-xs text-muted-foreground">{doc.meta}</p>
      </div>
      <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
        {doc.status}
      </span>
    </article>
  );
}
