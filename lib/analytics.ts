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
