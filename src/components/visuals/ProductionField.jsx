'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

const STAGES = [
  { name: 'Observe', code: '01', detail: 'Real signals enter the system' },
  { name: 'Reason', code: '02', detail: 'Models propose a decision' },
  { name: 'Evaluate', code: '03', detail: 'Quality and risk gates run' },
  { name: 'Operate', code: '04', detail: 'Production feedback closes the loop' },
];

export default function ProductionField() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const x = useSpring(420, { stiffness: 120, damping: 24, mass: .35 });
  const y = useSpring(320, { stiffness: 120, damping: 24, mass: .35 });

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % STAGES.length), 2400);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const moveSpotlight = (event) => {
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds) return;
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
  };

  return (
    <div className="production-field" ref={root} onPointerMove={moveSpotlight}>
      <motion.div className="field-spotlight" style={{ x, y }} aria-hidden="true" />

      <svg className="field-map" viewBox="0 0 760 720" role="img" aria-label="A production AI trace moving from observation through reasoning and evaluation into operation">
        <defs>
          <pattern id="field-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth=".6" />
          </pattern>
          <linearGradient id="trace-gradient" x1="0" x2="1">
            <stop offset="0" stopColor="#69beb8" />
            <stop offset=".58" stopColor="#e2b55c" />
            <stop offset="1" stopColor="#8f79d2" />
          </linearGradient>
          <filter id="trace-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <path id="production-trace" d="M74 584 C168 584 176 472 278 472 S382 352 472 352 S558 222 678 222" />
        </defs>

        <rect className="field-grid" width="760" height="720" fill="url(#field-grid)" />
        <path className="field-contour field-contour-one" d="M30 638 C148 644 176 532 275 532 C395 532 392 410 490 410 C610 410 592 278 735 278" />
        <path className="field-contour field-contour-two" d="M18 686 C180 692 204 584 300 584 C432 584 438 462 532 462 C655 462 650 326 748 326" />
        <use href="#production-trace" className="field-trace-shadow" />
        <use href="#production-trace" className="field-trace" />

        <path className="field-feedback" d="M678 222 C720 156 638 92 544 116 C408 150 374 224 276 202 C168 178 112 246 74 330" />
        <path className="field-input" d="M42 514 H130" />
        <path className="field-input" d="M42 550 H112" />
        <path className="field-input" d="M42 620 H104" />

        {[{ x: 74, y: 584 }, { x: 278, y: 472 }, { x: 472, y: 352 }, { x: 678, y: 222 }].map((point, index) => (
          <g className={`field-node${active === index ? ' is-active' : ''}`} key={STAGES[index].name} transform={`translate(${point.x} ${point.y})`}>
            <circle className="field-node-halo" r="20" />
            <circle className="field-node-core" r="5" />
            <text x="0" y="-34" textAnchor="middle">{STAGES[index].code}</text>
          </g>
        ))}

        {!reducedMotion && (
          <>
            <circle className="field-packet field-packet-one" r="4" filter="url(#trace-glow)">
              <animateMotion dur="6.5s" repeatCount="indefinite"><mpath href="#production-trace" /></animateMotion>
            </circle>
            <circle className="field-packet field-packet-two" r="2.5">
              <animateMotion dur="6.5s" begin="-3.25s" repeatCount="indefinite"><mpath href="#production-trace" /></animateMotion>
            </circle>
          </>
        )}
      </svg>

      <div className="field-readout" aria-live="polite">
        <span><i /> Live production trace</span>
        <div className="field-readout-copy">
          <small>{STAGES[active].code} / 04</small>
          <strong>{STAGES[active].name}</strong>
          <p>{STAGES[active].detail}</p>
        </div>
        <div className="field-stage-list" aria-label="Inspect production stages">
          {STAGES.map((stage, index) => (
            <button type="button" className={active === index ? 'is-active' : ''} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)} key={stage.name}>
              <span>{stage.code}</span>{stage.name}
            </button>
          ))}
        </div>
      </div>

      <p className="field-legend">Signals move through quality and risk gates before release. Monitoring sends evidence back to the next iteration.</p>
    </div>
  );
}
