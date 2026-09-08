'use client';

import { Component, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const CityJourneyScene = dynamic(() => import('@/components/visuals/CityJourneyScene'), { ssr: false });
const CHAPTERS = [
  { city: 'Singapore', label: '01 / The foundation', years: '2019 to 2026', title: 'Learning to build things that last.', description: 'From studying AI at SMU to shipping models and systems at Dentsu, Micron, and HPE.', detail: 'Analytics → manufacturing → enterprise AI' },
  { city: 'In motion', label: '02 / A new horizon', years: 'Singapore → Abu Dhabi', title: 'Same curiosity. A wider horizon.', description: 'Taking the lessons of production engineering into a new chapter of applied AI.', detail: 'Different city. The same commitment to useful AI.' },
  { city: 'Abu Dhabi', label: '03 / The next chapter', years: 'July 2026 to present', title: 'Building what comes next.', description: 'Applied AI Scientist at Inception42, working on agentic systems, evaluation, and governed AI workflows.', detail: 'Applied AI · evaluation · production' },
  { city: 'The UAE', label: '04 / Abu Dhabi · Dubai', years: 'A wider horizon', title: 'Beyond one skyline.', description: 'From Abu Dhabi’s waterfront to Dubai’s soaring architecture. A wider view of the Emirates, with my next chapter rooted in Abu Dhabi.', detail: 'Based in Abu Dhabi. Looking ahead.' },
];

const LANDMARKS = ['Marina Bay Sands · Gardens by the Bay', 'Across the Indian Ocean', 'Etihad Towers · Sheikh Zayed Grand Mosque', 'Burj Khalifa · Burj Al Arab · Dubai Frame'];

function CitySilhouette({ city }) {
  return <svg viewBox="0 0 600 260" className="journey-silhouette" aria-hidden="true">
    <path d="M0 232H600M0 243H600M0 254H600" stroke="currentColor" opacity=".15" />
    {city === 'Singapore' ? <>
      <path d="M35 230V155H69V230M80 230V118H116V230M124 230V170H154V230M450 230V143H478V230M490 230V97H524V230M538 230V152H570V230" fill="currentColor" opacity=".13" />
      {[190, 270, 350].map(x => <g key={x}><path d={`M${x} 230L${x+9} 76H${x+40}L${x+48} 230Z`} fill="currentColor" opacity=".22" /><path d={`M${x+15} 219V84M${x+25} 219V84M${x+35} 219V84`} stroke="currentColor" opacity=".55" /></g>)}
      <path d="M167 69Q282 86 421 55L404 80Q287 101 182 87Z" fill="currentColor" opacity=".8" />
      <path d="M93 230V190M70 168Q93 211 118 168M66 168H123M510 230V181M483 154Q510 204 539 154M479 154H543" fill="none" stroke="currentColor" opacity=".6" />
    </> : city === 'The UAE' ? <>
      <path d="M82 230V139H98V230M112 230V116H129V230M143 230V150H161V230M186 230V169H216V230" fill="currentColor" opacity=".28" />
      <path d="M275 230V156H287V111H296V76H303V47H309V15H313V47H318V76H326V111H336V156H349V230Z" fill="currentColor" opacity=".55" />
      <path d="M416 230V107Q493 144 470 230ZM416 122V230M414 166H456M414 190H467M414 214H472" fill="none" stroke="currentColor" strokeWidth="3" opacity=".65" />
      <path d="M520 230V160H568V230M526 230V167H562V230" fill="none" stroke="currentColor" strokeWidth="3" opacity=".4" />
    </> : <>
      <path d="M36 230V184H100V230M44 184Q68 133 92 184M477 230V148H504V230M518 230V178H553V230" fill="currentColor" opacity=".22" />
      {[[153,105,32],[220,42,37],[294,70,38],[371,98,34],[429,140,28]].map(([x,y,w]) => <g key={x}><path d={`M${x-12} 230Q${x-2} 155 ${x} ${y+7}L${x+w} ${y}Q${x+w+2} 157 ${x+w+10} 230Z`} fill="currentColor" opacity=".26" /><path d={`M${x+8} 224L${x+9} ${y+15}M${x+23} 224L${x+23} ${y+12}`} stroke="currentColor" opacity=".6" /></g>)}
    </>}
  </svg>;
}

class JourneyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function CityJourney() {
  const section = useRef(null);
  const progress = useRef(0);
  const progressBar = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const fail = useCallback(() => { setEnhanced(false); setReady(false); }, []);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = matchMedia('(max-width: 760px)');
    const short = matchMedia('(max-height: 650px)');
    let webgl;
    const preference = () => {
      setCompact(mobile.matches);
      if (motion.matches || short.matches || navigator.hardwareConcurrency <= 2 || navigator.deviceMemory < 4) { setEnhanced(false); return; }
      if (webgl === undefined) {
        try {
          const gl = document.createElement('canvas').getContext('webgl2');
          webgl = !!gl;
          gl?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch { webgl = false; }
      }
      setEnhanced(webgl);
    };
    const scroll = () => {
      const rect = section.current.getBoundingClientRect();
      const stageHeight = section.current.querySelector('.journey-sticky').offsetHeight;
      progress.current = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - stageHeight)));
      progressBar.current?.style.setProperty('transform', `scaleX(${progress.current})`);
      setChapter(progress.current < .28 ? 0 : progress.current < .57 ? 1 : progress.current < .83 ? 2 : 3);
      setVisible(rect.top < innerHeight && rect.bottom > 0 && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNearby(true); }, { rootMargin: '700px' });
    observer.observe(section.current);
    const resize = new ResizeObserver(scroll);
    resize.observe(section.current);
    preference(); scroll();
    motion.addEventListener('change', preference); mobile.addEventListener('change', preference); short.addEventListener('change', preference);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll); document.addEventListener('visibilitychange', scroll);
    return () => {
      observer.disconnect(); resize.disconnect(); motion.removeEventListener('change', preference); mobile.removeEventListener('change', preference); short.removeEventListener('change', preference);
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); document.removeEventListener('visibilitychange', scroll);
    };
  }, []);

  return <section id="journey" ref={section} className="city-journey" data-enhanced={enhanced} data-chapter={chapter} aria-labelledby="journey-title">
    <div className="journey-sticky">
      <div className="journey-scene" data-ready={ready} aria-hidden="true">
        <div className="journey-scene-fallback"><CitySilhouette city={CHAPTERS[chapter].city} /></div>
        {enhanced && nearby && <JourneyBoundary onFailure={fail}><CityJourneyScene progress={progress} compact={compact} visible={visible} onReady={onReady} onFailure={fail} /></JourneyBoundary>}
      </div>
      <div className="journey-shade" aria-hidden="true" />
      <header className="journey-heading"><h2 id="journey-title">New horizons. One trajectory.</h2><a href="#about">Skip to about <span aria-hidden="true">↗</span></a></header>
      <div className="journey-chapters">
        {CHAPTERS.map((item, i) => <article key={item.city} className="journey-chapter" data-active={chapter === i} aria-hidden={enhanced && chapter !== i ? true : undefined}>
          <p className="journey-eyebrow">{item.label}</p><h3>{item.city}<span>.</span></h3>
          <p className="journey-chapter-title">{item.title}</p><p className="journey-description">{item.description}</p>
          <div className="journey-milestone"><span>{item.years}</span><p>{item.detail}</p></div>
          <p className="journey-landmarks">{LANDMARKS[i]}</p>
          <div className="journey-static-art">{i !== 1 && <CitySilhouette city={item.city} />}</div>
        </article>)}
      </div>
      <div className="journey-footer" aria-hidden="true"><span>Scroll to travel <span>↓</span></span><div className="journey-route"><span>Singapore</span><div><i ref={progressBar} /></div><span>UAE</span></div><span>0{chapter + 1} / 04</span></div>
    </div>
  </section>;
}
