import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload: { name?: string; email?: string; message?: string; honey?: string };
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, message, honey } = payload;

  if (honey) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
  }
  if (message.length > 5000) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message too long' }) };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('SMTP env vars are missing');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server is not configured.' }) };
  }

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to: CONTACT_TO || SMTP_USER,
      replyTo: `${name} <${email}>`,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('SMTP send error:', err);
    return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send email.' }) };
  }
};
