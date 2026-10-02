import Glyph from '../../../../components/Glyph';
import {TONE_TEXT, TONE_VAR} from '../../../../data/command';
import {OPPORTUNITIES, type Opportunity} from '../../../../data/consumer';
import {cn} from '../../../../lib/cn';
import {LABEL, LABEL_BASE, Tile, tint} from '../../../../components/kit';

export function OpportunityPicker({at, onPick}: {at: number; onPick: (index: number) => void}) {
  return (
    <div className="grid gap-3 min-[620px]:grid-cols-2">
      {OPPORTUNITIES.map((item, index) => {
        const selected = index === at;
        const colour = TONE_VAR[item.tone];

        return (
          <button
            key={item.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onPick(index)}
            className={cn(
              'glass relative flex flex-col rounded-frame border p-5 text-left transition duration-250 ease-brand',
              selected ? 'shadow-lift' : 'border-line-2 hover:-translate-y-0.5 hover:border-line'
            )}
            style={
              selected
                ? {
                    borderColor: tint(colour, 55),
                    background: `color-mix(in srgb, ${colour} 9%, var(--color-panel))`
                  }
                : undefined
            }
          >
            <span className="flex items-center justify-between gap-3">
              <Tile tone={item.tone} size="sm">
                <Glyph name={item.glyph} bold className="h-5 w-5" />
              </Tile>
              <span
                className={cn(
                  'mono text-[11px] font-semibold uppercase tracking-[.12em]',
                  selected ? TONE_TEXT[item.tone] : 'text-faint'
                )}
              >
                {selected ? 'Explained below' : 'See explanation'}
              </span>
            </span>

            <span className="mt-4 block font-display text-[20px] font-semibold uppercase leading-none text-ink">
              {item.name}
            </span>
            <span className="mt-2 block text-[13.5px] font-light leading-[1.5] text-muted">
              {item.seen}
            </span>

            <span className="mt-auto block pt-4">
              <span className={cn(LABEL_BASE, 'block text-[11px] tracking-[.12em] text-faint')}>
                Guardian Care may suggest
              </span>
              <span className={cn('mt-1.5 block text-[13.5px] leading-[1.45]', TONE_TEXT[item.tone])}>
                → {item.suggest}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

const PARTS: Array<{key: 'identified' | 'matters' | 'recommend'; name: string; purpose: string}> = [
  {key: 'identified', name: 'What we identified', purpose: 'What the data is showing'},
  {key: 'matters', name: 'Why it matters', purpose: 'What the impact could be'},
  {key: 'recommend', name: 'What we recommend', purpose: 'What should be reviewed next'}
];

export function Explanation({opportunity}: {opportunity: Opportunity}) {
  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-2 px-5 py-4 min-[520px]:px-6">
        <span className={cn(LABEL, 'text-amber')}> Guardian Care Intelligence · Insight</span>
        <span
          className={cn(
            'mono inline-flex items-center gap-2 rounded-pill border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.12em]',
            TONE_TEXT[opportunity.tone]
          )}
          style={{borderColor: tint(TONE_VAR[opportunity.tone], 40)}}
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{background: TONE_VAR[opportunity.tone]}}
          />
          {opportunity.name}
        </span>
      </div>

      <div key={opportunity.key} className="animate-fadeup" aria-live="polite">
        {PARTS.map((part) => {
          const recommend = part.key === 'recommend';

          return (
            <div
              key={part.key}
              className="grid gap-2 border-b border-line-2 px-5 py-5 last:border-b-0 min-[520px]:px-6 min-[620px]:grid-cols-[168px_minmax(0,1fr)] min-[620px]:gap-6"
            >
              <div>
                <div
                  className={cn(
                    LABEL_BASE,
                    'text-[11px] tracking-[.12em]',
                    recommend ? 'text-amber' : TONE_TEXT[opportunity.tone]
                  )}
                >
                  {part.name}
                </div>
                <div className="mt-1 text-[12px] font-light text-faint">{part.purpose}</div>
              </div>
              <p
                className={cn(
                  'leading-[1.55]',
                  part.key === 'identified' && 'text-[16px] text-ink',
                  part.key === 'matters' && 'text-[15px] font-light text-muted',
                  recommend && 'border-l-2 border-amber/50 pl-4 text-[15.5px] font-light text-ink/90'
                )}
              >
                {recommend ? '→ ' : null}
                {opportunity[part.key]}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line-2 bg-bg/40 px-5 py-4 min-[520px]:px-6">
        <p className="text-[13px] font-light leading-[1.6] text-faint">
          Every insight arrives like this. Never just “{opportunity.name}” — always what it means for
          you, and what to do about it.
        </p>
      </div>
    </div>
  );
}
