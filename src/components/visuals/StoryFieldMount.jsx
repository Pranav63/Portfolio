'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// three.js + the postprocessing chain are ~200kB of the bundle and nothing above
// the fold needs them, so the field is client-only and never blocks first paint.
const StoryField = dynamic(() => import('./StoryField'), { ssr: false });

// A 3,200-point buffer with a bloom pass is not a reasonable thing to hand a
// mid-range phone. Reduced motion was already honoured; this also covers devices
// that simply cannot spend the frame budget, and they skip the download entirely.
function canRenderField() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores <= 4) return false;

  const memory = navigator.deviceMemory;
  if (typeof memory === 'number' && memory <= 4) return false;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse && window.innerWidth < 900) return false;

  return true;
}

export default function StoryFieldMount() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(canRenderField() ? 'field' : 'fallback');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // The scrim that keeps copy legible is tied to this class, and the static
  // fallback needs it just as much as the canvas does.
  useEffect(() => {
    if (mode === null) return undefined;
    document.documentElement.classList.add('field-active');
    return () => document.documentElement.classList.remove('field-active');
  }, [mode]);

  if (mode === null) return null;
  if (mode === 'fallback') {
    return (
      <div className="story-field story-field-fallback" aria-hidden="true">
        <span /><span /><span />
      </div>
    );
  }
  return <StoryField />;
}
