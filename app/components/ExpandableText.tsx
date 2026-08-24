'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const LINES = 4;

export default function ExpandableText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const lineCap = () => {
      const styles = getComputedStyle(el);
      const lh = parseFloat(styles.lineHeight);
      const fs = parseFloat(styles.fontSize);
      return (Number.isFinite(lh) ? lh : fs * 1.4) * LINES;
    };

    const apply = () => {
      if (expanded) {
        el.style.maxHeight = '';
        el.style.overflow = '';
        return;
      }

      const cap = lineCap();
      el.style.maxHeight = `${cap}px`;
      el.style.overflow = 'hidden';
      const overflows = el.scrollHeight > el.clientHeight + 1;
      setCanToggle(overflows);
      if (!overflows) {
        el.style.maxHeight = '';
        el.style.overflow = '';
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    const target = el.parentElement ?? el;
    ro.observe(target);
    return () => {
      ro.disconnect();
      el.style.maxHeight = '';
      el.style.overflow = '';
    };
  }, [children, expanded]);

  return (
    <div className={className}>
      <div ref={contentRef}>{children}</div>
      {canToggle && (
        <button
          type="button"
          className="expand-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
