'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STAGES = [
  { name: 'Frame', verb: 'Define the decision', description: 'Turn an ambiguous AI request into users, constraints, failure modes and a measurable definition of success.', output: 'System brief + risk map', signal: 'Success criteria' },
  { name: 'Build', verb: 'Make behaviour visible', description: 'Create the smallest traceable model or agent workflow that can expose assumptions before the architecture hardens.', output: 'Traceable baseline', signal: 'Execution traces' },
  { name: 'Evaluate', verb: 'Test what matters', description: 'Measure task quality, grounding and robustness against representative scenarios—not only a polished happy path.', output: 'Evaluation report', signal: 'Quality thresholds' },
  { name: 'Guard', verb: 'Design safe failure', description: 'Add permissions, validation, fallbacks and human escalation where model uncertainty meets operational risk.', output: 'Safety contract', signal: 'Failure coverage' },
  { name: 'Deploy', verb: 'Engineer the service', description: 'Package inference and orchestration behind observable APIs with repeatable release and rollback paths.', output: 'Release candidate', signal: 'Latency + reliability' },
  { name: 'Operate', verb: 'Close the loop', description: 'Watch quality, cost, drift and incidents in production, then feed real behaviour into the next evaluation cycle.', output: 'Production signal', signal: 'Cost + drift' },
];

export default function ProductionLifecycle() {
  const [active, setActive] = useState(0);
  const current = STAGES[active];

  return (
    <section id="practice" className="practice-section" aria-labelledby="practice-title">
      <div className="page-shell">
        <header className="practice-head">
          <div>
            <p className="section-label">How I work</p>
            <h2 id="practice-title">The work between a promising model and a dependable system.</h2>
          </div>
          <p>This is the part of applied AI I care about most—six stages I move through on every project, in roughly this order.</p>
        </header>

        <div className="practice-body">
          <aside className="practice-console" aria-live="polite">
            <div className="console-top"><span><i /> System method</span><span>0{active + 1} / 06</span></div>
            <svg viewBox="0 0 520 180" aria-hidden="true">
              <path className="console-grid-line" d="M0 30H520M0 90H520M0 150H520" />
              <motion.path className="console-wave" d="M0 112 C48 112 48 65 92 65 S138 130 184 130 S228 48 276 48 S328 110 374 110 S420 72 520 72" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }} />
              <motion.line className="console-scan" animate={{ x1: 88 + active * 68, x2: 88 + active * 68 }} y1="18" y2="164" transition={{ type: 'spring', stiffness: 140, damping: 22 }} />
            </svg>
            <AnimatePresence mode="wait">
              <motion.div className="console-copy" key={current.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .26 }}>
                <small>Current stage</small>
                <strong>{current.name}</strong>
                <p>{current.output}</p>
              </motion.div>
            </AnimatePresence>
            <div className="console-progress">
              {STAGES.map((stage, index) => <button type="button" aria-label={`Show ${stage.name}`} className={index <= active ? 'is-active' : ''} onClick={() => setActive(index)} key={stage.name}><span /></button>)}
            </div>
            <p className="console-note">The trace moves only when evidence clears the current gate.</p>
          </aside>

          <div className="practice-list">
            {STAGES.map((stage, index) => (
              <motion.article
                className={active === index ? 'is-active' : ''}
                key={stage.name}
                initial={{ y: 18 }}
                whileInView={{ y: 0 }}
                onViewportEnter={() => setActive(index)}
                onPointerEnter={() => setActive(index)}
                viewport={{ margin: '-35% 0px -45% 0px' }}
                transition={{ duration: .45 }}
              >
                {active === index && <motion.i className="practice-active" layoutId="practice-active" transition={{ type: 'spring', stiffness: 180, damping: 26 }} />}
                <span>0{index + 1}</span>
                <div className="practice-copy"><p>{stage.name}</p><h3>{stage.verb}</h3><p>{stage.description}</p></div>
                <dl><div><dt>Working output</dt><dd>{stage.output}</dd></div><div><dt>Evidence I watch</dt><dd>{stage.signal}</dd></div></dl>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
