import {useEffect, useState} from 'react';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import Glyph from '../../../components/Glyph';
import {LABEL} from '../../../components/kit';
import {MACHINES} from '../../../data/home';
import {systemParts, type Part} from '../../../data/parts';
import {useCountry} from '../../../lib/country';
import {cn} from '../../../lib/cn';
import {BeforeAfterTable} from './BeforeAfter';

type Slide = Pick<Part, 'key' | 'name' | 'image' | 'does'> & {glyph?: Part['glyph']};

const DUPLICATES = new Set(['battery', 'inverter', 'board']);

const INTERVAL_MS = 6000;
const FADE_MS = 700;

export default function Why() {
  return (
    <Section id="why" className="on-light bg-bg py-24 min-[760px]:py-36">
      <Wrap>
        <Reveal
          as="h2"
          className="text-balance text-center font-display text-[clamp(46px,7.6vw,104px)] font-extrabold leading-[0.92] tracking-[-0.02em] text-ink"
        >
          Why <span className="text-brand-gradient">Guardian Care</span>
        </Reveal>

        <MachineSlider />

        <div className="mt-14 min-[760px]:mt-16">
          <BeforeAfterTable />
        </div>
      </Wrap>
    </Section>
  );
}

function MachineSlider() {
  const country = useCountry();
  // The three headline machines first, then every part of a system, in the order power flows.
  const parts: Slide[] = [
    ...MACHINES.map((machine) => ({key: machine.key, name: machine.name, image: machine.image, glyph: undefined, does: machine.line})),
    // Battery, inverter and the board (surge protection) are already covered by the slides above.
    ...systemParts(country).filter((part) => !DUPLICATES.has(part.key))
  ];
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // There are no controls, so the slides always rotate; hovering holds the current one.
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setAt((was) => (was + 1) % parts.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [at, paused, parts.length]);

  return (
    <Reveal delay={0.1} className="mx-auto mt-10 max-w-[920px] min-[760px]:mt-12">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="The parts of a solar system"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="grid"
      >
        {parts.map((part, index) => {
          const showing = index === at;

          return (
            <div
              key={part.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${parts.length}: ${part.name}`}
              aria-hidden={!showing}
              className={cn(
                'col-start-1 row-start-1 grid items-center gap-6 min-[760px]:grid-cols-[0.8fr_1.2fr] min-[760px]:gap-12',
                showing ? 'opacity-100' : 'opacity-0'
              )}
              style={{transition: `opacity ${FADE_MS}ms ease-in-out`}}
            >
              <div className="relative grid h-[220px] place-items-center">
                <span
                  aria-hidden="true"
                  className="absolute h-[78%] w-[78%] rounded-full blur-[50px]"
                  style={{background: 'color-mix(in srgb, var(--color-green) 22%, transparent)'}}
                />
                {part.image ? (
                  <img
                    src={part.image}
                    alt={part.name}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      'relative max-h-[200px] w-auto max-w-[260px] object-contain',
                      !reduced && 'transition-transform duration-[900ms] ease-brand',
                      showing || reduced ? 'scale-100' : 'scale-95'
                    )}
                  />
                ) : part.glyph ? (
                  // No product picture for the isolators, so they get a large drawn icon.
                  <span className="relative grid h-[150px] w-[150px] place-items-center rounded-full bg-panel text-green shadow-[0_20px_50px_-25px_var(--drop)] ring-1 ring-line-2">
                    <Glyph name={part.glyph} className="h-[72px] w-[72px]" />
                  </span>
                ) : null}
              </div>

              <div className="text-center min-[760px]:text-left">
                <span className="mono text-[12px] font-semibold text-green">
                  {String(index + 1).padStart(2, '0')} / {String(parts.length).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1] tracking-[-0.015em] text-ink">
                  {part.name}
                </h3>
                <div className={cn(LABEL, 'mt-5 text-green')}>What it does</div>
                <p className="mx-auto mt-1.5 max-w-[480px] text-[clamp(16px,1.4vw,18px)] leading-[1.55] text-ink min-[760px]:mx-0">
                  {part.does}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
