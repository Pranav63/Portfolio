'use client';

import { motion } from 'framer-motion';
import { EXPERIENCE } from '@/data/portfolio';

const COMPANY_LOGOS = {
  'Inception · a G42 company': { src: '/logos/inception.svg', className: 'logo-invert', alt: 'Inception' },
  'Hewlett Packard Enterprise': { src: '/logos/hpe.svg', className: 'logo-hpe', alt: 'Hewlett Packard Enterprise' },
  'Micron Technology': { src: '/logos/micron.svg', className: '', alt: 'Micron Technology' },
  'Dentsu International': { src: '/logos/dentsu.png', className: 'logo-invert', alt: 'dentsu' },
};

export default function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="page-shell">
        <header className="experience-head">
          <p className="section-label">Experience</p>
          <h2>Where I&apos;ve done the work.</h2>
          <p>Applied AI, enterprise software and machine learning inside systems where reliability and measurable outcomes matter.</p>
        </header>

        <div className="experience-list">
          {EXPERIENCE.map((item, index) => {
            const logo = COMPANY_LOGOS[item.company];
            return (
              <motion.article key={item.company} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: .55, delay: index * .04 }}>
                <span className="experience-index">0{index + 1}</span>
                <div className="experience-company">
                  {logo && <div className="experience-logo"><img src={logo.src} className={logo.className} alt={logo.alt} /></div>}
                  <p>{item.company}</p>
                  <h3>{item.title}</h3>
                </div>
                <div className="experience-time"><strong>{item.period}</strong><span>{item.location}</span></div>
                <ul>{item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
