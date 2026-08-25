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
import { emailToText, generateEmail } from "@/lib/ai/generate";
import type { EmailResult, EmailTone } from "@/lib/ai/types";
import { recordActivity } from "@/lib/activity";
import { copyText, downloadText, slugify } from "@/lib/download";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Cortex" },
      {
        name: "description",
        content:
          "Describe the purpose and key points, pick a tone, and get a ready-to-send email with a matching subject line.",
      },
      { property: "og:title", content: "Smart Email Generator — Cortex" },
      {
        property: "og:description",
        content: "Tone-tuned emails with automatic subject lines, ready to copy and send.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES: { value: EmailTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
  { value: "apologetic", label: "Apologetic" },
];

const EXAMPLES = [
  "Follow up on the Q3 pricing proposal",
  "Ask a supplier for an updated delivery date",
  "Introduce our team to a new client",
];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [result, setResult] = useState<EmailResult | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const email = await generateEmail(purpose, details, tone);
      setResult(email);
      setDraft(email.body);
      setEditing(false);
      recordActivity("email", email.subject);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setPurpose("");
    setDetails("");
    setTone("professional");
    setResult(null);
    setDraft("");
    setEditing(false);
    setError(null);
  }

  const body = editing ? draft : (result?.body ?? "");
  const fullText = result ? emailToText({ subject: result.subject, body }) : "";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <PageHeading
          eyebrow="Smart Email Generator"
          title="Write the email for me"
          description="Say what the email is for, add the key details, choose a tone — the subject line is written for you."
        />

        <Panel title="Email workspace" className="mt-8">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of the email</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Follow up on the Q3 pricing proposal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
                <SelectTrigger id="tone" className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="details">Key information to include</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="One point per line — dates, numbers, names, next steps…"
              className="min-h-32"
            />
          </div>

          <div className="mt-4">
            <ExampleChips examples={EXAMPLES} onPick={setPurpose} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={run} disabled={loading || !purpose.trim()}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {loading ? "Writing…" : "Generate email"}
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>

          {error ? <ErrorState message={error} /> : null}
          {loading ? <GeneratingState label="Drafting your email…" /> : null}

          {!loading && !result && !error ? (
            <EmptyState
              title="No draft yet"
              hint="Tell Cortex what the email is about and it will handle the wording and the subject line."
            />
          ) : null}

          {!loading && result ? (
            <div className="rise-in mt-5 space-y-4">
              <div className="rounded-xl border border-border-subtle bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Subject line
                </p>
                <p className="mt-1 font-display text-base font-semibold">{result.subject}</p>
                <div className="mt-4 border-t border-border-subtle pt-4">
                  {editing ? (
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="min-h-80 text-sm"
                      aria-label="Edit email body"
                    />
                  ) : (
                    <pre className="font-sans text-sm whitespace-pre-wrap text-muted-foreground">
                      {result.body}
                    </pre>
                  )}
                </div>
              </div>

              <ResultActions
                busy={loading}
                editing={editing}
                onEdit={() => setEditing((v) => !v)}
                onCopy={() =>
                  copyText(fullText).then(
                    () => toast.success("Email copied to clipboard"),
                    () => toast.error("Couldn't copy — try selecting the text manually"),
                  )
                }
                onRegenerate={run}
                onDownload={() => downloadText(`${slugify(result.subject)}-email.md`, fullText)}
                onClear={clearAll}
              />
            </div>
          ) : null}
        </Panel>
      </main>
    </div>
  );
}
