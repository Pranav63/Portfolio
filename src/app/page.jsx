import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import FieldNotes from '@/components/sections/FieldNotes';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/ui/Navigation';
import StoryFieldMount from '@/components/visuals/StoryFieldMount';

export default function Home() {
  return (
    <>
      <StoryFieldMount />
      <Navigation />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Skills />
        <FieldNotes />
        <Contact />
      </main>
    </>
  );
}
