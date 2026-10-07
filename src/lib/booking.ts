import {ROLES} from './enquiry';
import {validEmail, validName, validTelephone} from './validate';

export {ROLES};

export type Booking = {
  name: string;
  email: string;
  phone: string;
  role: string;
  mode: string;
  day: string;
  slot: string;
  topic: string;
};

export type Field = keyof Booking;

export const MODES = [
  {value: 'phone', label: 'Phone call'},
  {value: 'video', label: 'Video call'},
  {value: 'site', label: 'Visit the property'}
] as const;

export const MEETING_MINUTES = 30;

export const DAY_OPENS = 9 * 60;
export const DAY_CLOSES = 17 * 60;

function clock(minutes: number): string {
  const hour = String(Math.floor(minutes / 60)).padStart(2, '0');
  const minute = String(minutes % 60).padStart(2, '0');
  return `${hour}:${minute}`;
}

/** Start times only, which is what a booking page shows. The length is stated once. */
function buildSlots() {
  const slots: Array<{value: string; label: string}> = [];
  for (let at = DAY_OPENS; at + MEETING_MINUTES <= DAY_CLOSES; at += MEETING_MINUTES) {
    slots.push({value: clock(at), label: clock(at)});
  }
  return slots;
}

export const SLOTS = buildSlots();

/** The full span, for places that must be unambiguous — the email, mostly. */
export function slotRange(value: string): string {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const start = Number(match[1]) * 60 + Number(match[2]);
  return `${clock(start)} – ${clock(start + MEETING_MINUTES)}`;
}

export const HORIZON_DAYS = 90;

export const EMPTY_BOOKING: Booking = {
  name: '',
  email: '',
  phone: '',
  role: '',
  mode: '',
  day: '',
  slot: '',
  topic: ''
};

export const COMPANY_TZ = 'Europe/London';

const UK_PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: COMPANY_TZ,
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});

function ukParts(at: Date) {
  const parts: Record<string, string> = {};
  for (const part of UK_PARTS.formatToParts(at)) parts[part.type] = part.value;

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute)
  };
}

/**
 * Minutes that UK wall-clock time is ahead of UTC at a given instant: 0 in
 * winter, 60 under British Summer Time.
 */
function ukOffsetMinutes(at: Date): number {
  const p = ukParts(at);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asIfUtc - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

/**
 * The instant at which a UK wall-clock time occurs.
 *
 * Offsets are resolved twice because the first pass has to guess: converting a
 * wall time needs the offset, and the offset depends on the instant you are
 * converting to. One correction settles it everywhere except the hour that
 * British Summer Time skips, which is 01:00–02:00 on a Sunday and outside
 * bookable hours anyway.
 */
export function instantForUkWall(dayValue: string, slotValue: string): Date | null {
  const day = parseDay(dayValue);
  const time = /^(\d{2}):(\d{2})$/.exec(slotValue);
  if (!day || !time) return null;

  const year = day.getFullYear();
  const month = day.getMonth();
  const date = day.getDate();
  const hour = Number(time[1]);
  const minute = Number(time[2]);
  const wall = Date.UTC(year, month, date, hour, minute);

  let instant = new Date(wall);
  for (let pass = 0; pass < 2; pass += 1) {
    instant = new Date(wall - ukOffsetMinutes(instant) * 60000);
  }

  return instant;
}

/** "GMT" or "BST", whichever applies on the day in question. */
export function ukClockName(at: Date = new Date()): string {
  return ukOffsetMinutes(at) === 0 ? 'GMT' : 'BST';
}

/**
 * Today, as the company reckons it.
 *
 * Built from UK calendar parts rather than the visitor's clock. Without this a
 * visitor in Auckland — thirteen hours ahead — would be offered a day that has
 * not started in London yet, or refused one that is still open.
 */
export function todayInCompanyTZ(now: Date = new Date()): Date {
  const p = ukParts(now);
  return new Date(p.year, p.month - 1, p.day);
}

export function viewerTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? COMPANY_TZ;
  } catch {
    return COMPANY_TZ;
  }
}

/**
 * The same hour on the viewer's own clock, when that differs from ours.
 * Returns null for anybody already on UK time, who does not need telling.
 */
export function viewerEquivalent(dayValue: string, slotValue: string): string | null {
  if (viewerTimeZone() === COMPANY_TZ) return null;

  const start = instantForUkWall(dayValue, slotValue);
  if (!start) return null;

  const end = new Date(start.getTime() + MEETING_MINUTES * 60000);
  const clock = (at: Date) =>
    at.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: false});

  const label = `${clock(start)} – ${clock(end)}`;
  return label === slotLabel(slotValue).replace(/\s/g, ' ') ? null : label;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Parsed as local time, deliberately. `new Date('2026-10-07')` is read as UTC
 * midnight, which lands on the previous day for anyone west of Greenwich — so a
 * booking made for tomorrow could validate as being in the past.
 */
