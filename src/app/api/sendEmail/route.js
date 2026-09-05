import nodemailer from 'nodemailer';

// Submissions are interpolated into an HTML email, so every value is escaped at
// the boundary. Without this, anything pasted into the form renders as markup
// in the inbox, which is a phishing vector aimed at the one person who reads it.
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const MAX_LENGTHS = { name: 120, email: 254, message: 5000 };
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// In-memory and therefore per-instance: enough to stop a script pointed at the
// endpoint from emptying itself into the mailbox, not a substitute for a real
// limiter if this ever moves off a single serverless region.
const hits = new Map();

function rateLimited(key) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 500) {
    for (const [id, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(id);
    }
  }
  return false;
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    for (const [field, limit] of Object.entries(MAX_LENGTHS)) {
      if (String({ name, email, message }[field]).length > limit) {
        return Response.json({ error: `${field} is too long` }, { status: 400 });
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (rateLimited(ip)) {
      return Response.json(
        { error: 'Too many messages from this address. Try again later or email directly.' },
        { status: 429 },
      );
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      message: escapeHtml(message),
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio message from ${String(name).replace(/[\r\n]/g, ' ').slice(0, 120)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 540px; color: #1a1a1a;">
          <div style="background: #090C18; padding: 24px 28px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #C9A84C; margin: 0; font-size: 1.1rem; letter-spacing: 0.05em;">
              NEW MESSAGE — PORTFOLIO
            </h2>
          </div>
          <div style="background: #f9f9f9; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 0.85rem; width: 80px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; font-size: 0.95rem;">${safe.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888; font-size: 0.85rem;">Email</td>
                <td style="padding: 8px 0; font-size: 0.95rem;">
                  <a href="mailto:${safe.email}" style="color: #C9A84C; text-decoration: none;">${safe.email}</a>
                </td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; font-size: 0.85rem; margin: 0 0 10px;">Message</p>
            <p style="line-height: 1.75; font-size: 0.95rem; margin: 0; white-space: pre-wrap;">${safe.message}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px;" />
            <p style="color: #bbb; font-size: 0.75rem; margin: 0;">
              Sent from pranavarora.vercel.app · Reply directly to this email to respond.
            </p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('sendEmail error:', err);
    return Response.json({ error: 'Failed to send' }, { status: 500 });
  }
}
