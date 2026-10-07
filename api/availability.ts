import type {VercelRequest, VercelResponse} from '@vercel/node';
import {everythingOpen, freeAcross, type AvailabilityReply} from '../src/lib/availability';
import {
  asInputValue,
  earliestDay,
  instantForUkWall,
  isBookable,
  latestDay,
  monthGrid,
  parseDay
} from '../src/lib/booking';
import {busyBetween, isConfigured} from '../src/server/google';

function monthOf(value: unknown): {year: number; month: number} | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  return {year, month: month - 1};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed.'});
  }

  const view = monthOf(req.query.month);
  if (!view) {
    return res.status(400).json({error: 'Pass month=YYYY-MM.'});
  }

  const days = monthGrid(view.year, view.month)
    .filter((day): day is Date => day !== null && isBookable(day))
    .map(asInputValue);

  if (days.length === 0) {
    const empty: AvailabilityReply = {live: isConfigured(), days: {}};
    return res.status(200).json(empty);
  }

  if (!isConfigured()) {
    const reply: AvailabilityReply = {live: false, days: everythingOpen(days)};
    return res.status(200).json(reply);
  }

  /* The window is the month's bookable span, widened to whole days so an event
     that starts before the first slot still registers against it. */
  const first = parseDay(days[0]);
  const last = parseDay(days[days.length - 1]);
  const from = instantForUkWall(days[0], '00:00') ?? first ?? earliestDay();
  const to = new Date((instantForUkWall(days[days.length - 1], '00:00') ?? last ?? latestDay()).getTime() + 86_400_000);

  try {
    const busy = await busyBetween(from, to);
    const reply: AvailabilityReply = {live: true, days: freeAcross(days, busy)};
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(reply);
  } catch (cause) {
    /* A calendar we cannot read must not silently become a calendar with
       nothing in it. The month still renders, but `live` is false and the page
       says the times are provisional. */
    console.error('Could not read the calendar:', cause);
    const reply: AvailabilityReply = {live: false, days: everythingOpen(days)};
    return res.status(200).json(reply);
  }
}
