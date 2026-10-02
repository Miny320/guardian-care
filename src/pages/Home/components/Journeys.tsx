import {Link} from 'react-router';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {JOURNEYS} from '../../../data/platform';
import {cn} from '../../../lib/cn';

export default function Journeys() {
  return (
    <Section id="journeys" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
          <h2 className="font-display text-[clamp(32px,5vw,58px)] font-semibold uppercase leading-[0.96] tracking-[-0.015em] text-ink">
            One platform.
            <br />
            Three journeys.
          </h2>
          <p className="mt-5 text-[16.5px] font-light leading-[1.6] text-muted">
            Choose where you are in the energy lifecycle.
          </p>
        </Reveal>

        <div className="grid gap-4 min-[1000px]:grid-cols-3 min-[1000px]:items-stretch">
          {JOURNEYS.map((journey, index) => (
            <Reveal
              key={journey.key}
              animation="animate-card-in"
              delay={index * 0.14}
              className="flex"
            >
              <Link
                to={journey.to}
                className="group glass shadow-lift relative flex w-full flex-col overflow-hidden rounded-frame border border-line-2 p-7 transition duration-250 ease-brand hover:-translate-y-1 hover:border-line hover:shadow-lift-hover min-[760px]:p-9"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-250 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${TONE_VAR[journey.tone]}, transparent)`
                  }}
                />

                <div
                  className={cn(
                    'mono text-[11px] font-semibold uppercase leading-[1.5] tracking-[.13em] min-[1000px]:min-h-[33px]',
                    TONE_TEXT[journey.tone]
                  )}
                >
                  {journey.eyebrow}
                </div>

                <h3 className="mt-3.5 font-display text-[clamp(25px,2.9vw,31px)] font-semibold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
                  {journey.headline}
                </h3>

                {journey.paras.map((para) => (
                  <p key={para} className="mt-4 text-[14.5px] font-light leading-[1.62] text-muted">
                    {para}
                  </p>
                ))}

                <div className="mt-auto pt-8">
                  <span
                    className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-pill border px-6 py-3.5 text-left text-[12px] font-bold uppercase leading-[1.3] tracking-[.08em] text-ink transition-colors duration-250 ease-brand group-hover:text-bg"
                    style={{
                      borderColor: `color-mix(in srgb, ${TONE_VAR[journey.tone]} 40%, transparent)`
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 transition-opacity duration-250 group-hover:opacity-100"
                      style={{background: TONE_VAR[journey.tone]}}
                    />
                    <span className="relative">{journey.cta} →</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
