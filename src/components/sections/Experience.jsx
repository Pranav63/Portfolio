'use client';

import { motion } from 'framer-motion';
import { EXPERIENCE, EDUCATION } from '@/data/portfolio';

// Intrinsic dimensions are declared so each logo reserves its box before it
// loads; the stylesheet still caps the rendered height at 30px.
const COMPANY_LOGOS = {
  'Inception · a G42 company': { src: '/logos/inception.svg', className: 'logo-invert', alt: 'Inception', width: 6108, height: 1205 },
  'Hewlett Packard Enterprise': { src: '/logos/hpe.svg', className: 'logo-hpe', alt: 'Hewlett Packard Enterprise', width: 241, height: 42 },
  'Micron Technology': { src: '/logos/micron.svg', className: '', alt: 'Micron Technology', width: 216, height: 46 },
  'Dentsu International': { src: '/logos/dentsu.png', className: 'logo-invert', alt: 'dentsu', width: 1400, height: 600 },
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
                  {logo && <div className="experience-logo"><img src={logo.src} className={logo.className} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" decoding="async" /></div>}
                  <p>{item.company}</p>
                  <h3>{item.title}</h3>
                </div>
                <div className="experience-time"><strong>{item.period}</strong><span>{item.location}</span></div>
                <ul>{item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}</ul>
              </motion.article>
            );
          })}
        </div>

        <div className="education-block">
          <p className="section-label">Education</p>
          <ul>
            {EDUCATION.map((item) => (
              <li key={item.degree}>
                <h3>{item.degree}</h3>
                <p>{item.school}</p>
                <span>{item.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
