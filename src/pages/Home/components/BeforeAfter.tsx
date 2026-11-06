import Reveal from '../../../components/Reveal';
import {BEFORE_AFTER} from '../../../data/home';
import {cn} from '../../../lib/cn';

// Topic, before and after side by side. Both outcome columns share one width and one type size,
// so neither side outweighs the other; colour and the mark carry the difference.
const COLUMNS = 'min-[860px]:grid-cols-[170px_1fr_1fr]';

export function BeforeAfterTable() {
  return (
    <Reveal className="overflow-hidden rounded-panel bg-panel shadow-[0_30px_70px_-45px_var(--drop)] ring-1 ring-line-2">
      <div className={cn('hidden border-b border-line-2 min-[860px]:grid', COLUMNS)}>
        <h3 className="flex items-center px-8 py-6 font-display text-[clamp(26px,2.6vw,34px)] font-extrabold leading-none text-green">
          Phase
        </h3>
        <h3 className="flex items-center gap-3 px-8 py-6 font-display text-[clamp(26px,2.6vw,34px)] font-extrabold leading-none text-faint">
          <Mark kind="before" />
          Before
        </h3>
        <h3 className="flex items-center gap-3 border-l border-line-2 px-8 py-6 font-display text-[clamp(26px,2.6vw,34px)] font-extrabold leading-none text-green">
          <Mark kind="after" />
          With Guardian Care
        </h3>
      </div>

      <ul className="divide-y divide-line-2">
        {BEFORE_AFTER.map((row) => (
          <li key={row.topic} className={cn('grid min-[860px]:items-stretch', COLUMNS)}>
            <span className="mono flex items-center px-6 pt-5 text-[12px] font-semibold uppercase tracking-[.14em] text-green min-[860px]:px-8 min-[860px]:py-6">
              {row.topic}
            </span>
            <Cell kind="before" text={row.before} />
            <Cell kind="after" text={row.after} />
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Cell({kind, text}: {kind: 'before' | 'after'; text: string}) {
  const after = kind === 'after';

  return (
    <div
      className={cn(
        'flex h-full items-start gap-3.5 px-6 py-3 min-[860px]:items-center min-[860px]:px-8 min-[860px]:py-6',
        after && 'pb-5 min-[860px]:border-l min-[860px]:border-line-2'
      )}
    >
      {/* On phones the column headings are hidden, so each line carries its own mark. */}
      <span className="min-[860px]:hidden">
        <Mark kind={kind} />
      </span>
      <p className={cn('text-[16px] leading-[1.55]', after ? 'text-ink' : 'text-muted')}>
        <span className="sr-only">{after ? 'With Guardian Care: ' : 'Before: '}</span>
        {text}
      </p>
    </div>
  );
}

function Mark({kind}: {kind: 'before' | 'after'}) {
  const after = kind === 'after';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold',
        after ? 'bg-green text-bg' : 'bg-ink/10 text-faint'
      )}
    >
      {after ? '✓' : '✕'}
    </span>
  );
}
