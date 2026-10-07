import {useEffect, useRef, useState} from 'react';
import Glyph from '../../components/Glyph';
import {LABEL, SECONDARY} from '../../components/kit';
import {cn} from '../../lib/cn';
import {
  COMPANY_TZ,
  EMPTY_BOOKING,
  MEETING_MINUTES,
  MODES,
  ROLES,
  SLOTS,
  WEEKDAYS,
  asInputValue,
  fetchAvailability,
  formatDay,
  isBookable,
  monthGrid,
  monthHasBookableDays,
  monthLabel,
  openingMonth,
  problems,
  requestBooking,
  sameDay,
  slotRange,
  ukClockName,
  viewerEquivalent,
  viewerTimeZone,
  type MonthAvailability,
  type Booking,
  type Field
} from '../../lib/booking';

const DETAIL_ORDER: Field[] = ['name', 'email', 'phone', 'role', 'mode', 'topic'];

const HOST = 'Guardian Care Energy Team';

type Step = 'when' | 'who' | 'done';

export default function Scheduler() {
  const opening = openingMonth();
  const [view, setView] = useState(opening);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState('');
  const [step, setStep] = useState<Step>('when');
  const [inMyZone, setInMyZone] = useState(false);
  const [open, setOpen] = useState<MonthAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState<Booking>(EMPTY_BOOKING);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const form = useRef<HTMLFormElement>(null);

  const chosen: Booking = {...booking, day: day ? asInputValue(day) : '', slot};
  const found = problems(chosen);
  const errorFor = (field: Field) => (touched[field] ? found[field] : undefined);

  const abroad = viewerTimeZone() !== COMPANY_TZ;
  const cells = monthGrid(view.year, view.month);
  const canBack = view.year > opening.year || (view.year === opening.year && view.month > opening.month);
  const ahead = view.month === 11 ? {year: view.year + 1, month: 0} : {year: view.year, month: view.month + 1};
  const canForward = monthHasBookableDays(ahead.year, ahead.month);

  useEffect(() => {
    let current = true;
    setLoading(true);

    fetchAvailability(view.year, view.month).then((reply) => {
      if (!current) return;
      setOpen(reply);
      setLoading(false);
    });

    return () => {
      current = false;
    };
  }, [view.year, view.month]);

  function move(by: number) {
    setView((was) => {
      const next = new Date(was.year, was.month + by, 1);
      return {year: next.getFullYear(), month: next.getMonth()};
    });
  }

  function write(field: Field, value: string) {
    setBooking((was) => ({...was, [field]: value}));
    if (failure) setFailure('');
  }

  const leave = (field: Field) => setTouched((was) => ({...was, [field]: true}));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    if (Object.keys(found).length > 0) {
      setTouched(Object.fromEntries(DETAIL_ORDER.map((field) => [field, true])));
      const first = DETAIL_ORDER.find((field) => found[field]);
      if (first) {
        const control = form.current?.elements.namedItem(first);
        if (control instanceof HTMLElement) control.focus();
      }
      return;
    }

    setSending(true);
    try {
      await requestBooking(chosen);
      setConfirmed(`${formatDay(chosen.day)} · ${slotRange(slot)} ${ukClockName()}`);
      setStep('done');
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'That did not go through. Try again.');
    } finally {
      setSending(false);
    }
  }

  function restart() {
    setBooking(EMPTY_BOOKING);
    setTouched({});
    setDay(null);
    setSlot('');
    setView(openingMonth());
    setStep('when');
  }

  const openFor = (key: string): string[] =>
    open ? (open.days[key] ?? []) : SLOTS.map((slot) => slot.value);

  const freeToday = day ? openFor(asInputValue(day)) : [];

  const when = day
    ? `${day.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'})} · ${slotRange(slot)}`
    : '';

  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className="grid min-[900px]:grid-cols-[264px_1fr]">
        <aside className="border-b border-line-2 px-6 py-6 min-[900px]:border-b-0 min-[900px]:border-r">
          <span className={cn(LABEL, 'text-faint')}>{HOST}</span>
          <h2 className="mt-3 font-display text-[clamp(21px,2.4vw,27px)] font-semibold uppercase leading-[1.1] tracking-[-0.01em] text-ink">
            Interview
          </h2>

          <div className="mt-5 space-y-3">
            <Fact glyph="monitoring" value={`${MEETING_MINUTES} min`} />
            <Fact glyph="connect" value={step === 'when' ? 'Phone, video or on site' : modeOf(booking.mode)} />
            <Fact glyph="grid" value={`UK time (${ukClockName()})`} />
            {step !== 'when' && when ? <Fact glyph="insight" value={when} /> : null}
          </div>

          <p className="mt-6 text-[13px] font-light leading-[1.6] text-muted">
            A half hour on what your system — or your portfolio — is actually doing, and what
            Guardian Care would change about it.
          </p>
        </aside>

        <div className="min-w-0">
          {step === 'done' ? (
            <div className="flex min-h-[460px] flex-col justify-center px-6 py-10 min-[760px]:px-9">
              <span className="text-green">
                <Glyph name="insight" className="h-10 w-10" />
              </span>
              <h3 className="mt-5 font-display text-[clamp(23px,2.8vw,32px)] font-semibold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
                Time requested
              </h3>
              <p className="mt-3 max-w-[440px] text-[15.5px] font-light leading-[1.6] text-muted">
                You asked for <span className="font-medium text-ink">{confirmed}</span>. We will
                confirm by email within one working day, or offer the nearest time we can.
              </p>
              <p className="mt-3 max-w-[440px] text-[14px] font-light leading-[1.6] text-faint">
                Nothing is in the diary until that confirmation arrives, so there is no calendar
                invite to add yet.
              </p>
              <div className="mt-7">
                <button type="button" onClick={restart} className={SECONDARY}>
                  Request another time
                </button>
              </div>
            </div>
          ) : step === 'when' ? (
            <div className="grid min-[640px]:grid-cols-[1fr_212px]">
              <div className="px-6 py-6 min-[640px]:border-r min-[640px]:border-line-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[17px] font-semibold uppercase tracking-[-0.005em] text-ink">
                    {monthLabel(view.year, view.month)}
                  </span>
                  <span className="flex gap-1.5">
                    <Arrow dir="back" disabled={!canBack} onClick={() => move(-1)} />
                    <Arrow dir="next" disabled={!canForward} onClick={() => move(1)} />
                  </span>
                </div>

                <div className="mono mt-5 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[.1em] text-faint">
                  {WEEKDAYS.map((name) => (
                    <span key={name} className="py-1">
                      {name}
                    </span>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map((date, index) => {
                    if (!date) return <span key={`pad-${index}`} />;

                    const key = asInputValue(date);
                    const free = openFor(key);
                    const open = isBookable(date) && free.length > 0;
                    const picked = sameDay(date, day);

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={!open}
                        aria-pressed={picked}
                        aria-label={date.toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                        onClick={() => {
                          setDay(date);
                          setSlot('');
                        }}
                        className={cn(
                          'mono aspect-square rounded-card text-[13px] font-medium transition duration-150',
                          picked && 'bg-[var(--cta)] text-[var(--cta-ink)]',
                          !picked && open && 'bg-field text-ink hover:bg-field-lit hover:ring-1 hover:ring-green/50',
                          !open && 'cursor-not-allowed text-faint/30'
                        )}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-5 text-[12px] font-light leading-[1.5] text-faint">
                  {loading
                    ? 'Checking the diary…'
                    : open?.live
                      ? 'Showing times that are free in our diary.'
                      : 'Weekdays only, from the next working day. Times are provisional.'}
                </p>
              </div>

              <div className="border-t border-line-2 px-6 py-6 min-[640px]:border-t-0">
                {day ? (
                  <>
                    <div className="text-[13px] font-medium text-ink">
                      {day.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'})}
                    </div>

                    {abroad ? (
                      <div className="mono mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line-2 text-[10px] uppercase tracking-[.08em]">
                        <Zone active={!inMyZone} onClick={() => setInMyZone(false)} label="UK" />
                        <Zone active={inMyZone} onClick={() => setInMyZone(true)} label="My time" />
                      </div>
                    ) : null}

                    {freeToday.length === 0 ? (
                      <p className="mt-3 text-[13px] font-light leading-[1.6] text-faint">
                        Nothing left on this day. Try another.
                      </p>
                    ) : null}

                    <div className="mt-3 flex max-h-[290px] flex-col gap-1.5 overflow-y-auto pr-1">
                      {SLOTS.filter((option) => freeToday.includes(option.value)).map((option) => {
                        const picked = slot === option.value;
                        const mine = viewerEquivalent(asInputValue(day), option.value);
                        const shown = inMyZone && mine ? mine.split(' – ')[0] : option.label;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={picked}
                            onClick={() => {
                              setSlot(option.value);
                              setStep('who');
                            }}
                            className={cn(
                              'mono shrink-0 rounded-card py-2.5 text-center text-[13px] font-semibold transition duration-150',
                              picked
                                ? 'bg-[var(--cta)] text-[var(--cta-ink)]'
                                : 'bg-field text-ink ring-1 ring-line-2 hover:ring-green/60'
                            )}
                          >
                            {shown}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-[13px] font-light leading-[1.6] text-faint">
                    Pick a day and the available times appear here.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form ref={form} noValidate onSubmit={submit}>
              <div className="flex items-center gap-3 border-b border-line-2 px-6 py-3.5">
                <button
                  type="button"
                  onClick={() => setStep('when')}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint ring-1 ring-line-2 transition duration-200 hover:text-ink hover:ring-ink/25"
                  aria-label="Back to the calendar"
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7.5 2.5 4 6l3.5 3.5" />
                  </svg>
                </button>
                <span className="text-[13.5px] font-medium text-ink">{when}</span>
              </div>

              <div className="grid gap-4 px-6 py-6 min-[620px]:grid-cols-2">
                <Text field="name" label="Name" required placeholder="Alex Hartley" autoComplete="name" value={booking.name} error={errorFor('name')} onWrite={write} onLeave={leave} />
                <Text field="email" label="Email address" required type="email" inputMode="email" placeholder="you@company.com" autoComplete="email" value={booking.email} error={errorFor('email')} onWrite={write} onLeave={leave} />
                <Text field="phone" label="Phone number" required type="tel" inputMode="tel" placeholder="07700 900123" autoComplete="tel" value={booking.phone} error={errorFor('phone')} onWrite={write} onLeave={leave} />
                <Select field="role" label="Which are you?" placeholder="Prefer not to say" options={ROLES} value={booking.role} error={errorFor('role')} onWrite={write} onLeave={leave} />

                <div className="min-[620px]:col-span-2">
                  <Select field="mode" label="How should we meet?" placeholder="Whichever suits you" options={MODES} value={booking.mode} error={errorFor('mode')} onWrite={write} onLeave={leave} />
                </div>

                <div className="min-[620px]:col-span-2">
                  <FieldShell field="topic" label="Anything that would help us prepare?" error={errorFor('topic')}>
                    <textarea
                      id="topic"
                      name="topic"
                      rows={3}
                      value={booking.topic}
                      placeholder="Your system, your portfolio, or whatever brought you here."
                      onChange={(event) => write('topic', event.target.value)}
                      onBlur={() => leave('topic')}
                      className="mt-2.5 w-full min-w-0 resize-y bg-transparent text-[15.5px] font-light leading-[1.6] text-ink outline-none placeholder:text-faint/60"
                    />
                  </FieldShell>
                </div>
              </div>

              <div className="px-6 pb-6">
                {failure ? (
                  <p role="alert" className="mb-3 text-[13.5px] font-light leading-[1.5] text-red">
                    {failure}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--cta)] px-7 py-3.5 text-[14px] font-semibold text-[var(--cta-ink)] shadow-[0_12px_30px_-14px_var(--btn-glow)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40 min-[620px]:w-auto"
                >
                  {sending ? 'Requesting…' : 'Request this time →'}
                </button>

                <p className="mt-3.5 text-[12.5px] font-light leading-[1.55] text-faint">
                  We confirm by email within one working day. The slot is held once you hear back.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function modeOf(value: string): string {
  return MODES.find((mode) => mode.value === value)?.label ?? 'Phone, video or on site';
}

function Fact({glyph, value}: {glyph: 'monitoring' | 'connect' | 'grid' | 'insight'; value: string}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-faint">
        <Glyph name={glyph} className="h-4 w-4" />
      </span>
      <span className="text-[13.5px] font-light leading-[1.4] text-muted">{value}</span>
    </div>
  );
}

function Zone({active, onClick, label}: {active: boolean; onClick: () => void; label: string}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn('py-1.5 transition duration-150', active ? 'bg-field-lit text-ink' : 'bg-field text-faint')}
    >
      {label}
    </button>
  );
}

function Arrow({dir, disabled, onClick}: {dir: 'back' | 'next'; disabled: boolean; onClick: () => void}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === 'back' ? 'Previous month' : 'Next month'}
      className="grid h-8 w-8 place-items-center rounded-full text-faint ring-1 ring-line-2 transition duration-200 hover:text-ink hover:ring-ink/25 disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 'back' ? 'M7.5 2.5 4 6l3.5 3.5' : 'M4.5 2.5 8 6l-3.5 3.5'} />
      </svg>
    </button>
  );
}

function FieldShell({
  field,
  label,
  required,
  error,
  children
}: {
  field: Field;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={field}
        className={cn(
          'block rounded-card bg-field p-4 ring-1 transition focus-within:bg-field-lit focus-within:ring-green/60',
          error ? 'ring-red/70' : 'ring-line-2'
        )}
      >
        <span className="block text-[13px] font-medium text-ink">
          {label}
          {required ? <span className="ml-1 text-green">*</span> : null}
        </span>
        {children}
      </label>
      {error ? (
        <p id={`${field}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-light leading-[1.45] text-red">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Text({
  field,
  label,
  value,
  error,
  required,
  onWrite,
  onLeave,
  ...input
}: {
  field: Field;
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  onWrite: (field: Field, value: string) => void;
  onLeave: (field: Field) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell field={field} label={label} required={required} error={error}>
      <input
        {...input}
        id={field}
        name={field}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${field}-error` : undefined}
        onChange={(event) => onWrite(field, event.target.value)}
        onBlur={() => onLeave(field)}
        className="mt-2.5 w-full min-w-0 bg-transparent text-[15.5px] font-medium text-ink outline-none placeholder:font-light placeholder:text-faint/60"
      />
    </FieldShell>
  );
}

function Select({
  field,
  label,
  placeholder,
  options,
  value,
  error,
  onWrite,
  onLeave
}: {
  field: Field;
  label: string;
  placeholder: string;
  options: ReadonlyArray<{value: string; label: string}>;
  value: string;
  error?: string;
  onWrite: (field: Field, value: string) => void;
  onLeave: (field: Field) => void;
}) {
  return (
    <FieldShell field={field} label={label} error={error}>
      <span className="relative mt-2.5 flex items-center">
        <select
          id={field}
          name={field}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${field}-error` : undefined}
          onChange={(event) => onWrite(field, event.target.value)}
          onBlur={() => onLeave(field)}
          className={cn(
            'w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 text-[15.5px] outline-none',
            value ? 'font-medium text-ink' : 'font-light text-faint/60'
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute right-0 h-3 w-3 text-faint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </span>
    </FieldShell>
  );
}
