'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState('');
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const isHome = pathname === '/';
  const links = [
    { label: 'Work', href: '/#projects', id: 'projects', current: pathname.startsWith('/work/') },
    { label: 'About', href: '/about', id: 'about', current: pathname === '/about' },
    { label: 'Writing', href: '/writing', id: 'notes', current: pathname.startsWith('/writing') },
    { label: 'Contact', href: '/#contact', id: 'contact', current: false },
  ];

  useEffect(() => {
    setOpen(false);
    const onScroll = () => {
      setCompact(window.scrollY > 36);
      if (!isHome) return;
      setActive(['hero', 'projects', 'about', 'notes', 'contact'].filter(id => document.getElementById(id)?.getBoundingClientRect().top <= 160).at(-1) || 'hero');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, isHome]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 861px)');
    const onDesktop = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      const link = nav?.querySelector('.is-active');
      setIndicator(link ? { left: link.offsetLeft, width: link.offsetWidth } : { left: 0, width: 0 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [active, pathname]);

  const renderLinks = () => links.map(link => {
    const current = isHome ? active === link.id : link.current;
    return <Link key={link.id} href={link.href} className={current ? 'is-active' : undefined} aria-current={current ? (isHome ? 'location' : 'page') : undefined} onClick={() => setOpen(false)}>{link.label}</Link>;
  });

  return (
    <header className={'site-header' + (compact || !isHome ? ' is-compact' : '')}>
      <Link className="brand" href="/" onClick={() => setOpen(false)}><strong>Pranav Arora</strong><span>Applied AI Scientist</span></Link>
      <nav ref={navRef} className="desktop-nav" aria-label="Primary navigation">{renderLinks()}<span className="nav-active-line" style={{ width: indicator.width, transform: `translateX(${indicator.left}px)`, opacity: indicator.width ? 1 : 0 }} aria-hidden="true" /></nav>
      <a className="nav-resume" href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
      <button ref={toggleRef} className="menu-toggle" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}><span /><span /></button>
      {open && <nav ref={menuRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== toggleRef.current) setOpen(false); }}>{renderLinks()}<a href="/Pranav_Arora.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Résumé (PDF) ↗</a></nav>}
    </header>
  );
}
