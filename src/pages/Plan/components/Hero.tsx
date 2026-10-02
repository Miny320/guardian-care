import Counter from '../../../components/Counter';
import Glyph, {type GlyphName} from '../../../components/Glyph';
import {LABEL, LABEL_BASE, PRIMARY, SECONDARY} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Estimated, Wrap} from '../../../components/ui';
import {CONTACT} from '../../../data/contact';
import {EXAMPLE} from '../../../data/plan';
import {cn} from '../../../lib/cn';
import {Figure, UnitKey, Units, type Segment} from './parts';

const ASKS: Array<{glyph: GlyphName; label: string}> = [
  {glyph: 'cost', label: 'What you pay'},
  {glyph: 'grid', label: 'Grid dependence'},
  {glyph: 'generation', label: 'Solar potential'},
  {glyph: 'storage', label: 'Storage value'}
];

const TODAY: Segment[] = [{tone: 'orange', count: 10, hollow: true, label: 'Bought from the grid'}];

export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] -top-[20%] -z-10 h-[72vw] w-[72vw] rounded-full blur-[150px] min-[1000px]:h-[54vw] min-[1000px]:w-[54vw]"
        style={{background: 'radial-gradient(circle, color-mix(in srgb, var(--wash-amber) 13%, transparent), transparent 64%)'}}
      />

      <Wrap>
        <div className="grid items-center gap-14 py-20 min-[760px]:py-24 min-[1000px]:min-h-[88vh] min-[1000px]:grid-cols-[1.04fr_0.96fr] min-[1000px]:gap-12 min-[1180px]:gap-20">
          <div>
            <Reveal
              className={cn(
                LABEL_BASE,
                'inline-flex items-center text-[12px] tracking-[.12em] text-amber'
              )}
            >
              Looking to reduce your electricity costs?
            </Reveal>

            <Reveal
              as="h1"
              delay={0.05}
              className="mt-7 font-display text-[clamp(40px,5.4vw,70px)] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-ink"
            >
              Build the right
              <br />
              energy system
              <br />
              <span className="text-brand-gradient">around your home.</span>
            </Reveal>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-7 max-w-[520px] text-[17px] font-light leading-[1.65] text-muted min-[760px]:text-[18.5px]"
            >
              We start with what you pay the grid today, then work out what solar and storage would
              actually change about it. The system is designed around{' '}
              <em className="not-italic text-ink">that</em>, not around a package.
            </Reveal>

            <Reveal
              delay={0.16}
              as="ul"
              className="mt-9 grid max-w-[440px] grid-cols-2 gap-x-6 gap-y-5"
            >
              {ASKS.map((ask) => (
                <li key={ask.label} className="flex items-center gap-2.5">
                  <Glyph name={ask.glyph} className="h-6 w-6 shrink-0 text-green" />
                  <span className="mono text-[11.5px] font-semibold uppercase tracking-[.12em] text-muted">
                    {ask.label}
                  </span>
                </li>
              ))}
            </Reveal>

            <Reveal delay={0.22} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#assess" className={PRIMARY}>
                Get my solar &amp; energy quote →
              </a>
              <a href="#changes" className={SECONDARY}>
                What solar changes
              </a>
            </Reveal>

            <Reveal delay={0.28} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="text-[14.5px] font-light text-muted">Rather speak to someone?</span>
              <a
                href={CONTACT.phoneHref}
                className="group inline-flex items-center gap-2 font-medium text-green transition-colors hover:text-green-bright"
              >
                <Glyph name="call" className="h-[18px] w-[18px] shrink-0" />
                <span className="text-[16px] tracking-[-0.01em] underline decoration-line decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-green-bright">
                  {CONTACT.phone}
                </span>
              </a>
              <span className="text-[13px] font-light text-faint">{CONTACT.hours}</span>
            </Reveal>
          </div>

          <Reveal animation="animate-card-in" delay={0.2} className="mx-auto w-full max-w-[520px]">
            <StartingCard />
          </Reveal>
        </div>
      </Wrap>
    </header>
  );
}

function StartingCard() {
  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-6 py-4 min-[520px]:px-7">
        <span className={cn(LABEL, 'text-orange')}>Where you start today</span>
        <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">Example home</span>
      </div>

      <div className="px-6 pb-7 pt-7 min-[520px]:px-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[14px] font-medium text-muted">You pay the grid</div>
            <Figure
              size="lg"
              tone="ink"
              className="mt-2"
              value={<Counter value={`£${EXAMPLE.annualSpend.toLocaleString('en-GB')}`} />}
            />
            <div className="mt-2 text-[14px] font-light text-muted">
              a year &#183; about{' '}
              <span className="font-medium text-ink">£{EXAMPLE.monthlyBill} a month</span>
            </div>
          </div>
          <Glyph name="cost" className="mb-1 h-10 w-10 shrink-0 text-orange/70" />
        </div>

        <div className="mt-9">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-[14px] font-medium text-muted">Where your electricity comes from</span>
            <span className="mono text-[12px] font-semibold uppercase tracking-[.1em] text-orange">
              All of it bought
            </span>
          </div>

          <Units segments={TODAY} className="mt-4" />
          <UnitKey segments={TODAY} className="mt-4" />
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-px border-t border-line-2 bg-line-2">
        {[
          {label: 'You pay', value: `${EXAMPLE.importRate}p`, note: 'for every unit'},
          {label: 'You generate', value: 'Nothing', note: 'No panels yet'},
          {label: 'You store', value: 'Nothing', note: 'Nothing kept back'}
        ].map((fact) => (
          <div key={fact.label} className="bg-panel px-3 py-5 min-[400px]:px-4 min-[520px]:px-5">
            <dt className="text-[12.5px] font-medium leading-tight text-muted">{fact.label}</dt>
            <dd className="mono mt-2 text-[19px] font-semibold text-ink">{fact.value}</dd>
            <dd className="mt-1.5 text-[12px] font-light leading-snug text-faint">{fact.note}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3 border-t border-line-2 bg-bg/40 px-6 py-5 min-[520px]:px-7">
        <Estimated label="Estimated from your bill" />
        <p className="min-w-[200px] flex-1 text-[14.5px] font-light leading-[1.55] text-ink/90">
          Next, we work out how much of that bill solar and storage could take away.
        </p>
      </div>
    </div>
  );
}