export function parseDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return startOfDay(date);
}

export function formatDay(value: string): string {
  const date = parseDay(value);
  if (!date) return value;

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** The soonest day we will take, which is the next working day. */
export function earliestDay(from: Date = new Date()): Date {
  const date = todayInCompanyTZ(from);
  date.setDate(date.getDate() + 1);
  while (isWeekend(date)) date.setDate(date.getDate() + 1);
  return date;
}

export function latestDay(from: Date = new Date()): Date {
  const date = todayInCompanyTZ(from);
  date.setDate(date.getDate() + HORIZON_DAYS);
  return date;
}

export function asInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isBookable(date: Date, now: Date = new Date()): boolean {
  const day = startOfDay(date);
  if (isWeekend(day)) return false;
  if (day < earliestDay(now)) return false;
  if (day > latestDay(now)) return false;
  return true;
}

export function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/**
 * A month as calendar cells, weeks starting Monday. Padding cells are null so
 * the grid keeps its shape without inventing days from the adjacent months.
 */
export function monthGrid(year: number, month: number): Array<Date | null> {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = Array.from({length: lead}, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-GB', {month: 'long', year: 'numeric'});
}

/** Whichever month the first bookable day falls in — where the calendar opens. */
export function openingMonth(now: Date = new Date()): {year: number; month: number} {
  const first = earliestDay(now);
  return {year: first.getFullYear(), month: first.getMonth()};
}

export function monthHasBookableDays(year: number, month: number, now: Date = new Date()): boolean {
  return monthGrid(year, month).some((day) => day !== null && isBookable(day, now));
}

export function slotLabel(value: string): string {
  return SLOTS.find((slot) => slot.value === value)?.label ?? value;
}

export function modeLabel(value: string): string {
  return MODES.find((mode) => mode.value === value)?.label ?? value;
}

export function roleLabel(value: string): string {
  return ROLES.find((role) => role.value === value)?.label ?? value;
}

export function problems(booking: Booking, now: Date = new Date()): Partial<Record<Field, string>> {
  const found: Partial<Record<Field, string>> = {};

  if (!booking.name.trim()) found.name = 'Please tell us your name.';
  else if (!validName(booking.name)) found.name = 'That looks too short to be a name.';

  if (!booking.email.trim()) found.email = 'We need an email address to confirm to.';
  else if (!validEmail(booking.email))
    found.email = 'Check this address — it needs an @ and a domain, like you@company.com.';

  if (!booking.phone.trim()) found.phone = 'We need a number in case we have to move the time.';
  else if (!validTelephone(booking.phone))
    found.phone = 'Check this number. UK numbers start 01, 02, 03 or 07; international ones start with +.';

  if (booking.role && !ROLES.some((role) => role.value === booking.role)) {
    found.role = 'Pick one of the listed options.';
  }

  if (booking.mode && !MODES.some((mode) => mode.value === booking.mode)) {
    found.mode = 'Pick one of the listed options.';
  }

  const day = parseDay(booking.day);
  if (!booking.day.trim()) found.day = 'Pick a day that suits you.';
  else if (!day) found.day = 'That date did not read properly.';
  else if (isWeekend(day)) found.day = 'We meet Monday to Friday. Please pick a weekday.';
  else if (day < earliestDay(now)) found.day = 'Please give us at least one working day’s notice.';
  else if (day > latestDay(now)) found.day = 'Please pick a date within the next three months.';

  if (!booking.slot) found.slot = 'Choose a time.';
  else if (!SLOTS.some((slot) => slot.value === booking.slot)) found.slot = 'Pick one of the listed times.';

  return found;
}

export function complete(booking: Booking, now: Date = new Date()): boolean {
  return Object.keys(problems(booking, now)).length === 0;
}

const ENDPOINT = '/api/booking';

const GENERIC_FAILURE = 'That did not go through. Please try again, or call us instead.';

export async function requestBooking(booking: Booking): Promise<void> {
  if (!complete(booking)) {
    throw new Error('Some of these need another look.');
  }

  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(booking)
    });
  } catch {
    throw new Error('We could not reach the server. Check your connection and try again.');
  }

  if (response.ok) return;

  let message = GENERIC_FAILURE;

  try {
    const body = (await response.json()) as {error?: unknown};
    if (typeof body.error === 'string' && body.error.trim()) message = body.error;
  } catch {
    message = GENERIC_FAILURE;
  }

  throw new Error(message);
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export type MonthAvailability = {live: boolean; days: Record<string, string[]>};

export async function fetchAvailability(year: number, month: number): Promise<MonthAvailability | null> {
  try {
    const response = await fetch(`/api/availability?month=${monthKey(year, month)}`);
    if (!response.ok) return null;
    return (await response.json()) as MonthAvailability;
  } catch {
    return null;
  }
}
