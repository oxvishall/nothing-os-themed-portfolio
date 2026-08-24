'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

const TARGET_LINES = 4;

export default function ExpandableText({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const containerRect = el.getBoundingClientRect();
      const totalH = el.scrollHeight;

      // Use document TreeWalker + Range.getClientRects to get the EXACT browser-rendered line boxes
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      let currentNode: Node | null = walker.nextNode();
      
      let lineCount = 0;
      let lineCap = 0;

      while (currentNode) {
        if (currentNode.textContent && currentNode.textContent.trim().length > 0) {
          const range = document.createRange();
          range.selectNodeContents(currentNode);
          const rects = Array.from(range.getClientRects());

          for (const r of rects) {
            // Ignore zero-height or zero-width rects
            if (r.height > 2 && r.width > 2) {
              lineCount++;
              lineCap = r.bottom - containerRect.top;

              if (lineCount === TARGET_LINES) {
                break;
              }
            }
          }
        }
        if (lineCount >= TARGET_LINES) break;
        currentNode = walker.nextNode();
      }

      if (lineCount > TARGET_LINES && lineCap > 0) {
        // Add 4px gap so cutoff happens cleanly in the blank space between lines
        const finalHeight = Math.ceil(lineCap + 4);
        
        // Only toggle if content actually extends beyond 4 lines
        if (totalH > finalHeight + 8) {
          setCanToggle(true);
          setCollapsedHeight(finalHeight);
          return;
        }
      }

      setCanToggle(false);
      setCollapsedHeight(null);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div className={className}>
      <motion.div
        ref={contentRef}
        initial={false}
        animate={{
          height: expanded || !canToggle || collapsedHeight === null ? 'auto' : collapsedHeight,
        }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{ overflow: 'hidden' }}
      >
        {children}
      </motion.div>
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
