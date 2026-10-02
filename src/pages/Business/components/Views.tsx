import Glyph from '../../../components/Glyph';
import {Heading, LABEL_BASE, Panel, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {EVENT} from '../../../data/businessFlow';
import {TONE_TEXT, TONE_VAR, type StatusTone} from '../../../data/command';
import {cn} from '../../../lib/cn';

export default function Views() {
  return (
    <Section id="views" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="One record, two readings"
          title="Your customer never"
          accent="sees a fault code."
          body="The same event, written for the person who needs reassurance and for the person who needs to fix it."
        />

        <div className="mx-auto max-w-[940px]">
          <Reveal className="flex flex-col items-center">
            <span
              className={cn(LABEL_BASE, 'rounded-pill px-4 py-2 text-[11px] tracking-[.13em] text-red')}
              style={{
                background: tint('var(--color-red)', 10),
                boxShadow: `inset 0 0 0 1px ${tint('var(--color-red)', 30)}`
              }}
            >
              {EVENT.raw}
            </span>

            <span aria-hidden="true" className="h-7 w-px bg-line-2" />
            <span aria-hidden="true" className="h-px w-1/2 bg-line-2 min-[760px]:w-[52%]" />
            <span aria-hidden="true" className="relative w-1/2 min-[760px]:w-[52%]">
              <span className="absolute left-0 top-0 h-7 w-px bg-line-2" />
              <span className="absolute right-0 top-0 h-7 w-px bg-line-2" />
              <span className="block h-7" />
            </span>
          </Reveal>

          <div className="grid gap-4 min-[760px]:grid-cols-2">
            <Reveal>
              <Panel
                title={EVENT.customer.who}
                tone={EVENT.customer.tone}
                glyph={EVENT.customer.glyph}
                className="h-full"
                bodyClassName="flex flex-col"
              >
                <p className="text-[15.5px] font-light leading-[1.6] text-ink/90">
                  {EVENT.customer.line}
                </p>

                <div className="mt-auto flex items-center gap-2.5 border-t border-line-2 pt-5">
                  <span className={TONE_TEXT[EVENT.customer.tone]}>
                    <Glyph name="monitoring" className="h-4 w-4" />
                  </span>
                  <span className="text-[12.5px] font-light leading-tight text-muted">
                    No code, no jargon, no reason to ring you.
                  </span>
                </div>

                <Underline tone={EVENT.customer.tone} />
              </Panel>
            </Reveal>

            <Reveal delay={0.08}>
              <Panel
                title={EVENT.operator.who}
                tone={EVENT.operator.tone}
                glyph={EVENT.operator.glyph}
                className="h-full"
                bodyClassName="flex flex-col"
              >
                <p className="mono text-[13.5px] leading-[1.6] text-ink/90">
                  {EVENT.operator.line}
                </p>

                <dl className="mt-5 divide-y divide-line-2 border-t border-line-2 pt-1">
                  {EVENT.operator.fields.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-[12.5px] font-light text-muted">{label}</dt>
                      <dd className="mono text-right text-[12.5px] font-semibold text-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Underline tone={EVENT.operator.tone} />
              </Panel>
            </Reveal>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

function Underline({tone}: {tone: StatusTone}) {
  return (
    <span
      aria-hidden="true"
      className="mt-5 block h-px"
      style={{background: `linear-gradient(90deg, ${tint(TONE_VAR[tone], 45)}, transparent)`}}
    />
  );
}
