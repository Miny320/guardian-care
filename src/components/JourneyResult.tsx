import type {ReactNode} from 'react';
import {Link} from 'react-router';
import {LABEL, PRIMARY, SECONDARY} from './kit';
import {Estimated} from './ui';
import {cn} from '../lib/cn';
import {useLocalPath} from '../lib/country';

export type Fact = {label: string; value: string; note?: string; tone?: string};

// The end of a journey inside the home page pop-up: a heading, the figures on the left, Guardian
// Care's first observation on the right, and the two ways on. Sized to sit on one screen.
export default function JourneyResult({
  title,
  accent,
  body,
  onRestart,
  facts,
  insight,
  contactTo = '/contact'
}: {
  title: string;
  accent: string;
  body: string;
  onRestart: () => void;
  facts: ReactNode;
  insight: {label: string; headline: string; body: string; nextLabel: string; next: string};
  contactTo?: string;
}) {
  const local = useLocalPath();

  return (
    <div className="px-5 pb-8 pt-16 min-[760px]:flex min-[760px]:min-h-[min(94svh,1100px)] min-[760px]:flex-col min-[760px]:justify-center min-[760px]:px-10 min-[760px]:py-10">
      <div className="mb-5 max-w-[720px] animate-fadeup">
        <h2 className="font-display text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1] tracking-[-0.015em] text-ink">
          {title} <span className="text-brand-gradient">{accent}</span>
        </h2>
        <p className="mt-3 text-[15.5px] font-light leading-[1.6] text-muted">
          {body}{' '}
          <button
            type="button"
            onClick={onRestart}
            className="font-medium text-green underline decoration-green/40 underline-offset-4 transition-colors hover:decoration-green"
          >
            Start again
          </button>
        </p>
      </div>

      <div className="grid gap-4 min-[1000px]:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0 animate-fadeup">{facts}</div>

        <div className="glass shadow-lift ring-lit flex animate-fadeup flex-col overflow-hidden rounded-frame [animation-delay:.08s]">
          <div className="border-b border-line-2 px-6 py-3.5">
            <span className={cn(LABEL, 'text-amber')}>{insight.label}</span>
          </div>
          <div className="flex-1 px-6 py-5">
            <p className="font-display text-[clamp(20px,2vw,24px)] font-extrabold leading-[1.15] text-ink">
              {insight.headline}
            </p>
            <p className="mt-3 text-[14.5px] font-light leading-[1.6] text-muted">{insight.body}</p>
          </div>
          <div className="border-t border-line-2 bg-bg/40 px-6 py-4">
            <div className={cn(LABEL, 'text-amber')}>{insight.nextLabel}</div>
            <p className="mt-2 border-l-2 border-amber/50 pl-4 text-[14.5px] font-light leading-[1.55] text-ink/90">
              → {insight.next}
            </p>
          </div>
        </div>
      </div>

      {/* The two ways on from here, in the site's button style (navy inside the light pop-up). */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to={local('/start')}
          className={PRIMARY}
        >
          Open my dashboard
        </Link>
        <Link
          to={local(contactTo)}
          className={SECONDARY}
        >
          Talk to the team
        </Link>
      </div>
    </div>
  );
}

// The figures, two to a row, in the same style as the system check's summary.
export function FactGrid({
  title,
  facts,
  caption,
  badge = 'Estimated'
}: {
  title: string;
  facts: Fact[];
  caption: string;
  badge?: string;
}) {
  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-5 py-3 min-[520px]:px-6">
        <span className={cn(LABEL, 'text-amber')}>{title}</span>
        <Estimated label={badge} />
      </div>

      <dl className="grid gap-px bg-line-2 min-[520px]:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="bg-panel px-5 py-3 min-[520px]:px-6">
            <dt className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-faint">{fact.label}</dt>
            <dd className={cn('mono mt-1.5 text-[15.5px] font-semibold leading-tight text-ink', fact.tone)}>{fact.value}</dd>
            {fact.note ? <dd className="mt-1 text-[12.5px] font-light leading-snug text-muted">{fact.note}</dd> : null}
          </div>
        ))}

        <div className="flex items-center bg-bg-2 px-5 py-3 min-[520px]:px-6">
          <p className="text-[13px] font-light leading-[1.55] text-muted">{caption}</p>
        </div>
      </dl>
    </div>
  );
}
