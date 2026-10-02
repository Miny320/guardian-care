import Glyph from '../../../components/Glyph';
import {Heading, LABEL, Tile} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_VAR} from '../../../data/command';
import {QUOTE, type PlanPosition} from '../../../data/plan';
import {cn} from '../../../lib/cn';

export default function Quote({position}: {position: PlanPosition}) {
  return (
    <Section id="quote" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          title="Every recommendation"
          accent="comes with a reason."
          body="Not a list of equipment and a price — what the system is designed to achieve, and why each part is there."
        />

        <ul className="grid gap-px overflow-hidden rounded-frame bg-line-2 ring-lit min-[720px]:grid-cols-2 min-[1120px]:grid-cols-3">
          {QUOTE.map((item, index) => (
            <Reveal
              key={item.key}
              as="li"
              delay={index * 0.05}
              className="group flex flex-col bg-panel px-6 py-7 transition-colors duration-250 hover:bg-panel-2 min-[760px]:px-7"
            >
              <div className="flex items-start justify-between gap-4">
                <Tile colour={TONE_VAR[item.tone]} size="lg">
                  <Glyph name={item.glyph} bold className="h-7 w-7" />
                </Tile>
                <span className="mono shrink-0 text-[11px] uppercase tracking-[.12em] text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="mt-6 font-display text-[clamp(25px,2.8vw,32px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
                {item.name}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className="mono rounded-pill px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.12em]"
                  style={{
                    color: TONE_VAR[item.tone],
                    background: `color-mix(in srgb, ${TONE_VAR[item.tone]} 13%, transparent)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${TONE_VAR[item.tone]} 34%, transparent)`
                  }}
                >
                  {item.does}
                </span>
                <span className="mono text-[11.5px] uppercase tracking-[.1em] text-faint">
                  {item.value(position)}
                </span>
              </div>

              <div className="mt-6 flex-1 border-t border-line-2 pt-5">
                <div className={cn(LABEL, 'text-faint')}>Why</div>
                <p className="mt-2.5 text-[14px] font-light leading-[1.55] text-muted">
                  {item.why}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </Section>
  );
}
