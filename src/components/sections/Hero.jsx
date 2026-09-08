export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-copy">
        <p className="hero-role"><span /> Applied AI Scientist at Inception42 · Abu Dhabi</p>
        <h1 className="hero-heading">Applied AI, held to a production <em>standard.</em></h1>
        <div className="hero-intro">
          <p>I&apos;m Pranav Arora. I build agentic AI, retrieval systems, and evaluation workflows, from experiments to production.</p>
          <div>
            <a className="primary-link" href="#projects">Explore my work <span>↓</span></a>
            <a className="quiet-link" href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer">View résumé (PDF) ↗</a>
          </div>
        </div>
        <div className="career-strip" aria-label="Career experience">
          <span>Experience across</span>
          <p>Inception42 <i>·</i> HPE <i>·</i> Micron <i>·</i> Dentsu</p>
        </div>
        </div>
      </div>
      <div className="hero-foot"><span>Singapore → Abu Dhabi</span><span className="hero-scroll-cue">Scroll to scatter <span aria-hidden="true">↓</span></span></div>
    </section>
  );
}
