import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import ProductionLifecycle from '@/components/sections/ProductionLifecycle';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import FieldNotes from '@/components/sections/FieldNotes';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/ui/Navigation';

export default function Home() {
  return (
    <>
      <div className="page-noise" aria-hidden="true" />
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <About />
        <ProductionLifecycle />
        <Experience />
        <Skills />
        <FieldNotes />
        <Contact />
      </main>
    </>
  );
}
