import Glyph from '../../../components/Glyph';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {DAY, JOINED, PARTS} from '../../../data/consumer';
import {TONE_TEXT} from '../../../data/command';
import {cn} from '../../../lib/cn';
import {LiveDot} from '../../Home/components/Conduit';
import {Heading, LABEL, dottedRail, ramp, tint} from '../../../components/kit';

const ROW_H = 62;
const ROW_GAP = 10;
const FAN_W = 150;
const SPINE_H = PARTS.length * ROW_H + (PARTS.length - 1) * ROW_GAP;
const HUB_Y = SPINE_H / 2;

function rowCentre(index: number): number {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
}

export default function Why() {
  return (
    <Section id="why" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow=" Why Guardian Care?"
          title="Many parts."
          accent="One clear picture."
          body="Several parts, each reporting its own small piece. None of them tells you how the system is doing."
        />

        <div
          className="hidden min-[1100px]:grid"
          style={{gridTemplateColumns: `minmax(0,1fr) ${FAN_W}px minmax(0,440px)`}}
        >
          <ol className="flex flex-col" style={{gap: ROW_GAP}}>
            {PARTS.map((part, index) => (
              <Reveal
                key={part.name}
                as="li"
                delay={index * 0.05}
                className="flex items-center gap-4 rounded-card border border-line-2 bg-panel/55 px-4 backdrop-blur-[6px]"
                style={{height: ROW_H}}
              >
                <PartRow index={index} />
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3}>
            <svg
              width={FAN_W}
              height={SPINE_H}
              viewBox={`0 0 ${FAN_W} ${SPINE_H}`}
              overflow="visible"
              aria-hidden="true"
              className="block"
            >
              {PARTS.map((part, index) => {
                const y = rowCentre(index);
                const colour = ramp(index, PARTS.length);
                return (
                  <g key={part.name}>
                    <path
                      d={`M 0 ${y} C ${FAN_W * 0.55} ${y}, ${FAN_W * 0.45} ${HUB_Y}, ${FAN_W} ${HUB_Y}`}
                      fill="none"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeDasharray="2 8"
                      style={{
                        stroke: colour,
                        opacity: 0.75,
                        animation: 'crawl 3s linear infinite',
                        animationDelay: `${index * -0.4}s`
                      }}
                    />
                    <circle cx="0" cy={y} r="3" style={{fill: colour}} />
                  </g>
                );
              })}

              <circle cx={FAN_W} cy={HUB_Y} r="11" style={{fill: tint('var(--ramp-mid)', 16)}} />
              <circle cx={FAN_W} cy={HUB_Y} r="5" style={{fill: 'var(--ramp-mid)'}} />
            </svg>
          </Reveal>

          <Reveal animation="animate-card-in" delay={0.2} style={{height: SPINE_H}}>
            <Picture />
          </Reveal>
        </div>

        <div className="min-[1100px]:hidden">
          <ol className="grid gap-2.5 min-[620px]:grid-cols-2">
            {PARTS.map((part, index) => (
              <Reveal
                key={part.name}
                as="li"
                delay={0.03}
                className="flex items-center gap-4 rounded-card border border-line-2 bg-panel/55 px-4 py-3.5 backdrop-blur-[6px]"
              >
                <PartRow index={index} />
              </Reveal>
            ))}
          </ol>

          <div
            aria-hidden="true"
            className="mx-auto h-12 w-0.5"
            style={dottedRail('var(--ramp-mid)')}
          />

          <Reveal animation="animate-card-in" className="mx-auto max-w-[520px]">
            <Picture />
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-20 max-w-[820px] text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-8 h-px max-w-[220px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--ramp-far), var(--ramp-mid), var(--color-blue), transparent)'
            }}
          />
          <p className="font-display text-[clamp(22px,3.2vw,36px)] font-medium uppercase leading-[1.16] tracking-[-0.005em] text-muted">
            Guardian Care brings the important information into{' '}
            <span className="font-semibold text-amber">one place</span> — and turns it into{' '}
            <span className="font-semibold text-green">clear energy intelligence</span>.
          </p>
        </Reveal>
      </Wrap>
    </Section>
  );
}

function PartRow({index}: {index: number}) {
  const part = PARTS[index];
  const colour = ramp(index, PARTS.length);

  return (
    <>
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-tile"
        style={{
          background: tint(colour, 12),
          boxShadow: `inset 0 0 0 1px ${tint(colour, 34)}`,
          color: colour
        }}
      >
        <Glyph name={part.glyph} bold className="h-[22px] w-[22px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-tight text-ink">{part.name}</span>
        <span className="mt-1 block text-[13px] font-light leading-snug text-muted">
          {part.says}
        </span>
      </span>
    </>
  );
}

function Picture() {
  return (
    <div className="relative h-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full blur-[60px]"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-green) 14%, transparent), color-mix(in srgb, var(--color-amber) 6%, transparent) 45%, transparent 70%)'
        }}
      />

      <div
        className="h-full rounded-frame p-px"
        style={{
          background:
            'linear-gradient(160deg, var(--ramp-far), var(--ramp-mid) 48%, var(--color-blue))'
        }}
      >
        <div className="flex h-full flex-col rounded-[5px] bg-[linear-gradient(180deg,var(--color-panel),var(--color-bg-2))] px-6 py-6 min-[520px]:px-7">
          <div className="flex items-center justify-between gap-4">
            <span className={cn(LABEL, 'text-amber')}> Guardian Care</span>
            <span className="flex items-center gap-2">
              <LiveDot />
              <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-green">
                Joined up
              </span>
            </span>
          </div>

          <div className="mt-5 font-display text-[26px] font-semibold uppercase leading-none text-ink">
            One view of your whole system
          </div>

          <ul className="mt-6 flex flex-1 flex-col justify-center gap-px overflow-hidden rounded-card">
            {PARTS.map((part, index) => {
              const joined = JOINED[index];

              return (
                <li
                  key={part.name}
                  className="flex items-center gap-3 bg-bg/40 px-3.5 py-2.5"
                >
                  <span className="shrink-0 text-faint">
                    <Glyph name={part.glyph} className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-light text-muted">
                    {part.name}
                  </span>

                  <span
                    className={cn(
                      'mono shrink-0 text-[12.5px] font-semibold',
                      TONE_TEXT[joined.tone]
                    )}
                  >
                    {joined.reading}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mono mt-5 border-t border-line-2 pt-4 text-[11px] uppercase tracking-[.12em] text-faint">
            {DAY.generated} made = {DAY.used} used + {DAY.stored} held + {DAY.exported} sent
          </p>
        </div>
      </div>
    </div>
  );
}

