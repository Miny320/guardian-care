import {useState} from 'react';
import {Caption, Heading, LABEL, LABEL_BASE, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, StatusGlyphIcon, Wrap} from '../../../components/ui';
import {CC_ATTENTION, CC_KPIS, CC_ROWS, TONE_TEXT, TONE_VAR} from '../../../data/command';
import {cn} from '../../../lib/cn';
import {LiveDot} from '../../Home/components/Conduit';

export default function Console() {
  const [at, setAt] = useState(0);
  const row = CC_ROWS[at];

  return (
    <Section id="console" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Guardian Care Operations"
          title="Open one screen."
          accent="Know where you stand."
          body="Who is healthy, who is offline, who needs an engineer — before anybody rings you."
        />

        <Reveal animation="animate-card-in">
          <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
            <div className="flex items-center justify-between gap-4 border-b border-line-2 px-5 py-3.5 min-[520px]:px-6">
              <span className="flex items-center gap-2.5">
                <LiveDot />
                <span className={cn(LABEL, 'text-green')}>Command centre</span>
              </span>
              <Caption>command.guardiancare.io</Caption>
            </div>

            <dl className="grid grid-cols-2 gap-px border-b border-line-2 bg-line-2 min-[620px]:grid-cols-3 min-[1000px]:grid-cols-6">
              {CC_KPIS.map((kpi) => (
                <div key={kpi.label} className="bg-panel/60 px-5 py-4">
                  <dd className={cn('mono text-[22px] font-semibold leading-none', TONE_TEXT[kpi.tone])}>
                    {kpi.value}
                  </dd>
                  <dt className="mt-2 text-[11px] uppercase tracking-[.12em] text-faint">
                    {kpi.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="grid min-[900px]:grid-cols-[1fr_1fr]">
              <ul className="border-b border-line-2 min-[900px]:border-b-0 min-[900px]:border-r">
                <li className="border-b border-line-2 px-5 py-3 min-[520px]:px-6">
                  <span className={cn(LABEL_BASE, 'text-[11px] tracking-[.13em] text-faint')}>
                    Needs attention &#183; {CC_ROWS.length} of {CC_ATTENTION}
                  </span>
                </li>

                {CC_ROWS.map((item, index) => {
                  const active = index === at;

                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => setAt(index)}
                        aria-current={active}
                        className={cn(
                          'flex w-full items-start gap-3.5 border-b border-line-2 px-5 py-4 text-left transition duration-200 min-[520px]:px-6',
                          active ? 'bg-panel' : 'hover:bg-panel/50'
                        )}
                      >
                        <span
                          className={cn('mt-0.5 shrink-0', TONE_TEXT[item.tone])}
                          aria-hidden="true"
                        >
                          <StatusGlyphIcon glyph={item.glyph} className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2.5">
                            <span className="text-[14.5px] font-medium text-ink">{item.name}</span>
                            <span className="mono text-[11.5px] uppercase tracking-[.12em] text-faint">
                              {item.location}
                            </span>
                          </span>
                          <span className="mt-1 block text-[13px] font-light leading-[1.45] text-muted">
                            {item.summary}
                          </span>
                        </span>

                        <span
                          className={cn(
                            LABEL_BASE,
                            'shrink-0 rounded-pill px-2.5 py-1 text-[11px] tracking-[.12em]'
                          )}
                          style={{
                            color: TONE_VAR[item.tone],
                            background: tint(TONE_VAR[item.tone], 12),
                            boxShadow: `inset 0 0 0 1px ${tint(TONE_VAR[item.tone], 32)}`
                          }}
                        >
                          {item.status}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="bg-bg-2/40 px-5 py-6 min-[520px]:px-6">
                <div className={cn(LABEL, TONE_TEXT[row.tone])}>{row.name}</div>

                <dl className="mt-5 divide-y divide-line-2">
                  {row.fields.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-[13px] font-light text-muted">{label}</dt>
                      <dd className="mono text-right text-[13px] font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div
                  className="mt-5 rounded-card px-4 py-3.5"
                  style={{
                    background: tint(TONE_VAR[row.tone], 7),
                    boxShadow: `inset 0 0 0 1px ${tint(TONE_VAR[row.tone], 20)}`
                  }}
                >
                  <div className={cn(LABEL, 'text-[11px]', TONE_TEXT[row.tone])}>
                    &#9671; Guardian Care Intelligence
                  </div>
                  <p className="mt-2 text-[13.5px] font-light leading-[1.55] text-ink/90">
                    {row.recommendation}
                  </p>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {row.actions.map((action) => (
                    <li
                      key={action}
                      className="mono rounded-pill border border-line-2 px-3 py-1.5 text-[11px] uppercase tracking-[.12em] text-muted"
                    >
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}
