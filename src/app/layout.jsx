import { Fraunces, Space_Grotesk, Space_Mono } from 'next/font/google';
import '@/styles/globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
});
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' });

export const metadata = {
  title: 'Pranav Arora',
  description: 'ML Engineer. Singapore to Abu Dhabi.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <head>
        {/* dark theme declared — stops Dark Reader from injecting and breaking hydration */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}