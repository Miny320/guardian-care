import Glyph from '../../../components/Glyph';
import {Heading, LABEL, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {WATCH} from '../../../data/businessFlow';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {cn} from '../../../lib/cn';

export default function Watch() {
  return (
    <Section id="watch" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="The rules engine"
          title="It is already"
          accent="watching."
          body="Six of the conditions Guardian Care raises on its own. None of them waits for a customer to pick up the phone."
        />

        <div className="grid gap-px overflow-hidden rounded-frame bg-line-2 ring-1 ring-line-2 min-[620px]:grid-cols-2 min-[1060px]:grid-cols-3">
          {WATCH.map((watch, index) => (
            <Reveal
              key={watch.key}
              delay={(index % 3) * 0.06}
              className="bg-panel/70 p-6 min-[760px]:p-7"
            >
              <span
                className={cn('inline-grid h-10 w-10 place-items-center rounded-tile', TONE_TEXT[watch.tone])}
                style={{
                  background: tint(TONE_VAR[watch.tone], 12),
                  boxShadow: `inset 0 0 0 1px ${tint(TONE_VAR[watch.tone], 26)}`
                }}
              >
                <Glyph name={watch.glyph} className="h-5 w-5" />
              </span>

              <div className="mt-5 font-display text-[21px] font-semibold uppercase leading-[1.08] tracking-[-0.01em] text-ink">
                {watch.trigger}
              </div>

              <div className="mt-4 flex items-start gap-2.5 border-t border-line-2 pt-4">
                <span
                  aria-hidden="true"
                  className={cn('mono mt-px shrink-0 text-[12px]', TONE_TEXT[watch.tone])}
                >
                  &#8594;
                </span>
                <span className="text-[13.5px] font-light leading-[1.5] text-muted">
                  {watch.action}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8 text-center">
          <span className={cn(LABEL, 'text-faint')}>
            Five priority levels &#183; only two of them reach your customer
          </span>
        </Reveal>
      </Wrap>
    </Section>
  );
}
