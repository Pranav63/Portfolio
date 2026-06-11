'use client';
import { motion } from 'framer-motion';

// Waypoint marker. English section label with an Arabic counterpart,
// right-aligned. The time/phase props are gone with the sun cycle.
export default function Waypoint({ id, label, labelAr, inView = true, delay = 0 }) {
  return (
    <motion.div
      className="waypoint"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="wp-id">WP-{id}</span>
      <span className="wp-rule" />
      <span className="wp-phase">{label}</span>
      {labelAr && <span className="wp-ar" lang="ar" dir="rtl">{labelAr}</span>}
    </motion.div>
  );
}