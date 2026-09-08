import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import About from '@/components/sections/About';
import FieldNotes from '@/components/sections/FieldNotes';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/ui/Navigation';
import CityJourney from '@/components/sections/CityJourney';

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <Projects />
        <CityJourney />
        <About />
        <FieldNotes />
        <Contact />
      </main>
    </>
  );
}
