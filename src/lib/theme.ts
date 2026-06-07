/**
 * Shared theme constants + helpers used by ThemeToggle.
 * The pre-paint <script is:inline> in Base.astro intentionally inlines its
 * own copy (it must be JS, not a module) — keep KEY in sync there.
 */
export const THEME_KEY = "theme";

export type ThemeMode = "system" | "light" | "dark";
export const THEME_ROTATION: ThemeMode[] = ["system", "light", "dark"];

export const safeGetTheme = (): ThemeMode => {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* private mode / disabled storage */
  }
  return "system";
};

export const safeSetTheme = (mode: ThemeMode) => {
  try {
    if (mode === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* swallow — runtime toggle still works for this session */
  }
};

export const applyTheme = (mode: ThemeMode) => {
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};
