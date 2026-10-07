import type {VercelRequest} from '@vercel/node';
import {Resend} from 'resend';

export const MAX_BODY_BYTES = 8_000;

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

export function rateLimited(key: string): boolean {
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

export function clientKey(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return (first ?? req.socket?.remoteAddress ?? 'unknown').trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function textOf(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function panel(title: string, rows: Array<[string, string]>, body: {label: string; value: string}) {
  const text = [...rows.map(([label, value]) => `${label}: ${value}`), '', body.label, body.value].join('\n');

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#06182c">',
    `<h2 style="margin:0 0 16px;font-size:17px">${escapeHtml(title)}</h2>`,
    '<table style="border-collapse:collapse;margin-bottom:20px">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#4e5358">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 0;font-weight:600">${escapeHtml(value)}</td></tr>`
    ),
    '</table>',
    `<div style="color:#4e5358;font-size:13px;margin-bottom:6px">${escapeHtml(body.label)}</div>`,
    `<div style="white-space:pre-wrap;border-left:3px solid #7ab300;padding-left:14px">${escapeHtml(body.value)}</div>`,
    '</div>'
  ].join('');

  return {text, html};
}

export type Outgoing = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export type SendResult = {
  ok: boolean;
  id: string | null;
  status: number;
  message: string;
};

export async function sendMail(outgoing: Outgoing): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.error('RESEND_API_KEY is not set — nothing was sent.');
    return {
      ok: false,
      id: null,
      status: 500,
      message: 'Sending is not configured. Please use the phone number or email address on the page.'
    };
  }

  try {
    const resend = new Resend(key);
    const {data, error} = await resend.emails.send({
      from: outgoing.from,
      to: [outgoing.to],
      replyTo: outgoing.replyTo,
      subject: outgoing.subject,
      text: outgoing.text,
      html: outgoing.html
    });

    if (error) {
      console.error('Resend rejected the message:', error);
      return {ok: false, id: null, status: 502, message: 'That did not go through. Please try again, or call us.'};
    }

    return {ok: true, id: data?.id ?? null, status: 200, message: ''};
  } catch (cause) {
    console.error('Unexpected failure sending the message:', cause);
    return {ok: false, id: null, status: 500, message: 'That did not go through. Please try again, or call us.'};
  }
}
