import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import PageFooter from '@/components/ui/PageFooter';
import { ARTICLES } from '@/data/writing';
import { PROJECTS } from '@/data/portfolio';

export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map(article => ({ slug: article.slug })); }
export function generateMetadata({ params }) {
  const article = ARTICLES.find(item => item.slug === params.slug);
  if (!article) return {};
  const title = article.title + ' | Pranav Arora';
  const url = '/writing/' + article.slug;
  const image = { url: url + '/opengraph-image', width: 1200, height: 630, alt: article.title };
  return { title, description: article.summary, alternates: { canonical: url }, openGraph: { title, description: article.summary, type: 'article', url, authors: ['Pranav Arora'], images: [image] }, twitter: { card: 'summary_large_image', title, description: article.summary, images: [image.url] } };
}

export default function ArticlePage({ params }) {
  const article = ARTICLES.find(item => item.slug === params.slug);
  if (!article) notFound();
  const project = PROJECTS.find(item => item.id === article.project);
  return <><Navigation /><main id="main" className="inner-page article-page page-shell"><Link className="back-link" href="/writing">← All field notes</Link><article><header className="page-heading"><p className="section-label">{article.category} · {article.readTime}</p><h1>{article.title}</h1><p className="page-lead">{article.summary}</p><p className="article-byline">By Pranav Arora · Engineering notes</p></header><div className="article-body">{article.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<div className="article-source"><h2>Project evidence</h2><a className="text-link" href={article.source} target="_blank" rel="noreferrer">Read the repository source ↗</a><Link className="text-link" href={'/work/' + project.id}>Explore {project.title} →</Link></div></div></article></main><PageFooter /></>;
}
