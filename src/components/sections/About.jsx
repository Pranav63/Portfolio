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
          <div>
            <p className="section-label">About</p>
            <h2>From optimising factories in Singapore to building applied AI in Abu Dhabi.</h2>
          </div>
          <div className="about-story">
            <p>I started in analytics at Dentsu, moved closer to real-world operations at Micron, and then built enterprise AI systems at Hewlett Packard Enterprise.</p>
            <p>Today I&apos;m an Applied AI Scientist at Inception, a G42 company. That path changed what I care about: not only whether a model can work, but whether a team can understand it, evaluate it and trust it when the stakes are real.</p>
            <p className="about-note">The move from Singapore to Abu Dhabi was also a personal reset—a chance to work on ambitious AI problems while carrying forward the production discipline I learned in manufacturing and enterprise software.</p>
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
