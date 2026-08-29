import { ClipboardPaste } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

export function PasteTextBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardPaste className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">Paste text</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste email content, messages, notes, instructions or anything else.
          </p>
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste your email, message or notes here…"
        className="mt-4 min-h-[200px] resize-y text-sm"
        aria-label="Paste text to analyze"
      />
      <p className="mt-2 text-xs text-muted-foreground">{value.trim().length} characters</p>
    </div>
  );
}
