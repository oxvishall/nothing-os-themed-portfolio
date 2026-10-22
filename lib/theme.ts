/**
 * Theme helpers shared by the sidebar toggle and keyboard shortcuts.
 * Changes are broadcast with a `themechange` event so every control stays in sync.
 */

export type ThemeMode = 'light' | 'dark';

export function getTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  html.classList.toggle('dark', mode === 'dark');
  html.classList.toggle('light', mode === 'light');
  try { localStorage.setItem('theme', mode); } catch {}
  window.dispatchEvent(new CustomEvent<ThemeMode>('themechange', { detail: mode }));
}
