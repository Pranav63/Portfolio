'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { EXPERIENCE } from '@/data/portfolio';
import Waypoint from './Waypoint';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ExperienceCard = ({ exp, index, inView }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate={inView ? 'visible' : 'hidden'}
    custom={index + 2}
    style={{ position: 'relative', paddingLeft: '34px', marginBottom: '44px' }}
  >
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ delay: (index + 2) * 0.1 + 0.2, type: 'spring', stiffness: 300 }}
      className="timeline-dot"
    />

    <motion.div
      className="panel"
      whileHover={{ borderColor: 'rgba(201,168,76,0.4)', x: 4 }}
      style={{ padding: '28px 32px' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '6px',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 560,
          fontSize: '1.35rem',
          color: 'var(--text)',
        }}>
          {exp.title}
        </h3>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          {exp.period}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
      }}>
        <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.88rem' }}>
          {exp.company}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          &middot; {exp.location}
        </span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
        {exp.achievements.map((a, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              gap: '10px',
              fontSize: '0.88rem',
              color: 'var(--text-dim)',
              lineHeight: 1.7,
              marginBottom: '8px',
            }}
          >
            <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px', fontSize: '0.7rem' }}>
              &#9657;
            </span>
            {a}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {exp.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section-waypoint" ref={ref}>
      <div className="section-scrim" />

      <div className="section-inner">
        <Waypoint id="04" time="17:50" phase="Dusk" inView={inView} />

        <motion.h2
          className="section-title"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
          style={{ marginBottom: '60px' }}
        >
          The route <em>so far</em>
        </motion.h2>

        <div style={{ position: 'relative', paddingLeft: '6px' }}>
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="timeline-line"
            style={{ transformOrigin: 'top' }}
          />

          {EXPERIENCE.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} inView={inView} />
          ))}
        </div>

        <motion.p
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          custom={EXPERIENCE.length + 3}
          style={{
            textAlign: 'center',
            marginTop: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
          }}
        >
          Singapore chapter complete. Abu Dhabi next.
        </motion.p>
      </div>
    </section>
  );
}