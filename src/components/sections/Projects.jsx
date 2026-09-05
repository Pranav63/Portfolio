'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { FaGithub } from 'react-icons/fa';
import { PROJECTS } from '@/data/portfolio';

const DETAILS = {
  'trading-agent': {
    nav: 'Trading AI',
    year: '2026',
    flow: ['Financial news', 'AI signal', 'Technical checks', 'Human approval'],
    next: 'Add repeatable backtests and a paper-trading report before making any claim about signal quality or returns.',
  },
  'rag-eval': {
    nav: 'RAG Eval',
    year: '2026',
    flow: ['Question', 'Search 73 papers', 'Rerank evidence', 'Answer + evaluation'],
    next: 'Commit the raw 10-query results, connect RAGAS to the main dashboard path and build a larger human-reviewed test set.',
  },
  qlora: {
    nav: 'Arabic QLoRA',
    year: '2026',
    flow: ['7,620 source examples', '653 clean samples', 'QLoRA training', 'Base vs tuned comparison'],
    next: 'Move beyond four prompts with a held-out test set and human ratings for how natural the Arabic-English register feels.',
  },
};

export default function Projects() {
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const [activeProof, setActiveProof] = useState(null);
  const [proofZoom, setProofZoom] = useState(.9);
  const caseStudyRef = useRef(null);
  const lightboxMediaRef = useRef(null);
  const dialogRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const project = PROJECTS[active];
  const detail = DETAILS[project.id];

  useEffect(() => {
    if (!activeProof) return undefined;

    const previousOverflow = document.body.style.overflow;

    // aria-modal only claims the rest of the page is inert; Tab still has to be
    // kept inside the dialog by hand.
    const focusables = () => Array.from(
      dialogRef.current?.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((node) => !node.disabled && node.offsetParent !== null);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveProof(null);
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = focusables();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Lenis drives scrolling on its own RAF loop and ignores body overflow.
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    window.requestAnimationFrame(() => {
      const media = lightboxMediaRef.current;
      if (media) media.scrollLeft = (media.scrollWidth - media.clientWidth) / 2;
    });

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [activeProof, lenis]);

  const openProof = (proof, trigger) => {
    lastTriggerRef.current = trigger;
    setProofZoom(.9);
    setActiveProof(proof);
  };

  const changeProofZoom = (amount) => {
    setProofZoom((current) => Math.min(2, Math.max(.8, current + amount)));
  };

  const selectProject = (index) => {
    if (index === active) return;
    setActive(index);
    window.dispatchEvent(new CustomEvent('portfolio:project-change', { detail: { index } }));
    window.requestAnimationFrame(() => {
      if (window.scrollY > document.getElementById("projects")?.offsetTop + 260) {
        if (lenis) lenis.scrollTo(caseStudyRef.current, { block: 'start' });
        else caseStudyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

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
          <h2>Things I built to understand where AI becomes useful, and where it breaks.</h2>
          <p>Three personal projects, explained without pretending they are larger or more proven than they are.</p>
        </header>

        <div className="project-index" aria-label="Select a project">
          {PROJECTS.map((item, index) => (
            <button
              type="button"
              className={'project-row' + (index === active ? ' is-active' : '')}
              key={item.id}
              onClick={() => selectProject(index)}
              onPointerMove={trackPointer}
              aria-pressed={index === active}
            >
              {index === active && <motion.span className="project-row-active" layoutId="project-row-active" transition={{ type: 'spring', stiffness: 190, damping: 27 }} />}
              <span className="project-number">0{index + 1}</span>
              <span className="project-row-title"><strong><span className="project-title-long">{item.title}</span><span className="project-title-short">{DETAILS[item.id].nav}</span></strong><small>{item.subtitle}</small></span>
              <span className="project-row-proof">{item.metrics[0]}</span>
              <span className="project-year">{DETAILS[item.id].year}</span>
              <span className="project-arrow">↘</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={project.id}
            ref={caseStudyRef}
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
                    <motion.button
                      type="button"
                      onClick={(event) => openProof(proof, event.currentTarget)}
                      aria-label={`Open full-size image: ${proof.alt}`}
                      key={proof.src}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      whileHover={reducedMotion ? undefined : { y: -5 }}
                      transition={{ duration: .38 }}
                    >
                      <div className="proof-media"><Image src={proof.src} width={proof.width} height={proof.height} alt={proof.alt} sizes="(max-width: 760px) 94vw, 50vw" /><span>Open evidence +</span></div>
                      <span className="proof-caption">{proof.caption}<span>View full size +</span></span>
                    </motion.button>
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

        <AnimatePresence>
          {activeProof && (
            <motion.div
              className="image-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={activeProof.alt}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setActiveProof(null);
              }}
            >
              <motion.div
                className="image-lightbox-content"
                ref={dialogRef}
                initial={reducedMotion ? false : { opacity: 0, scale: .96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: .98, y: 8 }}
                transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="image-lightbox-toolbar">
                  <div className="image-lightbox-zoom" aria-label="Image zoom controls">
                    <button type="button" onClick={() => changeProofZoom(-.1)} disabled={proofZoom <= .8} aria-label="Zoom out">−</button>
                    <button type="button" className="image-lightbox-zoom-value" onClick={() => setProofZoom(1)} aria-label="Fit image to viewer">{Math.round(proofZoom * 100)}%</button>
                    <button type="button" onClick={() => changeProofZoom(.1)} disabled={proofZoom >= 2} aria-label="Zoom in">+</button>
                  </div>
                  <button type="button" className="image-lightbox-close" onClick={() => setActiveProof(null)} aria-label="Close full-size image" autoFocus>Close ×</button>
                </div>
                <div className="image-lightbox-media" ref={lightboxMediaRef}>
                  <div className="image-lightbox-stage" style={{ width: `${proofZoom * 100}%` }}>
                    <Image src={activeProof.src} width={activeProof.width} height={activeProof.height} alt={activeProof.alt} sizes="100vw" priority />
                  </div>
                </div>
                <p>{activeProof.caption}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
