import {Link} from 'react-router';
import Counter from '../../../components/Counter';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {EVENTS, PORTFOLIO, PRIORITIES} from '../../../data/platform';
import {cn} from '../../../lib/cn';

export default function Operations() {
  return (
    <Section id="operations" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mb-14 max-w-[720px]">
          <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
            The operational brain.
          </h2>
          <p className="mt-6 max-w-[540px] text-[16.5px] font-light leading-[1.65] text-muted">
            Every customer. Every system. Every event. One connected operational picture — and a
            queue short enough that the exceptions in it stay credible.
          </p>
        </Reveal>

        <div className="glass ring-lit overflow-hidden rounded-frame">
          <div className="grid grid-cols-2 gap-px bg-line-2 min-[760px]:grid-cols-4">
            {PORTFOLIO.map((kpi) => (
              <div key={kpi.label} className="bg-panel px-6 py-7 min-[760px]:px-8 min-[760px]:py-9">
                <div
                  className={cn(
                    'mono text-[clamp(28px,4.4vw,42px)] font-semibold leading-none',
                    TONE_TEXT[kpi.tone]
                  )}
                >
                  <Counter value={kpi.value} />
                </div>
                <div className="mono mt-3 text-[11.5px] font-semibold uppercase tracking-[.13em] text-faint">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line-2 px-6 pb-2 pt-7 min-[760px]:px-9">
            <div className="mono text-[11.5px] font-semibold uppercase tracking-[.13em] text-faint">
              Priority events
            </div>
          </div>

          <div>
            {EVENTS.map((event) => {
              const level = PRIORITIES.find((item) => item.name === event.priority);
              const tone = level?.tone ?? 'ink';

              return (
                <div
                  key={event.ref}
                  className="flex items-start gap-4 border-b border-line-2 px-6 py-4 transition-colors duration-150 last:border-b-0 hover:bg-panel-2/50 min-[760px]:items-center min-[760px]:px-9"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[6px] h-2.5 w-2.5 shrink-0 rounded-full border min-[760px]:mt-0"
                    style={{
                      borderColor: TONE_VAR[tone],
                      background: level?.filled ? TONE_VAR[tone] : 'transparent'
                    }}
                  />

                  <span
                    className={cn(
                      'mono w-[76px] shrink-0 text-[11.5px] font-semibold uppercase tracking-[.12em]',
                      TONE_TEXT[tone]
                    )}
                  >
                    {event.priority}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium leading-[1.3] text-ink">
                      {event.summary}
                    </span>
                    <span className="mt-1 block text-[13px] font-light leading-[1.45] text-faint">
                      {event.detail}
                    </span>
                  </span>

                  <span className="mono shrink-0 text-[12px] text-faint">{event.ref}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-line-2 bg-bg/40 px-6 py-7 min-[760px]:px-9">
            <div className="mono mb-5 text-[11.5px] font-semibold uppercase tracking-[.13em] text-faint">
              Priority levels
            </div>

            <dl className="grid gap-x-8 gap-y-3 min-[620px]:grid-cols-2 min-[1100px]:grid-cols-3">
              {PRIORITIES.map((level) => (
                <div key={level.name} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-2 w-2 shrink-0 rounded-full border"
                    style={{
                      borderColor: TONE_VAR[level.tone],
                      background: level.filled ? TONE_VAR[level.tone] : 'transparent'
                    }}
                  />
                  <span className="min-w-0">
                    <dt
                      className={cn(
                        'mono text-[11.5px] font-semibold uppercase tracking-[.12em]',
                        TONE_TEXT[level.tone]
                      )}
                    >
                      {level.name}
                    </dt>
                    <dd className="mt-1 text-[13px] font-light leading-[1.45] text-muted">
                      {level.meaning}
                    </dd>
                  </span>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t border-line-2 px-6 py-6 min-[760px]:px-9">
            <Link
              to="/business#portfolio"
              className="mono inline-flex items-center gap-2.5 rounded-pill border border-line-2 px-6 py-3 text-[11px] font-semibold uppercase tracking-[.12em] text-ink transition duration-200 hover:border-amber/50 hover:text-amber"
            >
              Command centre →
            </Link>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
