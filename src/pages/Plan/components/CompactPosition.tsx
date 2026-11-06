import JourneyResult, {FactGrid, type Fact} from '../../../components/JourneyResult';
import {GOAL_LABEL, money, type PlanPosition} from '../../../data/plan';

// The pop-up version of the plan: the key figures and one observation, on one screen.
export default function CompactPosition({position, onRestart}: {position: PlanPosition; onRestart: () => void}) {
  const {annualKwh, directKwh, batteryExtraKwh, combinedValue, systemKw, panels, batteryKwh, importRate} = position;
  const ownShare =
    annualKwh && directKwh !== null ? Math.round(((directKwh + (batteryExtraKwh ?? 0)) / annualKwh) * 100) : null;

  const facts: Fact[] = [
    {
      label: 'Electricity today',
      value: position.monthlyBill === null ? '—' : `£${position.monthlyBill} / month`,
      note: `Grid rate ${importRate}p/kWh`
    },
    {
      label: 'Yearly usage',
      value: annualKwh === null ? '—' : `≈ ${annualKwh.toLocaleString('en-GB')} kWh`,
      note: 'From your bill, less the standing charge'
    },
    {
      label: 'Indicative system',
      value: systemKw === null ? '—' : `${systemKw} kWp${panels ? ` · ${panels} panels` : ''}`,
      note: 'Sized to what you use'
    },
    {
      label: 'Battery',
      value: batteryKwh ? `${batteryKwh} kWh` : 'Not included',
      note: batteryKwh ? 'Holds daytime solar for the evening' : 'Can be added later'
    },
    {
      label: 'Your own power',
      value: ownShare === null ? '—' : `≈ ${ownShare}%`,
      note: 'Of your electricity, from your own roof',
      tone: 'text-green'
    },
    {
      label: 'Your main goal',
      value: position.goal ? (GOAL_LABEL[position.goal] ?? position.goal) : 'Not stated'
    },
    {
      label: 'Grid cost avoided',
      value: combinedValue === null ? '—' : `≈ ${money(combinedValue)} / yr`,
      note: 'Depends on roof, weather and tariff',
      tone: 'text-green'
    }
  ];

  const system = systemKw ? `A ${systemKw} kWp system${batteryKwh ? ` with a ${batteryKwh} kWh battery` : ''}` : 'Solar';

  return (
    <JourneyResult
      title="Your year,"
      accent="as it could be."
      body="Built from your answers, at the rate you gave us. Every figure is an estimate, not a quotation."
      onRestart={onRestart}
      facts={
        <FactGrid
          title="Your energy plan"
          facts={facts}
          caption="A survey confirms these figures. Once installed, monitoring measures them for real."
        />
      }
      insight={{
        label: 'Guardian Care Intelligence · Initial estimate',
        headline:
          ownShare === null
            ? 'Your bill is where the plan starts'
            : ownShare >= 90
              ? 'Almost all of your electricity could be your own'
              : `Around ${ownShare}% of your electricity could be your own`,
        body:
          combinedValue === null
            ? 'With your monthly bill, Guardian Care can size a system to the way you actually use power, rather than to an average home.'
            : `Today every unit is bought from the grid. ${system} could avoid about ${money(combinedValue)} of grid cost a year, depending on your roof, your tariff and when you use power.`,
        nextLabel: 'What we recommend',
        next: 'Confirm your roof and tariff with a short survey, then watch the system live from day one, so the saving is measured rather than promised.'
      }}
    />
  );
}
