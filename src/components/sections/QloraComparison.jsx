'use client';

import { useState } from 'react';
import comparisons from '@/data/qlora-comparisons.json';

const LABELS = ['Supply chain', 'Machine learning', 'Data preparation', 'Overfitting'];

function codeSwitchRatio(text) {
  const words = text.trim().split(/\s+/);
  return (words.filter(word => /[a-zA-Z]{2,}/.test(word)).length / words.length * 100).toFixed(1);
}

export default function QloraComparison() {
  const [selected, setSelected] = useState(0);
  const [highlight, setHighlight] = useState(true);
  const result = comparisons[selected];
  const output = text => text.split(/(\s+)/).map((word, index) => highlight && /[a-zA-Z]{2,}/.test(word) ? <mark key={index}>{word}</mark> : word);

  return (
    <section className="comparison" aria-labelledby="comparison-title">
      <div className="comparison-heading"><p className="section-label">Explore the experiment</p><span className="status-badge">Recorded outputs · no live inference</span></div>
      <h2 id="comparison-title">Same prompt. Two model outputs.</h2>
      <p>Choose one of the four saved prompts to compare the original model with the fine-tuned version. The text is reproduced as saved, including incomplete endings.</p>
      <div className="comparison-controls">
        <label htmlFor="comparison-prompt">Choose a prompt<select id="comparison-prompt" value={selected} onChange={event => setSelected(Number(event.target.value))}>{LABELS.map((label, index) => <option key={label} value={index}>{label}</option>)}</select></label>
        <label className="highlight-toggle"><input type="checkbox" checked={highlight} onChange={event => setHighlight(event.target.checked)} /> Highlight English terms</label>
      </div>
      <p className="comparison-prompt" lang="ar" dir="rtl">{result.prompt}</p>
      <p className="sr-only" role="status">Showing {LABELS[selected]}. Base: {codeSwitchRatio(result.base)} percent. Fine-tuned: {codeSwitchRatio(result.finetuned)} percent.</p>
      <div className="comparison-grid is-updating" key={selected}>
        {[['Base Qwen2.5-3B', result.base], ['Fine-tuned model', result.finetuned]].map(([label, text]) => (
          <article key={label}><div className="comparison-model"><h3>{label}</h3><span>{codeSwitchRatio(text)}% <small>code-switch ratio</small></span></div><p lang="ar" dir="rtl" className="comparison-output">{output(text)}</p></article>
        ))}
      </div>
      <details className="metric-method"><summary>How to read this comparison</summary><p>The percentage is the share of whitespace-separated words that contain two or more consecutive Latin letters, using the repository&apos;s benchmark rule. Highlighting uses the same rule. More English terms demonstrate a register change; they do not prove a better answer. These four examples are not a held-out quality benchmark.</p></details>
      <a className="text-link" href="https://github.com/Pranav63/qlora-multilingual-finetuning/blob/main/eval/comparison_results.json" target="_blank" rel="noreferrer">Inspect the saved source outputs ↗</a>
    </section>
  );
}
