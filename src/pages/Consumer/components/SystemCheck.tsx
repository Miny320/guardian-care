import Assessment from '../../../components/Assessment/Assessment';
import type {Answers, ProfileLine} from '../../../components/Assessment/types';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {ERA_LABEL, EXISTING_STEPS, type ExistingPosition} from '../../../data/consumer';
import {cn} from '../../../lib/cn';
import {LABEL} from '../../../components/kit';

export default function SystemCheck({
  answers,
  position,
  done,
  onChange,
  onComplete,
  onReset
}: {
  answers: Answers;
  position: ExistingPosition;
  done: boolean;
  onChange: (next: Answers) => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <Section id="unseen" hairline className="py-16 min-[760px]:py-24">
      <Wrap>

        <div id="check" className="scroll-mt-24 pt-16 min-[760px]:pt-20">
          <Reveal className="mb-10 grid gap-6 min-[1000px]:grid-cols-[1fr_auto] min-[1000px]:items-end">
            <div className="max-w-[640px]">
              <div className={cn(LABEL, 'text-amber')}> Start my system check</div>
              <h3 className="mt-4 font-display text-[clamp(28px,3.8vw,44px)] font-semibold uppercase leading-[1] tracking-[-0.01em] text-ink">
                Check my existing solar system
              </h3>
              <p className="mt-4 text-[16.5px] font-light leading-[1.65] text-muted">
                Tell us a few simple details about your installation and Guardian Care will begin
                building your system profile. Your summary appears the moment you finish.
              </p>
            </div>

            <ul className="mono flex flex-col gap-2 text-[11.5px] uppercase tracking-[.12em] text-faint">
              {['Every question says why it is asked', '“I’m not sure” is always an answer', 'Nothing to download or sign'].map(
                (line) => (
                  <li key={line} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-green" />
                    {line}
                  </li>
                )
              )}
            </ul>
          </Reveal>

          <Reveal>
            <Assessment
              steps={EXISTING_STEPS}
              answers={answers}
              onChange={onChange}
              onComplete={onComplete}
              onReset={onReset}
              done={done}
              finishLabel="Build my system summary"
              profile={{heading: 'Your system profile', lines: profileLines(position)}}
            />
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

function profileLines(position: ExistingPosition): ProfileLine[] {
  return [
    {
      label: 'Installed',
      value: position.era ? ERA_LABEL[position.era] : null,
      pending: 'Not yet answered'
    },
    {
      label: 'System age',
      value: position.ageYears === null ? null : `${position.ageYears} years`,
      pending: 'Being calculated'
    },
    {
      label: 'Panels',
      value: position.panels === null ? null : String(position.panels)
    },
    {
      label: 'Estimated system size',
      value: position.systemKw === null ? null : `${position.systemKw} kWp`,
      pending: 'Being calculated'
    },
    {
      label: 'Estimated generation',
      value:
        position.annualKwh === null ? null : `${position.annualKwh.toLocaleString('en-GB')} kWh/yr`,
      pending: 'Being calculated'
    },
    {
      label: 'Battery storage',
      value: position.hasBattery
        ? position.batteryKwh
          ? `${position.batteryKwh} kWh`
          : 'Yes'
        : position.era
          ? 'None recorded'
          : null
    },
    {
      label: 'Potential FIT',
      value: position.era ? (position.potentialFit ? 'Yes — to confirm' : 'Unlikely') : null,
      pending: 'Awaiting install date'
    },
    {
      label: 'Monthly bill',
      value: position.monthlyBill === null ? null : `£${position.monthlyBill}`
    },
    {
      label: 'Import rate',
      value: position.monthlyBill === null ? null : `${position.importRate}p/kWh`
    }
  ];
}
