import {Fragment, useState} from 'react';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT} from '../../../data/command';
import {INSIGHT, PIPELINE} from '../../../data/platform';
import {cn} from '../../../lib/cn';

export default function Intelligence() {
  const [at, setAt] = useState(0);
  const view = INSIGHT[at];

  return (
    <Section id="intelligence" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mx-auto mb-16 max-w-[720px] text-center">
          <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
            Data is only the start.
            <br />
            <span className="text-brand-gradient">What matters is what it means.</span>
          </h2>
        </Reveal>

        <div className="grid items-stretch gap-4 min-[900px]:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {PIPELINE.map((stage, index) => (
            <Fragment key={stage.key}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden self-center text-[18px] text-faint min-[900px]:block"
                >
                  →
                </span>
              ) : null}

              <Reveal
                delay={index * 0.07}
                className={cn(
                  'glass flex flex-col rounded-frame border p-7 min-[760px]:p-8',
                  stage.key === 'ai' ? 'border-amber/30' : 'border-line-2'
                )}
              >

                <div
                  className={cn(
                    'mono mt-6 text-[14px] uppercase tracking-[.24em]',
                    TONE_TEXT[stage.tone]
                  )}
                >
                  {stage.line}
                </div>

                <ul className="mt-6 flex-1 space-y-2 border-line-2 pt-5">
                  {stage.items.map((item) => (
                    <li
                      key={item}
                      className="mono text-[12px] uppercase tracking-[.1em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Fragment>
          ))}
        </div>

        <Reveal className="glass ring-lit mt-4 overflow-hidden rounded-frame">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-2 px-6 py-4 min-[760px]:px-9">
            <span className="mono inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.13em] text-amber">
               Guardian Care Intelligence
            </span>

            <div
              role="tablist"
              aria-label="Who this alert is written for"
              className="flex gap-px overflow-hidden rounded-pill border border-line-2"
            >
              {INSIGHT.map((option, index) => (
                <button
                  key={option.audience}
                  role="tab"
                  type="button"
                  aria-selected={index === at}
                  onClick={() => setAt(index)}
                  className={cn(
                    'mono px-4 py-2 text-[11.5px] font-semibold uppercase tracking-[.12em] transition duration-200',
                    index === at
                      ? 'bg-amber/15 text-amber'
                      : 'text-faint hover:text-ink'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 min-[760px]:px-9 min-[760px]:py-10">
            <div className="mono text-[11.5px] font-semibold uppercase tracking-[.13em] text-faint">
              System insight
            </div>

            <p className="mt-4 max-w-[760px] font-display text-[clamp(22px,3vw,32px)] font-medium uppercase leading-[1.14] text-ink">
              {view.headline}
            </p>

            <ul className="mt-7 space-y-2.5">
              {view.lines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[15px] font-light leading-[1.5] text-muted"
                >
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-faint" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-l-2 border-amber/50 pl-5">
              <div className="mono text-[11.5px] font-semibold uppercase tracking-[.13em] text-amber">
                {view.actionLabel}
              </div>
              <p className="mt-2 text-[15.5px] font-light leading-[1.55] text-ink/90">
                → {view.action}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {view.buttons.map((button, index) => (
                <span
                  key={button}
                  className={cn(
                    'mono rounded-pill px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[.12em]',
                    index === 0
                      ? 'bg-[var(--cta)] text-[var(--cta-ink)]'
                      : 'border border-line-2 text-muted'
                  )}
                >
                  {button}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-line-2 bg-bg/40 px-6 py-5 min-[760px]:px-9">
            <p className="max-w-[760px] text-[13.5px] font-light leading-[1.6] text-faint">
              One event. Two readers. The operator gets the string number and the fault history; the
              household gets to know whether there is anything for them to do. Neither is a
              simplified version of the other — they are the two things the same reading actually
              means.
            </p>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}
