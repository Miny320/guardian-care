import type {VercelRequest, VercelResponse} from '@vercel/node';
import {Resend} from 'resend';
import {CONTACT} from '../src/data/contact';
import {ROLES, problems, type Enquiry} from '../src/lib/enquiry';

const FROM = process.env.ENQUIRY_FROM ?? 'Guardian Care <onboarding@resend.dev>';
const TO = process.env.ENQUIRY_TO ?? CONTACT.email;

const MAX_BODY_BYTES = 8_000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5_000) {
    for (const [id, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(id);
    }
  }

  return false;
}

function clientKey(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return (first ?? req.socket?.remoteAddress ?? 'unknown').trim();
}

function asEnquiry(body: unknown): Enquiry {
  const raw = (body ?? {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

  return {
    name: text(raw.name),
    email: text(raw.email),
    phone: text(raw.phone),
    role: text(raw.role),
    message: text(raw.message)
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(enquiry: Enquiry, roleLabel: string) {
  const rows: Array<[string, string]> = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Role', roleLabel]
  ];

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    enquiry.message
  ].join('\n');

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#06182c">',
    '<h2 style="margin:0 0 16px;font-size:17px">New enquiry from the Guardian Care site</h2>',
    '<table style="border-collapse:collapse;margin-bottom:20px">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#4e5358">${label}</td>` +
        `<td style="padding:4px 0;font-weight:600">${escapeHtml(value)}</td></tr>`
    ),
    '</table>',
    `<div style="white-space:pre-wrap;border-left:3px solid #7ab300;padding-left:14px">${escapeHtml(enquiry.message)}</div>`,
    '</div>'
  ].join('');

  return {text, html};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed.'});
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY is not set — the enquiry was not sent.');
    return res.status(500).json({error: 'Sending is not configured. Please use the phone number or email address on the page.'});
  }

  const size = Number(req.headers['content-length'] ?? 0);
  if (size > MAX_BODY_BYTES) {
    return res.status(413).json({error: 'That message is too long to send.'});
  }

  if (rateLimited(clientKey(req))) {
    return res.status(429).json({error: 'Too many messages just now. Please try again in a minute.'});
  }

  const enquiry = asEnquiry(req.body);
  const found = problems(enquiry);
  if (Object.keys(found).length > 0) {
    return res.status(400).json({error: 'Some of these need another look.', fields: found});
  }

  const roleLabel = ROLES.find((role) => role.value === enquiry.role)?.label ?? enquiry.role;
  const {text, html} = render(enquiry, roleLabel);

  try {
    const resend = new Resend(key);
    const {data, error} = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: enquiry.email,
      subject: `Guardian Care enquiry — ${enquiry.name} (${roleLabel})`,
      text,
      html
    });

    if (error) {
      console.error('Resend rejected the enquiry:', error);
      return res.status(502).json({error: 'That did not go through. Please try again, or call us.'});
    }

    return res.status(200).json({id: data?.id ?? null});
  } catch (cause) {
    console.error('Unexpected failure sending the enquiry:', cause);
    return res.status(500).json({error: 'That did not go through. Please try again, or call us.'});
  }
}
