import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FORMATS = ["PDF", "DOCX", "PNG", "JPG", "JPEG", "TXT"];
const ACCEPT = ".pdf,.docx,.png,.jpg,.jpeg,.txt";

export function UploadDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(files);
      }}
      className={cn(
        "surface-card flex flex-col items-center justify-center gap-4 border-2 border-dashed px-5 py-10 text-center transition-colors sm:px-10 sm:py-14",
        dragging ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground">
        <CloudUpload className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">Drop your information here</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Upload documents, screenshots, bills, forms, offers, or notes.
        </p>
      </div>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {FORMATS.map((f) => (
          <li
            key={f}
            className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground"
          >
            {f}
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
        Browse files
      </Button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
