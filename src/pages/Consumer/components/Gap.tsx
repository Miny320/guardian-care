import Counter from '../../../components/Counter';
import {Heading, LABEL, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {GAP} from '../../../data/guardian';
import {cn} from '../../../lib/cn';

export default function Gap() {
  return (
    <Section id="gap" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="The gap"
          title="You were sold"
          accent="a number."
          body="Solar is quoted on what it should generate each year. Almost nobody ever checks whether it did."
        />

        <Reveal className="mx-auto max-w-[760px]">
          <Bar
            label="What it was sold on"
            percent={GAP.expected}
            colour="var(--color-line-2)"
            value="100%"
            tone="text-faint"
          />

          <div className="mt-8">
            <Bar
              label="What it actually makes"
              percent={GAP.actual}
              colour="var(--color-red)"
              value={`${GAP.actual}%`}
              tone="text-red"
              big
            />
          </div>

          <div
            className="mt-10 rounded-frame px-6 py-6 text-center min-[760px]:px-10 min-[760px]:py-8"
            style={{
              background: tint('var(--color-red)', 6),
              boxShadow: `inset 0 0 0 1px ${tint('var(--color-red)', 18)}`
            }}
          >
            <div className="font-display text-[clamp(26px,4.4vw,44px)] font-semibold uppercase leading-[1.05] tracking-[-0.015em] text-ink">
              <Counter value={String(GAP.years)} /> years.
              <br />
              <span className="text-red">Nobody checked.</span>
            </div>
            <p className="mx-auto mt-5 max-w-[420px] text-[15.5px] font-light leading-[1.6] text-muted">
              The panels are still on the roof. The statements still arrive. Nothing tells you the
              number has moved.
            </p>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}

function Bar({
  label,
  percent,
  colour,
  value,
  tone,
  big
}: {
  label: string;
  percent: number;
  colour: string;
  value: string;
  tone: string;
  big?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className={cn(LABEL, 'text-faint')}>{label}</span>
        <span
          className={cn(
            'mono font-semibold leading-none',
            big ? 'text-[clamp(34px,6vw,56px)]' : 'text-[22px]',
            tone
          )}
        >
          {value}
        </span>
      </div>

      <div
        className={cn('mt-3 overflow-hidden rounded-pill bg-line-2', big ? 'h-5' : 'h-3')}
        role="img"
        aria-label={`${label}: ${value}`}
      >
        <span
          className="block h-full rounded-pill"
          style={{width: `${percent}%`, background: colour}}
        />
      </div>
    </div>
  );
}
