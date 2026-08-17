'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { PROJECTS } from '@/data/portfolio';

const DETAILS = {
  'trading-agent': {
    year: '2026',
    flow: ['Financial news', 'AI signal', 'Technical checks', 'Human approval'],
    next: 'Add repeatable backtests and a paper-trading report before making any claim about signal quality or returns.',
  },
  'rag-eval': {
    year: '2026',
    flow: ['Question', 'Search 73 papers', 'Rerank evidence', 'Answer + evaluation'],
    next: 'Commit the raw 10-query results, connect RAGAS to the main dashboard path and build a larger human-reviewed test set.',
  },
  qlora: {
    year: '2026',
    flow: ['7,620 source examples', '653 clean samples', 'QLoRA training', 'Base vs tuned comparison'],
    next: 'Move beyond four prompts with a held-out test set and human ratings for how natural the Arabic-English register feels.',
  },
};

export default function Projects() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const project = PROJECTS[active];
  const detail = DETAILS[project.id];

  const trackPointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="page-shell">
        <header className="projects-head">
          <p className="section-label">Selected work</p>
          <h2>Things I built to understand where AI becomes useful—and where it breaks.</h2>
          <p>Three personal projects, explained without pretending they are larger or more proven than they are.</p>
        </header>

        <div className="project-index" aria-label="Select a project">
          {PROJECTS.map((item, index) => (
            <button
              type="button"
              className={'project-row' + (index === active ? ' is-active' : '')}
              key={item.id}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onPointerMove={trackPointer}
              onFocus={() => setActive(index)}
              aria-pressed={index === active}
            >
              {index === active && <motion.span className="project-row-active" layoutId="project-row-active" transition={{ type: 'spring', stiffness: 190, damping: 27 }} />}
              <span className="project-number">0{index + 1}</span>
              <span className="project-row-title"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
              <span className="project-row-proof">{item.metrics[0]}</span>
              <span className="project-year">{DETAILS[item.id].year}</span>
              <span className="project-arrow">↘</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={project.id}
            className="project-case-study"
            initial={reducedMotion ? false : { opacity: 0, y: 18, clipPath: 'inset(0 0 8% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="case-main">
              <p className="case-label">What I built</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a className="source-link" href={project.github} target="_blank" rel="noreferrer"><FaGithub /> Read the source <span>↗</span></a>
            </div>

            <div className="case-results">
              <p className="case-label">What the repository shows</p>
              <div>{project.caseStudy.evidence.map((item) => <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div>
              <p className="evidence-note">{project.highlights[0]}.</p>
            </div>

            <div className="project-flow" aria-label={'How ' + project.title + ' works'}>
              {detail.flow.map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < detail.flow.length - 1 && <i>→</i>}</div>)}
            </div>

            {project.proofs?.length > 0 ? (
              <div className="project-proofs">
                <div className="proof-heading"><p className="case-label">Saved results</p><p>These images are committed with the project, so the evidence remains visible even when no demo is hosted.</p></div>
                <div className="proof-grid">
                  {project.proofs.map((proof) => (
                    <a href={proof.src} target="_blank" rel="noreferrer" key={proof.src}>
                      <motion.figure initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} whileHover={reducedMotion ? undefined : { y: -5 }} transition={{ duration: .38 }}>
                        <div className="proof-media"><Image src={proof.src} width={proof.width} height={proof.height} alt={proof.alt} sizes="(max-width: 760px) 94vw, 50vw" /><span>Open evidence ↗</span></div>
                        <figcaption>{proof.caption}<span>View full size ↗</span></figcaption>
                      </motion.figure>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="source-proof"><p className="case-label">Current proof</p><p>The source contains the complete news pipeline, model classifier, indicator checks, risk guard, paper-broker integration and dashboard. It does not yet contain a backtest or a claim of profitable performance.</p></div>
            )}

            <div className="case-decisions">
              <div><p className="case-label">Why I built it this way</p></div>
              <div>{project.caseStudy.decisions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h4>{item.title}</h4><p>{item.rationale}</p></div></article>)}</div>
            </div>

            <div className="case-next"><p className="case-label">What I would improve next</p><p>{detail.next}</p></div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
