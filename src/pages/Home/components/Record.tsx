import {useId} from 'react';
import type {ReactNode} from 'react';
import Glyph from '../../../components/Glyph';
import {PRIMARY} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {RECORD_CLAIM, RECORD_ROOTS, RECORD_SPINE} from '../../../data/platform';
import {cn} from '../../../lib/cn';
import {LiveDot} from './Conduit';

const ROW_H = 72;
const ROW_GAP = 12;
const FAN_W = 120;
const SPINE_H = RECORD_SPINE.length * ROW_H + (RECORD_SPINE.length - 1) * ROW_GAP;
const ORIGIN_Y = SPINE_H / 2;

function rowCentre(index: number): number {
  return index * (ROW_H + ROW_GAP) + ROW_H / 2;
}

function tone(index: number): string {
  const t = index / (RECORD_SPINE.length - 1);
  if (t <= 0.5) {
    return `color-mix(in oklab, var(--ramp-mid) ${Math.round((t / 0.5) * 100)}%, var(--ramp-far))`;
  }
  return `color-mix(in oklab, var(--color-blue) ${Math.round(((t - 0.5) / 0.5) * 100)}%, var(--ramp-mid))`;
}

function tint(colour: string, percent: number): string {
  return `color-mix(in srgb, ${colour} ${percent}%, transparent)`;
}

