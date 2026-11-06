import {useState} from 'react';
import Glyph from '../../components/Glyph';
import {LABEL} from '../../components/kit';
import {CtaBand, PageHero, PagePhoto, PageSection} from '../../components/page';
import Reveal from '../../components/Reveal';
import type {Country, CountryCode} from '../../data/countries';
import {useCountry, usePageTitle} from '../../lib/country';
import {systemParts} from '../../data/parts';
import {cn} from '../../lib/cn';

export default function Tools() {
  usePageTitle('Solar tools');

  return (
    <main>
      <PageHero
        title="Solar tools,"
        accent="in your own numbers."
        lead="Work out roughly what solar and a battery are worth where you live, and see what each part of a solar system does."
        aside={<PagePhoto src="/assets/photos/system-explainer.jpg" alt="A home with roof solar and a battery in the garage" />}
      />

      <PageSection
        id="calculator"
        title="What could solar"
        accent="be worth to you?"
        lead="Move the sliders to match your home. The figures update as you go."
      >
        <Calculator />
      </PageSection>

      <PageSection
        id="diagram"
        title="What each part"
        accent="of a system does."
        lead="Tap a part to see what it is for and what can go wrong with it."
      >
        <SystemDiagram />
      </PageSection>

      <CtaBand title="Want the real numbers for your home?" action={{label: 'Start my free solar check', to: '/consumer'}} />
    </main>
  );
}

// A typical home's daily electricity use, as a starting point for the slider.
const TYPICAL_USE: Record<CountryCode, number> = {uk: 8, us: 28, au: 18, th: 15};

const BATTERIES = [0, 5, 10, 13.5];

// Share of solar a home uses as it is made, before a battery: roughly a third of generation,
// and never more than about half of what the home uses (the rest is used after dark).
const DIRECT_SHARE = 0.35;
const DAYTIME_USE = 0.5;
// Usable full cycles a home battery manages in a year, allowing for cloudy and winter days.
const CYCLES = 280;

function estimate(country: Country, kwp: number, dailyUse: number, battery: number) {
  const generation = kwp * country.kwhPerKwp;
  const use = dailyUse * 365;
  const direct = Math.min(generation * DIRECT_SHARE, use * DAYTIME_USE);
  const stored = Math.min(battery * 0.9 * CYCLES, generation - direct, use - direct);
  const selfUsed = direct + Math.max(0, stored);
  const exported = generation - selfUsed;
  const value = selfUsed * country.demo.importRate + exported * country.demo.exportRate;
  const batteryValue = Math.max(0, stored) * (country.demo.importRate - country.demo.exportRate);
  return {generation, selfUsed, exported, value, batteryValue, share: generation ? selfUsed / generation : 0};
}

