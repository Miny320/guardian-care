import {lazy, Suspense, useState} from 'react';
import {LABEL} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {HOME_MARKETS} from '../../../data/home';
import {cn} from '../../../lib/cn';
import {useCountry} from '../../../lib/country';

// The globe carries the world map data, so it loads on its own rather than with the page.
const Globe = lazy(() => import('./Globe'));

export default function Markets() {
  const {code} = useCountry();
  const [selected, setSelected] = useState<string>(code);
  // Switching country site moves the globe to the new country.
  const [seen, setSeen] = useState(code);
  if (seen !== code) {
    setSeen(code);
    setSelected(code);
  }
  const market = HOME_MARKETS.find((item) => item.key === selected) ?? HOME_MARKETS[0];

  return (
    <Section id="markets" hairline className="py-24 min-[760px]:py-36">
      <Wrap>
        <Reveal
          as="h2"
          className="text-balance text-center font-display text-[clamp(46px,7.6vw,104px)] font-extrabold leading-[0.92] tracking-[-0.02em] text-ink"
        >
          Market <span className="text-brand-gradient">Opportunity</span>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 min-[1000px]:mt-16 min-[1000px]:grid-cols-[1fr_1.05fr] min-[1000px]:gap-16">
          <div aria-live="polite" className="min-[1000px]:order-1">
            <div key={market.key} className="animate-fadeup">
              <div className={cn(LABEL, 'text-amber')}>{market.name}</div>

              <h3 className="mt-6 text-balance font-display text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[0.98] tracking-[-0.015em] text-ink">
                {market.headline}
              </h3>

              <dl className="mt-8 grid gap-px overflow-hidden rounded-card bg-line-2 ring-1 ring-line-2 min-[560px]:grid-cols-2">
                {market.facts.map((fact) => (
                  <div key={fact.label} className="bg-panel px-5 py-4">
                    <dt className="mono text-[10.5px] uppercase tracking-[.12em] text-faint">{fact.label}</dt>
                    <dd className="mt-1.5 text-[16px] font-medium leading-[1.4] text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 border-l-2 border-green pl-5">
                <div className={cn(LABEL, 'text-green')}>Where we help</div>
                <p className="mt-2 text-[clamp(17px,1.5vw,19px)] font-light leading-[1.65] text-muted">
                  {market.helps}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center min-[1000px]:order-2">
            <Suspense fallback={<div className="aspect-square w-full max-w-[560px]" />}>
              <Globe markets={HOME_MARKETS} selected={selected} onSelect={setSelected} />
            </Suspense>

            <div role="group" aria-label="Choose a market" className="mt-4 flex flex-wrap justify-center gap-2">
              {HOME_MARKETS.map((item) => {
                const on = item.key === selected;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelected(item.key)}
                    aria-pressed={on}
                    className={cn(
                      'rounded-pill px-4 py-2 text-[13px] font-medium transition duration-200',
                      on ? 'bg-green text-bg' : 'text-muted ring-1 ring-line-2 hover:text-ink hover:ring-green/50'
                    )}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
