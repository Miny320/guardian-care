import Assessment from '../../../components/Assessment/Assessment';
import type {Answers, ProfileLine} from '../../../components/Assessment/types';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {GOAL_LABEL, PLAN_STEPS, type PlanPosition} from '../../../data/plan';

export default function Assess({
  answers,
  position,
  done,
  onChange,
  onComplete,
  onReset
}: {
  answers: Answers;
  position: PlanPosition;
  done: boolean;
  onChange: (next: Answers) => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <Section id="assess" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mb-10 grid gap-6 min-[1000px]:grid-cols-[1fr_auto] min-[1000px]:items-end">
          <div className="max-w-[660px]">
            <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
              Your position first.
              <br />
              <span className="text-brand-gradient">Panels later.</span>
            </h2>
            <p className="mt-5 text-[16.5px] font-light leading-[1.65] text-muted">
              A few questions about what you pay now. The estimate is built from your answers, not
              from a product we would like to sell you.
            </p>
          </div>

          <ul className="mono flex flex-col gap-2 text-[11.5px] uppercase tracking-[.12em] text-faint">
            {[
              'Every question says why it is asked',
              'Blank fields fall back to averages',
              '“I don’t know” is always an answer'
            ].map((line) => (
              <li key={line} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green" />
                {line}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <Assessment
            steps={PLAN_STEPS}
            answers={answers}
            onChange={onChange}
            onComplete={onComplete}
            onReset={onReset}
            done={done}
            finishLabel="Build my energy estimate"
            profile={{heading: 'Your current position', lines: profileLines(position)}}
          />
        </Reveal>
      </Wrap>
    </Section>
  );
}

function profileLines(position: PlanPosition): ProfileLine[] {
  return [
    {
      label: 'Monthly electricity bill',
      value: position.monthlyBill === null ? null : `£${position.monthlyBill}`,
      pending: 'Not yet answered'
    },
    {
      label: 'Estimated annual spend',
      value:
        position.annualSpend === null ? null : `£${position.annualSpend.toLocaleString('en-GB')}`,
      pending: 'Being calculated'
    },
    {
      label: 'Import rate',
      value: position.monthlyBill === null ? null : `${position.importRate}p/kWh`
    },
    {
      label: 'Standing charge',
      value: position.monthlyBill === null ? null : `${position.standingCharge}p/day`
    },
    {
      label: 'Estimated annual usage',
      value:
        position.annualKwh === null ? null : `${position.annualKwh.toLocaleString('en-GB')} kWh`,
      pending: 'Being calculated'
    },
    {
      label: 'What you want to achieve',
      value: position.goal ? GOAL_LABEL[position.goal] : null,
      pending: 'Not yet answered'
    },
    {
      label: 'Indicative system',
      value: position.systemKw === null ? null : `${position.systemKw} kWp`,
      pending: 'Being calculated'
    },
    {
      label: 'Storage',
      value: position.batteryKwh
        ? `${position.batteryKwh} kWh for review`
        : position.systemKw
          ? 'For review'
          : null
    }
  ];
}
