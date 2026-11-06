import {useState, type ComponentType, type CSSProperties} from 'react';
import {Link} from 'react-router';
import Modal from '../../../components/Modal';
import {PRIMARY} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {useLocalPath} from '../../../lib/country';
import {cn} from '../../../lib/cn';
import Business from '../../Business/Business';
import Consumer from '../../Consumer/Consumer';
import Plan from '../../Plan/Plan';

type Audience = {
  key: string;
  who: string;
  title: string;
  line: string;
  action: {label: string};
  // The journey that opens in the pop-up, so visitors stay on the home page.
  journey: ComponentType<{embedded?: boolean}>;
  more: Array<{label: string; to: string}>;
};

// One card per journey: the two homeowner journeys and the business one, matching the hero slides.
const AUDIENCES: Audience[] = [
  {
    key: 'existing',
    who: 'For homeowners',
    title: 'Already have solar',
    line: 'Find out how your system is performing today, and what it needs to keep working well.',
    action: {label: 'Check my solar'},
    journey: Consumer,
    more: []
  },
  {
    key: 'plan',
    who: 'For homeowners',
    title: 'Looking to reduce your electricity cost?',
    line: 'We check how you use power first, then show what solar and a battery could save you.',
    action: {label: 'Get my free plan'},
    journey: Plan,
    more: []
  },
  {
    key: 'business',
    who: 'For solar companies',
    title: 'I run Guardian Care for business',
    line: 'Stay connected to every customer you have installed for, and hear about problems before they do.',
    action: {label: 'See where to start'},
    journey: Business,
    more: [{label: 'Book a demo', to: '/contact?service=business'}]
  }
];

// The first journey is the one most visitors are on, so its card leads in the brand gradient,
// lit by a soft sun-glow from the top corner.
const FEATURED_BACKGROUND = [
  'radial-gradient(circle at 88% 6%, rgba(255, 236, 160, 0.45), transparent 42%)',
  'radial-gradient(circle at 10% 100%, rgba(10, 95, 181, 0.55), transparent 55%)',
  'linear-gradient(150deg, #3f6a00 0%, #1f6b3a 50%, #0b5a96 100%)'
].join(', ');

// The gradient card is dark, so its button takes the white version of the shared style.
const ON_DARK = {
  '--btn-solid': '#ffffff',
  '--btn-solid-ink': '#08254a',
  '--btn-solid-hover': '#eef6e0',
  '--btn-shadow': 'rgba(0, 0, 0, 0.45)'
} as CSSProperties;

// Hovering, or tabbing to its button, grows a card slightly and lights its border.
const CARD =
  'relative isolate flex w-full flex-col overflow-hidden rounded-panel p-8 ring-2 transition duration-300 ' +
  'ease-brand hover:scale-[1.03] has-[:focus-visible]:scale-[1.03] min-[760px]:p-9';

export default function Paths() {
  const local = useLocalPath();
  const [open, setOpen] = useState<Audience | null>(null);
  const Journey = open?.journey;

  return (
    <Section id="paths" className="on-light bg-bg py-20 min-[760px]:py-28">
      <Wrap>
        <Reveal
          as="h2"
          className="text-balance text-center font-display text-[clamp(40px,6vw,80px)] font-extrabold leading-[0.94] tracking-[-0.02em] text-ink"
        >
          Which one <span className="text-brand-gradient">are you?</span>
        </Reveal>

        <div className="mt-12 grid gap-4 min-[760px]:mt-16 min-[760px]:grid-cols-2 min-[1100px]:grid-cols-3">
          {AUDIENCES.map((audience, index) => {
            const featured = index === 0;

            return (
              // The fade-in owns the outer transform, so the hover scale lives on the inner card.
              <Reveal key={audience.key} delay={index * 0.08} className="flex">
                <div
                  className={cn(
                    CARD,
                    featured
                      ? 'shadow-[0_30px_70px_-30px_rgba(31,107,58,0.75)] ring-transparent hover:shadow-[0_40px_80px_-28px_rgba(31,107,58,0.9)] hover:ring-[#d9f0a8] has-[:focus-visible]:ring-[#d9f0a8]'
                      : 'bg-panel shadow-[0_24px_60px_-34px_var(--drop)] ring-line-2 hover:shadow-[0_34px_70px_-30px_var(--drop)] hover:ring-green has-[:focus-visible]:ring-green'
                  )}
                  style={featured ? {background: FEATURED_BACKGROUND, ...ON_DARK} : undefined}
                >
                  <div
                    className={cn(
                      'mono text-[12px] font-semibold uppercase tracking-[.14em]',
                      featured ? 'text-[#d9f0a8]' : 'text-green'
                    )}
                  >
                    {audience.who}
                  </div>
                  <h3
                    className={cn(
                      'mt-3 text-balance font-display text-[clamp(30px,2.8vw,40px)] font-extrabold leading-[0.98]',
                      featured ? 'text-white' : 'text-ink'
                    )}
                  >
                    {audience.title}
                  </h3>
                  {/* Extra links sit with the description, so every card's button lines up along the bottom. */}
                  <div className="mt-5 flex-1">
                    <p className={cn('text-[17px] font-light leading-[1.6]', featured ? 'text-white/85' : 'text-muted')}>
                      {audience.line}
                    </p>
                    {audience.more.map((link) => (
                      <Link
                        key={link.to}
                        to={local(link.to)}
                        className="mt-3 inline-block text-[15px] font-medium text-green underline decoration-green/40 underline-offset-4 transition-colors hover:decoration-green"
                      >
                        {link.label} →
                      </Link>
                    ))}
                  </div>

                  <div className="mt-9">
                    <button
                      type="button"
                      onClick={() => setOpen(audience)}
                      aria-haspopup="dialog"
                      className={PRIMARY}
                    >
                      {audience.action.label} →
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Wrap>

      {open && Journey ? (
        <Modal label={open.title} onClose={() => setOpen(null)}>
          <Journey embedded />
        </Modal>
      ) : null}
    </Section>
  );
}
