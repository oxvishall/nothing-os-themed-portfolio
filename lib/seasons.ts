/**
 * Seasonal themes: decorations layered on top of whatever interface style is
 * active. Several can run at once.
 *
 * To turn a season on or off, edit ACTIVE_SEASONS below; that's the only switch.
 * For a quick preview without editing, add ?season=halloween,christmas to the URL
 * (or ?season=none to turn everything off).
 *
 * Adding a season: add its id to SeasonId and SEASONS, build
 * app/components/seasons/<Name>.tsx, register it in SeasonalThemes.tsx, and put
 * any CSS under html[data-season~="<id>"] in app/seasons.css.
 */

export type SeasonId = 'halloween' | 'christmas' | 'diwali' | 'newyear' | 'pongal';

export const SEASONS: Record<SeasonId, { label: string }> = {
  halloween: { label: 'Halloween' },
  christmas: { label: 'Christmas' },
  diwali: { label: 'Diwali' },
  newyear: { label: 'New Year' },
  pongal: { label: 'Pongal' },
};

/** The switch. Seasons listed here are live for every visitor. */
export const ACTIVE_SEASONS: SeasonId[] = ['halloween'];

const isSeasonId = (v: string): v is SeasonId => v in SEASONS;

/** Active seasons, with the ?season= URL preview applied (client only). */
export function resolveSeasons(search?: string): SeasonId[] {
  const param = search ? new URLSearchParams(search).get('season') : null;
  if (param === null) return ACTIVE_SEASONS;
  if (param === 'none' || param === '') return [];
  return param.split(',').map(s => s.trim()).filter(isSeasonId);
}
