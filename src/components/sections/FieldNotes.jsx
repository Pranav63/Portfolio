'use client';

import { motion } from 'framer-motion';

const NOTES = [
  {
    index: '01',
    project: 'RAG evaluation',
    title: 'A demo shows what can happen. An evaluation shows how often.',
    detail: 'That is why I keep retrieval evidence, response time and answer-quality results visible instead of hiding them behind one polished query.',
  },
  {
    index: '02',
    project: 'Trading agent',
    title: 'Risk controls belong inside the product, not in the footnotes.',
    detail: 'Human approval, exposure limits and a kill switch are part of the system behaviour—not cleanup added after the model is connected.',
  },
  {
    index: '03',
    project: 'QLoRA fine-tuning',
    title: 'Small experiments need clearer comparisons, not larger claims.',
    detail: 'A stored base-versus-tuned comparison is more useful than a vague quality claim, and it makes the next evaluation gap obvious.',
  },
];

export default function FieldNotes() {
  return (
    <section className="notes-section" aria-labelledby="notes-title">
      <div className="page-shell">
        <header className="notes-head">
          <p className="section-label">Notes</p>
          <h2 id="notes-title">What building these systems changed my mind about.</h2>
        </header>

        <div className="notes-list">
          {NOTES.map((note, index) => (
            <motion.article
              key={note.index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: .45, delay: index * .06 }}
            >
              <span>{note.index}</span>
              <div>
                <p>{note.project}</p>
                <h3>{note.title}</h3>
              </div>
              <p>{note.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
