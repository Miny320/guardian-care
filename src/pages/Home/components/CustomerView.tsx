import {Link} from 'react-router';
import Counter from '../../../components/Counter';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {TODAY, TODAY_ROWS} from '../../../data/platform';
import {cn} from '../../../lib/cn';
import {LiveDot} from './Conduit';

export default function CustomerView() {
  return (
    <Section id="customer" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mx-auto mb-16 max-w-[680px] text-center">
          <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
            Complex energy.
            <br />
            <span className="text-brand-gradient">Simple to understand.</span>
          </h2>
        </Reveal>

        <div className="mx-auto max-w-[560px]">
          <Reveal className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
            <div className="flex items-center gap-2.5 border-b border-line-2 px-6 py-4 min-[520px]:px-8">
              <LiveDot />
              <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-green">
                {TODAY.status}
              </span>
            </div>

            <div className="px-6 py-9 text-center min-[520px]:px-8">
              <div className="mono text-[11.5px] font-semibold uppercase tracking-[.13em] text-faint">
                Today’s solar
              </div>
              <div className="mono mt-4 text-[clamp(46px,10vw,76px)] font-semibold leading-none text-amber">
                <Counter value={TODAY.generated.toFixed(1)} />
                <span className="mono ml-2.5 text-[15px] font-normal text-faint">kWh</span>
              </div>
            </div>

            <div className="border-t border-line-2 px-6 py-8 min-[520px]:px-8">
              <div className="space-y-5">
                {TODAY_ROWS.map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-faint">
                        {row.label}
                      </span>
                      <span className={cn('mono text-[15px] font-semibold', TONE_TEXT[row.tone])}>
                        {row.value.toFixed(1)}
                        <span className="mono ml-1 text-[11px] font-normal text-faint">kWh</span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-pill bg-line-2">
                      <div
                        className="h-full rounded-pill"
                        style={{
                          width: `${(row.value / TODAY.generated) * 100}%`,
                          background: TONE_VAR[row.tone]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mono mt-6 border-t border-line-2 pt-5 text-[11px] uppercase tracking-[.12em] text-faint">
                {TODAY.used} + {TODAY.stored} + {TODAY.exported} = {TODAY.generated} kWh
              </p>
            </div>

            <div className="border-t border-line-2 bg-bg/40 px-6 py-6 min-[520px]:px-8">
              <span className="mono block text-[11px] font-semibold uppercase tracking-[.13em] text-amber">
                Guardian Care Intelligence
              </span>
              <p className="mt-2.5 text-[15.5px] font-light leading-[1.55] text-ink/90">
                “{TODAY.ai}”
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="mt-8 flex flex-col items-center gap-4">
            <Link
              to="/consumer"
              className="inline-flex items-center gap-2.5 rounded-pill bg-[var(--cta)] px-8 py-4 text-[12px] font-bold uppercase tracking-[.1em] text-[var(--cta-ink)] shadow-[0_14px_36px_-16px_var(--btn-glow)] transition duration-250 ease-brand hover:-translate-y-0.5 hover:bg-[var(--cta-hover)]"
            >
              Explore my energy →
            </Link>

            <Link
              to="/plan"
              className="group inline-flex items-center gap-2 text-[13.5px] font-light text-faint transition-colors hover:text-ink"
            >
              No system yet? Build an energy plan
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}
