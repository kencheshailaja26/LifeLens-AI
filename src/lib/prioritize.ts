import type { Priority } from "@/data/actions";

export type PriorityInput = {
  /** Days until the deadline. Negative means overdue. */
  dueInDays: number;
  /** How important the task is on its own. */
  importance: "critical" | "significant" | "routine";
  /** What happens if the task is missed. */
  consequence: "severe" | "moderate" | "minor";
  /** Something important depends on this task being done first. */
  blocks?: string | undefined;
};

export type PriorityResult = {
  priority: Priority;
  score: number;
  explanation: string;
  source: "ai" | "manual";
};

function deadlineScore(days: number) {
  if (days < 0) return 45;
  if (days <= 1) return 40;
  if (days <= 3) return 28;
  if (days <= 7) return 16;
  return 6;
}

const importanceScore = { critical: 25, significant: 15, routine: 6 } as const;
const consequenceScore = { severe: 25, moderate: 14, minor: 5 } as const;

function deadlinePhrase(days: number) {
  if (days < 0) return `the deadline passed ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  if (days === 0) return "the deadline is today";
  if (days === 1) return "the deadline is tomorrow";
  if (days <= 7) return `the deadline is in ${days} days`;
  return `the deadline is still ${days} days away`;
}

/**
 * Smart prioritization: deadline proximity + importance + consequences of
 * missing it + whether it blocks another important event. A manual override
 * always wins and is preserved.
 */
export function prioritize(input: PriorityInput, manual?: Priority): PriorityResult {
  const score =
    deadlineScore(input.dueInDays) +
    importanceScore[input.importance] +
    consequenceScore[input.consequence] +
    (input.blocks ? 12 : 0);

  const priority: Priority = score >= 70 ? "high" : score >= 45 ? "medium" : "low";

  const reasons: string[] = [deadlinePhrase(input.dueInDays)];
  if (input.consequence === "severe") reasons.push("missing it has a serious consequence");
  else if (input.consequence === "moderate") reasons.push("there is a real cost to missing it");
  if (input.blocks) reasons.push(`it blocks ${input.blocks}`);
  if (priority === "low" && input.consequence === "minor") {
    reasons.push("there is no penalty for a small delay");
  }
  if (priority === "medium" && input.dueInDays > 1) {
    reasons.push("there is still sufficient time");
  }

  const label = priority === "high" ? "High" : priority === "medium" ? "Medium" : "Low";

  if (manual) {
    const manualLabel = manual === "high" ? "High" : manual === "medium" ? "Medium" : "Low";
    return {
      priority: manual,
      score,
      source: "manual",
      explanation: `Set to ${manualLabel} priority by you. LifeLens suggested ${label} because ${reasons[0]}.`,
    };
  }

  return {
    priority,
    score,
    source: "ai",
    explanation: `${label} priority because ${reasons.join(", and ")}.`,
  };
}
