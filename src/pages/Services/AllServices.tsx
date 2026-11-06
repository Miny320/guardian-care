import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {LABEL, PRIMARY, SECONDARY} from '../../components/kit';
import {CtaBand, PageHero} from '../../components/page';
import Reveal from '../../components/Reveal';
import {Section, Wrap} from '../../components/ui';
import {SERVICE_DETAILS, type ServiceDetail} from '../../data/services';
import {useLocalPath, usePageTitle} from '../../lib/country';
import {cn} from '../../lib/cn';

// Every service in detail, one section each. The home page's "What we do" links land on the
// matching section (for example /uk/services#monitoring).
const KEYS = SERVICE_DETAILS.map((service) => service.key);

// Short names for the bar, so all six fit across a desktop screen.
const SHORT: Record<string, string> = {
  assessment: 'Assessment',
  equipment: 'Equipment & installation',
  monitoring: 'Connected monitoring',
  intelligence: 'AI intelligence',
  operations: 'Operations & maintenance',
  customer: 'Customer energy'
};

export default function AllServices() {
  usePageTitle('Services');
  const active = useActiveSection(KEYS);

  return (
    <main>
      <PageHero
        title="Our services,"
        accent="from first assessment to lifelong care."
        lead="Six connected services on one platform. Each builds on the system profile the one before it creates, so every recommendation is based on what is really installed and how it really performs."
      />

      <ServiceNav active={active} />

      {SERVICE_DETAILS.map((service, index) => (
        <ServiceSection key={service.key} service={service} index={index} />
      ))}

      <CtaBand
        title="Not sure where to start?"
        lead="Tell us about your system or your business, and we will point you to the service that fits."
        action={{label: 'Talk to the team', to: '/contact'}}
      />
    </main>
  );
}

