import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import PageFooter from '@/components/ui/PageFooter';
import ProjectCaseStudy from '@/components/sections/ProjectCaseStudy';
import BlurText from '@/components/reactbits/BlurText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import CoverReveal from '@/components/ui/CoverReveal';
import { FaGithub } from 'react-icons/fa';
import { PROJECTS } from '@/data/portfolio';
import { CASE_STUDIES } from '@/data/caseStudies';

export const dynamicParams = false;
export function generateStaticParams() { return PROJECTS.map(project => ({ slug: project.id })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find(item => item.id === slug);
  if (!project) return {};
  const title = project.title + ' | Pranav Arora';
  const url = '/work/' + project.id;
  return { title, description: project.description, alternates: { canonical: url }, openGraph: { title, description: project.description, type: 'article', url, images: [{ url: project.proofs[0].src, alt: project.proofs[0].alt }] }, twitter: { card: 'summary_large_image', title, description: project.description, images: [project.proofs[0].src] } };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const index = PROJECTS.findIndex(item => item.id === slug);
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
        <header className="page-heading case-heading">
          <p className="section-label">{detail.category} / Case study</p>
          <BlurText as="h1" text={project.title} animateBy="words" delay={90} stepDuration={0.4} trigger="load" />
          <p className="page-lead">{project.subtitle}</p>
          <div className="case-heading-actions">
            <span className="status-badge">{detail.status} · 2026</span>
            <a className="case-action" href={project.github} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> Source <span aria-hidden="true">↗</span></a>
            {project.live && <a className="case-action case-action--primary" href={project.live} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
          </div>
        </header>
        <CoverReveal proof={cover} label={new URL(project.live ?? project.github).host} transitionName={'project-' + project.id} />
        <div className="case-context"><div><h2>The problem</h2><p>{detail.problem}</p></div><div><h2>My contribution</h2><p>{detail.contribution}</p><ul className="stack-tags" aria-label="Tools and methods">{detail.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div></div>
        <ProjectCaseStudy project={project} detail={detail} />
        <nav className="next-project" aria-label="More projects">
          <span>Next case study</span>
          <SpotlightCard className="next-project-card" spotlightColor="#8a5cff" intensity={0.22} spotlightSize={420} borderGlow={0.8}>
            <div><p className="work-meta"><span>{CASE_STUDIES[next.id].category}</span></p><Link className="work-link" href={'/work/' + next.id}>{next.title}</Link><p className="work-lead">{next.subtitle}</p></div>
            <figure className="work-frame"><Image src={next.proofs[0].src} alt="" width={next.proofs[0].width} height={next.proofs[0].height} sizes="(max-width: 860px) 90vw, 420px" /></figure>
          </SpotlightCard>
        </nav>
      </main>
      <PageFooter />
    </>
  );
}
