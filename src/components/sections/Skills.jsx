const GROUPS = [
  ['Applied AI', 'Agentic systems, RAG, fine-tuning, tool use and prompt design'],
  ['Evaluation', 'LLM-as-judge, retrieval quality, MLflow and experiment design'],
  ['Engineering', 'Python, FastAPI, PostgreSQL, Redis, Docker and Kubernetes'],
  ['Platforms', 'Azure, GCP, AWS, Qdrant, KServe and production monitoring'],
];

export default function Skills() {
  return (
    <section id="skills" className="tools-section">
      <div className="page-shell tools-grid">
        <div>
          <p className="section-label">Tools and practice</p>
          <h2>The stack changes. The standard doesn&apos;t.</h2>
          <p>I choose tools around the problem, the team and the operating constraints—not because they are fashionable.</p>
        </div>
        <div className="tools-list">
          {GROUPS.map(([name, detail], index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
