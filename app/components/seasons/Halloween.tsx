'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { sfxBoo, sfxClick } from '@/lib/sfx';
import { trackSeasonal } from '@/lib/analytics';

/**
 * Halloween layer (lib/seasons.ts). Sits on top of any interface style:
 * - a spider hangs from the top on a silk thread, lowers as you scroll,
 *   can be pulled down (springs back) and scurries up when tapped
 * - a pair of eyes watches from the empty margin (or the banner on small
 *   screens) and follows the pointer; clicking them lets a ghost out
 * - now and then the banner's "lights" flicker
 */
export default function Halloween() {
  return (
    <>
      <Spider />
      <WatchingEyes />
      <BannerFlicker />
    </>
  );
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Spider ──────────────────────────────────────────────────────────────── */

const REST = 56;        // thread length at the top of the page (px)
const MAX_DROP = 240;   // how much further it lowers while you scroll

function Spider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const len = useMotionValue(REST);   // thread length from scrolling
  const pull = useMotionValue(0);     // extra stretch while dragged
  const thread = useTransform(() => Math.max(0, len.get() + pull.get()));
  const hidden = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // Hang just inside the right edge of the content column
    const place = () => {
      const main = document.querySelector('.main-content');
      const right = main ? main.getBoundingClientRect().right : window.innerWidth;
      wrap.style.left = `${Math.round(right - 64)}px`;
      wrap.style.opacity = '1';
    };
    const onScroll = () => {
      if (hidden.current) return;
      len.set(REST + Math.min(window.scrollY * 0.12, MAX_DROP));
    };
    place();
    onScroll();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', onScroll);
    };
  }, [len]);

  // Tap: it scurries up out of sight, then lowers itself back down
  const retreat = () => {
    if (hidden.current) return;
    hidden.current = true;
    sfxClick(1);
    trackSeasonal('halloween', 'spider_tap');
    animate(len, -40, { duration: 0.45, ease: [0.4, 0, 1, 1] });
    setTimeout(() => {
      hidden.current = false;
      animate(len, REST + Math.min(window.scrollY * 0.12, MAX_DROP), { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    }, 5000);
  };

  return (
    <div
      ref={wrapRef}
      className="hw-spider-wrap"
      aria-hidden
      style={{ position: 'fixed', top: 0, left: -100, width: 40, zIndex: 45, pointerEvents: 'none', opacity: 0 }}
    >
      <div className="hw-sway">
        <motion.div className="hw-thread" style={{ height: thread }} />
        <motion.div
          className="hw-spider"
          style={{ y: pull, top: thread, position: 'absolute', left: 4, pointerEvents: 'auto', touchAction: 'none' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.75}
          dragTransition={{ bounceStiffness: 420, bounceDamping: 9 }}
          onDragEnd={(_, info) => { if (info.offset.y > 40) trackSeasonal('halloween', 'spider_pull'); }}
          onTap={retreat}
          whileTap={{ scale: 0.9 }}
          data-cursor="grab"
        >
          <SpiderSvg />
        </motion.div>
      </div>
    </div>
  );
}

function SpiderSvg() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {/* legs, four a side */}
      <path d="M12 12 L5 6 L1 9" /><path d="M12 14 L4 12 L0 15" /><path d="M12 16 L4 18 L1 23" /><path d="M13 18 L7 23 L5 27" />
      <path d="M20 12 L27 6 L31 9" /><path d="M20 14 L28 12 L32 15" /><path d="M20 16 L28 18 L31 23" /><path d="M19 18 L25 23 L27 27" />
      {/* body and head */}
      <ellipse cx="16" cy="17" rx="5.5" ry="6.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9.5" r="3.6" fill="currentColor" stroke="none" />
      {/* eyes */}
      <circle cx="14.7" cy="9.2" r="0.9" fill="var(--bg-page)" stroke="none" />
      <circle cx="17.3" cy="9.2" r="0.9" fill="var(--bg-page)" stroke="none" />
    </svg>
  );
}

/* ─── Watching eyes + ghost ───────────────────────────────────────────────── */

type Spot = { inCover: boolean; x: number; y: number };
type Ghost = { id: number; x: number; y: number };

const BOO_LINES = ['Boo.', 'Still here.', 'It follows you.', 'Nothing is watching.', 'You found it again.'];

