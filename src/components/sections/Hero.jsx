'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  const rise = (delay) => (reducedMotion
    ? { initial: false }
    : {
      initial: { opacity: 0, y: 26 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: .9, delay, ease },
    });

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <motion.p className="hero-role" {...rise(.05)}>
          <span /> Applied AI Scientist at Inception · Abu Dhabi
        </motion.p>

        <h1 className="hero-heading">
          <motion.span {...rise(.14)}>Applied AI, held</motion.span>
          <motion.span {...rise(.22)}>to a production</motion.span>
          <motion.em {...rise(.3)}>standard.</motion.em>
        </h1>

        <motion.div className="hero-intro" {...rise(.42)}>
          <p>I&apos;m Pranav Arora. I develop, evaluate and deploy AI systems, connecting scientific experiments to the engineering required for reliable use.</p>
          <div>
            <a
              className="primary-link"
              href="#projects"
              onClick={(event) => {
                if (!lenis) return;
                event.preventDefault();
                lenis.scrollTo('#projects');
              }}
            >
              Selected work <span>↓</span>
            </a>
            <a className="quiet-link" href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
          </div>
        </motion.div>
      </div>

      <motion.aside className="hero-system-map" aria-label="The production AI lifecycle represented by the visual" {...rise(.54)}>
        <p><span /> Live system atlas</p>
        <ol>
          <li><span>01</span><strong>Research</strong></li>
          <li><span>02</span><strong>Evaluate</strong></li>
          <li><span>03</span><strong>Deploy</strong></li>
          <li><span>04</span><strong>Observe</strong></li>
        </ol>
        <small>The same system changes state as you move through the work.</small>
      </motion.aside>

      <div className="hero-foot">
        <span>Singapore → Abu Dhabi</span>
        <span>Models · evaluation · production</span>
      </div>
    </section>
  );
}
