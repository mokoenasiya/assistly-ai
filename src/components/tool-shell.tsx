import type { ReactNode } from "react";
import { Copy, Download, Eraser, PencilLine, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
    </div>
  );
}

export function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card overflow-hidden rounded-2xl ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-brand" aria-hidden="true" />
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
        {aside}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function ExampleChips({
  examples,
  onPick,
}: {
  examples: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Try:</span>
      {examples.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onPick(example)}
          className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {example}
        </button>
      ))}
    </div>
  );
}

export function ResultActions({
  onCopy,
  onEdit,
  editing,
  onRegenerate,
  onDownload,
  onClear,
  busy,
}: {
  onCopy: () => void;
  onEdit: () => void;
  editing: boolean;
  onRegenerate: () => void;
  onDownload?: () => void;
  onClear: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={onCopy}>
        <Copy className="size-3.5" /> Copy
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
        <PencilLine className="size-3.5" /> {editing ? "Done editing" : "Edit"}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onRegenerate} disabled={busy}>
        <RefreshCw className={`size-3.5 ${busy ? "animate-spin" : ""}`} /> Regenerate
      </Button>
      {onDownload ? (
        <Button type="button" variant="secondary" size="sm" onClick={onDownload}>
          <Download className="size-3.5" /> Download
        </Button>
      ) : null}
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        <Eraser className="size-3.5" /> Clear
      </Button>
    </div>
  );
}

export function GeneratingState({ label }: { label: string }) {
  return (
    <div className="rise-in mt-5 rounded-xl border border-border-subtle bg-background p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-brand">
        <span className="pulse-dot size-2 rounded-full bg-brand" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-4 space-y-2.5" aria-hidden="true">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-border bg-background p-8 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
    >
      {message}
    </div>
  );
}
