import Counter from '../../../components/Counter';
import Glyph from '../../../components/Glyph';
import {Heading, LABEL} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Estimated, Section, Wrap} from '../../../components/ui';
import {TONE_TEXT} from '../../../data/command';
import {SELF_USE, money, type PlanPosition} from '../../../data/plan';
import {cn} from '../../../lib/cn';
import {Caption, Figure, Panel, UnitKey, Units, type Segment} from './parts';

const CELLS = 20;

export default function Position({position}: {position: PlanPosition}) {
  const {annualKwh, directKwh, batteryExtraKwh, importRate} = position;

  const solarCells = annualKwh && directKwh ? Math.round((directKwh / annualKwh) * CELLS) : 0;
  const batteryCells =
    annualKwh && batteryExtraKwh
      ? Math.round(((directKwh ?? 0) + batteryExtraKwh) / annualKwh * CELLS) - solarCells
      : 0;
  const boughtCells = Math.max(0, CELLS - solarCells - batteryCells);

  const today: Segment[] = [
    {tone: 'orange', count: CELLS, hollow: true, label: 'Bought from the grid'}
  ];

  const after: Segment[] = [
    {tone: 'amber', count: solarCells, label: 'Solar, used as it is made'},
    {tone: 'purple', count: batteryCells, label: 'Solar, stored for later'},
    {tone: 'orange', count: boughtCells, hollow: true, label: 'Still bought'}
  ];

  const readable = annualKwh !== null && directKwh !== null;

  return (
    <Section id="estimate" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow=" Your energy intelligence estimate"
          title="Your year,"
          accent="as it could be."
          body="Built from your answers, at the rate you gave us. Every figure that matters shows the sum behind it."
        />

        <Reveal animation="animate-card-in" className="min-w-0">
          <Panel
            title="Your household electricity, one year"
            tone="amber"
            glyph="property"
            aside={
              <Caption>
                {annualKwh === null
                  ? 'awaiting your bill'
                  : `${annualKwh.toLocaleString('en-GB')} kWh · ${importRate}p each`}
              </Caption>
            }
            bodyClassName="px-5 py-7 min-[520px]:px-7"
          >
            {readable ? (
              <>
                <div>
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-display text-[clamp(19px,2.2vw,24px)] font-semibold uppercase leading-none text-ink">
                      Today
                    </span>
                    <span className="mono text-[13px] uppercase tracking-[.12em] text-orange">
                      100% purchased
                    </span>
                  </div>
                  <Units segments={today} />
                </div>

                <div className="my-8 flex items-center gap-4">
                  <span className="h-px flex-1 bg-line-2" />
                  <Glyph name="generation" className="h-6 w-6 shrink-0 text-amber" />
                  <span className={cn(LABEL, 'text-amber')}>With solar and storage</span>
                  <span className="h-px flex-1 bg-line-2" />
                </div>

                <div>
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-display text-[clamp(19px,2.2vw,24px)] font-semibold uppercase leading-none text-ink">
                      Potentially
                    </span>
                    <span className="mono text-[13px] uppercase tracking-[.12em] text-green">
                      {Math.round(((solarCells + batteryCells) / CELLS) * 100)}% your own
                    </span>
                  </div>
                  <Units segments={after} />
                  <UnitKey segments={after} className="mt-5" />
                </div>
              </>
            ) : (
              <p className="text-[15px] font-light leading-[1.6] text-muted">
                Guardian Care needs your monthly bill to draw this. Everything below is sized from
                national averages until it arrives.
              </p>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={0.08} className="mt-4 min-w-0">
          <Panel
            title="Estimated grid cost avoided"
            tone="green"
            glyph="savings"
            aside={<Estimated label="Estimate, not a quotation" />}
            bodyClassName="p-0"
          >
            <div className="grid gap-px bg-line-2 min-[900px]:grid-cols-2">
              <Working
                tone="amber"
                heading="Used as it is made"
                note={`About ${Math.round(SELF_USE.without * 100)}% of generation, capped by what the property actually uses`}
                rows={[
                  [
                    'Solar used directly',
                    directKwh === null ? '—' : `${directKwh.toLocaleString('en-GB')} kWh/yr`
                  ],
                  ['Your import rate', `${importRate}p/kWh`]
                ]}
                total={money(position.directValue)}
              />

              <Working
                tone="purple"
                heading="Held back by a battery"
                note={`Lifts self-consumption to about ${Math.round(SELF_USE.with * 100)}%, by keeping surplus for the evening`}
                rows={[
                  [
                    'Additional solar used',
                    batteryExtraKwh === null
                      ? '—'
                      : `${batteryExtraKwh.toLocaleString('en-GB')} kWh/yr`
                  ],
                  ['Your import rate', `${importRate}p/kWh`]
                ]}
                total={money(position.batteryExtraValue)}
              />
            </div>

            <div className="border-t border-line-2 bg-bg/40 px-5 py-7 min-[520px]:px-7">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className={cn(LABEL, 'text-green')}>Combined, per year</div>
                  <Figure
                    size="lg"
                    tone="green"
                    unit="per year"
                    className="mt-3"
                    value={
                      position.combinedValue === null ? (
                        '—'
                      ) : (
                        <Counter value={money(position.combinedValue)} />
                      )
                    }
                  />
                </div>

                <div className="max-w-[420px]">
                  <div className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-faint">
                    Depends on
                  </div>
                  <ul className="mt-3 grid gap-x-6 gap-y-1 text-[12.5px] font-light text-faint min-[520px]:grid-cols-2">
                    {[
                      'Final system size',
                      'Roof suitability',
                      'Weather',
                      'Household usage',
                      'Battery capacity',
                      'Your tariff',
                      'System configuration',
                      'Export arrangement'
                    ].map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.14} className="mt-4 min-w-0">
          <Compare position={position} />
        </Reveal>

        <Reveal delay={0.2} className="mt-4">
          <div className="glass ring-lit flex flex-col gap-5 rounded-frame px-6 py-6 min-[760px]:flex-row min-[760px]:items-center min-[760px]:gap-8 min-[760px]:px-8">
            <Glyph name="grid" className="h-9 w-9 shrink-0 text-faint" />
            <div className="min-w-0 flex-1">
              <div className={cn(LABEL, 'text-faint')}>What solar cannot change</div>
              <p className="mt-2.5 text-[14.5px] font-light leading-[1.6] text-muted">
                Your standing charge is payable whether you generate or not. We take it off before
                dividing your bill, so solar is never credited with a cost it cannot remove.
              </p>
            </div>
            <Figure
              size="sm"
              tone="ink"
              unit="per year"
              className="shrink-0"
              value={money(position.annualStanding)}
            />
          </div>
        </Reveal>
      </Wrap>
    </Section>
  );
}

function Working({
  tone,
  heading,
  note,
  rows,
  total
}: {
  tone: 'amber' | 'purple';
  heading: string;
  note: string;
  rows: Array<[string, string]>;
  total: string;
}) {
  return (
    <div className="bg-panel px-5 py-6 min-[520px]:px-7">
      <div className={cn(LABEL, TONE_TEXT[tone])}>{heading}</div>
      <p className="mt-2.5 text-[13px] font-light leading-[1.5] text-faint">{note}</p>

      <dl className="mt-5 divide-y divide-line-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-[14px] font-light text-muted">{label}</dt>
            <dd className="mono text-[14px] font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-2 pt-5">
        <span className="text-[13px] font-light text-faint">avoided grid cost</span>
        <Figure size="sm" tone={tone} value={total} />
      </div>
    </div>
  );
}

function Compare({position}: {position: PlanPosition}) {
  const rows: Array<[string, string, string, boolean]> = [
    ['Grid dependency', 'High', 'Potentially reduced', true],
    [
      'Solar generation',
      'None',
      position.systemKw ? `${position.systemKw} kWp available` : 'Available',
      true
    ],
    [
      'Battery storage',
      'None',
      position.batteryKwh ? `${position.batteryKwh} kWh for assessment` : 'For assessment',
      true
    ],
    ['Energy monitoring', 'None', 'Included', true],
    ['Guardian Care intelligence', 'None', 'Included', true],
    [
      'Electricity cost',
      position.monthlyBill === null ? '—' : `£${position.monthlyBill}/month`,
      position.combinedValue === null
        ? 'Reduced'
        : `≈ ${money(position.combinedValue / 12)}/month less`,
      true
    ]
  ];

  return (
    <div className="glass ring-lit overflow-hidden rounded-frame">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] gap-px bg-line-2 min-[620px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="bg-panel-2 px-4 py-3.5 min-[620px]:px-6">
          <span className={cn(LABEL, 'text-faint')}>Position</span>
        </div>
        <div className="bg-panel-2 px-4 py-3.5 min-[620px]:px-6">
          <span className={cn(LABEL, 'text-orange')}>Today</span>
        </div>
        <div className="bg-panel-2 px-4 py-3.5 min-[620px]:px-6">
          <span className={cn(LABEL, 'text-green')}>Potentially</span>
        </div>

        {rows.map(([label, now, later]) => (
          <Cells key={label} label={label} now={now} later={later} />
        ))}
      </div>
    </div>
  );
}

function Cells({label, now, later}: {label: string; now: string; later: string}) {
  return (
    <>
      <div className="bg-panel px-4 py-4 min-[620px]:px-6">
        <span className="text-[13.5px] font-light leading-snug text-muted min-[620px]:text-[14.5px]">
          {label}
        </span>
      </div>
      <div className="bg-panel px-4 py-4 min-[620px]:px-6">
        <span className="mono text-[13px] font-semibold leading-snug text-faint min-[620px]:text-[14px]">
          {now}
        </span>
      </div>
      <div className="bg-panel px-4 py-4 min-[620px]:px-6">
        <span className="mono text-[13px] font-semibold leading-snug text-green min-[620px]:text-[14px]">
          {later}
        </span>
      </div>
    </>
  );
}
