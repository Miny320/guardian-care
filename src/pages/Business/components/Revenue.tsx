import {Heading, LABEL, LABEL_BASE, PRIMARY, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {OPPORTUNITY} from '../../../data/businessFlow';
import {cn} from '../../../lib/cn';

export default function Revenue() {
  const scale = Math.max(OPPORTUNITY.exported, OPPORTUNITY.imported);

  return (
    <Section id="revenue" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Upgrade intelligence"
          title="Never say"
          accent="&ldquo;buy a battery&rdquo; again."
          body="Guardian Care finds the customers who already need one, and hands your team the reason."
        />

        <div className="mx-auto grid max-w-[1000px] gap-4 min-[900px]:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="glass ring-lit rounded-frame p-6 min-[760px]:p-7">
            <div className={cn(LABEL, 'text-faint')}>One customer, {OPPORTUNITY.window}</div>

            <div className="mt-7 space-y-7">
              <Bar
                label="Sold to the grid"
                value={OPPORTUNITY.exported}
                scale={scale}
                colour="var(--color-blue)"
                note="At export rates"
              />
              <Bar
                label="Bought back after dark"
                value={OPPORTUNITY.imported}
                scale={scale}
                colour="var(--color-orange)"
                note="At retail rates"
              />
            </div>

            <p className="mt-7 border-t border-line-2 pt-5 text-[13.5px] font-light leading-[1.55] text-muted">
              The same electricity, leaving cheap and returning dear. Guardian Care sees this
              across your whole portfolio at once.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col gap-4">
            <Message
              label="What everyone sends"
              tone="var(--color-faint)"
              body={OPPORTUNITY.weak}
              faded
            />
            <Message
              label="What Guardian Care sends"
              tone="var(--color-green)"
              body={OPPORTUNITY.strong}
            />

            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
              <a href="#join" className={PRIMARY}>
                Put this in front of your team →
              </a>
              <span className={cn(LABEL, 'text-faint')}>Their data. Your offer.</span>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

function Bar({
  label,
  value,
  scale,
  colour,
  note
}: {
  label: string;
  value: number;
  scale: number;
  colour: string;
  note: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[14px] font-light text-muted">{label}</span>
        <span className="mono text-[19px] font-semibold" style={{color: colour}}>
          {value.toLocaleString('en-GB')}
          <span className="mono ml-1.5 text-[11.5px] font-normal text-faint">kWh</span>
        </span>
      </div>

      <div className="mt-3 h-2.5 overflow-hidden rounded-pill bg-line-2">
        <span
          className="block h-full rounded-pill"
          style={{width: `${(value / scale) * 100}%`, background: colour}}
        />
      </div>

      <div className="mono mt-2 text-[11px] uppercase tracking-[.12em] text-faint">{note}</div>
    </div>
  );
}

function Message({
  label,
  tone,
  body,
  faded
}: {
  label: string;
  tone: string;
  body: string;
  faded?: boolean;
}) {
  return (
    <div
      className={cn('rounded-frame px-6 py-5', faded && 'opacity-60')}
      style={{
        background: tint(tone, faded ? 4 : 7),
        boxShadow: `inset 0 0 0 1px ${tint(tone, faded ? 14 : 26)}`
      }}
    >
      <div className={cn(LABEL_BASE, 'text-[11px] tracking-[.13em]')} style={{color: tone}}>
        {label}
      </div>
      <p
        className={cn(
          'mt-3 leading-[1.55]',
          faded
            ? 'text-[15px] font-light text-muted'
            : 'text-[16.5px] font-light text-ink min-[760px]:text-[17.5px]'
        )}
      >
        &ldquo;{body}&rdquo;
      </p>
    </div>
  );
}
