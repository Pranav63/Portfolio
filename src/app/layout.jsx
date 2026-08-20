import { Fraunces, Space_Grotesk, Space_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import SmoothScroll from '@/components/ui/SmoothScroll';
import '@/styles/globals.css';
import '@/styles/motion.css';

const fraunces = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], variable: '--font-fraunces' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-plex-arabic' });

export const metadata = {
  title: 'Pranav Arora | Applied AI Scientist',
  description: 'Applied AI Scientist at Inception, a G42 company, researching, evaluating and deploying agentic AI systems from Abu Dhabi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${grotesk.variable} ${mono.variable} ${plexArabic.variable}`}>
      <head><meta name="color-scheme" content="dark" /></head>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
