import {Link} from 'react-router';
import Glyph, {type GlyphName} from '../../components/Glyph';
import {LABEL} from '../../components/kit';
import {PageHero} from '../../components/page';
import Reveal from '../../components/Reveal';
import {Wrap} from '../../components/ui';
import {useLocalPath, usePageTitle} from '../../lib/country';
import {cn} from '../../lib/cn';

type Path = {to: string; glyph: GlyphName; name: string; line: string; cta: string};

const HOMEOWNERS: Path[] = [
  {to: '/consumer', glyph: 'solarRoof', name: 'I already have solar', line: 'A free 2-minute check of how your system is doing, with a summary at the end.', cta: 'Start my free check'},
  {to: '/plan', glyph: 'savings', name: 'I want lower bills', line: 'See what you pay now, and what solar and a battery could change.', cta: 'Get my free plan'},
  {to: '/contact?service=assessment', glyph: 'call', name: 'I’d rather talk', line: 'Book a call or send a message, and someone from the team will come back to you.', cta: 'Talk to the team'}
];

const COMPANIES: Path[] = [
  {to: '/business', glyph: 'business', name: 'See where to start', line: 'Six questions about your business, then the stage worth running first.', cta: 'Answer six questions'},
  {to: '/contact?service=business', glyph: 'portfolio', name: 'Book a demo', line: 'See the console with your own customer base in mind.', cta: 'Book a demo'}
];

export default function Start() {
  usePageTitle('Get started');

  return (
    <main>
      <PageHero
        title="Get started"
        accent="with Guardian Care."
        lead="Your live dashboard opens once your system is connected. Start here, and we’ll take you the rest of the way."
      />

      <Wrap className="pb-24 min-[760px]:pb-32">
        <Group title="For homeowners" paths={HOMEOWNERS} />
        <Group title="For solar companies" paths={COMPANIES} />
      </Wrap>
    </main>
  );
}

function Group({title, paths}: {title: string; paths: Path[]}) {
  const local = useLocalPath();

  return (
    <section className="mt-12 first:mt-0">
      <h2 className={cn(LABEL, 'mb-5 text-green')}>{title}</h2>
      <ul className={cn('grid gap-4', paths.length === 3 ? 'min-[900px]:grid-cols-3' : 'min-[700px]:grid-cols-2')}>
        {paths.map((path, index) => (
          <Reveal key={path.to} as="li" delay={index * 0.06}>
            <Link
              to={local(path.to)}
              className="group flex h-full flex-col rounded-frame bg-panel p-7 ring-1 ring-line-2 transition duration-250 ease-brand hover:-translate-y-1 hover:ring-green/60 min-[760px]:p-8"
            >
              <Glyph name={path.glyph} className="h-10 w-10 text-green" />
              <h3 className="mt-6 font-display text-[clamp(26px,2.6vw,34px)] font-extrabold leading-[1] text-ink">{path.name}</h3>
              <p className="mt-3 flex-1 text-[16px] font-light leading-[1.6] text-muted">{path.line}</p>
              <span className="mt-7 text-[14px] font-bold uppercase tracking-[.08em] text-green">
                {path.cta} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
