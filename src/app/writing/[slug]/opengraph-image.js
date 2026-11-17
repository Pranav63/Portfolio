import { notFound } from 'next/navigation';
import { ARTICLES } from '@/data/writing';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImage';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find(item => item.slug === slug);
  if (!article) notFound();
  return renderOgImage({ title: article.title, subtitle: 'Field notes by Pranav Arora', eyebrow: article.category });
}
