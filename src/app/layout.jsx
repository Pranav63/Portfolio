import { Geist, Geist_Mono } from 'next/font/google';
import SmoothScroll from '@/components/ui/SmoothScroll';
import StoryFieldMount from '@/components/visuals/StoryFieldMount';
import '@/styles/globals.css';
import '@/styles/motion.css';
import '@/styles/pages.css';
import '@/styles/network.css';
import '@/styles/journey.css';
import '@/styles/showcase.css';

// Geist for everything readable; its mono sibling only for figures and code-like labels.
const geist = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const SITE_URL = 'https://pranavarora.vercel.app';
const TITLE = 'Pranav Arora | Applied AI Scientist';
const DESCRIPTION =
  'Applied AI Scientist at Inception42, a G42 company, researching, evaluating and deploying agentic AI systems from Abu Dhabi.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: 'Pranav Arora',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0A0C',
};

// Person schema so a search result carries the role and employer, not just the title tag.
const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pranav Arora',
  jobTitle: 'Applied AI Scientist',
  url: SITE_URL,
  worksFor: { '@type': 'Organization', name: 'Inception42, a G42 company' },
  address: { '@type': 'PostalAddress', addressLocality: 'Abu Dhabi', addressCountry: 'AE' },
  sameAs: ['https://github.com/Pranav63', 'https://www.linkedin.com/in/pranavarora63/'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
        <a className="skip-link" href="#main">Skip to content</a>
        <StoryFieldMount />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
