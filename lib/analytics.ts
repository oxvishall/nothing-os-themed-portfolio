/**
 * analytics.ts
 *
 * Typed wrappers around Firebase Analytics logEvent.
 * All functions are safe to call in SSR — they no-op on the server.
 */

import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase';

// ─── Helper ────────────────────────────────────────────────────────────────

async function track(event: string, params?: Record<string, unknown>) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) return;
  logEvent(analytics, event, params as Record<string, string>);
}

// ─── Page / Session ────────────────────────────────────────────────────────

/** Called once when the portfolio first loads (after splash). */
export function trackPageView(page: string = 'home') {
  track('page_view', { page_title: page, page_location: window.location.href });
}

/** Called when the splash screen finishes animating. */
export function trackSplashDismissed() {
  track('splash_dismissed');
}

// ─── Navigation ────────────────────────────────────────────────────────────

/** Called when the user switches between profile tabs. */
export function trackTabSwitch(tab: string) {
  track('tab_switch', { tab_name: tab });
}

/** Called when the user toggles between list and grid layout. */
export function trackLayoutToggle(layout: 'list' | 'grid') {
  track('layout_toggle', { layout });
}

// ─── Projects ──────────────────────────────────────────────────────────────

/** Called when a project card is clicked / expanded. */
export function trackProjectClick(projectId: string, projectTitle: string) {
  track('project_click', { project_id: projectId, project_title: projectTitle });
}

/** Called when a project's external link (live / GitHub) is opened. */
export function trackProjectLinkClick(projectTitle: string, type: 'live' | 'github' | 'other') {
  track('project_link_click', { project_title: projectTitle, link_type: type });
}

// ─── Experience ────────────────────────────────────────────────────────────

/** Called when an experience card is expanded. */
export function trackExperienceExpand(company: string) {
  track('experience_expand', { company });
}

// ─── Sidebar / Social ──────────────────────────────────────────────────────

/** Called when any social / external link in the sidebar is clicked. */
export function trackSocialLinkClick(label: string, url: string) {
  track('social_link_click', { link_label: label, link_url: url });
}

/** Called when the theme is toggled. */
export function trackThemeToggle(theme: 'light' | 'dark') {
  track('theme_toggle', { theme });
}

/** Called when the GitHub star button is clicked from the bio section. */
export function trackStarClick() {
  track('github_star_click');
}

// ─── Avatar / Media ────────────────────────────────────────────────────────

/** Called when the avatar lightbox is opened. */
export function trackAvatarView() {
  track('avatar_view');
}

// ─── About / Tools ─────────────────────────────────────────────────────────

/** Called when a tool/skill badge is interacted with. */
export function trackToolClick(tool: string) {
  track('tool_click', { tool_name: tool });
}

// ─── Shortcuts & Easter Eggs ───────────────────────────────────────────────

export type EasterEgg = 'glyph_mode' | 'say_nothing' | 'footer_triple_tap';

/**
 * Called when an easter egg fires.
 * `source`: found it ('secret') or used the Try button in the help panel ('try_button').
 */
export function trackEasterEgg(egg: EasterEgg, source: 'secret' | 'try_button', state?: 'on' | 'off') {
  track('easter_egg', { egg, source, ...(state ? { state } : {}) });
}

/** Called when the shortcuts & secrets panel opens. */
export function trackHelpOpen(source: 'keyboard' | 'sidebar' | 'footer') {
  track('help_panel_open', { source });
}

/** Called when a keyboard shortcut is used. */
export function trackShortcut(action: 'tab' | 'theme' | 'sounds' | 'top', detail?: string) {
  track('keyboard_shortcut', { action, ...(detail ? { detail } : {}) });
}

// ─── Seasonal themes ───────────────────────────────────────────────────────

/** Called when a visitor interacts with a seasonal theme (e.g. finds the Halloween ghost). */
export function trackSeasonal(season: string, action: string, params?: Record<string, string | number>) {
  track('seasonal_interaction', { season, action, ...params });
}

// ─── Interface ─────────────────────────────────────────────────────────────

/** Called when the interface style (Nothing, Keycap…) changes. */
export function trackUiStyle(style: string) {
  track('ui_style_change', { style });
}

/** Called when sounds are turned on or off. */
export function trackSoundToggle(enabled: boolean, source: 'sidebar' | 'keyboard') {
  track('sound_toggle', { enabled, source });
}

// ─── Lab: Dot Matrix Generator ─────────────────────────────────────────────

/** Called when an image is loaded into the generator. Only metadata, never the image. */
export function trackGeneratorUpload(method: 'click' | 'drop' | 'paste', fileType: string, sizeKb: number) {
  track('lab_generator_upload', { method, file_type: fileType, size_kb: sizeKb });
}

/** Called when a generator setting changes (sliders are debounced by the caller). */
export function trackGeneratorOption(option: string, value: string | number | boolean) {
  track('lab_generator_option', { option, value: String(value) });
}

/** Called when the original is revealed with press-and-hold. */
export function trackGeneratorCompare() {
  track('lab_generator_compare');
}

/** Called when the dot-matrix PNG is downloaded, with the settings used. */
export function trackGeneratorDownload(settings: { cols: number; contrast: number; shape: string; dark: boolean; invert: boolean }) {
  track('lab_generator_download', {
    density: settings.cols,
    contrast: settings.contrast,
    shape: settings.shape,
    dark_bg: settings.dark,
    invert: settings.invert,
  });
}

// ─── Lab: Dot Playground ───────────────────────────────────────────────────

export type PlaygroundAction =
  | 'draw' | 'stamp' | 'preset' | 'life_start' | 'life_stop' | 'random' | 'invert' | 'clear' | 'download';

/** Called on playground actions. `draw` is sent once per visit, on the first stroke. */
export function trackPlayground(action: PlaygroundAction, params?: Record<string, string | number>) {
  track('lab_playground', { action, ...params });
}