// Which section is in the middle of the screen, for the bar at the top.
function useActiveSection(keys: string[]) {
  const [active, setActive] = useState(keys[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      {rootMargin: '-45% 0px -50% 0px'}
    );
    keys.forEach((key) => {
      const el = document.getElementById(key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [keys]);

  return active;
}

// Sticks under the site header, so any service is one tap away.
function ServiceNav({active}: {active: string}) {
  const bar = useRef<HTMLElement>(null);

  // On narrow screens the bar scrolls sideways: keep the current service in view.
  useEffect(() => {
    const nav = bar.current;
    const item = nav?.querySelector<HTMLElement>('[aria-current]');
    if (!nav || !item) return;
    const left = item.offsetLeft - (nav.clientWidth - item.offsetWidth) / 2;
    nav.scrollTo({left: Math.max(0, left), behavior: 'smooth'});
  }, [active]);

  return (
    <div className="on-light sticky top-[60px] z-40 border-y border-line-2 bg-bg/95 backdrop-blur-md min-[760px]:top-[68px]">
      <Wrap>
        <nav ref={bar} aria-label="Services" className="relative -mx-1 flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
          {SERVICE_DETAILS.map((service, index) => {
            const on = service.key === active;
            return (
              <a
                key={service.key}
                href={`#${service.key}`}
                aria-current={on ? 'true' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-[8px] px-3.5 py-2 text-[14px] font-semibold transition-colors duration-200',
                  on ? 'bg-[#08254a] text-white' : 'text-muted hover:bg-[#08254a]/[0.06] hover:text-ink'
                )}
              >
                <span className={cn('mono text-[11px]', on ? 'text-[#c6ec6e]' : 'text-green')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {SHORT[service.key] ?? service.title}
              </a>
            );
          })}
        </nav>
      </Wrap>
    </div>
  );
}

const SECTION = 'scroll-mt-[124px] py-20 min-[760px]:scroll-mt-[130px] min-[760px]:py-28';

function ServiceSection({service, index}: {service: ServiceDetail; index: number}) {
  const local = useLocalPath();
  // Alternate light and dark sections, and the side the photo sits on.
  const light = index % 2 === 0;
  const flip = index % 2 === 1;

  if (service.feature) return <FeatureSection service={service} index={index} light={light} />;

  return (
    <Section id={service.key} className={cn(SECTION, light && 'on-light bg-bg')}>
      <Wrap>
        <div className="grid items-center gap-10 min-[1000px]:grid-cols-2 min-[1000px]:gap-16">
          <Reveal className={cn(flip && 'min-[1000px]:order-2')}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="mono text-[13px] font-semibold text-green">{String(index + 1).padStart(2, '0')}</span>
              <span className="mono text-[11.5px] font-semibold uppercase tracking-[.12em] text-faint">
                {service.tags.join(' · ')}
              </span>
            </div>
            <h2 className="mt-4 text-balance font-display text-[clamp(34px,4.4vw,60px)] font-extrabold leading-[0.98] tracking-[-0.02em] text-ink">
              {service.title}
            </h2>
            <p className="mt-6 text-[clamp(17px,1.6vw,20px)] font-light leading-[1.65] text-muted">{service.text}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className={cn(LABEL, 'mr-1 text-faint')}>For</span>
              {service.audience.map((who) => (
                <span key={who} className="rounded-pill px-3 py-1 text-[13px] font-medium text-ink ring-1 ring-line-2">
                  {who}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={local(service.primary.to)} className={PRIMARY}>
                {service.primary.label}
              </Link>
              <Link to={local(service.secondary.to)} className={SECONDARY}>
                {service.secondary.label}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className={cn(flip && 'min-[1000px]:order-1')}>
            <img
              src={service.image.src}
              alt={service.image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[3/2] w-full rounded-frame object-cover shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]"
            />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 min-[1000px]:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={0.06} className="rounded-frame bg-panel p-7 ring-1 ring-line-2 min-[760px]:p-8">
            <h3 className={cn(LABEL, 'text-green')}>How it works</h3>
            <ol className="mt-5 grid gap-5">
              {service.steps.map((step, number) => (
                <li key={step.title} className="flex gap-4">
                  <span className="mono grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-green ring-1 ring-green/50">
                    {number + 1}
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold leading-[1.3] text-ink">{step.title}</span>
                    <span className="mt-1 block text-[14.5px] font-light leading-[1.55] text-muted">{step.line}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.12} className="rounded-frame bg-panel p-7 ring-1 ring-line-2 min-[760px]:p-8">
            <h3 className={cn(LABEL, 'text-green')}>What you get</h3>
            <ul className="mt-5 grid gap-4">
              {service.outcomes.map((item) => (
                <li key={item} className="border-l-2 border-green pl-4 font-display text-[18px] font-bold leading-[1.3] text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

// A service with a full write-up. 'stacked': the headline and description across the page, then
// the photo beside the list. 'split': the text beside the photo, then the list across the page.
function FeatureSection({service, index, light}: {service: ServiceDetail; index: number; light: boolean}) {
  const feature = service.feature!;
  const label = (
    <div className={cn(LABEL, 'text-green')}>
      {String(index + 1).padStart(2, '0')} · {service.title}
    </div>
  );
  const paragraphs = feature.paragraphs.map((paragraph) => (
    <p key={paragraph} className="text-[clamp(16px,1.5vw,19px)] font-light leading-[1.7] text-muted">
      {paragraph}
    </p>
  ));

  if (feature.layout === 'table') {
    return (
      <Section id={service.key} className={cn(SECTION, light && 'on-light bg-bg')}>
        <Wrap>
          <div className="grid gap-8">
            <Reveal>
              {label}
              <h2 className="mt-5 text-balance font-display text-[clamp(34px,4.6vw,64px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
                {feature.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.06} className="grid gap-4">
              {paragraphs}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-14 min-[1000px]:mt-16">
            <CoverTable feature={feature} />
          </Reveal>
          {feature.note ? <SectionNote text={feature.note} /> : null}
        </Wrap>
      </Section>
    );
  }

  if (feature.layout === 'split') {
    return (
      <Section id={service.key} className={cn(SECTION, light && 'on-light bg-bg')}>
        <Wrap>
          <div className="grid items-center gap-10 min-[1000px]:grid-cols-2 min-[1000px]:gap-16">
            <Reveal>
              {label}
              <h2 className="mt-5 text-balance font-display text-[clamp(32px,3.8vw,52px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
                {feature.headline}
              </h2>
              <div className="mt-6 grid gap-4">{paragraphs}</div>
            </Reveal>
            <Reveal delay={0.08}>
              <img
                src={service.image.src}
                alt={service.image.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full rounded-frame object-cover shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]"
              />
            </Reveal>
          </div>

          <Reveal className="mt-14 min-[1000px]:mt-16">
            {feature.columns ? <CoverTable feature={feature} /> : <CoverList feature={feature} />}
          </Reveal>
          {feature.note ? <SectionNote text={feature.note} /> : null}
        </Wrap>
      </Section>
    );
  }

  return (
    <Section id={service.key} className={cn(SECTION, light && 'on-light bg-bg')}>
      <Wrap>
        {/* The headline across the full width, with the description below it. */}
        <div className="grid gap-8">
          <Reveal>
            {label}
            <h2 className="mt-5 text-balance font-display text-[clamp(34px,4.6vw,64px)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {feature.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="grid gap-4">
            {paragraphs}
          </Reveal>
        </div>

        <div
          className={cn(
            'mt-14 grid gap-10 min-[1000px]:mt-16 min-[1000px]:gap-16',
            feature.mirror ? 'min-[1000px]:grid-cols-[1.2fr_0.8fr]' : 'min-[1000px]:grid-cols-[0.8fr_1.2fr]'
          )}
        >
          <Reveal className={cn(feature.mirror && 'min-[1000px]:order-2')}>
            <img
              src={service.image.src}
              alt={service.image.alt}
              loading="lazy"
              decoding="async"
              className={cn('aspect-[4/3] w-full rounded-card object-cover min-[1000px]:aspect-[4/5]', feature.focus ?? 'object-center')}
            />
            {/* The service's stages sit under the photo, leaving the list on its own. */}
            {feature.flow ? <FlowTrack stages={feature.flow} /> : null}
          </Reveal>

          <Reveal delay={0.08} className={cn(feature.mirror && 'min-[1000px]:order-1')}>
            <CoverList feature={feature} flow={false} />
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

// "What we cover": a ruled list, each name beside its description, with the service's stages
// underneath when it has them.
function CoverList({feature, flow = true}: {feature: NonNullable<ServiceDetail['feature']>; flow?: boolean}) {
  return (
    <>
      <h3 className={cn(LABEL, 'text-faint')}>{feature.listTitle ?? 'What we cover'}</h3>
      <dl className="mt-5 border-t border-ink/80">
        {feature.cover.map((item) => (
          <div
            key={item.name}
            className="grid gap-2 border-b border-line-2 py-6 min-[640px]:grid-cols-[0.75fr_1.25fr] min-[640px]:gap-8"
          >
            <dt className="font-display text-[clamp(19px,1.7vw,22px)] font-bold leading-[1.2] text-ink">{item.name}</dt>
            <dd className="text-[16px] font-light leading-[1.65] text-muted">{item.line}</dd>
          </div>
        ))}
      </dl>

      {flow && feature.flow ? (
        <ol aria-label="" className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
          {feature.flow.map((stage, number) => (
            <li key={stage} className="flex items-center gap-2">
              {number > 0 ? (
                <span aria-hidden="true" className="text-green">
                  →
                </span>
              ) : null}
              <span className="rounded-[8px] px-3.5 py-2 text-[14px] font-semibold text-ink ring-1 ring-line-2">
                <span className="mono mr-2 text-[11px] text-green">{String(number + 1).padStart(2, '0')}</span>
                {stage}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}

// The stages as a track: numbered dots joined by a line, each name underneath. Narrow enough to
// sit under a photo.
function FlowTrack({stages}: {stages: string[]}) {
  return (
    <div className="mt-8">
      <h3 className={cn(LABEL, 'text-faint')}>How it runs</h3>
      <ol
        aria-label="How it runs"
        className="relative mt-5 grid"
        style={{gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`}}
      >
        {/* The line runs from the first dot to the last, behind them. */}
        <span
          aria-hidden="true"
          className="absolute top-[15px] h-px bg-green/60"
          style={{left: `${50 / stages.length}%`, right: `${50 / stages.length}%`}}
        />
        {stages.map((stage, number) => (
          <li key={stage} className="relative flex flex-col items-center text-center">
            <span className="mono grid h-[31px] w-[31px] place-items-center rounded-full bg-bg text-[11px] font-semibold text-green ring-1 ring-green">
              {String(number + 1).padStart(2, '0')}
            </span>
            <span className="mt-3 text-[13.5px] font-semibold leading-[1.25] text-ink">{stage}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The list in open columns, three across on desktop: a thin rule above, a hairline between
// columns and rows, and each item as a small label, its name and one line of description.
function CoverTable({feature}: {feature: NonNullable<ServiceDetail['feature']>}) {
  const title = feature.listTitle ?? 'What we cover';

  return (
    <div>
      {/* The title shows only where the section asks for it; otherwise it is for screen readers. */}
      {feature.showListTitle ? <h3 className={cn(LABEL, 'mb-5 text-green')}>{title}</h3> : null}
      <ul aria-label={title} className="grid border-t border-ink/80 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-3">
        {feature.cover.map((item, index) => (
          <li key={item.name} className={cell(index)}>
            {item.eyebrow ?? feature.itemLabel ? (
              <div
                className={cn(
                  'mono mb-3 text-[11.5px] font-semibold uppercase tracking-[.14em]',
                  item.eyebrow ? 'text-green' : 'text-faint'
                )}
              >
                {item.eyebrow ?? feature.itemLabel}
              </div>
            ) : null}
            <div className="font-display text-[clamp(22px,2vw,27px)] font-bold leading-[1.15] tracking-[-0.01em] text-ink">
              {item.name}
            </div>
            <p className="mt-2.5 text-[15.5px] font-light leading-[1.65] text-muted">{item.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Hairlines between items: between every item on phones, between columns and rows when the
// list sits two or three across. The first item in each row starts flush with the rule.
function cell(index: number) {
  return cn(
    'border-line-2 py-9',
    index > 0 && 'border-t',
    index < 2 ? 'min-[640px]:border-t-0' : 'min-[640px]:border-t',
    index % 2 === 1 ? 'min-[640px]:border-l min-[640px]:pl-10' : 'min-[640px]:border-l-0 min-[640px]:pl-0',
    'min-[640px]:pr-10',
    index < 3 ? 'min-[1000px]:border-t-0' : 'min-[1000px]:border-t',
    index % 3 !== 0 ? 'min-[1000px]:border-l min-[1000px]:pl-10' : 'min-[1000px]:border-l-0 min-[1000px]:pl-0'
  );
}

// A closing line for a section: one quiet sentence with a green rule beside it.
function SectionNote({text}: {text: string}) {
  return (
    <Reveal className="mt-14 min-[1000px]:mt-16">
      <p className="max-w-[820px] border-l-2 border-green pl-5 text-[clamp(16px,1.4vw,18px)] font-light leading-[1.65] text-muted min-[760px]:pl-6">
        {text}
      </p>
    </Reveal>
  );
}
