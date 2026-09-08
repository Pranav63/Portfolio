'use client';

import { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SOCIAL } from '@/data/portfolio';

const ICONS = { github: FaGithub, linkedin: FaLinkedin };
const EMAIL = SOCIAL.find((item) => item.icon === 'mail').href.replace('mailto:', '');

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState('');
  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (state !== 'sending') setState('idle');
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyState('Email copied');
    } catch {
      setCopyState('Select the email address to copy it, or open the email link.');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setState('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/sendEmail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), signal: controller.signal });
      if (!response.ok) {
        const message = response.status === 429 ? 'Too many messages. Please try again later or use the email link.' : response.status === 400 ? 'Please check your name, email, and message, then try again.' : 'Your message could not be sent. Please try again or use the email link.';
        throw new Error(message);
      }
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Sending took too long. Your message is still here; please try again or email directly.' : err.message === 'Failed to fetch' ? 'Connection failed. Your message is still here; please try again or email directly.' : err.message);
      setState('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="page-shell contact-grid">
        <div className="contact-copy">
          <p className="section-label">Contact</p>
          <h2>Let&apos;s talk applied AI.</h2>
          <p>Have a research question, an engineering challenge, or a collaboration in mind? Tell me a little about it.</p>
          <a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL} ↗</a>
          <button className="copy-email" type="button" onClick={copyEmail}>Copy email</button>
          <p className="copy-status" role="status">{copyState}</p>
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

        <form className="contact-form" onSubmit={submit} aria-busy={state === 'sending'}>
          <label><span>Name</span><input required maxLength={120} disabled={state === 'sending'} name="name" autoComplete="name" value={form.name} onChange={update('name')} placeholder="Your name" /></label>
          <label><span>Email</span><input required maxLength={254} disabled={state === 'sending'} type="email" name="email" autoComplete="email" spellCheck={false} value={form.email} onChange={update('email')} placeholder="you@company.com" /></label>
          <label><span>Message</span><textarea required maxLength={5000} disabled={state === 'sending'} rows={5} name="message" value={form.message} onChange={update('message')} placeholder="What are you working on?" /></label>
          <button className="submit-button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'} <span>↗</span></button>
          {state === 'sent' && <p className="form-state success" role="status">Thanks, I&apos;ll get back to you soon.</p>}
          {state === 'error' && <p className="form-state error" role="alert">{error}</p>}
        </form>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Pranav Arora</span>
        <span>Applied AI Scientist · Abu Dhabi</span>
        <a
          href="#hero"
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
