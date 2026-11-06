import {useState, type ReactNode} from 'react';
import {Link} from 'react-router';
import {useCountry, useLocalPath} from '../lib/country';
import {cn} from '../lib/cn';
import {PRIMARY, SECONDARY} from './kit';
import Reveal from './Reveal';
import {Section, Wrap} from './ui';

const TITLE = 'font-display font-extrabold tracking-[-0.02em] text-ink';

// Opening block of an inner page: a large title, one plain sentence, and the main action.
export function PageHero({
  title,
  accent,
  lead,
  action,
  aside
}: {
  title: ReactNode;
  accent?: ReactNode;
  lead: ReactNode;
  action?: {label: string; to: string};
  aside?: ReactNode;
}) {
  const local = useLocalPath();

  return (
    <header className="under-nav relative isolate overflow-hidden">
      <Wrap>
        <div
          className={cn(
            'grid items-center gap-10 py-16 min-[760px]:py-24',
            aside ? 'min-[1000px]:grid-cols-[1.15fr_0.85fr] min-[1000px]:gap-16' : 'max-w-[960px]'
          )}
        >
          <div>
            <Reveal as="h1" className={cn(TITLE, 'text-balance text-[clamp(42px,6.4vw,92px)] leading-[0.92]')}>
              {title}
              {accent ? (
                <>
                  {' '}
                  <span className="text-brand-gradient">{accent}</span>
                </>
              ) : null}
            </Reveal>
            <Reveal
              as="p"
              delay={0.06}
              className="mt-7 max-w-[680px] text-[clamp(18px,1.8vw,23px)] font-light leading-[1.55] text-muted"
            >
              {lead}
            </Reveal>
            {action ? (
              <Reveal delay={0.12} className="mt-10">
                <Link to={local(action.to)} className={PRIMARY}>
                  {action.label} →
                </Link>
              </Reveal>
            ) : null}
          </div>
          {aside ? (
            <Reveal delay={0.1} className="flex justify-center">
              {aside}
            </Reveal>
          ) : null}
        </div>
      </Wrap>
    </header>
  );
}

// A photograph cut with the same uneven corners as the home page's "What we do" pictures.
export function PagePhoto({src, alt, flip = false}: {src: string; alt: string; flip?: boolean}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn(
        'aspect-[3/2] w-full object-cover shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]',
        flip
          ? 'rounded-l-frame rounded-tr-[96px] rounded-br-[24px] min-[760px]:rounded-tr-[140px]'
          : 'rounded-r-frame rounded-tl-[96px] rounded-bl-[24px] min-[760px]:rounded-tl-[140px]'
      )}
    />
  );
}

export function PageSection({
  id,
  title,
  accent,
  lead,
  media,
  children
}: {
  id?: string;
  title: ReactNode;
  accent?: ReactNode;
  lead?: ReactNode;
  // Sits beside the heading on wide screens, below it on phones.
  media?: ReactNode;
  children?: ReactNode;
}) {
  const heading = (
    <Reveal className="max-w-[820px]">
      <h2 className={cn(TITLE, 'text-balance text-[clamp(34px,4.6vw,64px)] leading-[0.95]')}>
        {title}
        {accent ? (
          <>
            {' '}
            <span className="text-brand-gradient">{accent}</span>
          </>
        ) : null}
      </h2>
      {lead ? <p className="mt-6 text-[clamp(17px,1.6vw,20px)] font-light leading-[1.65] text-muted">{lead}</p> : null}
    </Reveal>
  );

  return (
    <Section id={id} hairline className="py-20 min-[760px]:py-28">
      <Wrap>
        {media ? (
          <div className="grid items-center gap-10 min-[1000px]:grid-cols-2 min-[1000px]:gap-16">
            {heading}
            <Reveal delay={0.08}>{media}</Reveal>
          </div>
        ) : (
          heading
        )}
        {children ? <div className="mt-12">{children}</div> : null}
      </Wrap>
    </Section>
  );
}

