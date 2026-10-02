import {useEffect, useRef, useState} from 'react';
import Glyph from '../Glyph';
import {cn} from '../../lib/cn';
import {visibleSteps, type Answers, type Estimate, type ProfileLine, type Step} from './types';

const ADVANCE_MS = 260;

type AssessmentProps = {
  steps: Step[];
  answers: Answers;
  onChange: (next: Answers) => void;
  onComplete: () => void;
  done: boolean;
  finishLabel: string;
  profile: {heading: string; lines: ProfileLine[]};
  onReset: () => void;
};

export default function Assessment({
  steps,
  answers,
  onChange,
  onComplete,
  done,
  finishLabel,
  profile,
  onReset
}: AssessmentProps) {
  const [at, setAt] = useState(0);
  const [opened, setOpened] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const visible = visibleSteps(steps, answers);
  const index = Math.min(at, visible.length - 1);
  const step = visible[index];
  const last = index === visible.length - 1;

  function advance(next: Answers) {
    const list = visibleSteps(steps, next);
    const here = list.findIndex((item) => item.key === step.key);
    if (here === -1 || here === list.length - 1) {
      onComplete();
      return;
    }
    setAt(here + 1);
  }

  function choose(value: string) {
    if (step.kind !== 'choice') return;
    const option = step.options.find((item) => item.value === value);
    const next: Answers = {...answers, choice: {...answers.choice, [step.key]: value}};
    onChange(next);

    if (option?.input) return;

    clearTimeout(timer.current);
    timer.current = setTimeout(() => advance(next), ADVANCE_MS);
  }

  function toggle(value: string) {
    if (step.kind !== 'multi') return;
    const picked = answers.multi[step.key] ?? [];
    const next = picked.includes(value)
      ? picked.filter((item) => item !== value)
      : [...picked, value];
    onChange({...answers, multi: {...answers.multi, [step.key]: next}});
  }

  function write(key: string, value: string) {
    onChange({...answers, field: {...answers.field, [key]: value}});
  }

  function back() {
    clearTimeout(timer.current);
    setAt(Math.max(0, index - 1));
  }

  function restart() {
    clearTimeout(timer.current);
    setAt(0);
    setOpened([]);
    onReset();
  }

  const chosen = step?.kind === 'choice' ? answers.choice[step.key] : undefined;
  const openInput =
    step?.kind === 'choice'
      ? step.options.find((item) => item.value === chosen && item.input)
      : undefined;
  const multiPicked = step?.kind === 'multi' ? (answers.multi[step.key] ?? []) : [];

  const unfolded =
    step?.kind === 'fields' &&
    (opened.includes(step.key) ||
      step.fields.some((item) => (answers.field[item.key] ?? '').trim() !== ''));

  return (
    <div className="grid gap-px overflow-hidden rounded-panel bg-line-2 ring-1 ring-line-2 min-[980px]:grid-cols-[1fr_306px]">
      <div className="bg-panel p-6 min-[760px]:p-9">
        {done ? (
          <Complete count={visible.length} onRestart={restart} />
        ) : (
          <>
            <Progress at={index} total={visible.length} />

            <div className="mt-7 flex items-start gap-4">
              <span className="mt-0.5 shrink-0 text-green">
                <Glyph name={step.glyph} className="h-8 w-8" />
              </span>
              <div>
                <h3 className="font-display text-[clamp(24px,3vw,34px)] font-semibold uppercase leading-[1.06] tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                {step.lead ? (
                  <p className="mt-2 text-[15px] font-light leading-[1.55] text-muted">
                    {step.lead}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-7">
              {step.kind === 'fields' && step.estimate && !unfolded ? (
                <Assumed
                  estimate={step.estimate}
                  onOpen={() => setOpened((list) => [...list, step.key])}
                />
              ) : step.kind === 'fields' ? (
                <div className="grid gap-3 min-[620px]:grid-cols-2">
                  {step.fields.map((field) => (
                    <label
                      key={field.key}
                      className="block rounded-card bg-bg-2 p-4 ring-1 ring-line-2 transition focus-within:ring-green/60"
                    >
                      <span className="block text-[13px] font-medium text-ink">{field.label}</span>
                      {field.note ? (
                        <span className="mt-0.5 block text-[12px] font-light text-faint">
                          {field.note}
                        </span>
                      ) : null}
                      <span className="mt-2.5 flex items-baseline gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={answers.field[field.key] ?? ''}
                          onChange={(event) => write(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="mono w-full min-w-0 bg-transparent text-[19px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-faint/60"
                        />
                        <span className="mono shrink-0 text-[12px] text-faint">{field.suffix}</span>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    'grid gap-2.5',
                    step.options.length > 4
                      ? 'min-[620px]:grid-cols-2 min-[1280px]:grid-cols-3'
                      : 'min-[620px]:grid-cols-2'
                  )}
                >
                  {step.options.map((option) => {
                    const picked =
                      step.kind === 'multi'
                        ? multiPicked.includes(option.value)
                        : chosen === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={step.kind === 'multi' ? picked : undefined}
                        onClick={() =>
                          step.kind === 'multi' ? toggle(option.value) : choose(option.value)
                        }
                        className={cn(
                          'group flex items-center gap-3 rounded-card px-4 py-3.5 text-left transition duration-200 ease-brand',
                          picked
                            ? 'bg-green-glow ring-2 ring-green'
                            : 'bg-bg-2 ring-1 ring-line-2 hover:-translate-y-0.5 hover:ring-green/45'
                        )}
                      >
                        <Tick picked={picked} multi={step.kind === 'multi'} />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block text-[15px] leading-[1.35]',
                              picked ? 'font-medium text-ink' : 'font-light text-ink'
                            )}
                          >
                            {option.label}
                          </span>
                          {option.note ? (
                            <span className="mt-0.5 block text-[12.5px] font-light leading-[1.45] text-faint">
                              {option.note}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {openInput ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-card bg-bg-2 p-4 ring-1 ring-green/40">
                  <label className="flex flex-1 items-baseline gap-2">
                    <span className="sr-only">{step.title}</span>
                    <input
                      autoFocus
                      type="text"
                      inputMode="decimal"
                      value={answers.field[step.key] ?? ''}
                      onChange={(event) => write(step.key, event.target.value)}
                      placeholder={openInput.input?.placeholder}
                      className="mono w-full min-w-0 bg-transparent text-[21px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-faint/60"
                    />
                    <span className="mono shrink-0 text-[12.5px] text-faint">
                      {openInput.input?.suffix}
                    </span>
                  </label>
                </div>
              ) : null}
            </div>

            <div className="mt-7 rounded-card border-l-2 border-green/45 bg-bg-2/70 px-5 py-4">
              <div className="text-[11.5px] font-bold uppercase tracking-[.13em] text-green">
                {step.why.heading}
              </div>
              <div className="mt-2 text-[14.5px] font-light leading-[1.6] text-muted [&_b]:font-medium [&_b]:text-ink">
                {step.why.body}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[13.5px] min-[520px]:py-2.5 font-medium text-faint ring-1 ring-line-2 transition duration-200 hover:text-ink hover:ring-ink/25"
                >
                  ← Back
                </button>
              ) : null}

              {step.kind !== 'choice' || openInput ? (
                <button
                  type="button"
                  onClick={() => advance(answers)}
                  disabled={step.kind === 'multi' && multiPicked.length === 0}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[var(--cta)] px-7 py-3 text-[14px] font-semibold tracking-[-0.005em] text-[var(--cta-ink)] shadow-[0_12px_30px_-14px_var(--btn-glow)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
                >
                  {last ? finishLabel : 'Continue'} →
                </button>
              ) : (
                <span className="text-[13px] font-light text-faint">
                  Choose an answer to continue
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <aside className="bg-bg-2 p-6 min-[760px]:p-7">
        <div className="text-[11.5px] font-bold uppercase tracking-[.13em] text-green">
          {profile.heading}
        </div>

        <dl className="mt-5 space-y-px">
          {profile.lines.map((line) => (
            <div key={line.label} className="py-2.5">
              <dt className="text-[11.5px] font-medium uppercase tracking-[.08em] text-faint">
                {line.label}
              </dt>
              <dd
                className={cn(
                  'mono mt-1 text-[16px] font-semibold',
                  line.value ? 'text-ink' : 'text-faint/70'
                )}
              >
                {line.value ?? line.pending ?? '—'}
              </dd>
            </div>
          ))}
        </dl>

        {done ? (
          <button
            type="button"
            onClick={restart}
            className="mt-5 w-full rounded-full px-4 py-3 text-[13px] min-[520px]:py-2.5 font-medium text-faint ring-1 ring-line-2 transition duration-200 hover:text-ink hover:ring-ink/25"
          >
            Start again
          </button>
        ) : (
          <p className="mt-5 border-t border-line-2 pt-4 text-[12.5px] font-light leading-[1.55] text-faint">
            Everything here is an estimate until Guardian Care receives monitoring and meter data
            from the property.
          </p>
        )}
      </aside>
    </div>
  );
}

function Progress({at, total}: {at: number; total: number}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] font-bold uppercase tracking-[.13em] text-green">
          Step {at + 1} of {total}
        </span>
        <span className="mono text-[11px] text-faint">
          {String(at + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-2.5 flex gap-1.5">
        {Array.from({length: total}, (_, slot) => (
          <span
            key={slot}
            className={cn(
              'h-[3px] flex-1 rounded-full transition-colors duration-300',
              slot < at ? 'bg-green/55' : slot === at ? 'bg-green' : 'bg-line-2'
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Assumed({estimate, onOpen}: {estimate: Estimate; onOpen: () => void}) {
  return (
    <div className="rounded-card bg-bg-2 p-5 ring-1 ring-line-2">
      <div className="text-[11.5px] font-bold uppercase tracking-[.13em] text-faint">
        What we will assume
      </div>

      <dl className="mt-4 space-y-px">
        {estimate.assumed.map((line) => (
          <div
            key={line.label}
            className="flex items-baseline justify-between gap-4 border-b border-line-2 py-2.5 last:border-b-0"
          >
            <dt className="text-[14px] font-light text-muted">{line.label}</dt>
            <dd className="mono shrink-0 text-[15px] font-semibold text-ink">{line.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[13px] font-light leading-[1.55] text-faint">{estimate.source}</p>

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-3 text-[13.5px] min-[520px]:py-2.5 font-medium text-green ring-1 ring-green/40 transition duration-200 hover:bg-green-glow hover:ring-green/70"
      >
        {estimate.open} →
      </button>
    </div>
  );
}

function Tick({picked, multi}: {picked: boolean; multi: boolean}) {
  return (
    <span
      className={cn(
        'grid h-5 w-5 shrink-0 place-items-center border transition-colors duration-200',
        multi ? 'rounded-[6px]' : 'rounded-full',
        picked ? 'border-green bg-green text-bg' : 'border-line-2 text-transparent'
      )}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 6.2 4.8 9 10 3.2" />
      </svg>
    </span>
  );
}

function Complete({count, onRestart}: {count: number; onRestart: () => void}) {
  return (
    <div className="flex min-h-[280px] flex-col justify-center py-4">
      <span className="text-green">
        <Glyph name="insight" className="h-10 w-10" />
      </span>
      <h3 className="mt-5 font-display text-[clamp(26px,3.2vw,38px)] font-semibold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
        Your assessment is ready
      </h3>
      <p className="mt-3 max-w-[440px] text-[15.5px] font-light leading-[1.6] text-muted">
        All {count} questions answered. Guardian Care has built your initial position from them —
        it is set out below, and every figure in it is labelled as an estimate until the system is
        connected.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13.5px] min-[520px]:py-2.5 font-medium text-faint ring-1 ring-line-2 transition duration-200 hover:text-ink hover:ring-ink/25"
        >
          Start again
        </button>
      </div>
    </div>
  );
}
