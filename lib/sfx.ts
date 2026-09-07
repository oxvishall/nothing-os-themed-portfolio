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

// Cache for pre-rendered physical switch click buffers
const clickBuffers: { [key: number]: AudioBuffer } = {};

function createSwitchClickBuffer(ac: AudioContext, variant: number): AudioBuffer {
  const sampleRate = ac.sampleRate;
  const duration = 0.014; // 14ms acoustic impulse
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = ac.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  // 4 distinct physical switch profiles (Optical, Kailh, Omron, Soft Tactile)
  const profiles = [
    { resFreq: 3400, resDecay: 750, thudFreq: 260, thudDecay: 450, noiseMix: 0.68 },
    { resFreq: 4200, resDecay: 900, thudFreq: 310, thudDecay: 550, noiseMix: 0.76 },
    { resFreq: 2800, resDecay: 650, thudFreq: 220, thudDecay: 400, noiseMix: 0.58 },
    { resFreq: 3800, resDecay: 820, thudFreq: 280, thudDecay: 500, noiseMix: 0.72 },
  ];
  const p = profiles[variant % profiles.length];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. High-frequency microswitch snap transient
    const snapEnvelope = Math.exp(-t * p.resDecay);
    const snapOsc = Math.sin(2 * Math.PI * p.resFreq * t);
    const snapNoise = Math.random() * 2 - 1;
    const snap = (snapOsc * 0.45 + snapNoise * 0.55) * snapEnvelope * p.noiseMix;

    // 2. Low-frequency switch body thud
    const thudEnvelope = Math.exp(-t * p.thudDecay);
    const thud = Math.sin(2 * Math.PI * p.thudFreq * (1 - t * 12) * t) * thudEnvelope * (1 - p.noiseMix);

    // 3. Switch release micro-rebound tick (~4ms)
    let rebound = 0;
    if (t > 0.0035) {
      const rebT = t - 0.0035;
      rebound = (Math.random() * 2 - 1) * Math.exp(-rebT * 1100) * 0.3;
    }

    // Combine and soft clip for clean tactile punch
    const raw = (snap + thud + rebound) * 2.2;
    data[i] = Math.tanh(raw);
  }

  return buffer;
}

// ─── Authentic Physical Mouse Switch Click with Variations ────────────────
export function sfxClick(variant?: number) {
  const ac = getCtx();
  if (!ac) return;

  try {
    const out = masterOut(ac);
    const t = ac.currentTime;

    const v = variant !== undefined ? variant : Math.floor(Math.random() * 4);
    if (!clickBuffers[v] || clickBuffers[v].sampleRate !== ac.sampleRate) {
      clickBuffers[v] = createSwitchClickBuffer(ac, v);
    }

    const src = ac.createBufferSource();
    src.buffer = clickBuffers[v];

    // Subtle pitch jitter between 0.94 and 1.06 (±6%) for organic click variation
    src.playbackRate.setValueAtTime(0.94 + Math.random() * 0.12, t);

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.4, t);

    src.connect(gain);
    gain.connect(out);
    src.start(t);
  } catch (err) {
    // Audio safe fallback
  }
}

// ─── Mobile Sidepanel Open Sound ──────────────────────────────────────────
export function sfxPanelOpen() {
  sfxClick(1);
}

// ─── Tab Switch (Tactile navigation click) ──────────────────────────────────
export function sfxTabSwitch() {
  sfxClick(0);
}

// ─── Theme Toggle (Solid tactile switch click) ────────────────────────────
export function sfxThemeToggle() {
  sfxClick(2);
}

// ─── Read More / Show More (Subtle tactile click) ─────────────────────────
export function sfxExpand() {
  sfxClick(3);
}

// ─── Scroll to Top (Crisp tactile launch click) ───────────────────────────
export function sfxScrollTop() {
  sfxClick(1);
}