export default function Record() {
  return (
    <Section id="record" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Reveal className="mx-auto mb-16 max-w-[680px] text-center">
          <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
            One customer.
            <br />
            <span className="text-brand-gradient">One system record.</span>
          </h2>
        </Reveal>

        <div
          className="hidden min-[1180px]:grid min-[1180px]:items-stretch"
          style={{gridTemplateColumns: `360px ${FAN_W}px 1fr`}}
        >
          <Reveal animation="animate-card-in" style={{height: SPINE_H}}>
            <RecordCore />
          </Reveal>

          <Reveal delay={0.25}>
            <svg
              width={FAN_W}
              height={SPINE_H}
              viewBox={`0 0 ${FAN_W} ${SPINE_H}`}
              overflow="visible"
              aria-hidden="true"
              className="block"
            >
              {RECORD_SPINE.map((node, index) => {
                const y = rowCentre(index);
                return (
                  <g key={node.name}>
                    <path
                      d={`M 0 ${ORIGIN_Y} C ${FAN_W * 0.55} ${ORIGIN_Y}, ${FAN_W * 0.45} ${y}, ${FAN_W} ${y}`}
                      fill="none"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeDasharray="2 8"
                      style={{
                        stroke: tone(index),
                        opacity: 0.75,
                        animation: 'crawl 3s linear infinite',
                        animationDelay: `${index * -0.4}s`
                      }}
                    />
                    <circle cx={FAN_W} cy={y} r="3.5" style={{fill: tone(index)}} />
                  </g>
                );
              })}

              <circle cx="0" cy={ORIGIN_Y} r="11" style={{fill: tint('var(--ramp-mid)', 16)}} />
              <circle cx="0" cy={ORIGIN_Y} r="5" style={{fill: 'var(--ramp-mid)'}} />
            </svg>
          </Reveal>

          <ol className="flex flex-col" style={{gap: ROW_GAP}}>
            {RECORD_SPINE.map((node, index) => (
              <Reveal
                key={node.name}
                as="li"
                delay={0.3 + index * 0.06}
                className="flex items-center gap-5 rounded-card border bg-panel/55 px-5 backdrop-blur-[6px]"
                style={{height: ROW_H, borderColor: tint(tone(index), 26)}}
              >
                <StageRow index={index} />
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mx-auto max-w-[560px] min-[1180px]:hidden">
          <Reveal animation="animate-card-in">
            <RecordCore />
          </Reveal>

          <div className="ml-[19px] h-10 w-0.5" style={dottedRail(tone(0))} aria-hidden="true" />

          <ol>
            {RECORD_SPINE.map((node, index) => (
              <Reveal key={node.name} as="li" delay={0.04} className="flex gap-4">
                <div className="relative flex w-10 shrink-0 justify-center">
                  {index < RECORD_SPINE.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 w-0.5"
                      style={dottedRail(tone(index))}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 h-5 w-0.5"
                      style={dottedRail(tone(index))}
                    />
                  )}
                  <SymbolTile colour={tone(index)} size="rail">
                    <Glyph name={node.glyph} bold className="h-6 w-6" />
                  </SymbolTile>
                </div>

                <div className="min-w-0 flex-1 pb-7 pt-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="mono text-[11px] text-faint">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[19px] font-semibold uppercase leading-none text-ink">
                      {node.name}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[13.5px] font-light leading-[1.5] text-muted">
                    {node.line}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
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
            <Claim text={RECORD_CLAIM} />
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 flex justify-center min-[760px]:mt-24">
          <a href="#journeys" className={PRIMARY}>
            Choose your journey &#8594;
          </a>
        </Reveal>
      </Wrap>
    </Section>
  );
}

function RecordCore() {
  return (
    <div className="relative h-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full blur-[60px]"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--color-green) 16%, transparent), color-mix(in srgb, var(--color-amber) 6%, transparent) 45%, transparent 70%)'
        }}
      />

      <div
        className="h-full rounded-frame p-px"
        style={{
          background:
            'linear-gradient(160deg, var(--ramp-far), var(--ramp-mid) 48%, var(--color-blue))'
        }}
      >
        <div className="flex h-full flex-col rounded-[5px] bg-[linear-gradient(180deg,var(--color-panel),var(--color-bg-2))] px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mono text-[11.5px] font-semibold uppercase tracking-[.13em] text-amber">
                 Customer record
              </div>
              <div className="mono mt-1.5 text-[13px] text-faint">GC-0418</div>
            </div>
            <span className="flex items-center gap-2">
              <LiveDot />
              <span className="mono text-[11px] font-semibold uppercase tracking-[.12em] text-green">
                Active
              </span>
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center py-4">
            <Emblem />
          </div>

          <ul className="space-y-px overflow-hidden rounded-card border border-line-2">
            {RECORD_ROOTS.map((root, index) => (
              <li key={root.name} className="flex items-center gap-3.5 bg-bg/50 px-4 py-3">
                <SymbolTile colour={ROOT_TONES[index]} size="root">
                  <Glyph name={root.glyph} bold className="h-6 w-6" />
                </SymbolTile>
                <span className="min-w-0">
                  <span className="mono block text-[11px] font-semibold uppercase tracking-[.13em] text-ink">
                    {root.name}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] font-light leading-[1.4] text-muted">
                    {root.line}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              {RECORD_SPINE.map((node, index) => (
                <span
                  key={node.name}
                  className="h-1.5 w-5 rounded-pill"
                  style={{background: tone(index)}}
                />
              ))}
            </div>
            <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">
              {RECORD_SPINE.length} / {RECORD_SPINE.length} linked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Emblem() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const glowId = `rec-core-glow-${uid}`;
  const edgeId = `rec-core-edge-${uid}`;
  const C = 80;
  const spin = (seconds: number, reverse?: boolean) => ({
    transformOrigin: `${C}px ${C}px`,
    transformBox: 'view-box' as const,
    animation: `orbit ${seconds}s linear infinite${reverse ? ' reverse' : ''}`
  });

  return (
    <svg viewBox="0 0 160 160" className="h-36 w-36 min-[1180px]:h-40 min-[1180px]:w-40" aria-hidden="true">
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--ramp-mid)" stopOpacity="0.32" />
          <stop offset="60%" stopColor="var(--ramp-mid)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--ramp-mid)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-amber)" />
          <stop offset="52%" stopColor="var(--ramp-mid)" />
          <stop offset="100%" stopColor="var(--color-blue)" />
        </linearGradient>
      </defs>

      <circle cx={C} cy={C} r="62" fill={`url(#${glowId})`} />

      <g style={spin(60)}>
        <circle
          cx={C}
          cy={C}
          r="72"
          fill="none"
          stroke="var(--ramp-mid)"
          strokeWidth="1.6"
          strokeDasharray="2 8"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx={C} cy={C - 72} r="3" fill="var(--ramp-mid)" />
      </g>

      <g style={spin(38, true)}>
        <circle
          cx={C}
          cy={C}
          r="54"
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="1.3"
          strokeDasharray="1.5 6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx={C + 54} cy={C} r="2.4" fill="var(--color-amber)" />
      </g>

      <circle cx={C} cy={C} r="36" fill="none" stroke="var(--color-blue)" strokeWidth="1" opacity="0.35" />

      <rect
        x={C - 17}
        y={C - 17}
        width="34"
        height="34"
        rx="3"
        transform={`rotate(45 ${C} ${C})`}
        fill="color-mix(in srgb, var(--color-green) 8%, transparent)"
        stroke={`url(#${edgeId})`}
        strokeWidth="2"
      />
      <rect
        x={C - 5}
        y={C - 5}
        width="10"
        height="10"
        rx="1"
        transform={`rotate(45 ${C} ${C})`}
        fill={`url(#${edgeId})`}
      />
    </svg>
  );
}

function StageRow({index}: {index: number}) {
  const node = RECORD_SPINE[index];
  const colour = tone(index);

  return (
    <>
      <span className="mono w-6 shrink-0 text-[11px] font-semibold text-faint">
        {String(index + 1).padStart(2, '0')}
      </span>

      <SymbolTile colour={colour} size="row">
        <Glyph name={node.glyph} bold className="h-7 w-7" />
      </SymbolTile>

      <span className="min-w-0">
        <span className="block font-display text-[18px] font-semibold uppercase leading-none tracking-[0.01em] text-ink">
          {node.name}
        </span>
        <span className="mt-1.5 block text-[13.5px] font-light leading-[1.35] text-muted">
          {node.line}
        </span>
      </span>
    </>
  );
}

const ROOT_TONES = ['var(--ramp-far)', 'var(--ramp-mid)', 'var(--color-blue)'];

const TILE = {
  row: 'h-12 w-12 rounded-tile',
  root: 'h-10 w-10 rounded-tile',
  rail: 'relative mt-1 h-11 w-11 rounded-full'
} as const;

function SymbolTile({
  colour,
  size,
  children
}: {
  colour: string;
  size: keyof typeof TILE;
  children: ReactNode;
}) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center text-bg', TILE[size])}
      style={{
        background: colour,
        boxShadow: `0 8px 22px -10px ${tint(colour, 85)}, inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.2)`
      }}
    >
      {children}
    </span>
  );
}

function dottedRail(colour: string) {
  return {
    backgroundImage: `linear-gradient(180deg, ${colour} 0 2px, transparent 2px)`,
    backgroundSize: '2px 10px',
    backgroundRepeat: 'repeat-y',
    animation: 'rail-crawl-y 2.6s linear infinite'
  };
}

const NOUNS: Record<string, string> = {
  site: 'var(--ramp-far)',
  system: 'var(--ramp-mid)',
  operator: 'var(--color-blue)',
  customer: 'var(--color-ink)'
};

function Claim({text}: {text: string}) {
  const parts = text.split(/\b(site|system|operator|customer)\b/);

  return (
    <>
      {parts.map((part, index) =>
        NOUNS[part] ? (
          <span key={index} style={{color: NOUNS[part]}} className="font-semibold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}
