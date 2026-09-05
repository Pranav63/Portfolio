'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';

const LINKS = [
  ['Work', 'projects'],
  ['About', 'about'],
  ['Experience', 'experience'],
  ['Capabilities', 'skills'],
  ['Contact', 'contact'],
];

const CHAPTERS = [['Overview', 'hero'], ...LINKS];

export default function Navigation() {
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState('hero');
  const [progress, setProgress] = useState(0);

  // The active section comes from an IntersectionObserver rather than measuring
  // offsetTop for every section on every scroll event, which forced a synchronous
  // layout each time. Only the document height is measured, and only on resize.
  useEffect(() => {
    const sections = ['hero', ...LINKS.map(([, id]) => id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.intersectionRatio));
        let best = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { threshold: [0, .1, .25, .5, .75, 1], rootMargin: '-15% 0px -55% 0px' },
    );
    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let available = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let frame = 0;

    const read = () => {
      frame = 0;
      setCompact(window.scrollY > 36);
      setProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };
    const onResize = () => {
      available = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      onScroll();
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const goTo = (id) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    if (lenis) lenis.scrollTo(target);
    else target.scrollIntoView();
  };

  return (
    <>
      <motion.header className={`site-header${compact ? ' is-compact' : ''}`} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
      <button className="brand" type="button" onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo(0, 0))}>
        <strong>Pranav Arora</strong><span>Applied AI Scientist</span>
      </button>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {LINKS.map(([label, id]) => (
          <button className={active === id ? 'is-active' : ''} key={id} type="button" onClick={() => goTo(id)}>
            {label}
          </button>
        ))}
      </nav>

      <a className="nav-resume" href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
      <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation"><span /><span /></button>
      <span className="site-progress" aria-hidden="true" style={{ transform: `scaleX(${progress / 100})` }} />

      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} aria-label="Mobile navigation">
            {LINKS.map(([label, id]) => <button className={active === id ? 'is-active' : ''} key={id} type="button" onClick={() => goTo(id)}>{label}</button>)}
            <a href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
          </motion.nav>
        )}
      </AnimatePresence>
      </motion.header>

      <nav className="chapter-rail" aria-label="Page chapters">
        <span className="chapter-rail-label">Index</span>
        {CHAPTERS.map(([label, id], index) => (
          <button
            type="button"
            className={active === id ? 'is-active' : ''}
            key={id}
            onClick={() => goTo(id)}
            aria-current={active === id ? 'location' : undefined}
            aria-label={'Go to ' + label}
          >
            <span>{String(index).padStart(2, '0')}</span>
            <i />
            <strong>{label}</strong>
          </button>
        ))}
      </nav>
    </>
  );
}
