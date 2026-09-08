import { PROJECTS } from '@/data/portfolio';
import { ARTICLES } from '@/data/writing';

export default function sitemap() {
  return ['', '/about', '/writing', ...PROJECTS.map(project => '/work/' + project.id), ...ARTICLES.map(article => '/writing/' + article.slug)].map(path => ({ url: 'https://pranavarora.vercel.app' + path }));
}
