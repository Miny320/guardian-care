import {validEmail, validMobile} from './validate';

export type Channel = 'email' | 'sms';

export type Row = [label: string, value: string, note?: string];

export type Summary = {
  subject: string;
  intro: string;
  rows: Row[];
  notes: string[];
  action: string;
  sms: string;
};

export type Delivery = {channel: Channel; to: string; summary: Summary};

export const PENDING_NOTE =
  'Delivery is not connected yet — this shows you exactly what will arrive once it is.';

export function validFor(channel: Channel, value: string): boolean {
  return channel === 'email' ? validEmail(value) : validMobile(value);
}

const GSM_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';

const GSM_EXTENDED = '^{}\\[~]|€';

export function segments(text: string): number {
  if (text.length === 0) return 0;

  let septets = 0;
  for (const character of text) {
    if (GSM_BASIC.includes(character)) septets += 1;
    else if (GSM_EXTENDED.includes(character)) septets += 2;
    else return text.length <= 70 ? 1 : Math.ceil(text.length / 67);
  }

  return septets <= 160 ? 1 : Math.ceil(septets / 153);
}

export function plain(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/[\u2022\u00B7]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2248/g, '~')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const FAKE_LATENCY_MS = 900;

export async function sendSummary(delivery: Delivery): Promise<void> {
  if (!validFor(delivery.channel, delivery.to)) {
    throw new Error(
      delivery.channel === 'email'
        ? 'That does not look like an email address.'
        : 'That does not look like a UK mobile number.'
    );
  }

  await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));

  if (import.meta.env.DEV) {
    console.info('[deliver] not connected — would have sent:', delivery);
  }
}
