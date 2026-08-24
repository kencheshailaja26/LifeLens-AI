import {
  LayoutDashboard,
  Inbox,
  ListChecks,
  CalendarClock,
  Sparkles,
  FileText,
  BellRing,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
};

export const mainNav: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: Inbox, badge: "3" },
  { label: "Actions", to: "/actions", icon: ListChecks },
  { label: "Timeline", to: "/timeline", icon: CalendarClock },
  { label: "AI Assistant", to: "/assistant", icon: Sparkles },
];

export const managementNav: NavItem[] = [
  { label: "Documents", to: "/documents", icon: FileText },
  { label: "Reminders", to: "/reminders", icon: BellRing },
];

export const settingsNav: NavItem[] = [{ label: "Settings", to: "/settings", icon: Settings }];
