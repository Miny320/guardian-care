import {CtaBand, NumberedGrid, PageHero, PagePhoto, PageSection} from '../../components/page';
import {LABEL} from '../../components/kit';
import Reveal from '../../components/Reveal';
import type {Country} from '../../data/countries';
import {useCountry, usePageTitle} from '../../lib/country';
import {cn} from '../../lib/cn';

// One example day for a 4 kWp system. kWh, not money, so it reads the same in every country.
const DAY = {generated: 14.6, used: 13.1, imported: 8.5, exported: 10.0, battery: 64};

const MONITOR = [
  {name: 'Solar generation', line: 'How much electricity your panels are making.'},
  {name: 'Household use', line: 'How much electricity your home uses, and when.'},
  {name: 'Grid imports', line: 'How much you are still buying from the grid.'},
  {name: 'Exports', line: 'How much surplus solar you send to the grid, where your meter records it.'},
  {name: 'Battery performance', line: 'Charging, stored energy and discharge on compatible batteries.'},
  {name: 'Costs & earnings', line: 'Estimated import costs and export earnings, using your confirmed rates.'}
];

const ALERTS = [
  {title: 'Performance alert', line: 'Your solar is making less than expected for the conditions. It may be worth investigating.'},
  {title: 'Usage advice', line: 'You are buying grid electricity while your panels are generating. Some usage could move to daylight hours.'},
  {title: 'Battery insight', line: 'Your battery often runs low before the evening ends. Its settings may need a review.'},
  {title: 'Maintenance reminder', line: 'Your system may be due an inspection or service.'}
];

function money({demo}: Country, amount: number) {
  return `${demo.currency}${amount.toFixed(2)}`;
}

function rate({demo}: Country, value: number) {
  return demo.rateUnit === demo.currency ? `${demo.currency}${value.toFixed(2)}/kWh` : `${Math.round(value * 100)}${demo.rateUnit}/kWh`;
}

export default function EnergyIntelligence() {
  const country = useCountry();
  usePageTitle('Energy intelligence & monitoring');

  const {importRate, exportRate} = country.demo;
  const importCost = DAY.imported * importRate;
  const solarValue = (DAY.generated - DAY.exported) * importRate + DAY.exported * exportRate;

  const tiles = [
    {label: 'Solar made', value: `${DAY.generated} kWh`, tone: 'text-amber'},
    {label: 'Home used', value: `${DAY.used} kWh`, tone: 'text-ink'},
    {label: 'Bought from grid', value: `${DAY.imported} kWh`, tone: 'text-orange'},
    {label: 'Sent to grid', value: `${DAY.exported.toFixed(1)} kWh`, tone: 'text-blue'},
    {label: 'Grid cost today', value: money(country, importCost), tone: 'text-red'},
    {label: 'Solar value today', value: money(country, solarValue), tone: 'text-green'}
  ];

  return (
    <main>
      <PageHero
        title="Understand your electricity."
        accent="Take control of it."
        lead="With suitable monitoring, you see what your system makes, what your home uses, and what you buy and sell. We turn that into advice you can act on."
        action={{label: 'Set up energy intelligence', to: '/contact?service=intelligence'}}
        aside={<PagePhoto src="/assets/photos/service-intelligence.jpg" alt="A homeowner checking an energy dashboard on a wall-mounted screen" />}
      />

      <PageSection title="What your dashboard" accent="could show.">
        <Reveal className="rounded-frame bg-panel p-6 ring-1 ring-line-2 min-[760px]:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={cn(LABEL, 'text-green')}>Today · Example</span>
            <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">Battery {DAY.battery}%</span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line-2 ring-1 ring-line-2 min-[760px]:grid-cols-3">
            {tiles.map((tile) => (
              <div key={tile.label} className="bg-bg-2 px-5 py-5">
                <dt className="mono text-[10.5px] uppercase tracking-[.12em] text-faint">{tile.label}</dt>
                <dd className={cn('mono mt-2 text-[clamp(22px,2.6vw,32px)] font-semibold', tile.tone)}>{tile.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-card bg-green/10 px-5 py-4 ring-1 ring-green/35">
            <div className={cn(LABEL, 'text-green')}>Today’s tip</div>
            <p className="mt-1.5 text-[16px] leading-[1.55] text-ink">
              You bought electricity at 1pm while your panels were generating. Running the dishwasher after 11am
              could use more of your own solar.
            </p>
          </div>
          <p className="mt-5 text-[13px] font-light text-faint">
            Example figures for a 4 kWp system, using example rates of {rate(country, importRate)} to buy and{' '}
            {rate(country, exportRate)} for export. Your dashboard uses your own tariff and meter data.
          </p>
        </Reveal>
      </PageSection>

      <PageSection title="Six numbers that show" accent="how your system is doing.">
        <NumberedGrid items={MONITOR} />
      </PageSection>

      <PageSection
        title="Alerts that"
        accent="mean something."
        lead="You only hear from us when reliable monitoring data supports it, so an alert is always worth reading."
      >
        <ul className="grid gap-3 min-[760px]:grid-cols-2">
          {ALERTS.map((alert) => (
            <li key={alert.title} className="rounded-card bg-panel px-6 py-5 ring-1 ring-line-2">
              <div className={cn(LABEL, 'text-amber')}>{alert.title}</div>
              <p className="mt-2 text-[16px] font-light leading-[1.6] text-ink">{alert.line}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      <CtaBand title="Know what your system is doing, every day." action={{label: 'Set up energy intelligence', to: '/contact?service=intelligence'}} />
    </main>
  );
}
