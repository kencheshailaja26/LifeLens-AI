import { initialActions, type ActionItem } from "@/data/actions";
import { resolvePriority } from "@/lib/prioritize";

export type AssistantAnswer = {
  text: string;
  bullets?: string[];
  sources: string[];
  found: boolean;
};

export const NOT_FOUND = "I couldn't find that information in your LifeLens data.";

export const suggestedQuestions = [
  "What do I need to finish this week?",
  "Which deadlines are coming up?",
  "What documents do I need for my internship?",
  "Which task should I do first?",
  "Do I have anything overdue?",
  "Show me everything related to my internship.",
];

const priorityOf = (a: ActionItem) => resolvePriority(a.signals, a.manualPriority).priority;

const rank = { high: 0, medium: 1, low: 2 } as const;

const open = () => initialActions.filter((a) => !a.completed);

const line = (a: ActionItem) =>
  `${a.title} — ${a.due.toLowerCase()}, ${priorityOf(a)} priority (${a.category})`;

const uniqueSources = (items: ActionItem[]) =>
  Array.from(new Set(items.map((a) => a.source)));

function sortByUrgency(items: ActionItem[]) {
  return [...items].sort((a, b) => {
    const p = rank[priorityOf(a)] - rank[priorityOf(b)];
    if (p !== 0) return p;
    return a.signals.dueInDays - b.signals.dueInDays;
  });
}

/**
 * Local, deterministic answer engine over the user's stored LifeLens data.
 * It never invents information: anything it cannot ground returns `found: false`.
 */
export function answerQuestion(question: string): AssistantAnswer {
  const q = question.toLowerCase();

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  // Overdue
  if (has("overdue", "late", "missed")) {
    const items = open().filter((a) => a.status === "overdue");
    if (!items.length) {
      return { text: "Nothing is overdue right now — everything with a past deadline is completed.", sources: [], found: true };
    }
    return {
      text: `Yes — you have ${items.length} overdue ${items.length === 1 ? "item" : "items"}:`,
      bullets: items.map(line),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // First / next task
  if (has("first", "start with", "do next", "next task", "prioritise", "prioritize")) {
    const [top] = sortByUrgency(open());
    if (!top) return { text: "You have no open actions left.", sources: [], found: true };
    const p = resolvePriority(top.signals, top.manualPriority);
    return {
      text: `You should ${top.title.toLowerCase()} first. It's ${top.due.toLowerCase()} and marked ${p.priority} priority. ${p.explanation}`,
      sources: [top.source],
      found: true,
    };
  }

  // Internship-related
  if (has("internship", "joining", "hr", "offer")) {
    const items = initialActions.filter(
      (a) => a.source.toLowerCase().includes("internship") || a.title.toLowerCase().includes("internship"),
    );
    if (!items.length) return { text: NOT_FOUND, sources: [], found: false };
    const docTask = items.find((a) => a.title.toLowerCase().includes("document"));
    const intro = has("document", "need for", "required")
      ? docTask
        ? `For your internship you need to submit: ${docTask.description.replace(/\.$/, "")}.`
        : "Here is everything stored about your internship:"
      : "Here is everything related to your internship:";
    return {
      text: intro,
      bullets: items.map((a) => `${a.title} — ${a.completed ? "completed" : a.due.toLowerCase()}`),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // This week
  if (has("this week", "finish this week", "week")) {
    const items = sortByUrgency(open().filter((a) => a.signals.dueInDays <= 7));
    if (!items.length) return { text: "Nothing is due in the next 7 days.", sources: [], found: true };
    return {
      text: `You have ${items.length} things to finish within the next 7 days:`,
      bullets: items.map(line),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // Deadlines / upcoming
  if (has("deadline", "coming up", "upcoming", "due", "timeline", "when")) {
    const items = sortByUrgency(open());
    return {
      text: "These are your upcoming deadlines, soonest first:",
      bullets: items.map(line),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // Category lookups
  const categoryMatch = (["Career", "Education", "Bills", "Travel", "Events", "Personal"] as const).find(
    (c) => q.includes(c.toLowerCase()) || (c === "Bills" && has("bill", "payment")),
  );
  if (categoryMatch) {
    const items = open().filter((a) => a.category === categoryMatch);
    if (!items.length) return { text: NOT_FOUND, sources: [], found: false };
    return {
      text: `Here's what's open under ${categoryMatch}:`,
      bullets: sortByUrgency(items).map(line),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // Free-text keyword match against stored actions and documents
  const words = q.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  const matches = initialActions.filter((a) =>
    words.some(
      (w) =>
        a.title.toLowerCase().includes(w) ||
        a.description.toLowerCase().includes(w) ||
        a.source.toLowerCase().includes(w),
    ),
  );
  if (matches.length) {
    return {
      text: `Here's what I found in your LifeLens data:`,
      bullets: matches.map((a) => `${a.title} — ${a.completed ? "completed" : a.due.toLowerCase()}`),
      sources: uniqueSources(matches),
      found: true,
    };
  }

  return { text: NOT_FOUND, sources: [], found: false };
}
