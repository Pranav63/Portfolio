'use client';
import { motion } from 'framer-motion';

// Waypoint marker. The id, time and phase mirror the 3d scene's
// time-of-day at that scroll position, so structure encodes real state.
export default function Waypoint({ id, time, phase, inView = true, delay = 0 }) {
  return (
    <motion.div
      className="waypoint"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="wp-id">WP-{id}</span>
      <span className="wp-rule" />
      <span className="wp-time">{time}</span>
      <span className="wp-phase">{phase}</span>
    </motion.div>
  );
}