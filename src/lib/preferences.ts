/**
 * Local preference storage for LifeLens.
 * Uses the browser's localStorage so choices survive a refresh. LifeLens
 * document/action data itself stays in the existing sessionStorage store.
 */

export type ThemePreference = "light" | "dark";

export type Preferences = {
  notifications: boolean;
  reminders: boolean;
  theme: ThemePreference;
};

const KEY = "lifelens.preferences";

export const defaultPreferences: Preferences = {
  notifications: true,
  reminders: true,
  theme: "light",
};

export function loadPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      notifications: parsed.notifications ?? defaultPreferences.notifications,
      reminders: parsed.reminders ?? defaultPreferences.reminders,
      theme: parsed.theme === "dark" ? "dark" : "light",
    };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(prefs: Preferences) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
  applyTheme(prefs.theme);
}

export function applyTheme(theme: ThemePreference) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Remove every LifeLens item from the existing session store. */
export function clearLifeLensData() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key && key.startsWith("lifelens.")) keys.push(key);
  }
  for (const key of keys) window.sessionStorage.removeItem(key);
}
