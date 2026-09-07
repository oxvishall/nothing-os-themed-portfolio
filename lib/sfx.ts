/**
 * sfx.ts
 *
 * Synthesized sound effects using the Web Audio API.
 * No audio files required. All sounds are generated in real-time.
 * Styled to match the Nothing OS digital/dot-matrix aesthetic.
 */

const SFX_KEY = 'sfx_enabled';

/** Returns true when SFX is on (default: on). */
export function isSfxEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem(SFX_KEY);
  return val === null ? true : val === 'true';
}

/** Persist SFX preference. */
export function setSfxEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SFX_KEY, String(enabled));
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!isSfxEnabled()) return null;
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/**
 * Creates a short stereo compressor → destination chain.
 */
function masterOut(ac: AudioContext) {
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.knee.value = 10;
  comp.ratio.value = 6;
  comp.connect(ac.destination);
  return comp;
}

// ─── Click / Button Press ──────────────────────────────────────────────────
export function sfxClick() {
  const ac = getCtx();
  if (!ac) return;
  const out = masterOut(ac);
  const t = ac.currentTime;

  // Two short oscillator ticks — tight, digital, tactile
  [0, 0.04].forEach((offset, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 - i * 300, t + offset);
    osc.frequency.exponentialRampToValueAtTime(800 - i * 200, t + offset + 0.05);

    gain.gain.setValueAtTime(0.08, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.07);

    osc.connect(gain);
    gain.connect(out);

    osc.start(t + offset);
    osc.stop(t + offset + 0.1);
  });
}

// ─── Tab Switch ────────────────────────────────────────────────────────────
export function sfxTabSwitch() {
  const ac = getCtx();
  if (!ac) return;
  const out = masterOut(ac);
  const t = ac.currentTime;

  // Ascending two-tone sweep — navigation feel
  const freqs = [440, 660];
  freqs.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t + i * 0.06);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.15, t + i * 0.06 + 0.08);

    gain.gain.setValueAtTime(0.0, t + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.07, t + i * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.1);

    osc.connect(gain);
    gain.connect(out);
    osc.start(t + i * 0.06);
    osc.stop(t + i * 0.06 + 0.15);
  });
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────
export function sfxThemeToggle() {
  const ac = getCtx();
  if (!ac) return;
  const out = masterOut(ac);
  const t = ac.currentTime;

  // Whoosh-like sweep: high → low for dark, low → high for light
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(2400, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.18);

  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

  // Add a subtle noise texture
  const bufferSize = ac.sampleRate * 0.15;
  const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ac.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseGain = ac.createGain();
  noiseGain.gain.setValueAtTime(0.015, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  noise.connect(noiseGain);
  noiseGain.connect(out);
  noise.start(t);

  osc.connect(gain);
  gain.connect(out);
  osc.start(t);
  osc.stop(t + 0.25);
}

// ─── Read More / Show More ─────────────────────────────────────────────────
export function sfxExpand() {
  const ac = getCtx();
  if (!ac) return;
  const out = masterOut(ac);
  const t = ac.currentTime;

  // Gentle upward chime — reveals content
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523, t);        // C5
  osc.frequency.setValueAtTime(659, t + 0.07); // E5
  osc.frequency.setValueAtTime(784, t + 0.14); // G5

  gain.gain.setValueAtTime(0.0, t);
  gain.gain.linearRampToValueAtTime(0.06, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

  osc.connect(gain);
  gain.connect(out);
  osc.start(t);
  osc.stop(t + 0.32);
}

// ─── Scroll to Top ────────────────────────────────────────────────────────
export function sfxScrollTop() {
  const ac = getCtx();
  if (!ac) return;
  const out = masterOut(ac);
  const t = ac.currentTime;

  // Rising blip — satisfying launch
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);

  gain.gain.setValueAtTime(0.07, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

  osc.connect(gain);
  gain.connect(out);
  osc.start(t);
  osc.stop(t + 0.2);
}
