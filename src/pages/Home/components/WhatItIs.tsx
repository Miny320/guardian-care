import {useId} from 'react';
import {LABEL} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {cn} from '../../../lib/cn';

// In Sam's own voice: have Sam approve it before launch, as it is published under his name.
// What Guardian Care is, for each of the three audiences it serves: businesses, engineers and homeowners.
const QUOTE =
  'Guardian Care is the intelligence layer for the solar energy ecosystem, empowering solar businesses to transform how they manage and grow their operations, equipping engineers with smarter tools to protect and optimise every installation, and giving homeowners the intelligence, visibility and confidence to make the most of their energy — all through one connected, AI-powered platform.';

export default function WhatItIs() {
  return (
    <Section id="about" className="relative isolate overflow-hidden py-16 min-[760px]:py-24">
      <DottedWordmark />

      <Wrap>
        <figure className="mx-auto max-w-[1120px] text-center">
          {/* <Reveal className={cn(LABEL, 'text-green')}>What is Guardian Care?</Reveal> */}
          <Reveal as="blockquote" delay={0.06}>
            <p className="text-pretty font-display text-[clamp(24px,2.9vw,40px)] font-light leading-[1.28] tracking-[-0.01em] text-ink">
              &ldquo;{QUOTE}&rdquo;
            </p>
          </Reveal>
          <Reveal as="figcaption" delay={0.12} className="mt-7 font-display text-[clamp(24px,2.4vw,32px)] font-light tracking-[.04em] text-brand-gradient">
            &mdash; Sam
          </Reveal>
        </figure>
      </Wrap>
    </Section>
  );
}

// "GUARDIAN CARE" set as a field of dots: a dot pattern clipped to the lettering, painted with the
// brand ramp, then softened so it reads as texture behind the copy rather than as a second headline.
function DottedWordmark() {
  const id = useId();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 1600 300"
        className="w-[150%] max-w-none shrink-0 opacity-40 min-[760px]:w-[96%]"
        style={{filter: 'blur(2.2px)'}}
      >
        <defs>
          <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2.6" fill="#fff" />
          </pattern>
          <mask id={`${id}-mask`}>
            <text
              x="800"
              y="248"
              textAnchor="middle"
              textLength="1560"
              lengthAdjust="spacingAndGlyphs"
              fill={`url(#${id}-dots)`}
              className="font-display"
              style={{fontSize: 290, fontWeight: 700, letterSpacing: '-0.01em'}}
            >
              GUARDIAN CARE
            </text>
          </mask>
          <linearGradient id={`${id}-ramp`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--ramp-far)" />
            <stop offset="50%" stopColor="var(--ramp-mid)" />
            <stop offset="100%" stopColor="var(--color-blue)" />
          </linearGradient>
        </defs>
        <rect width="1600" height="300" fill={`url(#${id}-ramp)`} mask={`url(#${id}-mask)`} />
      </svg>
    </div>
  );
}
