import {useState} from 'react';
import Counter from '../../../components/Counter';
import Glyph from '../../../components/Glyph';
import {Heading, LABEL, Tile} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {DASHBOARD, SUGGESTIONS} from '../../../data/plan';
import {cn} from '../../../lib/cn';
import {LiveDot} from '../../Home/components/Conduit';
import {Caption, Panel} from './parts';

const ANSWERS = [
  'Are you generating what was expected?',
  'How much are you actually using yourself?',
  'Is the battery earning its place?',
  'How much are you still purchasing?',
  'Are you exporting significant surplus?',
  'Is anything worth reviewing?'
];

export default function Afterwards() {
  const [at, setAt] = useState(0);
  const picked = SUGGESTIONS[at];

  return (
    <Section id="after" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow=" After installation"
          title="Installation"
          accent="is not the end."
          body="Once connected, Guardian Care stops estimating. Every figure becomes a reading."
        />

        <Reveal animation="animate-card-in" className="min-w-0">
          <Panel
            title="Your Guardian Care account · today"
            tone="green"
            glyph="monitoring"
            aside={
              <span className="flex items-center gap-2">
                <LiveDot />
                <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-green">
                  Measured
                </span>
              </span>
            }
            bodyClassName="p-0"
          >
            <div className="grid grid-cols-2 gap-px bg-line-2 min-[620px]:grid-cols-3 min-[1080px]:grid-cols-6">
              {DASHBOARD.map((reading) => (
                <div key={reading.key} className="bg-panel px-4 py-5 min-[520px]:px-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-faint">
                      {reading.label}
                    </span>
                    <Glyph
                      name={reading.glyph}
                      className={cn('h-5 w-5 shrink-0 opacity-70', TONE_TEXT[reading.tone])}
                    />
                  </div>
                  <div
                    className={cn(
                      'mono mt-3.5 text-[clamp(21px,2.4vw,27px)] font-semibold leading-none',
                      TONE_TEXT[reading.tone]
                    )}
                  >
                    <Counter value={reading.value} />
                  </div>
                  <div className="mono mt-2 text-[11.5px] text-faint">{reading.unit}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-2 bg-bg/40 px-5 py-4 min-[520px]:px-6">
              <Caption>Log in whenever you like</Caption>
              <span aria-hidden="true" className="text-faint/40">
              </span>
              <Caption>Nothing you have to check</Caption>
              <span aria-hidden="true" className="text-faint/40">
              </span>
              <Caption>Guardian Care watches it for you</Caption>
            </div>
          </Panel>
        </Reveal>

        <div className="mt-16 grid gap-10 min-[1080px]:grid-cols-[0.78fr_1.22fr] min-[1080px]:gap-14">
          <div>
            <Reveal>
              <div className={cn(LABEL, 'text-amber')}> Guardian Care keeps learning</div>
              <h3 className="mt-4 font-display text-[clamp(26px,3.4vw,40px)] font-semibold uppercase leading-[1] tracking-[-0.01em] text-ink">
                Your quote was a guess.
                <br />
                <span className="text-brand-gradient">Your system is not.</span>
              </h3>
            </Reveal>

            <Reveal delay={0.08} as="ul" className="mt-7 space-y-2.5">
              {ANSWERS.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[7px] text-[9px] text-green">
                  </span>
                  <span className="text-[14.5px] font-light leading-[1.45] text-ink/85">
                    {line}
                  </span>
                </li>
              ))}
            </Reveal>
          </div>

          <div className="min-w-0">
            <Reveal className="grid gap-2.5 min-[620px]:grid-cols-2">
              {SUGGESTIONS.map((suggestion, index) => {
                const on = index === at;
                const colour = TONE_VAR[suggestion.tone];

                return (
                  <button
                    key={suggestion.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAt(index)}
                    className={cn(
                      'flex items-center gap-3.5 rounded-card px-4 py-3.5 text-left transition duration-250 ease-brand',
                      on
                        ? 'bg-panel-2'
                        : 'bg-panel/55 ring-1 ring-line-2 hover:-translate-y-0.5 hover:ring-ink/20'
                    )}
                    style={on ? {boxShadow: `inset 0 0 0 2px ${colour}`} : undefined}
                  >
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-tile',
                        on && 'text-bg'
                      )}
                      style={
                        on
                          ? {background: colour}
                          : {
                              background: `color-mix(in srgb, ${colour} 11%, transparent)`,
                              border: `1px solid color-mix(in srgb, ${colour} 26%, transparent)`,
                              color: `color-mix(in srgb, ${colour} 72%, var(--color-faint))`
                            }
                      }
                    >
                      <Glyph name={suggestion.glyph} bold={on} className="h-[18px] w-[18px]" />
                    </span>
                    <span
                      className={cn(
                        'text-[14.5px] leading-tight',
                        on ? 'font-medium text-ink' : 'font-light text-ink/80'
                      )}
                    >
                      {suggestion.name}
                    </span>
                  </button>
                );
              })}
            </Reveal>

            <Reveal key={picked.key} animation="animate-card-in" className="mt-3">
              <div className="glass ring-lit overflow-hidden rounded-frame">
                <div className="flex items-center gap-3.5 border-b border-line-2 px-5 py-4 min-[520px]:px-6">
                  <Tile colour={TONE_VAR[picked.tone]} size="sm">
                    <Glyph name={picked.glyph} bold className="h-[18px] w-[18px]" />
                  </Tile>
                  <span className={cn(LABEL, TONE_TEXT[picked.tone])}>{picked.name}</span>
                </div>

                <div className="px-5 py-6 min-[520px]:px-6">
                  <p className="font-display text-[clamp(19px,2.3vw,25px)] font-medium uppercase leading-[1.16] text-ink">
                    “{picked.says}”
                  </p>

                  <div className="mt-6 border-t border-line-2 pt-5">
                    <div className={cn(LABEL, 'text-faint')}>Suggested review</div>
                    <p
                      className={cn(
                        'mt-2.5 border-l-2 pl-4 text-[15px] font-light leading-[1.55] text-ink/90'
                      )}
                      style={{
                        borderColor: `color-mix(in srgb, ${TONE_VAR[picked.tone]} 55%, transparent)`
                      }}
                    >
                      → {picked.review}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal
              delay={0.08}
              className="mono mt-4 text-[11.5px] uppercase leading-[1.5] tracking-[.12em] text-faint"
            >
              What it saw, then what it would look at. Nothing when there is nothing worth saying.
            </Reveal>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
