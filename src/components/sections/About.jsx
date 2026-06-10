'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Waypoint from './Waypoint';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Static ledger, no count-up. The numbers are strong enough on their own.
const LEDGER = [
  { value: '6+',     label: 'Years in production AI' },
  { value: '$10M',   label: 'Annual revenue impact, Micron RL' },
  { value: '5,000+', label: 'Users served, HPE Document Hub' },
  { value: '85%',    label: 'Query accuracy, Text-to-SQL' },
];

const EDUCATION = [
  {
    degree: 'Master of IT in Business (AI track)',
    school: 'Singapore Management University',
    year: '2019 - 2020',
  },
  {
    degree: 'B.Tech, Computer Science',
    school: 'UPES, Dehradun',
    year: '2014 - 2018',
  },
  {
    degree: 'Business Analytics',
    school: 'Harvard Business School Online',
    year: '2020',
  },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="section-waypoint" ref={ref}>
      <div className="section-scrim" />

      <div className="section-inner">
        <Waypoint id="02" time="09:40" phase="Morning" inView={inView} />

        <motion.h2
          className="section-title"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
        >
          Research into <em>running systems</em>
        </motion.h2>

        <motion.p
          className="section-lede"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
        >
          Six years across semiconductor manufacturing, enterprise AI and digital
          marketing. The pattern is the same every time: take the paper, ship the
          system, prove the number.
        </motion.p>

        {/* ledger strip */}
        <motion.div
          className="ledger"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={3}
          style={{ marginBottom: '64px' }}
        >
          {LEDGER.map((item) => (
            <div className="ledger-cell" key={item.label}>
              <div className="ledger-value">{item.value}</div>
              <div className="ledger-label">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* bio */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={4}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--gold-light)',
              marginBottom: '22px',
            }}>
              "I want to work on AI systems that operate at civilisational scale."
            </p>
            <p style={{
              lineHeight: 1.8,
              color: 'var(--text-dim)',
              fontSize: 'var(--step-body)',
              marginBottom: '14px',
            }}>
              That is why I am moving to the UAE. From RL agents scheduling wafer
              fab runs at Micron to LangGraph multi-agent platforms at HPE, the
              work I care about is the unglamorous middle: evaluation, deployment,
              observability, the parts that decide whether AI actually works in
              production.
            </p>
            <p style={{
              lineHeight: 1.8,
              color: 'var(--text-dim)',
              fontSize: 'var(--step-body)',
              marginBottom: '24px',
            }}>
              Off the clock: photography, chess, quizzing, and an unreasonable
              number of Marvel rewatches.
            </p>
          </motion.div>

          {/* education */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={5}
          >
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--step-micro)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '20px',
            }}>
              Education
            </span>

            {EDUCATION.map((edu, i) => (
              <div
                key={edu.degree}
                style={{
                  paddingBottom: '18px',
                  marginBottom: i < EDUCATION.length - 1 ? '18px' : 0,
                  borderBottom: i < EDUCATION.length - 1 ? '1px solid var(--rule)' : 'none',
                }}
              >
                <div style={{
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: 'var(--text)',
                  marginBottom: '4px',
                }}>
                  {edu.degree}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                }}>
                  {edu.school} &middot; {edu.year}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}