export function NumberedGrid({items, columns = 3}: {items: Array<{name: string; line: ReactNode}>; columns?: 2 | 3}) {
  return (
    <ol
      className={cn(
        'grid gap-px overflow-hidden rounded-frame bg-line-2 ring-1 ring-line-2 min-[680px]:grid-cols-2',
        columns === 3 && 'min-[1080px]:grid-cols-3'
      )}
    >
      {items.map((item, index) => (
        <Reveal key={item.name} as="li" delay={(index % 3) * 0.05} className="bg-panel p-6 min-[760px]:p-8">
          <span className="mono text-[12px] font-semibold tracking-[.12em] text-green">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-4 font-display text-[clamp(22px,2.2vw,28px)] font-extrabold leading-[1.02] text-ink">
            {item.name}
          </h3>
          <p className="mt-3 text-[16px] font-light leading-[1.6] text-muted">{item.line}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function TickList({items}: {items: ReactNode[]}) {
  return (
    <ul className="grid gap-3 min-[760px]:grid-cols-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3.5 rounded-card bg-panel px-5 py-4 ring-1 ring-line-2">
          <span
            aria-hidden="true"
            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-[12px] font-bold text-bg"
          >
            ✓
          </span>
          <span className="text-[16px] leading-[1.5] text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({children}: {children: ReactNode}) {
  return (
    <p className="mt-8 max-w-[820px] border-l-2 border-amber pl-5 text-[15.5px] font-light leading-[1.65] text-muted">
      {children}
    </p>
  );
}

export function Faq({items}: {items: Array<{q: string; a: ReactNode}>}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="max-w-[880px] divide-y divide-line-2 overflow-hidden rounded-frame ring-1 ring-line-2">
      {items.map((item, index) => {
        const on = open === index;
        return (
          <li key={item.q} className="bg-panel">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : index)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[17px] font-medium text-ink transition-colors hover:bg-panel-2 min-[760px]:px-8"
              >
                {item.q}
                <span aria-hidden="true" className={cn('text-[22px] text-green transition-transform', on && 'rotate-45')}>
                  +
                </span>
              </button>
            </h3>
            {on ? (
              <div className="px-6 pb-6 text-[16px] font-light leading-[1.65] text-muted min-[760px]:px-8">{item.a}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// Closing call to action on a brand gradient, used at the foot of the home page and inner pages.
type CtaLink = {label: string; to: string};
type CtaChoice = {who: string; line: string; label: string; to: string};

// The closing band: a deep navy-to-teal gradient, left-aligned headline, a short lead and a
// one-line promise, two buttons, and the logo mark as a faint watermark in the corner.
export function CtaBand({
  title,
  lead,
  tagline,
  action,
  secondary,
  choices
}: {
  title: ReactNode;
  lead?: ReactNode;
  tagline?: string;
  action?: CtaLink;
  secondary?: CtaLink;
  // One card per kind of visitor, each with its own way forward.
  choices?: CtaChoice[];
}) {
  const local = useLocalPath();

  return (
    <section
      className="relative isolate overflow-hidden py-24 min-[760px]:py-32"
      style={{background: 'linear-gradient(160deg, #08254a 0%, #0a3150 48%, #0e4a46 100%)'}}
    >
      {/* The logo mark in full colour, large and softly lit, sitting behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[6%] -right-[3%] -z-10 w-[clamp(200px,24vw,360px)]">
        <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(122,179,0,0.18),transparent_68%)] blur-2xl" />
        <img src="/assets/logo-mark.png" alt="" className="relative w-full opacity-[0.16] max-[760px]:opacity-[0.1]" />
      </div>
      <Wrap>
        <Reveal className="max-w-[760px]">
          <h2 className="text-balance font-display text-[clamp(40px,5.8vw,80px)] font-extrabold leading-[0.98] tracking-[-0.025em] text-white">
            {title}
          </h2>
          {lead ? (
            <p className="mt-7 max-w-[640px] text-[clamp(17px,1.5vw,19px)] font-light leading-[1.65] text-white/75">{lead}</p>
          ) : null}
          {tagline ? <p className="mt-6 text-[clamp(17px,1.5vw,19px)] font-bold text-white/85">{tagline}</p> : null}
          {action || secondary ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {action ? (
                <Link
                  to={local(action.to)}
                  className={PRIMARY}
                >
                  {action.label}
                </Link>
              ) : null}
              {secondary ? (
                <Link
                  to={local(secondary.to)}
                  className={SECONDARY}
                >
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </Reveal>

        {choices ? (
          <ul className="mt-12 grid max-w-[1080px] gap-4 min-[860px]:grid-cols-3">
            {choices.map((choice, index) => (
              <Reveal key={choice.to} as="li" delay={0.08 + index * 0.07} className="flex">
                <Link
                  to={local(choice.to)}
                  className="group flex w-full flex-col rounded-[18px] bg-white/[0.07] p-6 ring-1 ring-white/20 backdrop-blur-sm transition duration-300 ease-brand hover:-translate-y-1 hover:bg-white/[0.12] hover:ring-[#c6ec6e]/70 min-[760px]:p-7"
                >
                  <span className="font-display text-[22px] font-extrabold leading-[1.15] text-white">{choice.who}</span>
                  <span className="mt-3 flex-1 text-[16px] font-light leading-[1.6] text-white/75">{choice.line}</span>
                  <span className="mt-6 text-[15px] font-semibold text-[#c6ec6e]">
                    {choice.label} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </Wrap>
    </section>
  );
}

// The three assessments still calculate in pounds with UK tariffs. Say so outside the UK.
export function MarketNotice() {
  const {code, name} = useCountry();
  const local = useLocalPath();
  if (code === 'uk') return null;

  return (
    <div className="mb-8 rounded-card bg-amber/10 px-5 py-4 text-[15px] leading-[1.6] text-ink ring-1 ring-amber/40">
      This check currently uses UK prices and tariffs, so treat its figures as a guide only. For advice based on
      rules in {code === 'us' ? 'the ' : ''}
      {name},{' '}
      <Link to={local('/contact?service=assessment')} className="font-medium text-green underline underline-offset-2">
        talk to our team
      </Link>
      .
    </div>
  );
}
