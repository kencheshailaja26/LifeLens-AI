import { FileImage, FileText, FileType, StickyNote, type LucideIcon } from "lucide-react";

import { ProcessingStatus, type UploadStatus } from "./ProcessingStatus";

export type UploadItem = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: UploadStatus;
  source: "file" | "text";
};

function iconFor(item: UploadItem): LucideIcon {
  if (item.source === "text") return StickyNote;
  const t = item.type.toLowerCase();
  if (["png", "jpg", "jpeg"].includes(t)) return FileImage;
  if (t === "pdf") return FileText;
  return FileType;
}

export function FileUploadItem({ item }: { item: UploadItem }) {
  const Icon = iconFor(item);

  return (
    <li className="surface-card flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {item.type.toUpperCase()} · {item.uploadedAt}
        </p>
      </div>
      <ProcessingStatus status={item.status} />
    </li>
  );
}