function Calculator() {
  const country = useCountry();
  const [kwp, setKwp] = useState(4);
  const [dailyUse, setDailyUse] = useState(TYPICAL_USE[country.code]);
  const [battery, setBattery] = useState(0);

  // A new country starts from that country's typical home.
  const [seen, setSeen] = useState(country.code);
  if (seen !== country.code) {
    setSeen(country.code);
    setDailyUse(TYPICAL_USE[country.code]);
  }

  const result = estimate(country, kwp, dailyUse, battery);
  const money = (amount: number) => `${country.demo.currency}${Math.round(amount).toLocaleString(country.lang)}`;
  const kwh = (amount: number) => `${Math.round(amount).toLocaleString(country.lang)} kWh`;
  const rate = (value: number) =>
    country.demo.rateUnit === country.demo.currency ? `${country.demo.currency}${value.toFixed(2)}` : `${Math.round(value * 100)}${country.demo.rateUnit}`;

  return (
    <div className="grid gap-4 min-[1000px]:grid-cols-[1fr_1fr]">
      <Reveal className="rounded-frame bg-panel p-6 ring-1 ring-line-2 min-[760px]:p-8">
        <Slider label="Solar system size" value={kwp} min={1} max={15} step={0.5} unit="kWp" onChange={setKwp} />
        <Slider label="Electricity your home uses a day" value={dailyUse} min={3} max={60} step={1} unit="kWh" onChange={setDailyUse} />

        <fieldset className="mt-7">
          <legend className="text-[15px] font-medium text-ink">Battery</legend>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {BATTERIES.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={battery === size}
                onClick={() => setBattery(size)}
                className={cn(
                  'rounded-card px-3 py-3 text-[14.5px] transition duration-200',
                  battery === size ? 'bg-green-glow font-medium text-ink ring-2 ring-green' : 'bg-bg-2 text-ink ring-1 ring-line-2 hover:ring-green/45'
                )}
              >
                {size ? `${size} kWh` : 'None'}
              </button>
            ))}
          </div>
        </fieldset>
      </Reveal>

      <Reveal delay={0.06} aria-live="polite" className="flex flex-col rounded-frame bg-panel p-6 ring-1 ring-line-2 min-[760px]:p-8">
        <div className={cn(LABEL, 'text-green')}>Rough yearly estimate · {country.name}</div>
        <div className="mt-4 font-display text-[clamp(52px,7vw,88px)] font-extrabold leading-none text-ink">{money(result.value)}</div>
        <p className="mt-2 text-[16px] font-light text-muted">worth of electricity a year from your solar</p>

        <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line-2 ring-1 ring-line-2">
          {[
            ['Solar made', kwh(result.generation)],
            ['Used at home', `${Math.round(result.share * 100)}%`],
            ['Sent to the grid', kwh(result.exported)],
            ['Battery adds', battery ? money(result.batteryValue) : '—']
          ].map(([label, value]) => (
            <div key={label} className="bg-bg-2 px-5 py-4">
              <dt className="mono text-[10.5px] uppercase tracking-[.12em] text-faint">{label}</dt>
              <dd className="mono mt-1.5 text-[clamp(20px,2.2vw,26px)] font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-auto pt-6 text-[13px] font-light leading-[1.6] text-faint">
          A rough guide, not a quote. It assumes about {country.kwhPerKwp.toLocaleString(country.lang)} kWh a year from each kWp,
          and example rates of {rate(country.demo.importRate)}/kWh to buy and {rate(country.demo.exportRate)}/kWh for export.
          Your roof, tariff and usage change the real figure.
        </p>
      </Reveal>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-7 block first:mt-0">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-medium text-ink">{label}</span>
        <span className="mono text-[18px] font-semibold text-green">
          {value} <span className="text-[12px] font-normal text-faint">{unit}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-[var(--color-green)]"
      />
    </label>
  );
}


function SystemDiagram() {
  const country = useCountry();
  const list = systemParts(country);
  const [picked, setPicked] = useState(list[0].key);
  const part = list.find((item) => item.key === picked) ?? list[0];

  return (
    <div className="grid gap-4 min-[1000px]:grid-cols-[1.2fr_0.8fr]">
      <Reveal className="rounded-frame bg-panel p-6 ring-1 ring-line-2 min-[760px]:p-8">
        <ol className="relative grid grid-cols-2 gap-3 min-[560px]:grid-cols-4 min-[1000px]:grid-cols-4" aria-label="Parts of a solar system, in the order power flows">
          {list.map((item, index) => {
            const on = item.key === picked;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked(item.key)}
                  className={cn(
                    'flex h-full w-full flex-col items-center gap-3 rounded-card px-3 py-5 text-center transition duration-200',
                    on ? 'bg-green-glow ring-2 ring-green' : 'bg-bg-2 ring-1 ring-line-2 hover:ring-green/45'
                  )}
                >
                  <span className="mono text-[11px] font-semibold text-faint">{String(index + 1).padStart(2, '0')}</span>
                  {item.image ? (
                    <img src={item.image} alt="" className="h-14 w-full object-contain" />
                  ) : (
                    <span className="grid h-14 place-items-center">
                      <Glyph name={item.glyph} className={cn('h-9 w-9', on ? 'text-green' : 'text-ink')} />
                    </span>
                  )}
                  <span className="text-[14.5px] font-medium leading-tight text-ink">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-[13px] font-light text-faint">Numbered in the order power flows, from the roof to the grid.</p>
      </Reveal>

      <Reveal delay={0.06} aria-live="polite" className="rounded-frame bg-panel p-7 ring-1 ring-line-2 min-[760px]:p-9">
        <div key={part.key} className="animate-fadeup">
          {part.image ? (
            <img src={part.image} alt="" className="h-32 w-auto max-w-full object-contain" />
          ) : (
            <Glyph name={part.glyph} className="h-11 w-11 text-green" />
          )}
          <h3 className="mt-5 font-display text-[clamp(28px,3vw,38px)] font-extrabold leading-none text-ink">{part.name}</h3>
          <div className={cn(LABEL, 'mt-6 text-green')}>What it does</div>
          <p className="mt-2 text-[17px] font-light leading-[1.6] text-ink">{part.does}</p>
          <div className={cn(LABEL, 'mt-6 text-amber')}>What to watch for</div>
          <p className="mt-2 text-[17px] font-light leading-[1.6] text-muted">{part.fails}</p>
        </div>
      </Reveal>
    </div>
  );
}
