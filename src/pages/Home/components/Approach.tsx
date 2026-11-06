import {Fragment} from 'react';
import {LABEL} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {cn} from '../../../lib/cn';

type PhaseKey = 'establish' | 'connect' | 'operate';
type Step = {title: string; text: string; phase: PhaseKey};

// The Guardian Care lifecycle: three phases, eight steps.
const PHASES: Array<{key: PhaseKey; name: string; line: string; tone: string}> = [
  {key: 'establish', name: 'Establish', line: 'What is there, and what it needs', tone: 'text-amber'},
  {key: 'connect', name: 'Connect', line: 'Estimates become readings', tone: 'text-green'},
  {key: 'operate', name: 'Operate', line: 'For as long as the system runs', tone: 'text-blue-bright'}
];

const STEPS: Step[] = [
  {phase: 'establish', title: 'Capture', text: 'We learn about your solar system, its equipment and how your home uses energy.'},
  {phase: 'establish', title: 'Analyse', text: 'We use system data and intelligent analysis to find problems and opportunities to improve.'},
  {phase: 'establish', title: 'Update', text: 'We help fix, protect and improve your existing solar installation.'},
  {phase: 'connect', title: 'Connect', text: 'We connect your system to Guardian Care, bringing its energy data and performance online.'},
  {phase: 'operate', title: 'Monitor', text: 'We continuously track your system and use intelligent monitoring to spot changes and potential problems.'},
  {phase: 'operate', title: 'Advise', text: 'AI turns complex energy data into simple insights and useful advice for you.'},
  {phase: 'operate', title: 'Maintain', text: 'We help resolve problems, coordinate maintenance and keep your system running smoothly.'},
  {phase: 'operate', title: 'Retain', text: 'We stay connected, supporting your system and helping you get more from your energy over time.'}
];

const PHASE = Object.fromEntries(PHASES.map((phase) => [phase.key, phase])) as Record<PhaseKey, (typeof PHASES)[number]>;

// Glass cards on the dark background. Step 6, Advise, is where AI turns the data into advice
// the customer can use, so it is the one lit in green.
const LIT_STEP = 5;
const CARD = 'relative flex h-full flex-col rounded-[18px] p-6 ring-1 min-[760px]:p-7';
const GLASS = 'bg-white/[0.06] ring-white/15 backdrop-blur-sm';
const LIT = 'ring-white/25 shadow-[0_24px_60px_-28px_rgba(122,179,0,0.7)]';
const LIT_BACKGROUND = 'linear-gradient(160deg, #3d9a52 0%, #23804a 55%, #1b6b45 100%)';

export default function Approach() {
  return (
    <Section id="approach" className="pt-24 pb-4 min-[760px]:pt-32">
      <Wrap>
        <Reveal className="mx-auto max-w-[960px] text-center">
          <div className={cn(LABEL, 'text-green')}>Our approach</div>
          <h2 className="mt-4 text-balance font-display text-[clamp(32px,4.4vw,60px)] font-extrabold leading-[1] tracking-[-0.02em] text-ink">
            Smarter solar care, <span className="text-brand-gradient">from first assessment to ongoing energy intelligence.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-[clamp(17px,1.5vw,19px)] font-light leading-[1.65] text-muted">
            Guardian Care takes a complete approach to solar ownership. We don’t just monitor a system — we build a clear
            understanding of it, track how it performs, identify issues early, and help customers improve performance over
            time.
          </p>
        </Reveal>

        {/* Four to a row on desktop, an arrow between each card in a row. */}
        <ol className="mt-16 grid gap-y-5 min-[640px]:grid-cols-2 min-[640px]:gap-x-5 min-[1100px]:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] min-[1100px]:gap-x-3 min-[1100px]:gap-y-6">
          {STEPS.map((step, index) => (
            <Fragment key={step.title}>
              <Reveal as="li" delay={(index % 4) * 0.07}>
                <StepCard step={step} index={index} />
              </Reveal>
              {index % 4 !== 3 ? <Arrow /> : null}
            </Fragment>
          ))}
        </ol>
      </Wrap>
    </Section>
  );
}

function StepCard({step, index}: {step: Step; index: number}) {
  const lit = index === LIT_STEP;
  const phase = PHASE[step.phase];

  return (
    <div className={cn(CARD, lit ? LIT : GLASS)} style={lit ? {background: LIT_BACKGROUND} : undefined}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'font-display text-[clamp(40px,3.4vw,52px)] font-extrabold leading-none',
            lit ? 'text-white/85' : 'text-[#c6ec6e]'
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={cn(LABEL, 'mt-1 text-[10.5px]', lit ? 'text-white/80' : phase.tone)}>{phase.name}</span>
      </div>
      <h3 className="mt-4 font-display text-[22px] font-extrabold leading-[1.1] text-white">{step.title}</h3>
      <p className={cn('mt-3 text-[15.5px] font-light leading-[1.6]', lit ? 'text-white/90' : 'text-white/70')}>{step.text}</p>
    </div>
  );
}

function Arrow() {
  return (
    <li aria-hidden="true" className="hidden items-center justify-center min-[1100px]:flex">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.05] text-[#c6ec6e] ring-1 ring-white/25">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </li>
  );
}
