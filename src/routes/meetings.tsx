import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock, CheckCircle2, Loader2, Wand2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import {
  EmptyState,
  ErrorState,
  ExampleChips,
  GeneratingState,
  PageHeading,
  Panel,
  ResultActions,
} from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateMeetingSummary, meetingToText } from "@/lib/ai/generate";
import type { MeetingResult } from "@/lib/ai/types";
import { recordActivity } from "@/lib/activity";
import { copyText, downloadText } from "@/lib/download";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Cortex" },
      {
        name: "description",
        content:
          "Paste meeting notes or a transcript and get a summary, decisions, action items and deadlines in a clean task layout.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Cortex" },
      {
        property: "og:description",
        content: "Decisions, action items and deadlines pulled out of any transcript.",
      },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Sprint 14 design sync, attendees: Priya, Marcus, Lena.
Priya walked through the new onboarding flow and the drop-off data from last month.
Marcus raised that the second step is where most users abandon the flow.
We agreed to cut the second step entirely and merge its fields into step one.
Lena will run a quick usability test with five users by Friday.
Marcus will update the analytics dashboard so the funnel reflects the new steps.
We decided to hold the launch until the test results are in.
Deadline for the revised designs is next Wednesday.`;

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const summary = await generateMeetingSummary(notes);
      setResult(summary);
      setDraft(meetingToText(summary));
      setEditing(false);
      recordActivity("meeting", notes.split("\n")[0]?.slice(0, 60) || "Meeting summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setNotes("");
    setResult(null);
    setDraft("");
    setEditing(false);
    setError(null);
  }

  const text = editing ? draft : result ? meetingToText(result) : "";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <PageHeading
          eyebrow="Meeting Notes Summarizer"
          title="Turn notes into next steps"
          description="Paste raw notes or a transcript and get a summary, the decisions made, action items and any deadlines mentioned."
        />

        <Panel title="Meeting workspace" className="mt-8">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes or transcript</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here — one line per point works best."
              className="min-h-52"
            />
          </div>

          <div className="mt-4">
            <ExampleChips examples={["Load a sample transcript"]} onPick={() => setNotes(SAMPLE)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={run} disabled={loading || !notes.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {loading ? "Summarizing…" : "Summarize meeting"}
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>

          {error ? <ErrorState message={error} /> : null}
          {loading ? <GeneratingState label="Reading the transcript and pulling out actions…" /> : null}

          {!loading && !result && !error ? (
            <EmptyState
              title="Nothing summarized yet"
              hint="Paste your notes above, or load the sample transcript to see how it works."
            />
          ) : null}

          {!loading && result ? (
            <div className="rise-in mt-5 space-y-4">
              {editing ? (
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-h-100 font-mono text-xs"
                  aria-label="Edit meeting summary"
                />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border-subtle bg-background p-5">
                    <h3 className="font-display text-base font-semibold">Summary</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <BulletCard
                      heading="Key discussion points"
                      tone="brand"
                      items={result.discussionPoints}
                    />
                    <BulletCard
                      heading="Decisions made"
                      tone="accent"
                      items={result.decisions}
                    />
                  </div>

                  <div className="rounded-xl border border-border-subtle bg-background p-5">
                    <h3 className="font-display text-base font-semibold">Action items</h3>
                    <ul className="mt-3 space-y-2">
                      {result.actionItems.map((item) => (
                        <li
                          key={item.task}
                          className="surface-card flex items-start gap-3 rounded-lg p-3"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-success"
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.task}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.owner} · {item.due}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border-subtle bg-background p-5">
                    <h3 className="flex items-center gap-2 font-display text-base font-semibold">
                      <CalendarClock className="size-4 text-accent" aria-hidden="true" /> Deadlines
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {result.deadlines.map((d) => (
                        <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <ResultActions
                busy={loading}
                editing={editing}
                onEdit={() => setEditing((v) => !v)}
                onCopy={() =>
                  copyText(text).then(
                    () => toast.success("Summary copied to clipboard"),
                    () => toast.error("Couldn't copy — try selecting the text manually"),
                  )
                }
                onRegenerate={run}
                onDownload={() => downloadText("meeting-summary.md", text)}
                onClear={clearAll}
              />
            </div>
          ) : null}
        </Panel>
      </main>
    </div>
  );
}

function BulletCard({
  heading,
  items,
  tone,
}: {
  heading: string;
  items: string[];
  tone: "brand" | "accent";
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-background p-5">
      <h3 className="font-display text-base font-semibold">{heading}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground">
            <span
              className={`mt-1.5 size-1.5 shrink-0 rounded-full ${tone === "brand" ? "bg-brand" : "bg-accent"}`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
