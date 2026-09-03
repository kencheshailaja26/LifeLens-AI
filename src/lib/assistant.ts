import type { ActionItem } from "@/data/actions";
import type { AnalysisResult } from "@/data/analysis";
import { loadActionItems, loadAllAnalyses } from "@/lib/analysis-store";
import { prioritize } from "@/lib/prioritize";

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

const priorityOf = (a: ActionItem): "high" | "medium" | "low" =>
  prioritize(a.signals, a.manualPriority).priority;

const rank = { high: 0, medium: 1, low: 2 } as const;

const allActions = () => loadActionItems();
const allAnalyses = () => loadAllAnalyses();

const open = () => allActions().filter((a) => !a.completed);

const line = (a: ActionItem) =>
  `${a.title} — ${a.due.toLowerCase()}, ${priorityOf(a)} priority (${a.category})`;

const uniqueSources = (items: { source: string }[]) =>
  Array.from(new Set(items.map((a) => a.source)));

function sortByUrgency(items: ActionItem[]) {
  return [...items].sort((a, b) => {
    const p = rank[priorityOf(a)] - rank[priorityOf(b)];
    if (p !== 0) return p;
    return a.signals.dueInDays - b.signals.dueInDays;
  });
}

const STOP_WORDS = new Set([
  "what",
  "when",
  "where",
  "which",
  "whats",
  "does",
  "need",
  "have",
  "there",
  "about",
  "with",
  "from",
  "this",
  "that",
  "them",
  "they",
  "tell",
  "show",
  "give",
  "please",
  "list",
  "everything",
  "anything",
  "something",
  "info",
  "information",
  "lifelens",
  "should",
  "would",
  "could",
  "much",
  "many",
  "some",
  "your",
  "mine",
  "date",
  "dates",
]);

const stem = (w: string) => w.replace(/(ies)$/, "y").replace(/(es|s)$/, "");

const keywords = (q: string) =>
  q
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .map(stem);

/** Flatten every stored analysis into searchable, grounded facts. */
type Fact = { section: string; label: string; note?: string; source: string };

function factsFor(analysis: AnalysisResult): Fact[] {
  const facts: Fact[] = [];
  const src = analysis.documentName;
  const push = (
    section: string,
    items: { label: string; note?: string; value?: string }[] | undefined,
  ) => {
    for (const item of items ?? []) {
      const note = item.note ?? item.value;
      facts.push({ section, label: item.label, ...(note ? { note } : {}), source: src });
    }
  };
  push("Dates & deadlines", analysis.dates);
  push("Required documents", analysis.requirements);
  push("Contacts", analysis.contacts);
  push("Amounts", analysis.amounts);
  push("Locations", analysis.locations);
  push("Instructions", analysis.instructions);
  return facts;
}

const allFacts = () => allAnalyses().flatMap(factsFor);

const factLine = (f: Fact) => (f.note ? `${f.label} — ${f.note}` : f.label);

function sectionAnswer(section: string, intro: string, filter?: (f: Fact) => boolean) {
  const facts = allFacts().filter((f) => f.section === section && (!filter || filter(f)));
  if (!facts.length) return null;
  return {
    text: intro,
    bullets: facts.map(factLine),
    sources: uniqueSources(facts),
    found: true,
  } satisfies AssistantAnswer;
}

/**
 * Local, deterministic answer engine over the user's stored LifeLens data.
 * It never invents information: anything it cannot ground returns `found: false`.
 */
