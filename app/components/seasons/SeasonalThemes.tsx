'use client';

import { useEffect, useSyncExternalStore, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { resolveSeasons, type SeasonId } from '@/lib/seasons';

// Each season's layer is its own chunk, so inactive seasons never load
const LAYERS: Partial<Record<SeasonId, ComponentType>> = {
  halloween: dynamic(() => import('./Halloween'), { ssr: false }),
};

// Read once on the client; the server renders no seasons
const subscribe = () => () => {};
const getSeasons = () => resolveSeasons(window.location.search).join(' ');
const getServerSeasons = () => '';

/**
 * Mounts every active seasonal theme on top of the page and marks
 * <html data-season="…"> so CSS can target them (app/seasons.css).
 */
export default function SeasonalThemes() {
  const seasons = useSyncExternalStore(subscribe, getSeasons, getServerSeasons);

  useEffect(() => {
    const root = document.documentElement;
    if (seasons) root.dataset.season = seasons;
    else delete root.dataset.season;
  }, [seasons]);

  if (!seasons) return null;
  return (
    <>
      {(seasons.split(' ') as SeasonId[]).map(id => {
        const Layer = LAYERS[id];
        return Layer ? <Layer key={id} /> : null;
      })}
    </>
  );
}
