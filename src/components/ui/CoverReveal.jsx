'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

// The cover tilts up from the page and settles flat as it scrolls into view,
// so the first screenshot reads as the product arriving rather than an image.
export default function CoverReveal({ proof, label, transitionName }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

  return (
    <div ref={ref} className="case-cover-stage">
      <motion.a
        className="case-cover work-frame"
        href={proof.src}
        target="_blank"
        rel="noreferrer"
        aria-label={'Open full-size image: ' + proof.alt}
        style={reduce ? { viewTransitionName: transitionName } : { rotateX, scale, opacity, viewTransitionName: transitionName }}
      >
        <span className="case-cover-bar">{label}<span>Open full size ↗</span></span>
        <Image src={proof.src} alt={proof.alt} width={proof.width} height={proof.height} sizes="(max-width: 860px) 94vw, 1100px" priority />
      </motion.a>
    </div>
  );
}
