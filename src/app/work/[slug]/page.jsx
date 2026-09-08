import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import PageFooter from '@/components/ui/PageFooter';
import ProjectCaseStudy from '@/components/sections/ProjectCaseStudy';
import { PROJECTS } from '@/data/portfolio';
import { CASE_STUDIES } from '@/data/caseStudies';

export const dynamicParams = false;
export function generateStaticParams() { return PROJECTS.map(project => ({ slug: project.id })); }

export function generateMetadata({ params }) {
  const project = PROJECTS.find(item => item.id === params.slug);
  if (!project) return {};
  const title = project.title + ' | Pranav Arora';
  const url = '/work/' + project.id;
  return { title, description: project.description, alternates: { canonical: url }, openGraph: { title, description: project.description, type: 'article', url, images: [{ url: project.proofs[0].src, alt: project.proofs[0].alt }] }, twitter: { card: 'summary_large_image', title, description: project.description, images: [project.proofs[0].src] } };
}

export default function WorkPage({ params }) {
  const index = PROJECTS.findIndex(item => item.id === params.slug);
  if (index < 0) notFound();
  const project = PROJECTS[index];
  const detail = CASE_STUDIES[project.id];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const cover = project.proofs[0];
  return (
    <>
      <Navigation />
      <main id="main" className="inner-page page-shell">
        <a className="back-link" href="/#projects">← All selected work</a>
        <header className="page-heading">
          <p className="section-label">{detail.category} / Case study</p>
          <h1>{project.title}</h1>
          <p className="page-lead">{project.subtitle}</p>
          <span className="status-badge">{detail.status} · 2026</span>
        </header>
        <a className="case-cover" href={cover.src} target="_blank" rel="noreferrer" style={{ viewTransitionName: 'project-' + project.id }} aria-label={'Open full-size image: ' + cover.alt}><Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 860px) 94vw, 1100px" priority /><span className="case-cover-caption">Inspect screenshot ↗</span></a>
        <div className="case-context"><div><h2>The problem</h2><p>{detail.problem}</p></div><div><h2>My contribution</h2><p>{detail.contribution}</p><ul className="stack-tags" aria-label="Tools and methods">{detail.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div></div>
        <ProjectCaseStudy project={project} detail={detail} />
        <nav className="next-project" aria-label="More projects"><span>Continue exploring</span><Link href={'/work/' + next.id}>{next.title} <span aria-hidden="true">→</span></Link></nav>
      </main>
      <PageFooter />
    </>
  );
}
