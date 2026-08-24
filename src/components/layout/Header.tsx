import { Bell, Menu, Search, Plus } from "lucide-react";

export function Header({
  onOpenMenu,
  greeting = "Monday, ready when you are",
}: {
  onOpenMenu: () => void;
  greeting?: string;
}) {
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

        <div className="relative min-w-0 flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search documents, actions, deadlines…"
            aria-label="Search"
            className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <p className="ml-2 hidden text-sm text-muted-foreground xl:block">{greeting}</p>

        <div className="ml-auto flex items-center gap-2">
          <button className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:flex">
            <Plus className="h-4 w-4" />
            Add information
          </button>
          <button
            aria-label="Notifications"
            className="relative rounded-xl border border-border p-2.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
            SK
          </span>
        </div>
      </div>
    </header>
  );
}
