'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

// Earlier projects as an index. On a mouse, the hovered project's screenshot
// follows the pointer so the list stays compact without hiding the work.
export default function MoreWork({ items }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const move = event => {
    const box = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - box.left);
    y.set(event.clientY - box.top);
  };
  const shown = items.find(item => item.id === active);

  return (
    <div className="more-work" onPointerMove={move} onPointerLeave={() => setActive(null)}>
      <h3 className="more-work-title">Earlier work</h3>
      <ol>
        {items.map(item => (
          <li key={item.id} onPointerEnter={event => event.pointerType === 'mouse' && setActive(item.id)}>
            <a href={'/work/' + item.id} onFocus={() => setActive(null)}>
              <Image className="more-work-thumb" src={item.proofs[0].src} alt="" width={item.proofs[0].width} height={item.proofs[0].height} sizes="96px" />
              <span className="more-work-name">{item.title}</span>
              <span className="more-work-cat">{item.detail.category}</span>
              <span className="more-work-result">{item.detail.preview}</span>
              <span className="more-work-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ol>
      {!reduce && (
        <AnimatePresence>
          {shown && (
            <motion.div
              key="preview"
              className="more-work-preview"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div key={shown.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}>
                  <Image src={shown.proofs[0].src} alt="" width={shown.proofs[0].width} height={shown.proofs[0].height} sizes="360px" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
