'use client';

import { useEffect, useState } from 'react';

export default function ClientInteractions() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Lock scroll during splash
    if (showSplash) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    // Splash Screen Timeout
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showSplash]);

  return (
    <>
      <div id="splash" className={showSplash ? '' : 'splash--hidden'} aria-hidden="true">
        <div className="splash-dots">
          <div className="splash-dot" />
          <div className="splash-dot" />
          <div className="splash-dot" />
        </div>
        <div className="splash-text">BOOTING...</div>
      </div>
    </>
  );
}
