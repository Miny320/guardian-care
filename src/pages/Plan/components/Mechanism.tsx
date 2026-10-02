import Glyph, {type GlyphName} from '../../../components/Glyph';
import {Heading, LABEL, dottedRail} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {TONE_TEXT, TONE_VAR, type StatusTone} from '../../../data/command';
import {DEFAULT_RATES, SWAP} from '../../../data/plan';
import {cn} from '../../../lib/cn';
import {Caption, Figure, Panel, UnitKey, Units, type Segment} from './parts';

const WITHOUT: Segment[] = [
  {tone: 'orange', count: SWAP.usage, hollow: true, label: 'Bought from the grid'}
];

const WITH: Segment[] = [
  {tone: 'amber', count: SWAP.solarSupplies, label: 'Made on your roof'},
  {tone: 'orange', count: SWAP.gridWithSolar, hollow: true, label: 'Still bought'}
];

const DESTINATIONS: Array<{
  name: string;
  glyph: GlyphName;
  tone: StatusTone;
  worth: string;
  note: string;
}> = [
  {
    name: 'Your home',
    glyph: 'consumption',
    tone: 'green',
    worth: `${DEFAULT_RATES.importRate}p`,
    note: 'Used as it is made. Full price, saved.'
  },
  {
    name: 'Your battery',
    glyph: 'storage',
    tone: 'purple',
    worth: `${DEFAULT_RATES.importRate}p`,
    note: 'Used tonight instead. Same value, later.'
  },
  {
    name: 'The grid',
    glyph: 'export',
    tone: 'blue',
    worth: `${DEFAULT_RATES.exportRate}p`,
    note: 'Sold on, at about half what buying it back costs.'
  }
];

export default function Mechanism() {
  const rate = SWAP.rate / 100;
  const without = SWAP.usage * rate;
  const with_ = SWAP.gridWithSolar * rate;
  const saved = without - with_;

  return (
    <Section id="changes" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          title="Same house. Same usage."
          accent="Different bill."
          body="Electricity used as it is made is electricity never bought. That is the whole mechanism."
        />

        <div className="grid gap-4 min-[1080px]:grid-cols-[1.25fr_0.75fr]">
          <Reveal className="min-w-0">
            <Panel
              title={`One hour · ${SWAP.usage} kWh of household usage`}
              tone="amber"
              glyph="property"
              aside={<Caption>at {SWAP.rate}p/kWh</Caption>}
              bodyClassName="px-5 py-7 min-[520px]:px-7"
            >
              <Row label="Without solar" units={WITHOUT} cost={without} />

              <div className="my-8 flex items-center gap-4">
                <span className="h-px flex-1 bg-line-2" />
                <Glyph name="generation" className="h-6 w-6 shrink-0 text-amber" />
                <span className={cn(LABEL, 'text-amber')}>The roof starts working</span>
                <span className="h-px flex-1 bg-line-2" />
              </div>

              <Row label="With solar" units={WITH} cost={with_} tone="green" />

              <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line-2 pt-7">
                <div>
                  <div className={cn(LABEL, 'text-green')}>Not bought, that hour</div>
                  <div className="mt-2 text-[13px] font-light text-faint">
                    {SWAP.solarSupplies} kWh × {SWAP.rate}p, never purchased
                  </div>
                </div>
                <Figure size="md" tone="green" value={`£${saved.toFixed(2)}`} />
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <Panel
              title="What one unit is worth"
              tone="green"
              glyph="savings"
              className="h-full"
              bodyClassName="px-5 py-7 min-[520px]:px-6"
            >
              <p className="text-[14.5px] font-light leading-[1.6] text-muted">
                A generated unit has no fixed value. It is worth whatever it stopped you buying.
              </p>

              <ol className="mt-7">
                {DESTINATIONS.map((place, index) => (
                  <li key={place.name}>
                    <div className="flex items-start gap-4">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-tile text-bg"
                        style={{background: TONE_VAR[place.tone]}}
                      >
                        <Glyph name={place.glyph} bold className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-[19px] font-semibold uppercase leading-none text-ink">
                            {place.name}
                          </span>
                          <span
                            className={cn(
                              'mono shrink-0 text-[19px] font-semibold leading-none',
                              TONE_TEXT[place.tone]
                            )}
                          >
                            {place.worth}
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] font-light leading-[1.45] text-muted">
                          {place.note}
                        </p>
                      </div>
                    </div>

                    {index < DESTINATIONS.length - 1 ? (
                      <div
                        aria-hidden="true"
                        className="my-3 ml-5 h-7 w-0.5"
                        style={dottedRail(TONE_VAR[place.tone])}
                      />
                    ) : null}
                  </li>
                ))}
              </ol>

              <p className="mt-7 border-t border-line-2 pt-5 text-[13.5px] font-light leading-[1.55] text-ink/80">
                So the question is not{' '}
                <em className="not-italic text-faint">how many panels</em>. It is{' '}
                <em className="not-italic text-green">how much of it you can keep</em>.
              </p>
            </Panel>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

function Row({
  label,
  units,
  cost,
  tone = 'ink'
}: {
  label: string;
  units: Segment[];
  cost: number;
  tone?: StatusTone;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-display text-[clamp(19px,2.2vw,24px)] font-semibold uppercase leading-none text-ink">
          {label}
        </span>
        <span className={cn('mono text-[clamp(20px,2.4vw,26px)] font-semibold leading-none', TONE_TEXT[tone])}>
          £{cost.toFixed(2)}
        </span>
      </div>

      <Units segments={units} pad={SWAP.usage} />
      <UnitKey segments={units} className="mt-4" />
    </div>
  );
}
