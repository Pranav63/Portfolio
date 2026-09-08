'use client';

import { MotionConfig } from 'framer-motion';

export default function SmoothScroll({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
