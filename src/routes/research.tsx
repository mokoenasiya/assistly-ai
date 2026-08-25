import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateResearch, researchToText } from "@/lib/ai/generate";
import type { ResearchDepth, ResearchResult } from "@/lib/ai/types";
import { recordActivity } from "@/lib/activity";
import { copyText, downloadText, slugify } from "@/lib/download";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Cortex" },
      {
        name: "description",
        content:
          "Turn any topic or question into a structured research brief with summaries, key findings and a clear conclusion.",
      },
      { property: "og:title", content: "AI Research Assistant — Cortex" },
      {
        property: "og:description",
        content: "Structured research briefs with key findings and conclusions, in seconds.",
      },
    ],
  }),
  component: ResearchPage,
});

const EXAMPLES = [
  "Impact of remote work on team productivity",
  "How do vector databases compare in 2026?",
  "Renewable energy incentives for small businesses",
];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<ResearchDepth>("standard");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const research = await generateResearch(topic, depth);
      setResult(research);
      setDraft(researchToText(research));
      setEditing(false);
      recordActivity("research", research.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setTopic("");
    setDepth("standard");
    setResult(null);
    setDraft("");
    setEditing(false);
    setError(null);
  }

  const text = editing ? draft : result ? researchToText(result) : "";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <PageHeading
          eyebrow="AI Research Assistant"
          title="Research any topic"
          description="Enter a topic or question, choose how deep to go, and get a structured brief you can copy, edit or download."
        />

        <Panel title="Research workspace" className="mt-8">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a research topic or question…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Depth</Label>
              <Select value={depth} onValueChange={(v) => setDepth(v as ResearchDepth)}>
                <SelectTrigger id="depth" className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief overview</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <ExampleChips examples={EXAMPLES} onPick={setTopic} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={run} disabled={loading || !topic.trim()}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              {loading ? "Researching…" : "Generate research"}
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>

          {error ? <ErrorState message={error} /> : null}

          {loading ? <GeneratingState label="Gathering findings and structuring the brief…" /> : null}

          {!loading && !result && !error ? (
            <EmptyState
              title="No research yet"
              hint="Pick an example above or type your own question, then hit Generate research."
            />
          ) : null}

          {!loading && result ? (
            <div className="rise-in mt-5 space-y-4">
              {editing ? (
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="min-h-100 font-mono text-xs"
                  aria-label="Edit research"
                />
              ) : (
                <article className="rounded-xl border border-border-subtle bg-background p-5">
                  <h3 className="font-display text-lg font-semibold">{result.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>

                  <h4 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-brand">
                    Key findings
                  </h4>
                  <ul className="space-y-2">
                    {result.keyFindings.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    Important points
                  </h4>
                  <ul className="space-y-2">
                    {result.importantPoints.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <span
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conclusion
                  </h4>
                  <p className="text-sm text-muted-foreground">{result.conclusion}</p>
                </article>
              )}

              <ResultActions
                busy={loading}
                editing={editing}
                onEdit={() => setEditing((v) => !v)}
                onCopy={() =>
                  copyText(text).then(
                    () => toast.success("Research copied to clipboard"),
                    () => toast.error("Couldn't copy — try selecting the text manually"),
                  )
                }
                onRegenerate={run}
                onDownload={() => downloadText(`${slugify(result.title)}-research.md`, text)}
                onClear={clearAll}
              />
            </div>
          ) : null}
        </Panel>
      </main>
    </div>
  );
}
