import type {ReactNode} from 'react';
import Reveal from './Reveal';
import {cn} from '../lib/cn';
import {TONE_BG, TONE_TEXT, type StatusGlyph, type StatusTone} from '../data/command';

export const BTN =
  'inline-flex items-center justify-center gap-2.5 rounded-pill bg-[var(--cta)] px-[30px] py-[16px] ' +
  'text-[13px] font-bold uppercase tracking-[.08em] text-[var(--cta-ink)] ' +
  'shadow-[0_10px_30px_-12px_var(--btn-glow)] ' +
  'transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] ' +
  'hover:shadow-[0_18px_44px_-14px_var(--btn-glow)]';

export const ACTION =
  'inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--cta)] px-8 py-4 ' +
  'text-[15.5px] font-medium tracking-[-0.005em] text-[var(--cta-ink)] ' +
  'shadow-[0_14px_34px_-14px_var(--btn-glow)] transition duration-250 ease-brand ' +
  'hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] hover:shadow-[0_22px_46px_-16px_var(--btn-glow)]';

export const ACTION_QUIET =
  'inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] ' +
  'font-medium text-muted ring-1 ring-line-2 transition duration-250 ease-brand ' +
  'hover:-translate-y-0.5 hover:text-ink hover:ring-ink/30';

export const BTN_LINE =
  'inline-flex items-center gap-2.5 rounded-pill border border-line-2 px-[24px] py-[15px] text-[13px] ' +
  'font-semibold uppercase tracking-[.08em] text-ink transition duration-200 ease-brand ' +
  'hover:-translate-y-0.5 hover:border-green/50 hover:bg-green-glow hover:text-green';

export type Accent = 'green' | 'blue' | 'purple';

export const ACCENT_LINE: Record<Accent, string> = {
  green: 'bg-[linear-gradient(90deg,var(--color-green),var(--color-blue))]',
  blue: 'bg-[linear-gradient(90deg,var(--color-blue),var(--color-purple))]',
  purple: 'bg-[linear-gradient(90deg,var(--color-purple),var(--color-blue))]'
};

export const ACCENT_TEXT: Record<Accent, string> = {
  green: 'text-green',
  blue: 'text-blue',
  purple: 'text-purple'
};

export function Wrap({className, children}: {className?: string; children: ReactNode}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1220px] px-5 min-[760px]:px-[34px]', className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  alt,
  hairline,
  className,
  children
}: {
  id?: string;
  alt?: boolean;
  hairline?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 py-15 min-[760px]:py-25',
        alt && 'bg-bg-2',
        hairline && 'border-t border-line-2',
        className
      )}
    >
      {children}
    </section>
  );
}

const RULE = 'h-px bg-[linear-gradient(90deg,var(--color-green),var(--color-blue))]';

export function Eyebrow({
  tone = 'green',
  size = 'section',
  className,
  children
}: {
  tone?: 'green' | 'blue';
  size?: 'section' | 'hero';
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[.12em]',
        tone === 'blue' ? 'text-blue' : 'text-green',
        size === 'hero' ? 'mb-[26px]' : 'mb-[18px]',
        className
      )}
    >
      <span className={cn(RULE, size === 'hero' ? 'w-[26px]' : 'w-[22px]')} />
      {children}
    </div>
  );
}

export function SectionTitle({className, children}: {className?: string; children: ReactNode}) {
  return (
    <h2
      className={cn(
        'mb-4 font-display text-[clamp(30px,4.2vw,50px)] font-semibold uppercase leading-[1.02] tracking-[-0.005em]',
        className
      )}
    >
      {children}
    </h2>
  );
}

export function SectionBody({className, children}: {className?: string; children: ReactNode}) {
  return (
    <p className={cn('text-[17px] font-light leading-[1.65] text-muted', className)}>{children}</p>
  );
}

export function SectionHead({
  eyebrow,
  tone = 'green',
  index,
  title,
  body
}: {
  eyebrow: ReactNode;
  tone?: 'green' | 'blue';
  index?: string;
  title: ReactNode;
  body?: ReactNode;
}) {
  return (
    <div className="mb-13 max-w-[700px]">
      <div className="flex items-baseline gap-4">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        {index ? <span className="mono mb-[18px] text-[11px] text-faint">{index}</span> : null}
      </div>
      <SectionTitle>{title}</SectionTitle>
      {body ? <SectionBody>{body}</SectionBody> : null}
    </div>
  );
}

export function Estimated({
  label = 'Estimated',
  className
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-amber/40 bg-amber/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-amber',
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-amber" />
      {label}
    </span>
  );
}

export function DetailPanel({
  heading,
  attached = true,
  className,
  children
}: {
  heading: ReactNode;
  attached?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid items-start gap-4 bg-glass p-[22px] backdrop-blur-[14px]',
        'min-[760px]:grid-cols-[200px_1fr] min-[760px]:gap-[30px] min-[760px]:px-[30px] min-[760px]:py-[26px]',
        attached
          ? 'ring-lit-open-top rounded-b-frame'
          : 'ring-lit mt-[22px] rounded-frame shadow-lift',
        className
      )}
    >
      <div className="font-display text-2xl font-semibold uppercase leading-[1.1] text-green">
        {heading}
      </div>
      <div className="text-[15.5px] font-light leading-[1.68] text-muted [&_b]:font-medium [&_b]:text-ink">
        {children}
      </div>
    </div>
  );
}

