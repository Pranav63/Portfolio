import { Inter } from 'next/font/google';
import SmoothScroll from '@/components/ui/SmoothScroll';
import '@/styles/globals.css';
import '@/styles/motion.css';

// Single typeface across every UI context, the way the reference system works:
// hierarchy comes from scale and tracking, not from weight.
const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Pranav Arora | Applied AI Scientist',
  description: 'Applied AI Scientist at Inception, a G42 company, researching, evaluating and deploying agentic AI systems from Abu Dhabi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head><meta name="color-scheme" content="dark" /></head>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
