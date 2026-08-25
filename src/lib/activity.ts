import { useCallback, useEffect, useState } from "react";
import type { ToolId } from "./ai/types";

export interface ActivityEntry {
  id: string;
  tool: ToolId;
  title: string;
  createdAt: number;
}

const STORAGE_KEY = "cortex.activity.v1";
const EVENT = "cortex-activity-change";

function read(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ActivityEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordActivity(tool: ToolId, title: string) {
  if (typeof window === "undefined") return;
  const entry: ActivityEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tool,
    title: title.slice(0, 90) || "Untitled",
    createdAt: Date.now(),
  };
  const next = [entry, ...read()].slice(0, 30);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — activity is non-essential */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** Hydration-safe: starts empty on the server and fills in after mount. */
export function useActivity() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    const sync = () => setEntries(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const counts = {
    research: entries.filter((e) => e.tool === "research").length,
    email: entries.filter((e) => e.tool === "email").length,
    meeting: entries.filter((e) => e.tool === "meeting").length,
  };

  return { entries, counts, clear: useCallback(() => clearActivity(), []) };
}

export function timeAgo(ts: number): string {
  const seconds = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
