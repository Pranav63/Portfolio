import Image from 'next/image';
import { PROJECTS } from '@/data/portfolio';
import { CASE_STUDIES } from '@/data/caseStudies';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import Reveal from '@/components/ui/Reveal';
import MoreWork from '@/components/sections/MoreWork';
import Stat from '@/components/ui/Stat';

const SPOTLIGHT = { spotlightColor: '#8a5cff', intensity: 0.22, spotlightSize: 420, borderGlow: 0.8 };
const host = url => new URL(url).host;

// The first project leads, the next two sit as a pair, and the earlier work
// becomes an index. Order in PROJECTS decides the hierarchy.
export default function Projects() {
  const [featured, ...rest] = PROJECTS;
  const pair = rest.slice(0, 2);
  const earlier = rest.slice(2);
  return (
    <section id="projects" className="projects-section">
      <div className="page-shell">
        <header className="projects-head">
          <h2>Built. Measured. Explained.</h2>
          <p>Working systems, each with its evaluation and the limits it still has.</p>
        </header>

        <Reveal>
          <Featured project={featured} detail={CASE_STUDIES[featured.id]} />
        </Reveal>

        <div className="work-pair">
          {pair.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <Tile project={project} detail={CASE_STUDIES[project.id]} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <MoreWork items={earlier.map(project => ({ ...project, detail: CASE_STUDIES[project.id] }))} />
        </Reveal>
      </div>
    </section>
  );
}

function Featured({ project, detail }) {
  const [main, second] = project.proofs;
  return (
    <SpotlightCard className="work-feature" {...SPOTLIGHT}>
      <div className="work-feature-media" style={{ viewTransitionName: 'project-' + project.id }}>
        <figure className="work-frame">
          <figcaption>{host(project.live ?? project.github)}</figcaption>
          <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(max-width: 860px) 92vw, 720px" />
        </figure>
        {second && (
          <figure className="work-frame work-frame--float" aria-hidden="true">
            <Image src={second.src} alt="" width={second.width} height={second.height} sizes="320px" />
          </figure>
        )}
      </div>
      <div className="work-feature-copy">
        <p className="work-meta"><span>{detail.category}</span>{detail.status}</p>
        <h3><a className="work-link" href={'/work/' + project.id}>{project.title}</a></h3>
        <p className="work-lead">{project.subtitle}</p>
        <dl className="work-stats">
          {project.caseStudy.evidence.map(item => (
            <div key={item.label}><dt>{item.label}</dt><dd><Stat value={item.value} /></dd></div>
          ))}
        </dl>
        <div className="work-actions">
          <span className="work-cta">Read the case study <span aria-hidden="true">→</span></span>
          {project.live && <a className="work-live" href={project.live} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </SpotlightCard>
  );
}

function Tile({ project, detail }) {
  const cover = project.proofs[0];
  return (
    <SpotlightCard className="work-tile" {...SPOTLIGHT}>
      <figure className="work-frame" style={{ viewTransitionName: 'project-' + project.id }}>
        <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 860px) 92vw, 600px" />
      </figure>
      <p className="work-meta"><span>{detail.category}</span>{detail.status}</p>
      <h3><a className="work-link" href={'/work/' + project.id}>{project.title}</a></h3>
      <p className="work-lead">{detail.preview}</p>
      <span className="work-cta">Read the case study <span aria-hidden="true">→</span></span>
    </SpotlightCard>
  );
}
