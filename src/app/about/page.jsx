import Navigation from '@/components/ui/Navigation';
import PageFooter from '@/components/ui/PageFooter';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';

const title = 'About & Experience | Pranav Arora';
const description = 'From analytics and manufacturing in Singapore to applied AI in Abu Dhabi. Career, education, and engineering practice.';
export const metadata = { title, description, alternates: { canonical: '/about' }, openGraph: { title, description, url: '/about' }, twitter: { title, description } };

export default function AboutPage() {
  return <><Navigation /><main id="main" className="about-page"><header className="page-shell page-heading"><p className="section-label">Background & practice</p><h1>The work behind the work.</h1><p className="page-lead">Six years across analytics, manufacturing, enterprise software, and applied AI.</p></header><About full /><Experience /><Skills /></main><PageFooter /></>;
}
