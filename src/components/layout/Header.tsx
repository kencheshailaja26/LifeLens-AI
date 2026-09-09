import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Menu,
  Search,
  Plus,
  FileText,
  ListChecks,
  BellRing,
  Settings,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import {
  loadActionItems,
  loadDocumentItems,
  loadReminders,
  type Reminder,
} from "@/lib/analysis-store";
import type { ActionItem } from "@/data/actions";
import type { DocumentItem } from "@/components/cards/DocumentCard";

type Panel = "search" | "bell" | "profile" | null;

type SearchHit = {
  id: string;
  label: string;
  detail: string;
  group: "Documents" | "Actions" | "Reminders";
  to: string;
  params?: Record<string, string>;
};

function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

const panelClass =
  "absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-w-[92vw] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]";

export function Header({
  onOpenMenu,
  greeting = "Monday, ready when you are",
}: {
  onOpenMenu: () => void;
  greeting?: string;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Re-read the persisted LifeLens store on every navigation and whenever a panel opens.
  useEffect(() => {
    setDocuments(loadDocumentItems());
    setActions(loadActionItems());
    setReminders(loadReminders());
  }, [pathname, panel]);

  // Close any open panel when the route changes.
  useEffect(() => {
    setPanel(null);
    setQuery("");
  }, [pathname]);

  const searchRef = useOutsideClose(panel === "search", () => setPanel(null));
  const bellRef = useOutsideClose(panel === "bell", () => setPanel(null));
  const profileRef = useOutsideClose(panel === "profile", () => setPanel(null));

  const results = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];

    for (const doc of documents) {
      if (`${doc.name} ${doc.meta} ${doc.status}`.toLowerCase().includes(q)) {
        hits.push({
          id: `doc-${doc.id}`,
          label: doc.name,
          detail: doc.meta,
          group: "Documents",
          to: "/analysis/$documentId",
          params: { documentId: doc.id },
        });
      }
    }

    for (const action of actions) {
      const haystack =
        `${action.title} ${action.description} ${action.explanation} ${action.source} ${action.category} ${action.due}`.toLowerCase();
      if (haystack.includes(q)) {
        hits.push({
          id: `action-${action.id}`,
          label: action.title,
          detail: `${action.category} · ${action.due} · ${action.source}`,
          group: "Actions",
          to: "/actions",
        });
      }
    }

    for (const reminder of reminders) {
      if (`${reminder.title} ${reminder.source} ${reminder.dueLabel}`.toLowerCase().includes(q)) {
        hits.push({
          id: `rem-${reminder.id}`,
          label: reminder.title,
          detail: `Due ${reminder.dueLabel} · ${reminder.source}`,
          group: "Reminders",
          to: "/reminders",
        });
      }
    }

    return hits.slice(0, 12);
  }, [query, documents, actions, reminders]);

  const notifications = reminders;

  const closeAll = () => setPanel(null);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div ref={searchRef} className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPanel("search");
            }}
            onFocus={() => setPanel("search")}
            placeholder="Search documents, actions, deadlines…"
            aria-label="Search"
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />

          {panel === "search" && query.trim() ? (
            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)]">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results found
                </p>
              ) : (
                <ul className="max-h-[60vh] overflow-y-auto py-1">
                  {results.map((hit) => (
                    <li key={hit.id}>
                      <Link
                        to={hit.to}
                        {...(hit.params ? { params: hit.params } : {})}
                        onClick={closeAll}
                        className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted"
                      >
                        <span className="mt-0.5 text-muted-foreground">
                          {hit.group === "Documents" ? (
                            <FileText className="h-4 w-4" />
                          ) : hit.group === "Actions" ? (
                            <ListChecks className="h-4 w-4" />
                          ) : (
                            <BellRing className="h-4 w-4" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{hit.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {hit.group} · {hit.detail}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <p className="ml-2 hidden text-sm text-muted-foreground xl:block">{greeting}</p>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              closeAll();
              void navigate({ to: "/inbox" });
            }}
            className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:flex"
          >
            <Plus className="h-4 w-4" />
            Add information
          </button>

          <div ref={bellRef} className="relative">
            <button
              aria-label="Notifications"
              aria-expanded={panel === "bell"}
              onClick={() => setPanel(panel === "bell" ? null : "bell")}
              className="relative rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted"
            >
              <Bell className="h-[18px] w-[18px]" />
              {notifications.length > 0 ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              ) : null}
            </button>

            {panel === "bell" ? (
              <div className={panelClass}>
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Pending deadlines from your documents
                  </p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No notifications
                  </p>
                ) : (
                  <ul className="max-h-[60vh] overflow-y-auto py-1">
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <Link
                          to="/reminders"
                          onClick={closeAll}
                          className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted"
                        >
                          <BellRing
                            className={`mt-0.5 h-4 w-4 ${
                              n.urgency === "urgent" ? "text-destructive" : "text-primary"
                            }`}
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{n.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {n.daysUntil === 0
                                ? "Due today"
                                : n.daysUntil === 1
                                  ? "Due tomorrow"
                                  : `Due in ${n.daysUntil} days`}{" "}
                              · {n.source}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-border">
                  <Link
                    to="/reminders"
                    onClick={closeAll}
                    className="block px-4 py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-muted"
                  >
                    View all reminders
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div ref={profileRef} className="relative">
            <button
              aria-label="Account menu"
              aria-expanded={panel === "profile"}
              onClick={() => setPanel(panel === "profile" ? null : "profile")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground"
            >
              SK
            </button>

            {panel === "profile" ? (
              <div className={`${panelClass} w-64`}>
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
                    SK
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-semibold">Shailaja K.</span>
                    <span className="block truncate text-xs text-muted-foreground">Free plan</span>
                  </span>
                </div>
                <ul className="py-1">
                  {[
                    { to: "/", label: "Dashboard", icon: LayoutDashboard },
                    { to: "/documents", label: "My documents", icon: FileText },
                    { to: "/assistant", label: "Ask LifeLens", icon: Sparkles },
                    { to: "/settings", label: "Settings", icon: Settings },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={closeAll}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
