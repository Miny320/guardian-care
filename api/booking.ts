import type {VercelRequest, VercelResponse} from '@vercel/node';
import {
  formatDay,
  instantForUkWall,
  ukClockName,
  modeLabel,
  problems,
  roleLabel,
  slotRange,
  type Booking
} from '../src/lib/booking';
import {
  MAX_BODY_BYTES,
  clientKey,
  panel,
  rateLimited,
  sendMail,
  textOf
} from '../src/server/mail';

const FROM = process.env.ENQUIRY_FROM ?? 'Guardian Care <onboarding@resend.dev>';
const TO = process.env.ENQUIRY_TO ?? 'Greenguardiansolar@gmail.com';

function asBooking(body: unknown): Booking {
  const raw = (body ?? {}) as Record<string, unknown>;

  return {
    name: textOf(raw.name),
    email: textOf(raw.email),
    phone: textOf(raw.phone),
    role: textOf(raw.role),
    mode: textOf(raw.mode),
    day: textOf(raw.day),
    slot: textOf(raw.slot),
    topic: textOf(raw.topic)
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed.'});
  }

  const size = Number(req.headers['content-length'] ?? 0);
  if (size > MAX_BODY_BYTES) {
    return res.status(413).json({error: 'That message is too long to send.'});
  }

  if (rateLimited(clientKey(req))) {
    return res.status(429).json({error: 'Too many requests just now. Please try again in a minute.'});
  }

  const booking = asBooking(req.body);
  const found = problems(booking);
  if (Object.keys(found).length > 0) {
    return res.status(400).json({error: 'Some of these need another look.', fields: found});
  }

  const at = instantForUkWall(booking.day, booking.slot);
  const zone = ukClockName(at ?? new Date());
  const when = `${formatDay(booking.day)}, ${slotRange(booking.slot)} ${zone}`;
  const {text, html} = panel(
    'Interview request from the Guardian Care site',
    [
      ['Requested', when],
      ['Format', modeLabel(booking.mode)],
      ['Name', booking.name],
      ['Email', booking.email],
      ['Phone', booking.phone],
      ['They are', roleLabel(booking.role)]
    ],
    {label: 'What they would like to cover', value: booking.topic || 'Not stated'}
  );

  const result = await sendMail({
    from: FROM,
    to: TO,
    replyTo: booking.email,
    subject: `Interview request — ${booking.name}, ${when}`,
    text,
    html
  });

  if (result.ok) {
    return res.status(200).json({id: result.id});
  }

  return res.status(result.status).json({error: result.message});
}
