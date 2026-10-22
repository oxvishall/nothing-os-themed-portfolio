'use client';

// Opens the shortcuts & secrets panel (the only way in on touch devices)
export default function HelpButton() {
  return (
    <button
      type="button"
      className="footer-link"
      onClick={() => window.dispatchEvent(new Event('portfolio:help'))}
    >
      Shortcuts & secrets
    </button>
  );
}
