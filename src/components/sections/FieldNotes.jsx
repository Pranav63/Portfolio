import Link from 'next/link';
import { ARTICLES } from '@/data/writing';

export default function FieldNotes() {
  return (
    <section id="notes" className="notes-section" aria-labelledby="notes-title">
      <div className="page-shell">
        <header className="notes-head"><h2 id="notes-title">What the experiments taught me.</h2></header>
        <div className="writing-grid">
          {ARTICLES.map(article => (
            <Link className="note-card" href={'/writing/' + article.slug} key={article.slug}>
              <span className="note-meta">{article.category} · {article.readTime}</span>
              <h3>{article.title}</h3><p>{article.summary}</p>
              <span className="text-link">Read the note <span aria-hidden="true">↗</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
