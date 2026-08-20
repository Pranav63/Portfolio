'use client';

import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  if (!enabled) return children;

  return (
    <ReactLenis root options={{ lerp: 0.11, duration: 1.1, wheelMultiplier: 1 }}>
      {children}
    </ReactLenis>
  );
}
