import type { ReactNode } from "react";
import { Bot, User } from "lucide-react";

import { cn } from "@/lib/utils";

export function MessageBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-muted text-foreground/70" : "bg-primary/10 text-primary",
        )}
      >
        {isUser ? <User className="size-4" aria-hidden /> : <Bot className="size-4" aria-hidden />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isUser
            ? "bg-primary text-primary-foreground text-sm leading-relaxed"
            : "border border-border bg-card",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <MessageBubble role="assistant">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 animate-bounce rounded-full bg-primary/60"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </span>
        LifeLens is thinking…
      </div>
    </MessageBubble>
  );
}
