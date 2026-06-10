'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { PROJECTS } from '@/data/portfolio';
import Waypoint from './Waypoint';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MetricChip = ({ text }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    background: 'var(--gold-faint)',
    border: '1px solid var(--gold-dim)',
    borderRadius: '100px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--gold)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.04em',
  }}>
    {text}
  </span>
);

const Links = ({ project }) => (
  <div style={{ display: 'flex', gap: '14px' }}>
    {project.github && (
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} on GitHub`}
        style={{ color: 'rgba(237,232,220,0.5)', fontSize: '1.05rem' }}
      >
        <FaGithub />
      </a>
    )}
    {project.live && project.live !== project.github && (
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} live demo`}
        style={{ color: 'rgba(237,232,220,0.5)', fontSize: '0.95rem' }}
      >
        <FaExternalLinkAlt />
      </a>
    )}
  </div>
);

// First project gets the full-width feature treatment
const FeaturedProject = ({ project, inView }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate={inView ? 'visible' : 'hidden'}
    custom={2}
    className="panel"
    whileHover={{ borderColor: 'rgba(201,168,76,0.4)' }}
    style={{ padding: '40px', marginBottom: '24px' }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '14px',
    }}>
      <div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--step-micro)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          display: 'block',
          marginBottom: '10px',
        }}>
          Featured build
        </span>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 560,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: 'var(--text)',
          lineHeight: 1.15,
          marginBottom: '8px',
        }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>
          {project.subtitle}
        </p>
      </div>
      <Links project={project} />
    </div>

    <p style={{
      fontSize: '0.92rem',
      color: 'var(--text-dim)',
      lineHeight: 1.75,
      maxWidth: '720px',
      marginBottom: '22px',
    }}>
      {project.description}
    </p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
      {project.metrics?.map((m) => <MetricChip key={m} text={m} />)}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {project.tags.map((t) => (
        <span key={t} className="tag" style={{ fontSize: '0.68rem' }}>{t}</span>
      ))}
    </div>
  </motion.div>
);

const ProjectCard = ({ project, index, inView }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate={inView ? 'visible' : 'hidden'}
    custom={index + 3}
    whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.4)' }}
    className="panel"
    style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '14px',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: project.live ? '#27C93F' : 'var(--gold)',
      }}>
        {project.live && project.live !== project.github ? 'Live' : 'Open source'}
      </span>
      <Links project={project} />
    </div>

    <h3 style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 560,
      fontSize: '1.2rem',
      color: 'var(--text)',
      marginBottom: '6px',
      lineHeight: 1.25,
    }}>
      {project.title}
    </h3>

    <p style={{ fontSize: '0.78rem', color: 'var(--gold-light)', marginBottom: '14px' }}>
      {project.subtitle}
    </p>

    <p style={{
      fontSize: '0.86rem',
      color: 'var(--text-dim)',
      lineHeight: 1.7,
      marginBottom: '20px',
      flex: 1,
    }}>
      {project.description}
    </p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
      {project.metrics?.map((m) => <MetricChip key={m} text={m} />)}
    </div>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {project.tags.map((t) => (
        <span key={t} className="tag" style={{ fontSize: '0.68rem' }}>{t}</span>
      ))}
    </div>
  </motion.div>
);

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [featured, ...rest] = PROJECTS;

  return (
    <section id="projects" className="section-waypoint" ref={ref}>
      <div className="section-scrim" />

      <div className="section-inner">
        <Waypoint id="05" time="20:30" phase="Nightfall" inView={inView} />

        <motion.h2
          className="section-title"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
        >
          Built in <em>public</em>
        </motion.h2>

        <motion.p
          className="section-lede"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
        >
          Open, deployed and inspectable. Production engineering depth you can
          read the source of, not toy demos.
        </motion.p>

        {featured && <FeaturedProject project={featured} inView={inView} />}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}>
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} inView={inView} />
          ))}
        </div>

        <motion.p
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          custom={PROJECTS.length + 3}
          style={{
            textAlign: 'center',
            marginTop: '48px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          More at{' '}
          <a
            href="https://github.com/Pranav63"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)', textDecoration: 'none' }}
          >
            github.com/Pranav63
          </a>
        </motion.p>
      </div>
    </section>
  );
}