export function answerQuestion(question: string): AssistantAnswer {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  const hasData = allAnalyses().length > 0 || allActions().length > 0;
  if (!hasData) return { text: NOT_FOUND, sources: [], found: false };

  const topicWords = keywords(q);
  const matchesTopic = (text: string) => {
    if (!topicWords.length) return true;
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map(stem);
    return topicWords.some((w) =>
      tokens.some((t) => t === w || (w.length > 3 && (t.includes(w) || w.includes(t)))),
    );
  };


  // Overdue
  if (has("overdue", "late", "missed")) {
    const items = open().filter((a) => a.status === "overdue");
    if (!items.length) {
      return {
        text: "Nothing is overdue right now — everything with a past deadline is completed.",
        sources: [],
        found: true,
      };
    }
    return {
      text: `Yes — you have ${items.length} overdue ${items.length === 1 ? "item" : "items"}:`,
      bullets: items.map(line),
      sources: uniqueSources(items),
      found: true,
    };
  }

  // First / next / priority
  if (
    has(
      "first",
      "start with",
      "do next",
      "next task",
      "next priority",
      "priority",
      "prioritise",
      "prioritize",
      "most important",
      "urgent",
    )
  ) {
    const [top] = sortByUrgency(open());
    if (!top) {
      const facts = allFacts();
      if (!facts.length) return { text: NOT_FOUND, sources: [], found: false };
      return { text: "You have no open actions left.", sources: [], found: true };
    }
    const p = prioritize(top.signals, top.manualPriority);
    return {
      text: `You should ${top.title.toLowerCase()} first. It's ${top.due.toLowerCase()} and marked ${p.priority} priority. ${p.explanation}`,
      sources: [top.source],
      found: true,
    };
  }

  // Required documents
  if (has("document", "paper", "certificate", "proof", "submit", "bring", "carry")) {
    const answer =
      sectionAnswer(
        "Required documents",
        "Based on your analyzed documents, you need to provide:",
        (f) => matchesTopic(`${f.label} ${f.note ?? ""} ${f.source}`),
      ) ??
      sectionAnswer("Required documents", "Based on your analyzed documents, you need to provide:");
    if (answer) return answer;
  }

  // Contacts
  if (has("contact", "phone", "email", "who do i", "reach out", "call")) {
    const answer = sectionAnswer("Contacts", "Here are the contacts from your documents:");
    if (answer) return answer;
  }

  // Amounts
  if (has("amount", "cost", "fee", "pay", "price", "salary", "stipend", "money", "how much")) {
    const answer = sectionAnswer("Amounts", "Here are the amounts found in your documents:");
    if (answer) return answer;
  }

  // Locations
  if (has("where", "location", "address", "office", "venue", "place")) {
    const answer = sectionAnswer("Locations", "Here are the locations from your documents:");
    if (answer) return answer;
  }

  // Instructions
  if (has("instruction", "how do i", "steps", "process", "procedure", "note")) {
    const answer = sectionAnswer("Instructions", "Here are the key instructions from your documents:");
    if (answer) return answer;
  }

  // Specific date questions (joining date, start date, submission deadline…)
  if (has("date", "when", "joining", "start", "report", "deadline", "due", "expire")) {
    const dateFacts = allFacts().filter((f) => f.section === "Dates & deadlines");
    const focused = dateFacts.filter((f) => matchesTopic(`${f.label} ${f.note ?? ""} ${f.source}`));
    const chosen = focused.length ? focused : dateFacts;
    if (chosen.length) {
      return {
        text:
          chosen.length === 1
            ? "Here's the date from your documents:"
            : "Here are the relevant dates from your documents:",
        bullets: chosen.map(factLine),
        sources: uniqueSources(chosen),
        found: true,
      };
    }
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

  // Deadlines / upcoming actions
  if (has("deadline", "coming up", "upcoming", "due", "timeline", "todo", "to do", "task")) {
    const items = sortByUrgency(open());
    if (items.length) {
      return {
        text: "These are your upcoming deadlines, soonest first:",
        bullets: items.map(line),
        sources: uniqueSources(items),
        found: true,
      };
    }
  }

  // Category lookups
  const categoryMatch = (["Career", "Education", "Bills", "Travel", "Events", "Personal"] as const).find(
    (c) => q.includes(c.toLowerCase()) || (c === "Bills" && has("bill", "payment")),
  );
  if (categoryMatch) {
    const items = open().filter((a) => a.category === categoryMatch);
    if (items.length) {
      return {
        text: `Here's what's open under ${categoryMatch}:`,
        bullets: sortByUrgency(items).map(line),
        sources: uniqueSources(items),
        found: true,
      };
    }
  }

  // Document summaries ("what is this document about", "show me everything about X")
  if (has("summary", "summar", "about", "overview", "explain")) {
    const analyses = allAnalyses().filter((a) =>
      matchesTopic(`${a.documentName} ${a.summaryText ?? ""} ${a.summary.documentType} ${a.summary.category}`),
    );
    if (analyses.length) {
      return {
        text: "Here's what your analyzed documents say:",
        bullets: analyses.map(
          (a) => `${a.documentName} (${a.summary.documentType}) — ${a.summaryText ?? a.summary.category}`,
        ),
        sources: analyses.map((a) => a.documentName),
        found: true,
      };
    }
  }

  // Free-text grounded search across actions and every extracted fact
  const matchedActions = allActions().filter((a) =>
    matchesTopic(`${a.title} ${a.description} ${a.source} ${a.category}`),
  );
  const matchedFacts = topicWords.length
    ? allFacts().filter((f) => matchesTopic(`${f.label} ${f.note ?? ""} ${f.source}`))
    : [];

  if (matchedActions.length || matchedFacts.length) {
    const bullets = [
      ...matchedActions.map((a) => `${a.title} — ${a.completed ? "completed" : a.due.toLowerCase()}`),
      ...matchedFacts.map((f) => `${f.section}: ${factLine(f)}`),
    ];
    return {
      text: "Here's what I found in your LifeLens data:",
      bullets,
      sources: uniqueSources([...matchedActions, ...matchedFacts]),
      found: true,
    };
  }

  // Nothing matched the question, but real data exists: state the fallback and
  // show what LifeLens actually holds (still fully grounded, nothing invented).
  const analyses = allAnalyses();
  const openActions = sortByUrgency(open());
  const bullets = [
    ...analyses.map((a) => `${a.documentName} (${a.summary.documentType})`),
    ...openActions.map(line),
  ];
  if (bullets.length) {
    return {
      text: NOT_FOUND,
      bullets,
      sources: uniqueSources([...analyses.map((a) => ({ source: a.documentName })), ...openActions]),
      found: false,
    };
  }

  return { text: NOT_FOUND, sources: [], found: false };
}
