import type {ReactNode} from 'react';
import Glyph, {type GlyphName} from './Glyph';
import Reveal from './Reveal';
import {TONE_TEXT, TONE_VAR, type StatusTone} from '../data/command';
import {cn} from '../lib/cn';

export const PRIMARY =
  'inline-flex items-center gap-3 rounded-pill bg-[var(--cta)] px-8 py-[17px] text-[12.5px] ' +
  'font-bold uppercase tracking-[.1em] text-[var(--cta-ink)] ' +
  'shadow-[0_16px_40px_-16px_var(--btn-glow)] transition duration-250 ease-brand ' +
  'hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] ' +
  'hover:shadow-[0_24px_54px_-18px_var(--btn-glow)]';

export const SECONDARY =
  'mono inline-flex items-center gap-2.5 rounded-pill border border-line-2 px-6 py-[15px] ' +
  'text-[11px] font-semibold uppercase tracking-[.12em] text-ink transition duration-200 ' +
  'hover:border-green/60 hover:text-green';

export const LABEL_BASE = 'mono font-semibold uppercase';

export const LABEL = `${LABEL_BASE} text-[11.5px] tracking-[.13em]`;

export function Heading({
  eyebrow,
  title,
  accent,
  body,
  align = 'center',
  spacing = 'mb-14'
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  accent?: ReactNode;
  body?: ReactNode;
  align?: 'center' | 'left';
  spacing?: string;
}) {
  const centred = align === 'center';

  return (
    <Reveal className={cn('max-w-[740px]', spacing, centred && 'mx-auto text-center')}>
      {eyebrow ? (
        <div className={cn(LABEL_BASE, 'mb-5 text-[11px] tracking-[.12em] text-green')}>{eyebrow}</div>
      ) : null}

      <h2 className="font-display text-[clamp(30px,4.6vw,54px)] font-semibold uppercase leading-[0.98] tracking-[-0.015em] text-ink">
        {title}
        {accent ? (
          <>
            <br />
            <span className="text-brand-gradient">{accent}</span>
          </>
        ) : null}
      </h2>

      {body ? (
        <p
          className={cn(
            'mt-6 max-w-[560px] text-[16.5px] font-light leading-[1.65] text-muted',
            centred && 'mx-auto'
          )}
        >
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

export function tint(colour: string, percent: number): string {
  return `color-mix(in srgb, ${colour} ${percent}%, transparent)`;
}

export function ramp(index: number, count: number): string {
  const t = count > 1 ? index / (count - 1) : 0;
  if (t <= 0.5) {
    return `color-mix(in oklab, var(--ramp-mid) ${Math.round((t / 0.5) * 100)}%, var(--ramp-far))`;
  }
  return `color-mix(in oklab, var(--color-blue) ${Math.round(((t - 0.5) / 0.5) * 100)}%, var(--ramp-mid))`;
}

const TILE_SIZE = {
  sm: 'h-9 w-9 rounded-tile',
  md: 'h-11 w-11 rounded-tile',
  lg: 'h-14 w-14 rounded-card'
} as const;

export function Tile({
  tone,
  colour,
  size = 'md',
  className,
  children
}: {
  tone?: StatusTone;
  colour?: string;
  size?: keyof typeof TILE_SIZE;
  className?: string;
  children: ReactNode;
}) {
  const fill = colour ?? TONE_VAR[tone ?? 'green'];

  return (
    <span
      className={cn('grid shrink-0 place-items-center text-bg', TILE_SIZE[size], className)}
      style={{
        background: fill,
        boxShadow: `0 8px 22px -10px ${tint(fill, 80)}, inset 0 1px 0 rgba(255,255,255,0.38), inset 0 -1px 0 rgba(0,0,0,0.2)`
      }}
    >
      {children}
    </span>
  );
}

export function dottedRail(colour: string) {
  return {
    backgroundImage: `linear-gradient(180deg, ${colour} 0 2px, transparent 2px)`,
    backgroundSize: '2px 10px',
    backgroundRepeat: 'repeat-y',
    animation: 'rail-crawl-y 2.6s linear infinite'
  };
}

export function Figure({
  value,
  unit,
  tone = 'ink',
  size = 'md',
  className
}: {
  value: ReactNode;
  unit?: string;
  tone?: StatusTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const scale = {
    sm: 'text-[clamp(20px,2.4vw,26px)]',
    md: 'text-[clamp(28px,3.4vw,38px)]',
    lg: 'text-[clamp(38px,6vw,58px)]'
  }[size];

  return (
    <div className={cn('mono font-semibold leading-none', scale, TONE_TEXT[tone], className)}>
      {value}
      {unit ? (
        <span className="mono ml-1.5 text-[12px] font-normal tracking-normal text-faint">
          {unit}
        </span>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  tone = 'green',
  aside,
  glyph,
  className,
  bodyClassName,
  children
}: {
  title: ReactNode;
  tone?: StatusTone;
  aside?: ReactNode;
  glyph?: GlyphName;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('glass ring-lit flex flex-col overflow-hidden rounded-frame', className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-2 px-5 py-3.5 min-[520px]:px-6">
        <span className={cn(LABEL, 'flex items-center gap-2.5', TONE_TEXT[tone])}>
          {glyph ? <Glyph name={glyph} className="h-4 w-4" /> : <span aria-hidden="true">&#9671;</span>}
          {title}
        </span>
        {aside ? <span className="ml-auto shrink-0">{aside}</span> : null}
      </div>
      <div className={cn('flex-1 px-5 py-6 min-[520px]:px-6', bodyClassName)}>{children}</div>
    </div>
  );
}

export function Caption({children}: {children: ReactNode}) {
  return <span className="mono text-[11px] uppercase tracking-[.12em] text-faint">{children}</span>;
}
