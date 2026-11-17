import Image from 'next/image';
import { PROJECTS } from '@/data/portfolio';
import { CASE_STUDIES } from '@/data/caseStudies';

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="page-shell">
        <header className="projects-head">
          <p className="section-label">Selected work / 01 to 0{PROJECTS.length}</p>
          <h2>Built. Measured. Explained.</h2>
          <p>Applied AI projects with working interfaces, evaluation results, and engineering tradeoffs.</p>
        </header>
        <div className="work-grid">
          {PROJECTS.map((project, index) => {
            const detail = CASE_STUDIES[project.id];
            const proof = project.proofs[0];
            return (
              <a className="work-card" key={project.id} href={'/work/' + project.id}>
                <div className="work-card-image" style={{ viewTransitionName: 'project-' + project.id }}><Image src={proof.src} alt={proof.alt} width={proof.width} height={proof.height} sizes="(max-width: 860px) 94vw, 33vw" /></div>
                <div className="work-card-meta"><span>0{index + 1} / {detail.category}</span><span>{detail.status}</span></div>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
                <p className="work-card-result">{detail.preview}</p>
                <span className="work-card-action">View case study <span aria-hidden="true">↗</span></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
