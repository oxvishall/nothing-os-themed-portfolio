'use client';

import { useEffect } from 'react';

type CursorState = 'default' | 'pointer' | 'text' | 'grab' | 'crosshair' | 'disabled' | 'label';

const DISABLED = ':disabled, [aria-disabled="true"], .cursor-not-allowed';
const TEXT_INPUT =
  'textarea, [contenteditable="true"], ' +
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="file"])';
const GRAB = 'input[type="range"], [data-cursor="grab"]';
const CROSSHAIR = '[data-cursor="crosshair"]';
const LABEL = '[data-cursor-label]';
const INTERACTIVE = 'a, button, [role="button"], label, summary, select, .clickable, .cursor-pointer';

// Most specific match wins, in this order
function stateFor(target: Element): { state: CursorState; label?: string } {
  if (target.closest(DISABLED)) return { state: 'disabled' };
  if (target.closest(TEXT_INPUT)) return { state: 'text' };
  if (target.closest(GRAB)) return { state: 'grab' };
  if (target.closest(CROSSHAIR)) return { state: 'crosshair' };
  const labelled = target.closest(LABEL);
  if (labelled) return { state: 'label', label: labelled.getAttribute('data-cursor-label') || '' };
  if (target.closest(INTERACTIVE)) return { state: 'pointer' };
  return { state: 'default' };
}

// Dot cursor that eases toward the pointer in a single rAF loop and changes
// shape for links, text, sliders, drawing surfaces, disabled controls and
// labelled actions. No React state, so moving the mouse never re-renders.
export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const labelEl = cursor?.querySelector<HTMLElement>('.cursor-label');
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduceMotion ? 1 : 0.35;

    let targetX = -100, targetY = -100;
    let x = targetX, y = targetY;
    let frame = 0;
    let down = false;
    let lastTarget: Element | null = null;

    const tick = () => {
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Stop the loop once settled; the next mousemove restarts it
      const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1;
      frame = moving ? requestAnimationFrame(tick) : 0;
      if (!moving) probe();
    };

    const apply = (target: Element | null) => {
      // Keep the grab state locked while dragging a slider off its track
      if (down && cursor.dataset.state === 'grab') return;
      if (!target?.closest) return;
      const { state, label } = stateFor(target);
      cursor.dataset.state = state;
      if (labelEl && label !== undefined) labelEl.textContent = label;
    };

    // Browsers don't send mouseover to disabled buttons, so also hit-test
    // under the pointer now and then to catch them
    let lastProbe = 0;
    function probe() {
      const under = document.elementFromPoint(targetX, targetY);
      if (under && under !== lastTarget) { lastTarget = under; apply(under); }
    }
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
      if (e.timeStamp - lastProbe > 100) { lastProbe = e.timeStamp; probe(); }
    };
    const onOver = (e: MouseEvent) => {
      lastTarget = e.target as Element | null;
      apply(lastTarget);
    };
    const onDown = () => {
      down = true;
      cursor.classList.add('is-down');
      // Labels can change on press (e.g. HOLD → ORIGINAL)
      requestAnimationFrame(() => apply(lastTarget));
    };
    const onUp = () => {
      down = false;
      cursor.classList.remove('is-down');
      apply(lastTarget);
    };
    // Elements can become disabled/enabled under a still pointer (e.g. after an upload)
    const onClick = () => requestAnimationFrame(() => apply(lastTarget));

    const onLeave = () => { cursor.style.opacity = '0'; };
    const onEnter = () => { cursor.style.opacity = ''; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('click', onClick);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return null;
}
