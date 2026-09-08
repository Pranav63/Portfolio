'use client';

import { Component, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { NEURAL_NETWORK, randomSequence } from '@/data/network';

const StoryField = dynamic(() => import('./StoryField'), { ssr: false });
const random = randomSequence(91);
const stars = Array.from({ length: 180 }, () => [random() * 1440, random() * 1000, .4 + random() * 1.2]);

function StillConstellation() {
  const project = ([x, y, z]) => [1080 + (x + z * .24) * 112, 460 - (y - x * .18) * 112];
  return <svg className="field-fallback" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {stars.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#b8b5e3" opacity=".5" />)}
    <g className="still-brain">
      {NEURAL_NETWORK.edges.map(([a, b], i) => { const p = project(NEURAL_NETWORK.nodes[a]), q = project(NEURAL_NETWORK.nodes[b]); return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={i % 5 ? '#a995ec' : '#edbe91'} strokeWidth=".7" opacity=".3" />; })}
      {NEURAL_NETWORK.nodes.map((p, i) => { const [cx, cy] = project(p); return <g key={i}><circle cx={cx} cy={cy} r="7" fill="#b18dff" opacity=".09" /><circle cx={cx} cy={cy} r={i % 5 ? 1.3 : 2.3} fill={i % 5 ? '#b9c7ff' : '#ffe4bb'} /></g>; })}
    </g>
  </svg>;
}

class FieldBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function StoryFieldMount() {
  const pathname = usePathname();
  const progress = useRef(0);
  const ambient = useRef(pathname === '/' ? 0 : 1);
  const travel = useRef(0);
  const covered = useRef(false);
  const [context, setContext] = useState(pathname === '/' ? 'hero' : 'ambient');
  const [enabled, setEnabled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 760px)');
    let webgl;
    const preference = () => {
      setCompact(small.matches);
      if (motion.matches || navigator.hardwareConcurrency <= 2 || navigator.deviceMemory < 4) { setEnabled(false); return; }
      if (webgl === undefined) {
        try {
          const context = document.createElement('canvas').getContext('webgl2');
          webgl = Boolean(context);
          context?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { webgl = false; }
      }
      setEnabled(webgl);
    };
    const visibility = () => setVisible(!document.hidden && !covered.current);
    preference(); visibility();
    motion.addEventListener('change', preference); small.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      motion.removeEventListener('change', preference); small.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    const hero = pathname === '/' ? document.getElementById('hero') : null;
    const journey = pathname === '/' ? document.getElementById('journey') : null;
    const scroll = () => {
      const rect = journey?.getBoundingClientRect();
      covered.current = !!rect && rect.top <= 0 && rect.bottom >= window.innerHeight;
      setVisible(!document.hidden && !covered.current);
      const distance = window.scrollY / Math.max(1, window.innerHeight);
      const ratio = hero ? Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight) : 1;
      ambient.current = hero ? Math.min(1, Math.max(0, (ratio - .45) / .55)) : 1;
      progress.current = hero && ratio < 1 ? Math.min(.72, Math.max(0, (ratio - .025) / .86)) : .72 + Math.sin(distance * .5) * .025;
      travel.current = distance;
      setContext(hero && ratio < .75 ? 'hero' : 'ambient');
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    const resize = new ResizeObserver(scroll);
    resize.observe(document.getElementById('main') || document.body);
    return () => { window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); resize.disconnect(); };
  }, [pathname]);

  const live = enabled && ready && !failed;
  return (
    <div className="cinematic-field" data-context={context} data-mode={live ? 'webgl' : 'static'} aria-hidden="true">
      <StillConstellation />
      {enabled && !failed && <FieldBoundary onFailure={onFailure}><StoryField progress={progress} ambient={ambient} travel={travel} compact={compact} visible={visible} onReady={onReady} onContextLost={onFailure} /></FieldBoundary>}
      <div className="field-scrim" />
    </div>
  );
}
