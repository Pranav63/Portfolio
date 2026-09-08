import Link from 'next/link';
import Image from 'next/image';

export default function About({ full = false }) {
  return (
    <section id="about" className="about-section">
      <div className="page-shell about-grid">
        <div>{full && <Image className="about-portrait" src="/pranav-portrait.png" alt="Pranav Arora" width={271} height={279} sizes="160px" />}<p className="section-label">About me</p><h2>From factory floors to applied AI.</h2></div>
        <div className="about-story">
          <p>I started in analytics at Dentsu, worked on manufacturing systems at Micron, and built enterprise AI at Hewlett Packard Enterprise. Today I&apos;m an Applied AI Scientist at Inception42 in Abu Dhabi.</p>
          <p>That path shapes how I work: understand the operating problem, build a measurable experiment, and make the result usable by the people who depend on it.</p>
          {full ? <p className="about-note">Moving from Singapore to Abu Dhabi opened a new chapter: agentic systems, bilingual workflows, and the evaluation needed to put them into use.</p> : <Link className="text-link" href="/about">My background & experience <span aria-hidden="true">↗</span></Link>}
        </div>
      </div>
    </section>
  );
}
