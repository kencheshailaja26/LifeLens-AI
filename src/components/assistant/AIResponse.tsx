import { AlertCircle, Dot } from "lucide-react";

import { SourceReference } from "./SourceReference";
import type { AssistantAnswer } from "@/lib/assistant";

export function AIResponse({ answer }: { answer: AssistantAnswer }) {
  return (
    <div className="text-sm leading-relaxed">
      <p className={answer.found ? "text-foreground" : "flex items-start gap-2 text-muted-foreground"}>
        {answer.found ? null : <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />}
        {answer.text}
      </p>
      {answer.bullets?.length ? (
        <ul className="mt-3 space-y-1.5">
          {answer.bullets.map((b) => (
            <li key={b} className="flex items-start gap-1 text-foreground/90">
              <Dot className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <SourceReference sources={answer.sources} />
    </div>
  );
}
