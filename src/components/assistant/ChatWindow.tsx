import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { AIResponse } from "./AIResponse";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { SuggestedQuestion } from "./SuggestedQuestion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { answerQuestion, suggestedQuestions, type AssistantAnswer } from "@/lib/assistant";

type Message =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; answer: AssistantAnswer };

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || typing) return;
    setMessages((prev) => [...prev, { id: `${Date.now()}-u`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-a`, role: "assistant", answer: answerQuestion(q) },
        ]);
        setTyping(false);
      }, 700),
    );
  };

  return (
    <div className="surface-card flex h-[calc(100vh-14rem)] min-h-[520px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && !typing ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <h2 className="text-base font-semibold">Ask about your LifeLens data</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              LifeLens only answers from your uploaded documents and generated actions — pick a
              question below to get started.
            </p>
          </div>
        ) : null}

        {messages.map((message) =>
          message.role === "user" ? (
            <MessageBubble key={message.id} role="user">
              {message.text}
            </MessageBubble>
          ) : (
            <MessageBubble key={message.id} role="assistant">
              <AIResponse answer={message.answer} />
            </MessageBubble>
          ),
        )}

        {typing ? <TypingIndicator /> : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <SuggestedQuestion key={question} question={question} onSelect={ask} />
          ))}
        </div>

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask(input);
              }
            }}
            rows={1}
            placeholder="Ask LifeLens anything… (Enter to send, Shift+Enter for a new line)"
            aria-label="Message LifeLens"
            className="max-h-40 min-h-[46px] flex-1 resize-none text-sm"
          />
          <Button
            type="button"
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || typing}
            onClick={() => ask(input)}
            className="h-[46px] w-[46px] shrink-0 bg-brand-gradient text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
