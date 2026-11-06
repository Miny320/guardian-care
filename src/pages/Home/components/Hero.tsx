import {useEffect, useState} from 'react';
import Reveal from '../../../components/Reveal';
import {Wrap} from '../../../components/ui';
import {cn} from '../../../lib/cn';

const SLIDES = [
  {
    src: '/assets/photos/hero-globe.jpg',
    alt: 'The globe at night with solar sites in the US, UK, Thailand and Australia linked together',
    lead: 'A Smarter Future for',
    accent: 'Every Solar System',
    body: 'Connected technology, AI intelligence, and ongoing care — all in one platform.',
    note: 'Turning solar installations into continuously understood energy assets.',
  },
  {
    src: '/assets/photos/hero-dashboard.jpg',
    alt: 'The Guardian Care dashboard showing generation, energy mix, sites, alerts and an AI insight',
    // Keep the dashboard to the right, so the dark sky sits behind the text.
    position: 'object-right',
    lead: 'From Live Data to',
    accent: 'Intelligent Action',
    body: 'Guardian Care transforms real-time system data into insight, alerts, and action across the entire portfolio.',
    note: 'More than monitoring. Operational intelligence in motion.',
  },
  {
    src: '/assets/photos/hero-home-care.jpg',
    alt: 'A Guardian Care engineer checks a solar home’s live data on a tablet at dusk',
    lead: 'One Platform.',
    accent: 'Three Powerful Experiences.',
    body: 'For solar businesses. For engineers. For homeowners.',
    note: 'One connected ecosystem built to understand, protect, and optimize energy.',
  }
];


const INTERVAL_MS = 11000;
const FADE_MS = 2500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(query.matches);
    query.addEventListener('change', read);
    return () => query.removeEventListener('change', read);
  }, []);

  return reduced;
}

export default function Hero() {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (paused || reduced) return;
    const timer = setTimeout(() => setAt((was) => (was + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [at, paused, reduced]);

  return (
    <header
      className="under-nav relative isolate flex min-h-svh flex-col overflow-hidden bg-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="absolute inset-0 -z-10">
        {SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            aria-hidden={index !== at}
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              'position' in slide ? slide.position : undefined,
              index === at ? 'opacity-100' : 'opacity-0'
            )}
            // The photos show as they are: no zoom, no tint. Only the change of slide fades.
            style={{transition: reduced ? undefined : `opacity ${FADE_MS}ms ease-in-out`}}
          />
        ))}
        {/* A navy tint over the photos, a little deeper behind the text on the left, so every
            slide's text reads clearly whatever the photo. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#011227]/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,18,39,0.55)_0%,rgba(1,18,39,0.35)_40%,transparent_72%)]"
        />
      </div>

      <Wrap className="flex flex-1 flex-col">
        <div className="flex max-w-[880px] flex-1 flex-col items-start justify-center py-16 text-left">
          <h1 className="sr-only">Guardian Care</h1>

          {/* Every slide's text sits in the same grid cell, so the hero keeps one height as they crossfade. */}
          <Reveal className="grid w-full [text-shadow:0_2px_18px_rgba(1,18,39,0.55)]">
            {SLIDES.map((slide, index) => {
              const showing = index === at;

              return (
                <div
                  key={slide.src}
                  aria-hidden={!showing}
                  inert={!showing}
                  className={cn(
                    'col-start-1 row-start-1 flex flex-col items-start',
                    showing ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{transition: `opacity ${FADE_MS}ms ease-in-out`}}
                >
                  <p className="text-balance font-display text-[clamp(38px,6vw,86px)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink">
                    {slide.lead} <span className="text-[#c6ec6e]">{slide.accent}</span>
                  </p>

                  <p className="mt-10 max-w-[760px] text-pretty text-[clamp(19px,2.2vw,28px)] font-normal leading-[1.4] text-ink/90">
                    {slide.body}
                  </p>
                  {/* The slide's closing line, set apart in a frosted block. */}
                  <p className="mt-7 inline-flex max-w-[720px] items-center gap-3 text-pretty rounded-[12px] border-l-[3px] border-[#c6ec6e] bg-white/[0.09] px-5 py-3.5 text-[clamp(15px,1.4vw,18px)] font-semibold leading-[1.5] text-[#d9f0a8] ring-1 ring-white/15 backdrop-blur-md [text-shadow:none]">
                    {slide.note}
                  </p>
                </div>
              );
            })}
          </Reveal>
        </div>

        {/* On phones the action bar covers the foot of the screen, so these sit above it. */}
        <div className="relative flex items-center gap-2.5 pb-8 max-[639px]:pb-[100px]" role="group" aria-label="Choose a photo">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setAt(index)}
              aria-label={`Show photo ${index + 1} of ${SLIDES.length}`}
              aria-current={index === at}
              className="grid h-8 w-8 place-items-center"
            >
              <span
                className={cn(
                  'block h-1.5 rounded-pill transition-all duration-300 ease-brand',
                  index === at ? 'w-7 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/75'
                )}
              />
            </button>
          ))}
        </div>
      </Wrap>

      {/* Fixed to the foot of the hero: a gentle nudge down to the next section. */}
      <a
        href="#paths"
        aria-label="Scroll to the next section"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 max-[639px]:bottom-[94px]"
      >
        <span className="grid h-12 w-12 animate-[hero-cue_2.2s_ease-in-out_infinite] place-items-center rounded-full text-white ring-1 ring-white/45 transition-colors hover:bg-white/10 hover:ring-white motion-reduce:animate-none">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </span>
      </a>
    </header>
  );
}
