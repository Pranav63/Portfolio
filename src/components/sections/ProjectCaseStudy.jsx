'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import QloraComparison from '@/components/sections/QloraComparison';

export default function ProjectCaseStudy({ project, detail }) {
  const [activeProof, setActiveProof] = useState(null);
  const [proofZoom, setProofZoom] = useState(.9);
  const [flowStep, setFlowStep] = useState(0);
  const lightboxMediaRef = useRef(null);
  const dialogRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const reducedMotion = useReducedMotion();

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

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    window.requestAnimationFrame(() => {
      const media = lightboxMediaRef.current;
      if (media) media.scrollLeft = (media.scrollWidth - media.clientWidth) / 2;
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      lastTriggerRef.current?.focus();
    };
  }, [activeProof]);

  const openProof = (proof, trigger) => {
    lastTriggerRef.current = trigger;
    setProofZoom(.9);
    setActiveProof(proof);
  };

  const changeProofZoom = (amount) => {
    setProofZoom((current) => Math.min(2, Math.max(.8, current + amount)));
  };

  return (
    <div className="case-study-body">
          <article className="project-case-study">
            <div className="case-main">
              <p className="case-label">What I built</p>
              <h2>The approach</h2>
              <p>{project.description}</p>
              <a className="source-link" href={project.github} target="_blank" rel="noreferrer"><FaGithub /> Read the source <span>↗</span></a>
            </div>

            <div className="case-results">
              <h2 className="case-label">{detail.resultsLabel}</h2>
              <div>{project.caseStudy.evidence.map((item) => <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div>
              <p className="evidence-note">{detail.metricNote}</p>
            </div>

            <div className="project-architecture">
              <h2 className="case-label">Follow the workflow</h2>
              <div className="project-flow" role="group" aria-label={'How ' + project.title + ' works'}>
                {detail.flow.map((step, index) => <button type="button" key={step} aria-pressed={flowStep === index} aria-controls="flow-description" onClick={() => setFlowStep(index)}><span>0{index + 1}</span><strong>{step}</strong>{index < detail.flow.length - 1 && <i aria-hidden="true">→</i>}</button>)}
              </div>
              <div id="flow-description" className="flow-description" aria-live="polite" aria-atomic="true"><p key={flowStep}>{detail.flowNotes[flowStep]}</p></div>
            </div>

            {project.id === 'qlora' && <QloraComparison />}

            {project.proofs?.length > 0 ? (
              <div className="project-proofs">
                <div className="proof-heading"><h2 className="case-label">Inside the project</h2><p>Saved screenshots from the repository. Select an image to inspect it in detail.</p></div>
                <div className="proof-grid">
                  {project.proofs.map((proof) => (
                    <motion.button
                      type="button"
                      onClick={(event) => openProof(proof, event.currentTarget)}
                      aria-label={`Open full-size image: ${proof.alt}`}
                      key={proof.src}
                      initial={false}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      whileHover={reducedMotion ? undefined : { y: -5 }}
                      transition={{ duration: .38 }}
                    >
                      <motion.div className="proof-media" layoutId={reducedMotion ? undefined : 'proof-' + proof.src} transition={{ layout: { duration: .4, ease: [.22, 1, .36, 1] } }}><Image src={proof.src} width={proof.width} height={proof.height} alt={proof.alt} sizes="(max-width: 760px) 94vw, 50vw" /><span>Open evidence +</span></motion.div>
                      <span className="proof-caption">{proof.caption}<span>View full size +</span></span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="source-proof"><p className="case-label">Current proof</p><p>The source contains the complete news pipeline, model classifier, indicator checks, risk guard, paper-broker integration and dashboard. It does not yet contain a backtest or a claim of profitable performance.</p></div>
            )}

            <div className="case-decisions">
              <div><h2 className="case-label">Engineering decisions</h2></div>
              <div>{project.caseStudy.decisions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.rationale}</p></div></article>)}</div>
            </div>

            <div className="case-next"><h2 className="case-label">Limitations & next steps</h2><p>{detail.next}</p></div>
          </article>

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
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="image-lightbox-toolbar">
                  <div className="image-lightbox-zoom" aria-label="Image zoom controls">
                    <button type="button" onClick={() => changeProofZoom(-.1)} disabled={proofZoom <= .8} aria-label="Zoom out">−</button>
                    <button type="button" className="image-lightbox-zoom-value" onClick={() => setProofZoom(1)} aria-label="Reset image width to 100 percent">{Math.round(proofZoom * 100)}%</button>
                    <button type="button" onClick={() => changeProofZoom(.1)} disabled={proofZoom >= 2} aria-label="Zoom in">+</button>
                  </div>
                  <button type="button" className="image-lightbox-close" onClick={() => setActiveProof(null)} aria-label="Close full-size image" autoFocus>Close ×</button>
                </div>
                <div className="image-lightbox-media" ref={lightboxMediaRef}>
                  <motion.div className="image-lightbox-stage" layoutId={reducedMotion ? undefined : 'proof-' + activeProof.src} transition={{ layout: { duration: .4, ease: [.22, 1, .36, 1] } }} style={{ width: `${proofZoom * 100}%` }}>
                    <Image src={activeProof.src} width={activeProof.width} height={activeProof.height} alt={activeProof.alt} sizes="100vw" priority />
                  </motion.div>
                </div>
                <p>{activeProof.caption}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
