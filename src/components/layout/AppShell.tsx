import { useState, type ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar, SidebarContent } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-glow">
      <Sidebar />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-sidebar-border shadow-[var(--shadow-lift)]">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}
