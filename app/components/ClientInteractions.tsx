'use client';

import { useEffect, useState } from 'react';

export default function ClientInteractions() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash Screen Timeout
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

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
