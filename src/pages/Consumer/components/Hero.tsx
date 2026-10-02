import Counter from '../../../components/Counter';
import Glyph from '../../../components/Glyph';
import Reveal from '../../../components/Reveal';
import {Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR, type StatusTone} from '../../../data/command';
import {DAY, GRID_COST, HOME, pounds} from '../../../data/consumer';
import {cn} from '../../../lib/cn';
import {LiveDot} from '../../Home/components/Conduit';
import {LABEL, LABEL_BASE, PRIMARY, SECONDARY} from '../../../components/kit';

const SPLIT: Array<{label: string; value: number; tone: StatusTone}> = [
  {label: 'Used yourself', value: DAY.used, tone: 'green'},
  {label: 'Stored', value: DAY.stored, tone: 'purple'},
  {label: 'Exported', value: DAY.exported, tone: 'blue'}
];

export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] -top-[18%] -z-10 h-[70vw] w-[70vw] rounded-full blur-[140px] min-[1000px]:h-[52vw] min-[1000px]:w-[52vw]"
        style={{background: 'radial-gradient(circle, color-mix(in srgb, var(--wash-amber) 12%, transparent), transparent 64%)'}}
      />

      <Wrap>
        <div className="grid items-center gap-14 py-20 min-[760px]:py-24 min-[1000px]:min-h-[86vh] min-[1000px]:grid-cols-[1.02fr_0.98fr] min-[1000px]:gap-12 min-[1180px]:gap-20">
          <div>
            <Reveal
              className={cn(LABEL_BASE, 'inline-flex items-center text-[12px] tracking-[.12em] text-amber')}
            >
              Already have solar?
            </Reveal>

            <Reveal
              as="h1"
              delay={0.05}
              className="mt-7 font-display text-[clamp(40px,5.4vw,70px)] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-ink"
            >
              Understand how
              <br />
              your solar system
              <br />
              is performing <span className="text-brand-gradient">today.</span>
            </Reveal>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-7 max-w-[540px] text-[17px] font-light leading-[1.65] text-muted min-[760px]:text-[18.5px]"
            >
              Your system may have been installed years ago. Since then your energy use, electricity
              prices, equipment and household needs have probably all changed. Guardian Care shows
              you what your system is doing <em className="not-italic text-ink">now</em> — clearly,
              and in plain English.
            </Reveal>

            <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#check" className={PRIMARY}>
                Check my existing solar system →
              </a>
              <a href="#findings" className={SECONDARY}>
                What we find
              </a>
            </Reveal>
          </div>

          <Reveal animation="animate-card-in" delay={0.2} className="mx-auto w-full max-w-[520px]">
            <TodayCard />
          </Reveal>
        </div>
      </Wrap>
    </header>
  );
}

function TodayCard() {
  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-6 py-4 min-[520px]:px-7">
        <span className="flex items-center gap-2.5">
          <LiveDot />
          <span className={cn(LABEL_BASE, 'text-[11.5px] tracking-[.12em] text-green')}>
            Your system today
          </span>
        </span>
        <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">Example home</span>
      </div>

      <div className="px-6 pb-6 pt-7 min-[520px]:px-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className={cn(LABEL, 'text-faint')}>Solar generated</div>
            <div className="mono mt-3 text-[clamp(44px,8vw,64px)] font-semibold leading-none text-amber">
              <Counter value={DAY.generated.toFixed(1)} />
              <span className="mono ml-2 text-[14px] font-normal text-faint">kWh</span>
            </div>
          </div>
          <Glyph name="generation" className="mb-1 h-10 w-10 text-amber/70" />
        </div>

        <div
          className="mt-7 flex h-2.5 gap-[3px] overflow-hidden rounded-pill"
          role="img"
          aria-label={`${DAY.used} kWh used, ${DAY.stored} kWh stored, ${DAY.exported} kWh exported`}
        >
          {SPLIT.map((part) => (
            <span
              key={part.label}
              className="h-full"
              style={{width: `${(part.value / DAY.generated) * 100}%`, background: TONE_VAR[part.tone]}}
            />
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {SPLIT.map((part) => (
            <div key={part.label}>
              <dt className="flex items-center gap-2 text-[12.5px] font-light leading-tight text-muted">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{background: TONE_VAR[part.tone]}}
                />
                {part.label}
              </dt>
              <dd className={cn('mono mt-1.5 text-[17px] font-semibold', TONE_TEXT[part.tone])}>
                {part.value.toFixed(1)}
                <span className="mono ml-1 text-[11.5px] font-normal text-faint">kWh</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-line-2 bg-line-2">
        <div className="bg-panel px-6 py-5 min-[520px]:px-7">
          <dt className="text-[12.5px] font-light leading-tight text-muted">Bought from the grid</dt>
          <dd className="mono mt-2 text-[20px] font-semibold text-orange">
            {DAY.imported.toFixed(1)}
            <span className="mono ml-1 text-[11.5px] font-normal text-faint">kWh</span>
          </dd>
          <dd className="mono mt-1 text-[11.5px] text-faint">Mostly after dark</dd>
        </div>
        <div className="bg-panel px-6 py-5 min-[520px]:px-7">
          <dt className="text-[12.5px] font-light leading-tight text-muted">What that cost</dt>
          <dd className="mono mt-2 text-[20px] font-semibold text-ink">{pounds(GRID_COST)}</dd>
          <dd className="mono mt-1 text-[11.5px] text-faint">At {HOME.importRate}p/kWh</dd>
        </div>
      </dl>

      <div className="border-t border-line-2 bg-bg/40 px-6 py-5 min-[520px]:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={cn(LABEL, 'text-amber')}> Guardian Care Intelligence</span>
          <span className="mono inline-flex items-center gap-2 rounded-pill border border-amber/35 bg-amber/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-amber">
            1 worth reviewing
          </span>
        </div>
        <p className="mt-3 text-[15px] font-light leading-[1.55] text-ink/90">
          “{DAY.exported} kWh left your home at midday while {DAY.imported} kWh was bought back this
          evening. Your battery settings may be worth a look.”
        </p>
      </div>
    </div>
  );
}
