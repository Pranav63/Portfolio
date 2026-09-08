'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CAPABILITIES } from '@/data/portfolio';

const EXAMPLES = [
  ['qlora', 'Explore the fine-tuning experiment'],
  ['rag-eval', 'See the RAG evaluation'],
  ['trading-agent', 'Explore the agent workflow'],
  ['rag-eval', 'See the retrieval system'],
];

export default function Skills() {
  return (
    <section id="skills" className="tools-section">
      <div className="page-shell tools-grid">
        <motion.div initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .6 }}>
          <p className="section-label">Tools and practice</p>
          <h2>Practice, backed by projects.</h2>
          <p>The tools I use, with examples you can inspect.</p>
        </motion.div>
        <div className="tools-list">
          {CAPABILITIES.map(([name, detail], index) => (
            <motion.article
              key={name}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: .45, delay: index * .06 }}
            >
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p>{detail}</p>
              <Link className="text-link" href={'/work/' + EXAMPLES[index][0]}>{EXAMPLES[index][1]} →</Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
