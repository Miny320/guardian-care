import {MEETING_MINUTES, SLOTS, instantForUkWall, isBookable, parseDay} from './booking';

export type Busy = {start: string; end: string};

/** Day value -> the start times still open on it. */
export type Availability = Record<string, string[]>;

export type AvailabilityReply = {
  /** False when no calendar is connected, so the UI can stop promising. */
  live: boolean;
  days: Availability;
};

function overlaps(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

/**
 * The slots on one day that nothing in `busy` runs across.
 *
 * Busy periods are instants, not wall times, so a meeting entered in another
 * timezone still blocks the right slot here. A slot is taken when the two
 * overlap at all — touching at an edge does not count, so a 09:00–09:30 event
 * leaves 09:30 open rather than swallowing it.
 */
export function freeSlots(dayValue: string, busy: Busy[]): string[] {
  const day = parseDay(dayValue);
  if (!day || !isBookable(day)) return [];

  const periods = busy
    .map((period) => ({
      start: Date.parse(period.start),
      end: Date.parse(period.end)
    }))
    .filter((period) => Number.isFinite(period.start) && Number.isFinite(period.end));

  return SLOTS.filter((slot) => {
    const begins = instantForUkWall(dayValue, slot.value);
    if (!begins) return false;

    const from = begins.getTime();
    const to = from + MEETING_MINUTES * 60000;

    return !periods.some((period) => overlaps(from, to, period.start, period.end));
  }).map((slot) => slot.value);
}

/** Every bookable day in the range, with whatever is left open on each. */
export function freeAcross(days: string[], busy: Busy[]): Availability {
  const out: Availability = {};
  for (const day of days) out[day] = freeSlots(day, busy);
  return out;
}

/** Nothing connected: every bookable slot is offered, and `live` says so. */
export function everythingOpen(days: string[]): Availability {
  return freeAcross(days, []);
}
