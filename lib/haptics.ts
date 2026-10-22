/**
 * Light haptic feedback for touch devices.
 * - Android / Chrome: Vibration API
 * - iOS Safari (18+): has no Vibration API, but toggling a native
 *   <input type="checkbox" switch> plays the system haptic, so we click a
 *   hidden one. Must run inside a user gesture (tap, slider input…).
 * Desktop: no-op.
 */

type HapticKind = 'tick' | 'tap';

const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

let last = 0;

export function haptic(kind: HapticKind = 'tap') {
  if (!isTouch()) return;
  // Don't buzz more often than the finger can feel
  const now = performance.now();
  if (now - last < 30) return;
  last = now;

  try {
    if (typeof navigator.vibrate === 'function' && !isIOS()) {
      navigator.vibrate(kind === 'tick' ? 4 : 10);
      return;
    }
    if (isIOS()) {
      const label = document.createElement('label');
      label.ariaHidden = 'true';
      label.style.display = 'none';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      label.appendChild(input);
      document.head.appendChild(label);
      label.click();
      label.remove();
    }
  } catch {
    // Haptics are a nicety; never break the interaction
  }
}
