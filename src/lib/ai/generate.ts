import type {
  EmailResult,
  EmailTone,
  MeetingResult,
  ResearchDepth,
  ResearchResult,
} from "./types";

/**
 * Demo AI layer.
 *
 * Every generator is async and returns a typed result, so swapping in a real
 * AI endpoint later only means replacing the body of these three functions
 * (e.g. `await fetch('/api/research', ...)`) — no UI changes required.
 */

const DELAY: Record<ResearchDepth, number> = {
  brief: 900,
  standard: 1400,
  detailed: 2000,
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function titleCase(input: string) {
  const trimmed = input.trim().replace(/\s+/g, " ");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
}

export async function generateResearch(
  topic: string,
  depth: ResearchDepth,
): Promise<ResearchResult> {
  if (!topic.trim()) throw new Error("Please enter a research topic or question.");
  await wait(DELAY[depth]);

  const subject = titleCase(topic);
  const count = depth === "brief" ? 3 : depth === "standard" ? 5 : 7;

  const findingTemplates = [
    `Current evidence around ${subject.toLowerCase()} points to steady, measurable adoption rather than a sudden shift.`,
    `Organisations that documented their approach to ${subject.toLowerCase()} reported roughly 30% fewer repeated mistakes.`,
    `Cost is rarely the deciding factor — capability gaps and unclear ownership are cited more often.`,
    `Early movers show the strongest results in the first 12 months, after which the gap narrows.`,
    `Quality of measurement varies widely; self-reported figures tend to overstate benefits.`,
    `Regional differences are significant, with regulation shaping the pace more than technology.`,
    `Long-term outcomes depend on continuous review rather than a single implementation push.`,
  ];

  const pointTemplates = [
    `Define what success looks like for ${subject.toLowerCase()} before committing resources.`,
    `Assign a single accountable owner; shared ownership consistently underperforms.`,
    `Collect a baseline now so later comparisons are meaningful.`,
    `Budget for a review cycle, not just a launch.`,
    `Watch for second-order effects on adjacent teams and processes.`,
    `Prefer reversible decisions while uncertainty is high.`,
    `Document assumptions so they can be challenged later.`,
  ];

  return {
    title: subject,
    summary:
      depth === "brief"
        ? `A short orientation on ${subject.toLowerCase()}: what it is, why it matters right now, and the two or three things worth acting on first.`
        : `A ${depth} synthesis of ${subject.toLowerCase()}. This overview brings together the prevailing views, where they agree, where the evidence is thin, and what a practical next step looks like for a team acting on this today.`,
    keyFindings: findingTemplates.slice(0, count),
    importantPoints: pointTemplates.slice(0, Math.max(3, count - 1)),
    conclusion: `Overall, ${subject.toLowerCase()} rewards deliberate, well-measured progress. Teams that clarify ownership, set a baseline, and review outcomes on a fixed cadence capture most of the available benefit while keeping the downside contained.`,
  };
}

const TONE_OPENERS: Record<EmailTone, string> = {
  professional: "Hi there,\n\nI hope this note finds you well.",
  friendly: "Hi there,\n\nHope you're having a good week!",
  formal: "Dear Sir or Madam,\n\nI am writing to you regarding the matter below.",
  casual: "Hey,\n\nQuick one for you —",
  persuasive: "Hi there,\n\nI'll keep this short, because I think it's worth your time.",
  apologetic: "Hi there,\n\nThank you for your patience — and I'm sorry for the inconvenience caused.",
};

const TONE_CLOSERS: Record<EmailTone, string> = {
  professional: "Thanks very much for your time.\n\nBest regards,",
  friendly: "Thanks so much — looking forward to hearing from you!\n\nBest,",
  formal: "I look forward to your response at your earliest convenience.\n\nYours faithfully,",
  casual: "Let me know what you think.\n\nCheers,",
  persuasive: "Happy to move on this whenever you are — just say the word.\n\nBest regards,",
  apologetic: "Again, my apologies, and thank you for bearing with us.\n\nSincerely,",
};

const TONE_SUBJECT_PREFIX: Record<EmailTone, string> = {
  professional: "",
  friendly: "Quick note: ",
  formal: "Regarding: ",
  casual: "Quick one — ",
  persuasive: "Worth a look: ",
  apologetic: "Apologies and next steps: ",
};

export async function generateEmail(
  purpose: string,
  details: string,
  tone: EmailTone,
): Promise<EmailResult> {
  if (!purpose.trim()) throw new Error("Please describe the purpose of the email.");
  await wait(1200);

  const points = sentences(details);
  const bulletBlock = points.length
    ? points.map((p) => `• ${p.replace(/[.]$/, "")}`).join("\n")
    : "• (No additional details were provided.)";

  const body = [
    TONE_OPENERS[tone],
    "",
    `I'm reaching out about ${purpose.trim().replace(/[.]$/, "").toLowerCase()}.`,
    "",
    points.length ? "Here are the key points:" : "Here's the context:",
    bulletBlock,
    "",
    tone === "persuasive"
      ? "If this looks useful, the next step is small and easy to reverse — a short call to confirm the details."
      : "Please let me know if anything above needs adjusting, or if it would help to talk it through.",
    "",
    TONE_CLOSERS[tone],
    "[Your name]",
  ].join("\n");

  return {
    subject: `${TONE_SUBJECT_PREFIX[tone]}${titleCase(purpose.trim().replace(/[.]$/, ""))}`,
    body,
  };
}

export async function generateMeetingSummary(notes: string): Promise<MeetingResult> {
  if (notes.trim().length < 20) {
    throw new Error("Please paste at least a few lines of meeting notes or a transcript.");
  }
  await wait(1500);

  const lines = sentences(notes);
  const pick = (matcher: RegExp) => lines.filter((l) => matcher.test(l.toLowerCase()));

  const decisionLines = pick(/decid|agree|approv|confirm|sign off|go ahead/);
  const actionLines = pick(/will |should |need to|action|assign|take on|follow up|owns?\b/);
  const deadlineLines = pick(
    /by (mon|tue|wed|thu|fri|sat|sun|next|end|q[1-4])|deadline|due|friday|monday|eod|eow/,
  );

  const discussion = lines
    .filter((l) => !decisionLines.includes(l) && !actionLines.includes(l))
    .slice(0, 6);

  const actionItems = (actionLines.length ? actionLines : lines.slice(0, 3))
    .slice(0, 6)
    .map((line) => {
      const ownerMatch = line.match(/\b([A-Z][a-z]{2,})\b/);
      const dueMatch = line.match(
        /\b(today|tomorrow|EOD|EOW|next week|this week|Mon\w*|Tue\w*|Wed\w*|Thu\w*|Fri\w*|Q[1-4])\b/i,
      );
      return {
        task: line.replace(/^[-•*]\s*/, "").replace(/[.]$/, ""),
        owner: ownerMatch ? ownerMatch[1] : "Unassigned",
        due: dueMatch ? titleCase(dueMatch[1]) : "No date set",
      };
    });

  return {
    summary: `The team covered ${lines.length} discussion point${lines.length === 1 ? "" : "s"}, reached ${decisionLines.length || "no formal"} decision${decisionLines.length === 1 ? "" : "s"}, and left the meeting with ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"}. The main thread of the conversation was ${(discussion[0] ?? lines[0] ?? "").toLowerCase().replace(/[.]$/, "")}.`,
    discussionPoints: discussion.length ? discussion : lines.slice(0, 4),
    decisions: decisionLines.length
      ? decisionLines.slice(0, 5)
      : ["No explicit decisions were recorded in these notes."],
    actionItems,
    deadlines: deadlineLines.length
      ? deadlineLines.slice(0, 5)
      : ["No specific deadlines were mentioned."],
  };
}

export function researchToText(r: ResearchResult): string {
  return [
    `# ${r.title}`,
    "",
    "## Summary",
    r.summary,
    "",
    "## Key findings",
    ...r.keyFindings.map((f) => `- ${f}`),
    "",
    "## Important points",
    ...r.importantPoints.map((p) => `- ${p}`),
    "",
    "## Conclusion",
    r.conclusion,
    "",
  ].join("\n");
}

export function emailToText(e: EmailResult): string {
  return `Subject: ${e.subject}\n\n${e.body}\n`;
}

export function meetingToText(m: MeetingResult): string {
  return [
    "# Meeting summary",
    "",
    m.summary,
    "",
    "## Key discussion points",
    ...m.discussionPoints.map((p) => `- ${p}`),
    "",
    "## Decisions made",
    ...m.decisions.map((d) => `- ${d}`),
    "",
    "## Action items",
    ...m.actionItems.map((a) => `- ${a.task} — ${a.owner} (${a.due})`),
    "",
    "## Deadlines",
    ...m.deadlines.map((d) => `- ${d}`),
    "",
  ].join("\n");
}
