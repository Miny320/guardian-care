import {Link} from 'react-router';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {SERVICES, SERVICES_INTRO} from '../../../data/home';
import {useLocalPath} from '../../../lib/country';

// Heading and intro side by side, then open items (photo, rule, number, title, text, the areas
// each covers, link) rather than boxed cards.
export default function WhatWeDo() {
  const local = useLocalPath();

  return (
    <Section id="what" className="on-light bg-bg py-24 min-[760px]:py-32">
      <Wrap>
        <div className="grid items-end gap-6 min-[960px]:grid-cols-[1.15fr_0.85fr] min-[960px]:gap-16">
          <Reveal>
            <h2 className="text-balance font-display text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[0.94] tracking-[-0.02em] text-ink">
              What we <span className="text-brand-gradient">do</span>
            </h2>
          </Reveal>
          <Reveal as="p" delay={0.05} className="text-[clamp(17px,1.6vw,20px)] font-light leading-[1.6] text-muted min-[960px]:pb-2">
            {SERVICES_INTRO}
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-x-8 gap-y-16 min-[700px]:grid-cols-2 min-[1100px]:mt-16 min-[1100px]:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.key} as="li" delay={(index % 3) * 0.07}>
              <Link to={local(service.cta.to)} className="group block">
                <div className="aspect-[3/2] overflow-hidden rounded-card">
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 ease-brand group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 border-t border-ink/70 pt-5">
                  <span className="mono text-[13px] font-semibold text-green">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-display text-[clamp(24px,2.2vw,30px)] font-extrabold leading-[1] text-ink transition-colors group-hover:text-green">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[16px] font-light leading-[1.65] text-muted">{service.text}</p>
                  <p className="mono mt-4 text-[11.5px] font-semibold uppercase tracking-[.12em] text-faint">
                    {service.tags.join(' · ')}
                  </p>
                  <span className="mt-5 inline-block text-[15px] font-semibold text-green">
                    {service.cta.label} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>
      </Wrap>
    </Section>
  );
}
