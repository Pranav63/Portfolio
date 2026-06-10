'use client';
import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="hero" className="section-waypoint">
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(9,12,24,0.62) 0%, rgba(9,12,24,0.28) 55%, transparent 78%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <motion.div
        variants={{ hidden: {}, visible: {} }}
        initial={reduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '920px',
          width: '100%',
          padding: '0 24px',
        }}
      >
        {/* journey coordinates, Singapore to Abu Dhabi */}
        <motion.div
          variants={fadeUp} custom={0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.16em',
            color: 'var(--gold-light)',
            background: 'rgba(9,12,24,0.7)',
            border: '1px solid var(--gold-dim)',
            borderRadius: '100px',
            padding: '8px 22px',
            marginBottom: '36px',
          }}
        >
          <span>1.35° N, 103.82° E</span>
          <span style={{ color: 'var(--gold)' }}>&#8594;</span>
          <span>24.45° N, 54.38° E</span>
        </motion.div>

        {/* name, serif display */}
        <motion.h1
          variants={fadeUp} custom={1}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--step-hero)',
            fontWeight: 540,
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            marginBottom: '30px',
          }}
        >
          Pranav{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #C9A84C 0%, #F0D99A 45%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Arora
          </em>
        </motion.h1>

        {/* one confident static line, no typewriter */}
        <motion.p
          variants={fadeUp} custom={2}
          style={{
            fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
            color: 'rgba(237,232,220,0.82)',
            lineHeight: 1.65,
            maxWidth: '640px',
            margin: '0 auto 18px',
            textShadow: '0 2px 20px rgba(9,12,24,0.8)',
          }}
        >
          ML engineer shipping production AI for six years.
          RL schedulers moving <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>$10M of wafer fab output</span>,
          multi-agent platforms serving <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>5,000+ people</span>.
        </motion.p>

        <motion.p
          variants={fadeUp} custom={3}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '52px',
          }}
        >
          Singapore, relocating to Abu Dhabi
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp} custom={4}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <a href="#projects" className="btn-solid">View My Work</a>
          <a href="/Pranav_Arora.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Resume
          </a>
        </motion.div>

        {/* scroll cue ties to the day-night journey */}
        <motion.div
          variants={fadeUp} custom={5}
          style={{
            position: 'absolute',
            bottom: '-110px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(232,213,163,0.9)',
            textShadow: '0 0 20px rgba(201,168,76,0.8)',
          }}>
            Scroll until nightfall
          </span>
          <div style={{
            width: '1px',
            height: '44px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.9), transparent)',
          }} />
        </motion.div>
      </motion.div>
    </section>
  );
}