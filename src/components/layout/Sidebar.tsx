import { Link, useRouterState } from "@tanstack/react-router";
import { ScanLine, X } from "lucide-react";

import { mainNav, managementNav, settingsNav, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", active && "text-sidebar-primary")} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-[var(--shadow-card)]">
            <ScanLine className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-sidebar-foreground">
              LifeLens AI
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Turn information into action.
            </span>
          </span>
        </Link>
        {onNavigate ? (
          <button
            onClick={onNavigate}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>

        <SectionLabel>Management</SectionLabel>
        <div className="space-y-1">
          {managementNav.map((item) => (
            <NavLink key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        {settingsNav.map((item) => (
          <NavLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}

        <div className="mt-2 flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground">
            SK
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold">Shailaja K.</span>
            <span className="block truncate text-xs text-muted-foreground">Free plan</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sidebar-border lg:block">
      <SidebarContent />
    </aside>
  );
}
