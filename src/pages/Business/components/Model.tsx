import Counter from '../../../components/Counter';
import {Heading, LABEL, PRIMARY, ramp, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {
  AFTERCARE_LABEL,
  INSTALLED_LABEL,
  MARKET_LABEL,
  ROLLOUT,
  type BusinessPosition
} from '../../../data/businessFlow';
import {cn} from '../../../lib/cn';

export default function Model({position}: {position: BusinessPosition}) {
  const suggestion = suggest(position);

  return (
    <Section id="model" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Your Guardian Care model"
          title="Where to start"
          accent="in your business."
          body="Built from your six answers, and deliberately specific about the first stage rather than about the platform as a whole."
        />

        <div className="grid gap-4 min-[1000px]:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="glass ring-lit rounded-frame p-6 min-[760px]:p-8">
            <div className={cn(LABEL, 'text-green')}>Your profile</div>

            <dl className="mt-6 divide-y divide-line-2">
              <Row label="Market" value={position.market ? MARKET_LABEL[position.market] : 'Not given'} />
              <Row
                label="Installed customers"
                value={position.installedBand ? INSTALLED_LABEL[position.installedBand] : 'Not given'}
              />
              <Row
                label="Current aftercare"
                value={position.aftercare ? AFTERCARE_LABEL[position.aftercare] : 'Not given'}
                tone={position.reactive ? 'text-amber' : undefined}
              />
              <Row label="Monitoring coverage" value={position.monitoringCoverage} />
              <Row label="Primary goal" value={position.primaryGoal ?? 'Not given'} />
            </dl>

            {position.installedCount ? (
              <div className="mt-7 border-t border-line-2 pt-6">
                <div className={cn(LABEL, 'text-faint')}>Systems still running out there</div>
                <div className="mono mt-3 text-[clamp(32px,4.6vw,48px)] font-semibold leading-none text-green">
                  ~<Counter value={position.installedCount.toLocaleString('en-GB')} />
                </div>
                <p className="mt-3 text-[13px] font-light leading-[1.55] text-faint">
                  None of them stopped producing data when the job was signed off.
                </p>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.06} className="ring-lit overflow-hidden rounded-frame">
            <div className="bg-[linear-gradient(120deg,var(--color-green-glow),var(--color-blue-glow))] p-6 min-[760px]:p-9">
              <div className={cn(LABEL, 'text-green')}>&#9671; Guardian Care suggests</div>

              <p className="mt-5 font-display text-[clamp(22px,2.9vw,32px)] font-semibold uppercase leading-[1.1] tracking-[-0.01em] text-ink">
                {suggestion.headline}
              </p>
              <p className="mt-5 max-w-[580px] text-[15.5px] font-light leading-[1.65] text-muted">
                {suggestion.body}
              </p>
            </div>

            <div className="glass-solid border-t border-line-2 p-6 min-[760px]:px-9 min-[760px]:py-7">
              <div className={cn(LABEL, 'text-faint')}>Your first five moves</div>

              <ol className="mt-5 space-y-3">
                {ROLLOUT.map((stage, index) => {
                  const colour = ramp(index, ROLLOUT.length);

                  return (
                    <li key={stage} className="flex items-center gap-3.5">
                      <span
                        className="mono grid h-6 w-6 shrink-0 place-items-center rounded-tile text-[11px] font-semibold"
                        style={{background: tint(colour, 16), color: colour}}
                      >
                        {index + 1}
                      </span>
                      <span className="text-[14.5px] font-light leading-tight text-ink/90">
                        {stage}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-7 border-t border-line-2 pt-6">
                <a href="#join" className={PRIMARY}>
                  Start the conversation →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

function Row({label, value, tone}: {label: string; value: string; tone?: string}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[14px] font-light text-muted">{label}</dt>
      <dd className={cn('mono shrink-0 text-right text-[14px] font-semibold text-ink', tone)}>
        {value}
      </dd>
    </div>
  );
}

function suggest(position: BusinessPosition): {headline: string; body: string} {
  if (position.reactive && position.installedCount && position.installedCount >= 500) {
    return {
      headline: 'Your best opportunity is already inside your own customer base',
      body: 'A large installed base with a reactive aftercare process is the clearest case Guardian Care sees. Those systems are still producing data nobody reads, and the customers are still reachable — so the first stage is recapture and monitoring, not acquisition.'
    };
  }

  if (position.reactive) {
    return {
      headline: 'Right now, contact only ever begins with a problem',
      body: 'Your team waits for the customer to report something. Connecting monitoring to the systems you have already installed gives you a reason to make contact that is not a sales call.'
    };
  }

  if (position.monitoringCoverage === 'Broad') {
    return {
      headline: 'You already monitor. The gap is what happens next',
      body: 'Monitoring says something changed. Guardian Care classifies it, explains why it matters for that customer on that tariff, and drafts the conversation — the step that turns a dashboard into revenue.'
    };
  }

  return {
    headline: 'Start by making the customer base visible',
    body: 'Before anything can be automated, the platform has to know what each customer has and what it should be doing. Guardian Care begins with structured capture — and the assessment your engineers already carry out becomes the setup.'
  };
}
