import JourneyResult, {FactGrid, type Fact} from '../../../components/JourneyResult';
import {AFTERCARE_LABEL, BUSINESS_STEPS, INSTALLED_LABEL, MARKET_LABEL, ROLLOUT, type BusinessPosition} from '../../../data/businessFlow';

// Plain-word names for the customer types picked in the questions.
const CUSTOMER_LABEL: Record<string, string> = Object.fromEntries(
  BUSINESS_STEPS.flatMap((step) => (step.key === 'customers' && 'options' in step ? step.options : [])).map((option) => [
    option.value,
    option.label
  ])
);
import {suggest} from './Model';

// The pop-up version of the business model: the profile and where to start, on one screen.
export default function CompactModel({position, onRestart}: {position: BusinessPosition; onRestart: () => void}) {
  const suggestion = suggest(position);

  const facts: Fact[] = [
    {label: 'Systems installed', value: position.market ? MARKET_LABEL[position.market] : 'Not stated'},
    {
      label: 'Installed customers',
      value: position.installedBand ? INSTALLED_LABEL[position.installedBand] : 'Not stated'
    },
    {
      label: 'Systems still running',
      value: position.installedCount ? `~${position.installedCount.toLocaleString('en-GB')}` : '—',
      note: 'Still producing data after sign-off',
      tone: 'text-green'
    },
    {
      label: 'Current aftercare',
      value: position.aftercare ? AFTERCARE_LABEL[position.aftercare] : 'Not stated',
      note: position.reactive ? 'Contact starts with a problem' : undefined,
      tone: position.reactive ? 'text-amber' : undefined
    },
    {label: 'Monitoring coverage', value: position.monitoringCoverage},
    {label: 'Primary goal', value: position.primaryGoal ?? 'Not stated'},
    {
      label: 'Customer types',
      value: position.customerTypes.length
        ? position.customerTypes.length > 1
          ? `${position.customerTypes.length} types`
          : (CUSTOMER_LABEL[position.customerTypes[0]] ?? position.customerTypes[0])
        : 'Not stated',
      note:
        position.customerTypes.length > 1
          ? position.customerTypes.map((type) => CUSTOMER_LABEL[type] ?? type).join(', ')
          : undefined
    }
  ];

  return (
    <JourneyResult
      title="Where to start"
      accent="in your business."
      body="Built from your six answers, and specific about the first stage rather than the platform as a whole."
      onRestart={onRestart}
      facts={
        <FactGrid
          title="Your business profile"
          facts={facts}
          badge="From your answers"
          caption="Once your customer systems are connected, these become live figures for every installation."
        />
      }
      insight={{
        label: 'Guardian Care Intelligence · Where to start',
        headline: suggestion.headline,
        body: suggestion.body,
        nextLabel: 'Your first move',
        next: `${ROLLOUT[0]}, then ${ROLLOUT[1].toLowerCase()}. The other stages follow once those systems are visible.`
      }}
      contactTo="/contact?service=business"
    />
  );
}
