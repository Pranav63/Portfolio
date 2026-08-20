'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import ProductionField from '@/components/visuals/ProductionField';

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const section = useRef(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 72]);
  const fieldY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 130]);
  const fieldOpacity = useTransform(scrollYProgress, [0, .75], reducedMotion ? [1, 1] : [1, .15]);

  return (
    <section id="hero" className="hero" ref={section}>
      <motion.div className="hero-visual" style={{ y: fieldY, opacity: fieldOpacity }}>
        <ProductionField />
      </motion.div>

      <motion.div className="hero-content" style={{ y: copyY }}>
        <motion.p className="hero-role" initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: .7, delay: .1, ease }}>
          <span /> Applied AI Scientist at Inception · Abu Dhabi
        </motion.p>

        <h1 className="hero-heading">
          <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .9, delay: .14, ease }}>Applied AI, held</motion.span>
          <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .9, delay: .22, ease }}>to a production</motion.span>
          <motion.em initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: .9, delay: .3, ease }}>standard.</motion.em>
        </h1>

        <motion.div className="hero-intro" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: .75, delay: .4, ease }}>
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
              Explore selected work <span>↓</span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-foot">
        <span>Singapore → Abu Dhabi</span>
        <span>Models · evaluation · production</span>
      </div>
    </section>
  );
}
