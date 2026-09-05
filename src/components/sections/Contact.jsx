'use client';

import { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useLenis } from 'lenis/react';
import { SOCIAL } from '@/data/portfolio';

const ICONS = { github: FaGithub, linkedin: FaLinkedin };
const EMAIL = SOCIAL.find((item) => item.icon === 'mail').href.replace('mailto:', '');

export default function Contact() {
  const lenis = useLenis();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState('idle');
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setState('sending');
    try {
      const response = await fetch('/api/sendEmail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Unable to send');
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setState('error');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="page-shell contact-grid">
        <div className="contact-copy">
          <p className="section-label">Contact</p>
          <h2>Have something worth thinking through?</h2>
          <p>I&apos;m always open to a thoughtful conversation about applied AI, reliable systems or difficult engineering problems.</p>
          <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL} ↗</a>
          <div className="social-links">
            {SOCIAL.filter((item) => ICONS[item.icon]).map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                  <Icon aria-hidden="true" /> {item.label}
                </a>
              );
            })}
          </div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <label><span>Name</span><input required name="name" autoComplete="name" value={form.name} onChange={update('name')} placeholder="Your name" /></label>
          <label><span>Email</span><input required type="email" name="email" autoComplete="email" spellCheck={false} value={form.email} onChange={update('email')} placeholder="you@company.com" /></label>
          <label><span>Message</span><textarea required rows={5} name="message" value={form.message} onChange={update('message')} placeholder="What are you working on?" /></label>
          <button className="submit-button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'} <span>↗</span></button>
          {state === 'sent' && <p className="form-state success" role="status">Thanks, I&apos;ll get back to you soon.</p>}
          {state === 'error' && <p className="form-state error" role="alert">That did not send. Please use the email link instead.</p>}
        </form>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Pranav Arora</span>
        <span>Applied AI Scientist · Abu Dhabi</span>
        <a
          href="#hero"
          onClick={(event) => {
            if (!lenis) return;
            event.preventDefault();
            lenis.scrollTo(0);
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
