'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applyTheme, getTheme } from '@/lib/theme';
import {
  trackEasterEgg, trackHelpOpen, trackShortcut, trackSoundToggle, trackThemeToggle,
  type EasterEgg,
} from '@/lib/analytics';
import { isSfxEnabled, setSfxEnabled, sfxClick, sfxThemeToggle } from '@/lib/sfx';

const SHORTCUTS: [string, string][] = [
  ['1 – 5', 'Switch tabs'],
  ['D', 'Toggle dark mode'],
  ['S', 'Toggle sounds'],
  ['U', 'Back to top'],
  ['?', 'Show this panel'],
  ['Esc', 'Close'],
];

// Revealed in the help panel, each with a Try button
const SECRETS = [
  { id: 'glyph', name: 'Glyph mode', how: ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'], hint: 'Konami code: the whole page in the dot font' },
  { id: 'nothing', name: 'Say nothing', how: ['N', 'O', 'T', 'H', 'I', 'N', 'G'], hint: 'Type it anywhere for a dot wave' },
  { id: 'footer', name: 'Triple tap', how: ['×3'], hint: 'Tap the NOTHING × X footer logo three times' },
] as const;

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const SECRET_WORD = 'nothing';

// Full-screen ripple of dots spreading out from a point, drawn on a throwaway canvas
function dotWave(originX: number, originY: number) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'dot-wave';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#000';

  const STEP = 22, BAND = 70, DURATION = 1400;
  const maxDist = Math.hypot(Math.max(originX, W - originX), Math.max(originY, H - originY)) + BAND;
  const start = performance.now();

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    const ring = maxDist * (1 - (1 - t) ** 2);
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    for (let x = STEP / 2; x < W; x += STEP) {
      for (let y = STEP / 2; y < H; y += STEP) {
        const d = Math.abs(Math.hypot(x - originX, y - originY) - ring);
        if (d > BAND) continue;
        const r = 3.5 * (1 - d / BAND) * (1 - t * 0.6);
        if (r < 0.3) continue;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    if (t < 1) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

export default function KeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  // The easter eggs, shared by the secret triggers and the "Try" buttons
  type Source = 'secret' | 'try_button';
  const toggleGlyph = useCallback((source: Source) => {
    const on = document.documentElement.classList.toggle('glyph-mode');
    sfxThemeToggle();
    dotWave(window.innerWidth / 2, window.innerHeight / 2);
    notify(on ? 'Glyph mode on' : 'Glyph mode off');
    trackEasterEgg('glyph_mode', source, on ? 'on' : 'off');
  }, [notify]);
  const sayNothing = useCallback((egg: EasterEgg, source: Source, x = window.innerWidth / 2, y = window.innerHeight / 2) => {
    dotWave(x, y);
    notify('Say nothing.');
    trackEasterEgg(egg, source);
  }, [notify]);

  // Lets the key handler know whether "?" is opening or closing the panel
  const helpOpenRef = useRef(helpOpen);
  useEffect(() => { helpOpenRef.current = helpOpen; }, [helpOpen]);

  useEffect(() => {
    let konamiPos = 0;
    let typed = '';

    const onKey = (e: KeyboardEvent) => {
      // Never hijack typing or browser shortcuts
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;

      const key = e.key.toLowerCase();

      // Secret 1: Konami code toggles Glyph mode (whole page in the dot font)
      konamiPos = key === KONAMI[konamiPos] ? konamiPos + 1 : key === KONAMI[0] ? 1 : 0;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        toggleGlyph('secret');
        return;
      }

      // Secret 2: typing the word sends a dot wave across the screen
      if (key.length === 1 && /[a-z]/.test(key)) {
        typed = (typed + key).slice(-SECRET_WORD.length);
        if (typed === SECRET_WORD) {
          typed = '';
          sayNothing('say_nothing', 'secret');
          return;
        }
      }

      if (e.key === 'Escape') { setHelpOpen(false); return; }
      if (e.key === '?') {
        sfxClick();
        if (!helpOpenRef.current) trackHelpOpen('keyboard');
        setHelpOpen(o => !o);
        return;
      }

      if (/^[1-5]$/.test(e.key)) {
        window.dispatchEvent(new CustomEvent<number>('portfolio:tab', { detail: Number(e.key) - 1 }));
        trackShortcut('tab', e.key);
        return;
      }
      if (key === 'd') {
        const next = getTheme() === 'dark' ? 'light' : 'dark';
        sfxThemeToggle();
        applyTheme(next);
        notify(next === 'dark' ? 'Dark mode' : 'Light mode');
        trackThemeToggle(next);
        trackShortcut('theme', next);
        return;
      }
      if (key === 's') {
        const next = !isSfxEnabled();
        setSfxEnabled(next);
        if (next) sfxClick();
        notify(next ? 'Sounds on' : 'Sounds off');
        trackSoundToggle(next, 'keyboard');
        trackShortcut('sounds', next ? 'on' : 'off');
        return;
      }
      if (key === 'u') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        trackShortcut('top');
      }
    };

    const onHelp = (e: Event) => {
      sfxClick();
      setHelpOpen(true);
      trackHelpOpen((e as CustomEvent<'sidebar' | 'footer'>).detail ?? 'sidebar');
    };
    // Secret 3 (touch friendly): triple-tap the footer logo
    const onWave = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      sayNothing('footer_triple_tap', 'secret', x, y);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('portfolio:help', onHelp);
    // Other components can show a toast too
    const onToast = (e: Event) => notify((e as CustomEvent<string>).detail);

    window.addEventListener('portfolio:wave', onWave);
    window.addEventListener('portfolio:toast', onToast);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('portfolio:help', onHelp);
      window.removeEventListener('portfolio:wave', onWave);
      window.removeEventListener('portfolio:toast', onToast);
      clearTimeout(toastTimer.current);
    };
  }, [notify, toggleGlyph, sayNothing]);

  return (
    <>
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="shortcuts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Shortcuts and secrets"
              className="shortcuts-panel"
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <span className="sidebar-heading block">· Shortcuts ·</span>
              <ul className="shortcuts-list">
                {SHORTCUTS.map(([k, label]) => (
                  <li key={k}>
                    <span>{label}</span>
                    <kbd className="kbd">{k}</kbd>
                  </li>
                ))}
              </ul>
              <span className="sidebar-heading block mt-5">· Secrets ·</span>
              <ul className="secrets-list">
                {SECRETS.map(s => (
                  <li key={s.id}>
                    <div className="secret-text">
                      <span className="secret-name">{s.name}</span>
                      <span className="secret-hint">{s.hint}</span>
                      <span className="secret-keys">
                        {s.how.map((k, i) => <kbd key={i} className="kbd">{k}</kbd>)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="lab-btn"
                      onClick={() => {
                        setHelpOpen(false);
                        // Let the panel close first so the effect is visible
                        setTimeout(() => {
                          if (s.id === 'glyph') toggleGlyph('try_button');
                          else sayNothing(s.id === 'nothing' ? 'say_nothing' : 'footer_triple_tap', 'try_button');
                        }, 160);
                      }}
                    >
                      Try
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={{ duration: 0.15 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
