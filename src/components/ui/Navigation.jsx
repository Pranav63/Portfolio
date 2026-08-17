'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LINKS = [
  ['Work', 'projects'],
  ['About', 'about'],
  ['Practice', 'practice'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState('hero');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      setCompact(window.scrollY > 36);
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 0);

      const marker = window.scrollY + window.innerHeight * 0.34;
      const sections = ['hero', ...LINKS.map(([, id]) => id)];
      let current = 'hero';
      sections.forEach((id) => {
        const node = document.getElementById(id);
        if (node && node.offsetTop <= marker) current = id;
      });
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header className={`site-header${compact ? ' is-compact' : ''}`} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
      <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
  );
}
