import Assessment from '../../../components/Assessment/Assessment';
import type {Answers, ProfileLine} from '../../../components/Assessment/types';
import {LABEL_BASE} from '../../../components/kit';
import {MarketNotice} from '../../../components/page';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {cn} from '../../../lib/cn';
import {
  AFTERCARE_LABEL,
  BUSINESS_STEPS,
  INSTALLED_LABEL,
  MARKET_LABEL,
  type BusinessPosition
} from '../../../data/businessFlow';

export default function Assess({
  embedded = false,
  answers,
  position,
  done,
  onChange,
  onComplete,
  onReset
}: {
  // In the pop-up the questions take the full width, without the profile beside them.
  embedded?: boolean;
  answers: Answers;
  position: BusinessPosition;
  done: boolean;
  onChange: (next: Answers) => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <Section id="assess" className="under-nav pb-16 min-[760px]:pb-24">
      <Wrap>
        <Reveal className="mx-auto mb-14 max-w-[740px] pt-12 text-center min-[760px]:pt-16">
          <div className={cn(LABEL_BASE, 'mb-5 text-[11px] tracking-[.12em] text-green')}>
            Your business
          </div>
          <h1 className="font-display text-[clamp(32px,4.6vw,56px)] font-extrabold leading-[0.96] tracking-[-0.015em] text-ink">
            Six questions.
            <br />
            <span className="text-brand-gradient">Then where to start.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[16.5px] font-light leading-[1.65] text-muted">
            Guardian Care is deployed in stages. Your answers decide which stage is worth running
            first.
          </p>
        </Reveal>

        <MarketNotice />
        <Reveal>
          <Assessment
            steps={BUSINESS_STEPS}
            answers={answers}
            onChange={onChange}
            onComplete={onComplete}
            onReset={onReset}
            done={done}
            finishLabel="Show me where to start"
            profile={embedded ? undefined : {heading: 'Your business profile', lines: profileLines(position)}}
          />
        </Reveal>
      </Wrap>
    </Section>
  );
}

function profileLines(position: BusinessPosition): ProfileLine[] {
  return [
    {
      label: 'Market',
      value: position.market ? MARKET_LABEL[position.market] : null,
      pending: 'Not yet answered'
    },
    {
      label: 'Installed customers',
      value: position.installedBand ? INSTALLED_LABEL[position.installedBand] : null
    },
    {
      label: 'Current aftercare',
      value: position.aftercare ? AFTERCARE_LABEL[position.aftercare] : null
    },
    {
      label: 'Monitoring coverage',
      value: position.aftercare ? position.monitoringCoverage : null,
      pending: 'Being established'
    },
    {
      label: 'Primary goal',
      value: position.primaryGoal
    },
    {
      label: 'Customer types',
      value: position.customerTypes.length ? `${position.customerTypes.length} selected` : null
    }
  ];
}
