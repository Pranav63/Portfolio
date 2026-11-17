'use client';

import { motion, useReducedMotion } from 'motion/react';

// Content rises into place once as it enters the viewport, so each block of
// work arrives in reading order instead of the whole grid appearing at once.
export default function Reveal({ children, delay = 0, as = 'div', className }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
