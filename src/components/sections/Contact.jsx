'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Waypoint from './Waypoint';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SOCIAL = [
  { icon: FaEnvelope, label: 'pranav2vis@gmail.com',           sub: 'Email',    href: 'mailto:pranav2vis@gmail.com' },
  { icon: FaLinkedin, label: 'linkedin.com/in/pranavarora63',  sub: 'LinkedIn', href: 'https://www.linkedin.com/in/pranavarora63/' },
  { icon: FaGithub,   label: 'github.com/Pranav63',            sub: 'GitHub',   href: 'https://github.com/Pranav63' },
];

const INPUT_STYLE = {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--gold)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.88rem',
  width: '100%',
  caretColor: 'var(--gold)',
};

const LABEL_STYLE = {
  color: 'var(--text-muted)',
  fontSize: '0.82rem',
  fontFamily: 'var(--font-mono)',
  minWidth: '72px',
  userSelect: 'none',
  flexShrink: 0,
};

const LINE_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 20px',
  borderBottom: '1px solid var(--gold-faint)',
};

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-waypoint" ref={ref}>
      <div className="section-scrim" style={{
        background: 'linear-gradient(to bottom, transparent, rgba(9,12,24,0.85) 15%, rgba(9,12,24,0.92) 50%, rgba(9,12,24,0.85) 85%, transparent)',
      }} />

      <div className="section-inner">
        <Waypoint id="06" time="23:10" phase="Campfire" inView={inView} />

        <motion.h2
          className="section-title"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={1}
        >
          Pull up to <em>the fire</em>
        </motion.h2>

        <motion.p
          className="section-lede"
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={2}
        >
          The sun set somewhere around the experience section. If you are hiring
          for applied AI in the UAE, or have a production AI problem worth
          talking about, this is the place.
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}>
          {/* social links */}
          <motion.div
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={3}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {SOCIAL.map(({ icon: Icon, label, sub, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel"
                whileHover={{ x: 6, borderColor: 'rgba(201,168,76,0.4)' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 22px',
                  textDecoration: 'none',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--gold-faint)',
                  border: '1px solid var(--gold-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon style={{ color: 'var(--gold)', fontSize: '1rem' }} aria-hidden="true" />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}>
                    {sub}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {label}
                  </div>
                </div>
              </motion.a>
            ))}

            {/* availability */}
            <motion.div
              className="panel"
              variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={4}
              style={{ padding: '18px 22px', marginTop: '8px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#27C93F',
                  boxShadow: '0 0 10px rgba(39,201,63,0.6)',
                  flexShrink: 0,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#27C93F',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  Available for UAE roles
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Relocating to Abu Dhabi. Open to Applied AI, ML Engineering and
                Research Engineering roles.
              </p>
            </motion.div>
          </motion.div>

          {/* terminal form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'} custom={5}
            className="terminal"
          >
            <div className="terminal-bar">
              <div className="terminal-dot" style={{ background: '#FF5F56' }} />
              <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
              <div className="terminal-dot" style={{ background: '#27C93F' }} />
              <span style={{
                marginLeft: '10px',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}>
                contact.sh
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.65rem',
                color: 'var(--gold-dim)',
                fontFamily: 'var(--font-mono)',
              }}>
                pranav@campfire ~
              </span>
            </div>

            <div style={LINE_STYLE}>
              <label htmlFor="c-name" style={LABEL_STYLE}>$ name</label>
              <input
                id="c-name"
                required
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Your name"
                style={INPUT_STYLE}
              />
            </div>
            <div style={LINE_STYLE}>
              <label htmlFor="c-email" style={LABEL_STYLE}>$ email</label>
              <input
                id="c-email"
                required
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.com"
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ ...LINE_STYLE, alignItems: 'flex-start', borderBottom: 'none' }}>
              <label htmlFor="c-msg" style={{ ...LABEL_STYLE, paddingTop: '2px' }}>$ msg</label>
              <textarea
                id="c-msg"
                required
                rows={5}
                value={form.message}
                onChange={set('message')}
                placeholder="Your message..."
                style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.7 }}
              />
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--gold-faint)' }}>
              {sent ? (
                <div
                  role="status"
                  style={{
                    textAlign: 'center',
                    color: '#27C93F',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    padding: '10px 0',
                  }}
                >
                  Message sent. I will get back to you soon.
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-solid"
                    style={{
                      width: '100%',
                      padding: '12px',
                      opacity: sending ? 0.6 : 1,
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? 'Sending...' : 'Send message'}
                  </button>
                  {error && (
                    <p
                      role="alert"
                      style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        fontSize: '0.78rem',
                        color: '#FF5F56',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Send failed. Email me directly at pranav2vis@gmail.com
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}