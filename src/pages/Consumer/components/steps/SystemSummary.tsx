import {Estimated} from '../../../../components/ui';
import {summaryOf, type ExistingPosition} from '../../../../data/consumer';
import {cn} from '../../../../lib/cn';
import {LABEL} from '../../../../components/kit';

export default function SystemSummary({
  position,
  caption,
  title = 'System summary',
  dense = false
}: {
  position: ExistingPosition;
  caption: string;
  title?: string;
  // Tighter rows, so the whole summary fits on one screen inside the pop-up.
  dense?: boolean;
}) {
  const cell = dense ? 'px-5 py-3 min-[520px]:px-6' : 'px-5 py-4 min-[520px]:px-6';
  const rows = summaryOf(position);

  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className={cn('flex items-center justify-between gap-4 border-b border-line-2', cell)}>
        <span className={cn(LABEL, 'text-amber')}> {title}</span>
        <Estimated />
      </div>

      <dl className="grid gap-px bg-line-2 min-[520px]:grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className={cn('bg-panel', cell)}>
            <dt className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-faint">
              {row.label}
            </dt>
            <dd className={cn('mono font-semibold leading-tight text-ink', dense ? 'mt-1.5 text-[15.5px]' : 'mt-2 text-[16.5px]')}>
              {row.value}
            </dd>
            <dd className={cn('text-[12.5px] font-light leading-snug text-muted', dense ? 'mt-1' : 'mt-1.5')}>{row.note}</dd>
          </div>
        ))}

        <div className={cn('flex items-center bg-bg-2', cell)}>
          <p className="text-[13px] font-light leading-[1.55] text-muted">{caption}</p>
        </div>
      </dl>
    </div>
  );
}
