import Glyph from '../../../components/Glyph';
import {Heading, LABEL, Tile} from '../../../components/kit';
import Photo from '../../../components/Photo';
import Reveal from '../../../components/Reveal';
import {Estimated, Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {
  DEFAULT_RATES,
  STORAGE_COMPARISON,
  STORAGE_GENERATED,
  type StorageDay
} from '../../../data/plan';
import {cn} from '../../../lib/cn';
import {Figure, UnitKey, Units, type Segment} from './parts';

export default function Storage() {
  const [without, with_] = STORAGE_COMPARISON;
  const avoided = ((without.later - with_.later) * DEFAULT_RATES.importRate) / 100;

  return (
    <Section id="storage" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          title="Same generation."
          accent="Different destination."
          body="A battery does not produce more. It changes when you can use what you already produce."
        />

        <Reveal animation="animate-card-in" className="ring-lit overflow-hidden rounded-frame">
          <Photo
            src="/assets/photos/evening.jpg"
            alt="A house with solar panels photographed at dusk, its windows lit"
            className="h-[320px] min-[760px]:h-[380px]"
            imgClassName="object-[50%_45%]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 92%, transparent), color-mix(in srgb, var(--color-bg) 60%, transparent) 52%, color-mix(in srgb, var(--color-bg) 12%, transparent) 84%)'
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 min-[760px]:p-11">
              <div className={cn(LABEL, 'text-purple')}> Six in the evening</div>
              <h3 className="mt-5 max-w-[620px] font-display text-[clamp(27px,4.2vw,46px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
                The lights are on.
                <br />
                <span className="text-brand-gradient">The roof is finished.</span>
              </h3>
              <p className="mt-5 max-w-[460px] text-[16px] font-light leading-[1.6] text-ink/80">
                This is the hour a battery is for. Not midday, when everything is easy.
              </p>
            </div>
          </Photo>
        </Reveal>

        <div className="mt-4 grid gap-4 min-[980px]:grid-cols-2">
          {STORAGE_COMPARISON.map((day, index) => (
            <Reveal key={day.key} delay={index * 0.08} className="min-w-0">
              <Day day={day} best={index === 1} />
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.16}
          className="mt-4 rounded-frame p-px"
          style={{
            background:
              'linear-gradient(100deg, var(--ramp-far), var(--ramp-mid) 46%, var(--color-purple))'
          }}
        >
          <div className="flex flex-col gap-6 rounded-[5px] bg-[linear-gradient(180deg,var(--color-panel),var(--color-bg-2))] px-6 py-7 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-10 min-[900px]:px-9">
            <Tile colour="var(--color-purple)" size="lg">
              <Glyph name="storage" bold className="h-7 w-7" />
            </Tile>

            <div className="min-w-0 flex-1">
              <div className={cn(LABEL, 'text-purple')}>Guardian Care suggestion</div>
              <div className="mt-3 font-display text-[clamp(23px,3vw,34px)] font-semibold uppercase leading-[1.02] tracking-[-0.01em] text-ink">
                Battery storage opportunity identified
              </div>
              <p className="mt-3 max-w-[560px] text-[14.5px] font-light leading-[1.6] text-muted">
                {without.later - with_.later} fewer kilowatt-hours bought back that evening, at{' '}
                {DEFAULT_RATES.importRate}p each.
              </p>
            </div>

            <div className="shrink-0 min-[900px]:text-right">
              <Figure size="md" tone="purple" value={`£${avoided.toFixed(2)}`} unit="that evening" />
              <div className="mt-3">
                <Estimated label="Estimated, one day" />
              </div>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}

function Day({day, best}: {day: StorageDay; best: boolean}) {
  const segments: Segment[] = day.where.map((part) => ({
    tone: part.tone,
    count: part.value,
    label: part.label
  }));

  const later: Segment[] = [
    {tone: 'orange', count: day.later, hollow: true, label: 'Bought back that evening'}
  ];

  return (
    <div
      className={cn(
        'glass ring-lit flex h-full flex-col overflow-hidden rounded-frame',
        best && 'shadow-lift'
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-5 py-3.5 min-[520px]:px-6">
        <span className={cn(LABEL, best ? 'text-purple' : 'text-faint')}>{day.name}</span>
        <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">
          {STORAGE_GENERATED} kWh generated
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 min-[520px]:px-6">
        <div>
          <div className={cn(LABEL, 'text-faint')}>Where it went</div>
          <Units segments={segments} className="mt-4" />
          <UnitKey segments={segments} className="mt-4" />
        </div>

        <div className="mt-7 border-t border-line-2 pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className={cn(LABEL, 'text-orange')}>Then, that evening</div>
              <div className="mt-3.5 max-w-[240px]">
                <Units segments={later} pad={STORAGE_COMPARISON[0].later} />
              </div>
            </div>
            <Figure
              size="sm"
              tone={best ? 'green' : 'orange'}
              value={day.later}
              unit="kWh bought"
            />
          </div>
        </div>

        <p
          className={cn(
            'mt-6 border-l-2 pl-4 text-[14px] font-light leading-[1.55] text-ink/85',
            best ? 'border-purple/55' : 'border-line-2'
          )}
        >
          {day.line}
        </p>

        {best ? (
          <div className={cn('mt-5 flex items-center gap-2', TONE_TEXT.purple)}>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{background: TONE_VAR.purple}}
            />
            <span className="mono text-[11.5px] font-semibold uppercase tracking-[.12em]">
              Same panels · same weather · same house
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
