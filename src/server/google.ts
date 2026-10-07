import {createSign} from 'node:crypto';
import type {Busy} from '../lib/availability';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FREEBUSY_URL = 'https://www.googleapis.com/calendar/v3/freeBusy';
const SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

export function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? '';
}

export function isConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_KEY && calendarId());
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Private keys arrive from environment variables with their newlines escaped,
 * because a PEM pasted into a settings box loses them otherwise. Both forms are
 * accepted so it works however it was pasted.
 */
function privateKey(): string {
  return (process.env.GOOGLE_SA_KEY ?? '').replace(/\\n/g, '\n').trim();
}

/**
 * A service-account access token, signed here rather than by the Google SDK.
 *
 * `googleapis` is tens of megabytes for what is, on this path, one signed
 * assertion and two HTTPS calls — and every byte of it is cold-start cost on a
 * function that runs when somebody opens a booking page.
 *
 * `sub` decides which of the two setups this is, and getting it wrong fails in
 * opposite directions.
 *
 * With Workspace, an admin grants domain-wide delegation and `sub` names the
 * account to act as. Omit it there and the service account authenticates as
 * itself, owning no calendar — which returns an empty busy list rather than an
 * error, so the diary looks free.
 *
 * A personal Gmail has no admin console and so no delegation. Instead the owner
 * shares the calendar with the service account's own address, and `sub` must be
 * absent: ask to impersonate without the authority and Google refuses the token
 * outright.
 *
 * So it is set only when GOOGLE_SA_SUBJECT is, and that variable is the single
 * switch between the two arrangements.
 */
let cached: {token: string; expires: number} | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;

  const issued = Math.floor(Date.now() / 1000);
  const subject = process.env.GOOGLE_SA_SUBJECT?.trim();
  const claims = {
    iss: process.env.GOOGLE_SA_EMAIL,
    ...(subject ? {sub: subject} : {}),
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: issued,
    exp: issued + 3600
  };

  const unsigned = `${base64url(JSON.stringify({alg: 'RS256', typ: 'JWT'}))}.${base64url(JSON.stringify(claims))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const assertion = `${unsigned}.${base64url(signer.sign(privateKey()))}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Google refused the service account (${response.status}): ${await response.text()}`);
  }

  const body = (await response.json()) as {access_token?: string; expires_in?: number};
  if (!body.access_token) throw new Error('Google returned no access token.');

  cached = {
    token: body.access_token,
    expires: Date.now() + (body.expires_in ?? 3600) * 1000
  };

  return cached.token;
}

/** Everything already in the diary between two instants. */
export async function busyBetween(from: Date, to: Date): Promise<Busy[]> {
  const token = await accessToken();

  const response = await fetch(FREEBUSY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      items: [{id: calendarId()}]
    })
  });

  if (!response.ok) {
    throw new Error(`freeBusy failed (${response.status}): ${await response.text()}`);
  }

  const body = (await response.json()) as {
    calendars?: Record<string, {busy?: Busy[]; errors?: Array<{reason: string}>}>;
  };

  const calendar = body.calendars?.[calendarId()];

  if (calendar?.errors?.length) {
    throw new Error(`freeBusy rejected the calendar: ${calendar.errors.map((e) => e.reason).join(', ')}`);
  }

  return calendar?.busy ?? [];
}
