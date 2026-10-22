/**
 * Interface styles: how buttons and chips are drawn.
 * Applied as <html data-ui="…"> (set before paint by the inline script in
 * layout.tsx) and broadcast with a `uistylechange` event.
 * To add a style (e.g. iOS): add it here, then scope its CSS under [data-ui="<id>"].
 */

export const UI_STYLES = [
  { id: 'nothing', label: 'NOTHING' },
  { id: 'keycap', label: 'KEYCAP' },
] as const;

export type UiStyle = (typeof UI_STYLES)[number]['id'];

export const DEFAULT_UI_STYLE: UiStyle = 'nothing';
const STORAGE_KEY = 'ui_style';

const isUiStyle = (v: unknown): v is UiStyle => UI_STYLES.some(s => s.id === v);

export function getUiStyle(): UiStyle {
  if (typeof document === 'undefined') return DEFAULT_UI_STYLE;
  const v = document.documentElement.dataset.ui;
  return isUiStyle(v) ? v : DEFAULT_UI_STYLE;
}

export function applyUiStyle(style: UiStyle) {
  document.documentElement.dataset.ui = style;
  try { localStorage.setItem(STORAGE_KEY, style); } catch {}
  window.dispatchEvent(new CustomEvent<UiStyle>('uistylechange', { detail: style }));
}
