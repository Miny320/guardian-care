import Counter from '../../../components/Counter';
import Reveal from '../../../components/Reveal';
import {Wrap} from '../../../components/ui';
import {TONE_TEXT} from '../../../data/command';
import type {StatusTone} from '../../../data/command';
import {LIVE, VERBS} from '../../../data/platform';
import {cn} from '../../../lib/cn';
import {LiveDot} from './Conduit';
import EnergyField from './EnergyField';

const READINGS: Array<{
  verb: string;
  value: string;
  unit: string;
  name: string;
  tone: StatusTone;
}> = [
  {verb: VERBS[0], value: LIVE.solar.toFixed(1), unit: 'kW', name: 'Solar array', tone: 'amber'},
  {verb: VERBS[1], value: String(LIVE.charge), unit: '%', name: 'Battery', tone: 'purple'},
  {verb: VERBS[2], value: LIVE.home.toFixed(1), unit: 'kW', name: 'Home', tone: 'ink'},
  {verb: VERBS[3], value: LIVE.grid.toFixed(1), unit: 'kW', name: 'Grid', tone: 'blue'}
];

export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <EnergyField />

      <Wrap>
        <div className="mx-auto flex min-h-[64vh] max-w-[960px] flex-col justify-center py-12 text-center min-[760px]:min-h-[68vh] min-[760px]:py-16">
          <Reveal
            as="h1"
            className="font-display text-[clamp(44px,11vw,140px)] font-semibold uppercase leading-[0.86] tracking-[-0.022em] text-ink"
          >
            Energy,
            <br />
            <span className="text-brand-gradient">Understood.</span>
          </Reveal>

          <Reveal
            as="p"
            delay={0.06}
            className="mono mx-auto mt-8 text-[12.5px] font-medium uppercase tracking-[.12em] text-amber"
          >
            AI intelligence for every solar system
          </Reveal>

          <Reveal
            as="p"
            delay={0.12}
            className="mx-auto mt-7 max-w-[620px] text-[17px] font-light leading-[1.65] text-muted min-[760px]:text-[19px]"
          >
            From the first site assessment to everyday monitoring, Guardian Care connects your
            energy system, your team and your customer in one intelligent platform.
          </Reveal>

          <Reveal delay={0.18} className="mt-11">
            <a
              href="#journeys"
              className="inline-flex items-center gap-3 rounded-pill bg-[var(--cta)] px-9 py-[18px] text-[13px] font-bold uppercase tracking-[.1em] text-[var(--cta-ink)] shadow-[0_16px_40px_-16px_var(--btn-glow)] transition duration-250 ease-brand hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] hover:shadow-[0_24px_54px_-18px_var(--btn-glow)]"
            >
              Explore Guardian Care →
            </a>
          </Reveal>

          <Reveal
            delay={0.24}
            className="mx-auto mt-12 flex max-w-[620px] flex-col items-center gap-3 rounded-frame border border-line-2 bg-bg/55 px-6 py-4 backdrop-blur-[6px] min-[680px]:flex-row min-[680px]:gap-5"
          >
            <span className="flex shrink-0 items-center gap-2.5">
              <LiveDot />
              <span className="mono whitespace-nowrap text-[11.5px] font-semibold uppercase tracking-[.12em] text-green">
                {LIVE.status}
              </span>
            </span>

            <span
              aria-hidden="true"
              className="hidden h-6 w-px shrink-0 bg-line-2 min-[680px]:block"
            />

            <span className="text-[14px] font-light leading-[1.5] text-muted min-[680px]:text-left">
              <span className="mono mr-2 text-[11px] font-semibold uppercase tracking-[.13em] text-amber">
                Guardian Care Intelligence
              </span>
              {LIVE.ai}
            </span>
          </Reveal>

          <Reveal
            delay={0.3}
            className="mx-auto mt-14 grid w-full max-w-[680px] grid-cols-2 gap-x-6 gap-y-7 min-[620px]:grid-cols-4 min-[620px]:gap-x-4"
          >
            {READINGS.map((reading, index) => (
              <div key={reading.verb} className="relative">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -left-3 top-1/2 hidden -translate-y-1/2 text-faint/40 min-[620px]:block"
                  >
                    →
                  </span>
                ) : null}

                <div className="mono text-[11px] font-semibold uppercase tracking-[.13em] text-faint">
                  {reading.verb}
                </div>
                <div
                  className={cn(
                    'mono mt-2 text-[19px] font-semibold leading-none min-[620px]:text-[21px]',
                    TONE_TEXT[reading.tone]
                  )}
                >
                  <Counter value={reading.value} />
                  <span
                    className={cn(
                      'mono font-normal text-faint',
                      reading.unit === '%' ? 'ml-px text-[11px]' : 'ml-1 text-[11px]'
                    )}
                  >
                    {reading.unit}
                  </span>
                </div>
                <div className="mono mt-2 text-[11px] uppercase tracking-[.12em] text-faint/80">
                  {reading.name}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </Wrap>
    </header>
  );
}
