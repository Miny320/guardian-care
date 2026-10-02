import Counter from '../../../components/Counter';
import {Caption, LABEL, LABEL_BASE, PRIMARY, SECONDARY} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Wrap} from '../../../components/ui';
import {CC_ATTENTION, CC_CUSTOMERS} from '../../../data/command';
import {cn} from '../../../lib/cn';
import {LiveDot} from '../../Home/components/Conduit';
import {Portfolio, PortfolioKey} from './parts';

export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <Wrap>
        <div className="grid items-center gap-14 py-20 min-[760px]:py-24 min-[1000px]:min-h-[86vh] min-[1000px]:grid-cols-[0.92fr_1.08fr] min-[1000px]:gap-12 min-[1180px]:gap-16">
          <div>
            <Reveal
              className={cn(
                LABEL_BASE,
                'inline-flex items-center text-[12px] tracking-[.12em] text-green'
              )}
            >
              For solar and energy companies
            </Reveal>

            <Reveal
              as="h1"
              delay={0.05}
              className="mt-7 font-display text-[clamp(40px,5.4vw,70px)] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-ink"
            >
              You install it.
              <br />
              We keep it
              <br />
              <span className="text-brand-gradient">on your screen.</span>
            </Reveal>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-7 max-w-[500px] text-[17px] font-light leading-[1.65] text-muted min-[760px]:text-[18.5px]"
            >
              Every system you have ever installed, live on one console — and the day one of them
              needs you, it says so first.
            </Reveal>

            <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#assess" className={PRIMARY}>
                Start my assessment →
              </a>
              <a href="#console" className={SECONDARY}>
                See the console
              </a>
            </Reveal>
          </div>

          <Reveal animation="animate-card-in" delay={0.2} className="w-full">
            <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
              <div className="flex items-center justify-between gap-4 border-b border-line-2 px-5 py-3.5 min-[520px]:px-6">
                <span className="flex items-center gap-2.5">
                  <LiveDot />
                  <span className={cn(LABEL, 'text-green')}>Portfolio</span>
                </span>
                <Caption>One dot, one customer</Caption>
              </div>

              <div className="px-5 py-6 min-[520px]:px-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className={cn(LABEL, 'text-faint')}>Customers monitored</div>
                    <div className="mono mt-3 text-[clamp(38px,6.5vw,56px)] font-semibold leading-none text-ink">
                      <Counter value={CC_CUSTOMERS.toLocaleString('en-GB')} />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={cn(LABEL, 'text-faint')}>Need you today</div>
                    <div className="mono mt-3 text-[clamp(28px,4.4vw,38px)] font-semibold leading-none text-amber">
                      <Counter value={String(CC_ATTENTION)} />
                    </div>
                  </div>
                </div>

                <Portfolio className="mt-7" />
                <PortfolioKey className="mt-6 border-t border-line-2 pt-5" />
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </header>
  );
}
