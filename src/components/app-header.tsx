import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/research", label: "Research" },
  { to: "/email", label: "Email" },
  { to: "/meetings", label: "Meetings" },
] as const;

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 lg:gap-8 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-brand-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Cortex</span>
          <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:inline">
            AI Workspace
          </span>
        </Link>

        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              activeProps={{
                className:
                  "rounded-lg px-3 py-2 text-sm font-medium bg-brand text-brand-foreground shadow-sm hover:bg-brand hover:text-brand-foreground",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <span className="pulse-dot size-1.5 rounded-full bg-success" aria-hidden="true" />3 tools
          ready
        </div>
      </div>
    </header>
  );
}