export function PanelEdge({
  tone = 'brand',
  className
}: {
  tone?: 'brand' | 'blue';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-250 group-hover:opacity-100',
        tone === 'blue'
          ? 'bg-[linear-gradient(90deg,var(--color-blue),var(--color-purple))]'
          : 'bg-[linear-gradient(90deg,var(--color-green),var(--color-blue))]',
        className
      )}
    />
  );
}

const GLYPHS: Record<StatusGlyph, ReactNode> = {
  tick: <path d="M2.5 7 5.5 10 11.5 3.5" />,
  eye: (
    <>
      <path d="M1 7s2.4-3.6 6-3.6S13 7 13 7s-2.4 3.6-6 3.6S1 7 1 7Z" />
      <circle cx="7" cy="7" r="1.6" />
    </>
  ),
  bang: (
    <>
      <path d="M7 2.5v5" />
      <path d="M7 11h.01" />
    </>
  ),
  spanner: <path d="M9.4 2.2a3.4 3.4 0 0 0-4 4.4L2.4 9.6a1.3 1.3 0 0 0 1.9 1.9l3-3a3.4 3.4 0 0 0 4.4-4l-2 2-1.9-.5-.5-1.9z" />,
  rise: (
    <>
      <path d="M2.5 10.5 7 6l2.2 2.2L12 4.6" />
      <path d="M8.8 4.4H12v3.2" />
    </>
  ),
  alert: (
    <>
      <path d="M7 1.8 12.8 11.6H1.2z" />
      <path d="M7 5.6v2.6" />
      <path d="M7 10.1h.01" />
    </>
  )
};

export function StatusGlyphIcon({glyph, className}: {glyph: StatusGlyph; className?: string}) {
  return (
    <svg
      viewBox="0 0 14 14"
      className={cn("h-3.5 w-3.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[glyph]}
    </svg>
  );
}

export function StatusChip({
  glyph,
  tone,
  children,
  className
}: {
  glyph: StatusGlyph;
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-current/25 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[.1em]",
        TONE_TEXT[tone],
        className
      )}
    >
      <StatusGlyphIcon glyph={glyph} className="h-3 w-3" />
      {children}
    </span>
  );
}

export const HAIRLINE_GRID =
  'ring-lit grid gap-px overflow-hidden rounded-frame bg-line-2';

export const ATTACHED_ABOVE = 'rounded-b-none';

export function StatGrid({
  attached,
  className,
  children
}: {
  attached?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        HAIRLINE_GRID,
        'grid-cols-1 min-[520px]:grid-cols-2 min-[820px]:grid-cols-3',
        attached && ATTACHED_ABOVE,
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  dot,
  name,
  description,
  onClick,
  className
}: {
  dot: StatusTone | 'muted';
  name: ReactNode;
  description: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'group relative glass px-[22px] py-6 text-left',
        onClick && 'cursor-pointer transition duration-250 ease-brand hover:-translate-y-0.5 hover:bg-panel-2/70',
        className
      )}
    >
      <div
        className={cn(
          'mb-3.5 h-2 w-2 rounded-full transition-colors',
          dot === 'muted' ? 'bg-line-2' : TONE_BG[dot]
        )}
      />
      <div className="mb-[7px] font-display text-[22px] font-semibold uppercase">{name}</div>
      <div className="text-sm font-light leading-[1.55] text-muted">{description}</div>
    </Tag>
  );
}

export function BrowserFrame({
  url,
  badge,
  className,
  bodyClassName,
  children
}: {
  url: string;
  badge: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'ring-lit shadow-lift overflow-hidden rounded-frame bg-glass backdrop-blur-[14px]',
        className
      )}
    >
      <div className="glass-solid flex items-center gap-[11px] border-b border-line-2 px-5 py-[13px]">
        <div className="flex gap-1.5">
          <i className="h-[9px] w-[9px] rounded-full bg-ink/15" />
          <i className="h-[9px] w-[9px] rounded-full bg-ink/15" />
          <i className="h-[9px] w-[9px] rounded-full bg-ink/15" />
        </div>
        <span className="mono ml-2 truncate text-[11.5px] text-faint">{url}</span>
        <span className="ml-auto shrink-0 rounded-pill border border-line px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-green">
          {badge}
        </span>
      </div>
      <div className={cn('p-4 min-[760px]:p-6', bodyClassName)}>{children}</div>
    </div>
  );
}

export function ClosingSection({
  title,
  body,
  bodyClassName,
  action
}: {
  title: ReactNode;
  body: ReactNode;
  bodyClassName?: string;
  action: ReactNode;
}) {
  return (
    <Section hairline>
      <Wrap className="text-center">
        <Reveal>
          <SectionTitle>{title}</SectionTitle>
        </Reveal>
        <Reveal>
          <SectionBody className={cn('mx-auto mb-[34px]', bodyClassName ?? 'max-w-[520px]')}>
            {body}
          </SectionBody>
        </Reveal>
        <Reveal>{action}</Reveal>
      </Wrap>
    </Section>
  );
}
