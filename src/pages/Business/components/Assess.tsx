import Assessment from '../../../components/Assessment/Assessment';
import type {Answers, ProfileLine} from '../../../components/Assessment/types';
import {Heading} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {
  AFTERCARE_LABEL,
  BUSINESS_STEPS,
  INSTALLED_LABEL,
  MARKET_LABEL,
  type BusinessPosition
} from '../../../data/businessFlow';

export default function Assess({
  answers,
  position,
  done,
  onChange,
  onComplete,
  onReset
}: {
  answers: Answers;
  position: BusinessPosition;
  done: boolean;
  onChange: (next: Answers) => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <Section id="assess" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Your business"
          title="Six questions."
          accent="Then where to start."
          body="Guardian Care is deployed in stages. Your answers decide which stage is worth running first."
        />

        <Reveal>
          <Assessment
            steps={BUSINESS_STEPS}
            answers={answers}
            onChange={onChange}
            onComplete={onComplete}
            onReset={onReset}
            done={done}
            finishLabel="Show me where to start"
            profile={{heading: 'Your business profile', lines: profileLines(position)}}
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
