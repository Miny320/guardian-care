import {Fragment} from 'react';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {NEXT_STEPS, observe, type ExistingPosition} from '../../../data/consumer';
import {cn} from '../../../lib/cn';
import Conduit from '../../Home/components/Conduit';
import {Heading, LABEL, SECONDARY} from '../../../components/kit';
import SystemSummary from './steps/SystemSummary';

export default function Summary({position}: {position: ExistingPosition}) {
  const observation = observe(position);

  return (
    <Section id="summary" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow=" Your initial system summary"
          title="Your system,"
          accent="at a glance."
          body="Built from your answers alone. Every figure stays an estimate until your system is connected."
        />

        <div className="grid gap-4 min-[1080px]:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="min-w-0">
            <SystemSummary
              position={position}
              title="Your system summary"
              caption="Once monitoring is connected, these estimates are replaced by what your system actually does."
            />
          </Reveal>

          <Reveal delay={0.08} className="glass shadow-lift ring-lit flex flex-col overflow-hidden rounded-frame">
            <div className="border-b border-line-2 px-6 py-4">
              <span className={cn(LABEL, 'text-amber')}> Guardian Care Intelligence · Initial observation</span>
            </div>
            <div className="flex-1 px-6 py-6">
              <p className="font-display text-[clamp(21px,2.4vw,26px)] font-medium uppercase leading-[1.14] text-ink">
                {observation.headline}
              </p>
              <p className="mt-4 text-[15px] font-light leading-[1.65] text-muted">{observation.body}</p>
            </div>
            <div className="border-t border-line-2 bg-bg/40 px-6 py-5">
              <div className={cn(LABEL, 'text-amber')}>What we recommend</div>
              <p className="mt-2.5 border-l-2 border-amber/50 pl-4 text-[15px] font-light leading-[1.6] text-ink/90">
                → {observation.next}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="glass ring-lit mt-4 overflow-hidden rounded-frame">
          <div className="border-b border-line-2 px-6 py-4">
            <span className={cn(LABEL, 'text-faint')}>From here to your dashboard</span>
          </div>

          <ol className="grid gap-6 px-6 py-7 min-[900px]:grid-cols-[1fr_minmax(32px,72px)_1fr_minmax(32px,72px)_1fr] min-[900px]:items-center min-[900px]:gap-4">
            {NEXT_STEPS.map((step, index) => {
              const here = index === 0;

              return (
                <Fragment key={step.index}>
                  {index > 0 ? (
                    <li aria-hidden="true" className="hidden min-[900px]:block">
                      <Conduit direction="right" tone="green" delay={index * -0.9} />
                    </li>
                  ) : null}

                  <li className="flex items-start gap-4">
                    <span
                      className={cn(
                        'mono grid h-10 w-10 shrink-0 place-items-center rounded-full border text-[11px] font-semibold',
                        here ? 'border-green bg-green text-bg' : 'border-line-2 text-faint'
                      )}
                    >
                      {here ? '✓' : step.index}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[19px] font-semibold uppercase leading-none text-ink">
                        {step.name}
                      </span>
                      <span
                        className={cn(
                          'mt-1.5 block text-[13.5px] font-light leading-[1.45]',
                          here ? 'text-green' : 'text-muted'
                        )}
                      >
                        {step.line}
                      </span>
                    </span>
                  </li>
                </Fragment>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-center gap-4 border-t border-line-2 bg-bg/40 px-6 py-5">
            <a href="#account" className={SECONDARY}>
              See what your dashboard shows ↑
            </a>
            <span className="text-[13.5px] font-light text-faint">
              Connecting monitoring is the step that turns every estimate above into a reading.
            </span>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}
