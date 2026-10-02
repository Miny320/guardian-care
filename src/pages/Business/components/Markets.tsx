import {useState} from 'react';
import {useSearchParams} from 'react-router';
import {Heading, LABEL} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {COMMON, MARKETS} from '../../../data/markets';
import {cn} from '../../../lib/cn';

function indexOf(key: string | null): number {
  const found = MARKETS.findIndex((market) => market.key === key);
  return found === -1 ? 0 : found;
}

export default function Markets() {
  const [params] = useSearchParams();
  const requested = params.get('market');
  const [seen, setSeen] = useState(requested);
  const [at, setAt] = useState(() => indexOf(requested));

  if (requested !== seen) {
    setSeen(requested);
    setAt(indexOf(requested));
  }

  const market = MARKETS[at];
  const facts = [market.export, market.incentive, market.accreditation];

  return (
    <Section id="markets" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Where Guardian Care operates"
          title="One platform."
          accent="Four sets of rules."
          body="The physics of a roof does not change between territories. Everything that decides what its output is worth does."
        />

        <Reveal animation="animate-card-in">
          <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
            <div
              role="tablist"
              aria-label="Markets"
              className="grid grid-cols-2 gap-px border-b border-line-2 bg-line-2 min-[760px]:grid-cols-4"
            >
              {MARKETS.map((item, index) => {
                const active = index === at;

                return (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    id={`market-tab-${item.key}`}
                    aria-selected={active}
                    aria-controls="market-panel"
                    onClick={() => setAt(index)}
                    className={cn(
                      'px-5 py-4 text-left transition duration-200',
                      active ? 'bg-panel' : 'bg-panel/40 hover:bg-panel/70'
                    )}
                  >
                    <span
                      className={cn(
                        'mono block text-[10.5px] uppercase tracking-[.14em]',
                        active ? 'text-green' : 'text-faint'
                      )}
                    >
                      {item.short}
                    </span>
                    <span
                      className={cn(
                        'mt-1.5 block font-display text-[16px] font-semibold uppercase leading-[1.1] tracking-[-0.005em]',
                        active ? 'text-ink' : 'text-muted'
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              id="market-panel"
              role="tabpanel"
              aria-labelledby={`market-tab-${market.key}`}
              className="grid min-[900px]:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="border-b border-line-2 px-6 py-7 min-[900px]:border-b-0 min-[900px]:border-r min-[900px]:px-8">
                <h3 className="max-w-[540px] font-display text-[clamp(21px,2.5vw,28px)] font-medium uppercase leading-[1.14] text-ink">
                  {market.headline}
                </h3>
                <p className="mt-4 max-w-[560px] text-[15px] font-light leading-[1.7] text-muted">
                  {market.body}
                </p>

                <div className={cn(LABEL, 'mt-7 text-amber')}>What that changes operationally</div>
                <ul className="mt-3.5 space-y-2.5">
                  {market.operational.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-green"
                      />
                      <span className="text-[14.5px] font-light leading-[1.6] text-ink/85">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-7 min-[900px]:px-8">
                <dl className="space-y-px">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-b border-line-2 py-3.5 last:border-b-0">
                      <dt className="mono text-[10.5px] uppercase tracking-[.12em] text-faint">
                        {fact.label}
                      </dt>
                      <dd className="mt-1.5 text-[15px] font-medium leading-[1.4] text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 rounded-card border-l-2 border-green/45 bg-bg-2/60 px-5 py-4">
                  <div className={cn(LABEL, 'text-green')}>The same everywhere</div>
                  <ul className="mt-3 space-y-2.5">
                    {COMMON.map((line) => (
                      <li key={line} className="text-[13.5px] font-light leading-[1.55] text-muted">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}