function WatchingEyes() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const eyesRef = useRef<HTMLButtonElement>(null);

  // Pick a hiding place: the empty left margin if there is one, else the banner
  const place = useCallback(() => {
    const main = document.querySelector('.main-content');
    const margin = main ? main.getBoundingClientRect().left : 0;
    if (margin >= 120) {
      setSpot({
        inCover: false,
        x: 24 + Math.random() * (margin - 110),
        y: window.innerHeight * (0.3 + Math.random() * 0.45),
      });
    } else {
      setSpot({ inCover: true, x: 12 + Math.random() * 62, y: 14 + Math.random() * 34 });
    }
  }, []);

  // Appear a moment after load, so the eyes "open" while you look
  useEffect(() => {
    const t = setTimeout(place, 2200);
    return () => clearTimeout(t);
  }, [place]);

  // Pupils follow the pointer (no re-render)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const eyes = eyesRef.current;
      if (!eyes) return;
      eyes.querySelectorAll<HTMLElement>('.hw-pupil').forEach(p => {
        const r = (p.parentElement as HTMLElement).getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 120) * 3.2;
        p.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
    };
  }, [spot]);

  const boo = (e: React.MouseEvent) => {
    // Don't open the banner's image viewer underneath
    e.preventDefault();
    e.stopPropagation();
    const r = eyesRef.current?.getBoundingClientRect();
    if (!r) return;
    const id = Date.now();
    setGhosts(g => [...g, { id, x: r.left + r.width / 2, y: r.top + r.height / 2 }]);
    setTimeout(() => setGhosts(g => g.filter(x => x.id !== id)), 1800);
    setSpot(null);

    sfxBoo();
    const layout = document.querySelector('.layout');
    if (layout && !reduceMotion()) {
      layout.classList.add('hw-flicker');
      setTimeout(() => layout.classList.remove('hw-flicker'), 700);
    }

    let count = 1;
    try {
      count = Number(sessionStorage.getItem('hw_boo') || 0) + 1;
      sessionStorage.setItem('hw_boo', String(count));
    } catch {}
    window.dispatchEvent(new CustomEvent<string>('portfolio:toast', { detail: BOO_LINES[(count - 1) % BOO_LINES.length] }));
    trackSeasonal('halloween', 'ghost_found', { count });

    // The eyes come back somewhere else
    setTimeout(place, 9000);
  };

  const eyes = spot && (
    <button
      ref={eyesRef}
      type="button"
      className={`hw-eyes ${spot.inCover ? 'hw-eyes--cover' : ''}`}
      aria-label="Something is watching you"
      onClick={boo}
      onPointerDown={e => e.stopPropagation()}
      style={
        spot.inCover
          ? { position: 'absolute', left: `${spot.x}%`, top: `${spot.y}%`, zIndex: 5 }
          : { position: 'fixed', left: spot.x, top: spot.y, zIndex: 2 }
      }
    >
      <span className="hw-eye"><span className="hw-pupil" /></span>
      <span className="hw-eye"><span className="hw-pupil" /></span>
    </button>
  );

  const cover = typeof document !== 'undefined' ? document.querySelector('.cover') : null;

  return (
    <>
      {eyes && (spot?.inCover && cover ? createPortal(eyes, cover) : createPortal(eyes, document.body))}
      {ghosts.map(g => createPortal(<FlyingGhost key={g.id} x={g.x} y={g.y} />, document.body))}
    </>
  );
}

// 11×12 dot-matrix ghost
const GHOST = [
  '....XXX....',
  '..XXXXXXX..',
  '.XXXXXXXXX.',
  'XXXXXXXXXXX',
  'XX..XXX..XX',
  'XX..XXX..XX',
  'XXXXXXXXXXX',
  'XXXX...XXXX',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  'XXX.XXX.XXX',
  '.X...X...X.',
];

function FlyingGhost({ x, y }: { x: number; y: number }) {
  const still = reduceMotion();
  return (
    <motion.div
      className="hw-ghost"
      aria-hidden
      style={{ position: 'fixed', left: x - 33, top: y - 36, zIndex: 9998, pointerEvents: 'none' }}
      initial={{ opacity: 0, scale: 0.4, y: 0 }}
      animate={still
        ? { opacity: [0, 1, 0] }
        : { opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1.25, 1.5], y: [0, -60, -150, -240], x: [0, 14, -12, 10] }}
      transition={{ duration: 1.7, ease: 'easeOut', times: [0, 0.2, 0.6, 1] }}
    >
      <svg width="66" height="72" viewBox="0 0 66 72">
        {GHOST.flatMap((row, r) =>
          [...row].map((c, col) => (c === 'X' ? <circle key={`${r}-${col}`} cx={col * 6 + 3} cy={r * 6 + 3} r="2.4" /> : null)),
        )}
      </svg>
    </motion.div>
  );
}

/* ─── Banner flicker ──────────────────────────────────────────────────────── */

function BannerFlicker() {
  useEffect(() => {
    if (reduceMotion()) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        const cover = document.querySelector('.cover');
        cover?.classList.add('hw-flicker');
        setTimeout(() => cover?.classList.remove('hw-flicker'), 700);
        schedule();
      }, 18000 + Math.random() * 22000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);
  return null;
}
