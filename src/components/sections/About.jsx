'use client';

import { motion } from 'framer-motion';

const FACTS = [
  ['6+', 'years in data and AI'],
  ['$10M', 'annual impact from RL scheduling'],
  ['5K+', 'enterprise users served'],
  ['85%', 'text-to-SQL accuracy'],
];

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="page-shell">
        <div className="about-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .6 }}>
            <h2>From optimising factories in Singapore to building applied AI in Abu Dhabi.</h2>
          </motion.div>
          <div className="about-story">
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .55, delay: .05 }}>I started in analytics at Dentsu, moved closer to real-world operations at Micron, and then built enterprise AI systems at Hewlett Packard Enterprise.</motion.p>
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .55, delay: .12 }}>Today I&apos;m an Applied AI Scientist at Inception, a G42 company. That path changed what I care about: not just whether a model works, but whether a team can trust it when the stakes are real.</motion.p>
            <motion.p className="about-note" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .55, delay: .19 }}>The move from Singapore to Abu Dhabi was also a personal reset, a chance to work on ambitious AI problems while carrying forward the production discipline I learned in manufacturing and enterprise software.</motion.p>
          </div>
        </div>

        <div className="fact-line">
          {FACTS.map(([value, label], index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }}>
              <strong>{value}</strong><span>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
