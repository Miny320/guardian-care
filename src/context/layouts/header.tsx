import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router';
import Lockup from '../../components/Lockup';
import {useTheme} from '../../lib/theme';
import ThemeToggle from '../../components/ThemeToggle';
import {cn} from '../../lib/cn';

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const read = () => {
      const past = window.scrollY > threshold;
      setScrolled((was) => (was === past ? was : past));
    };

    read();
    window.addEventListener('scroll', read, {passive: true});
    return () => window.removeEventListener('scroll', read);
  }, [threshold]);

  return scrolled;
}

type NavLink = {href: string; label: string};
type Journey = {links: NavLink[]; switcher: boolean};

const START = {to: '/start', label: 'Get started'};

const JOURNEYS: Record<string, Journey> = {
  '/': {
    links: [
      {href: '#journeys', label: 'Platform'},
      {href: '#flow', label: 'How it connects'},
      {href: '#intelligence', label: 'Intelligence'},
      {href: '#operations', label: 'Operations'},
      {href: '#record', label: 'Architecture'}
    ],
    switcher: false
  },
  '/consumer': {
    links: [
      {href: '#why', label: 'Why Guardian Care'},
      {href: '#findings', label: 'What we find'},
      {href: '#activate', label: 'What it costs'},
      {href: '#aim', label: 'Our aim'}
    ],
    switcher: true
  },
  '/plan': {
    links: [
      {href: '#changes', label: 'What solar changes'},
      {href: '#storage', label: 'Storage'},
      {href: '#assess', label: 'Assessment'},
      {href: '#quote', label: 'Your quote'},
      {href: '#after', label: 'After installation'}
    ],
    switcher: true
  },
  '/business': {
    links: [
      {href: '#products', label: 'The platform'},
      {href: '#console', label: 'The console'},
      {href: '#revenue', label: 'Revenue'},
      {href: '#markets', label: 'Markets'},
      {href: '#join', label: 'How you join'}
    ],
    switcher: true
  },

  '/start': {links: [], switcher: true},

  '/contact': {links: [], switcher: true}
};

export default function Header() {
  const {pathname} = useLocation();
  const journey = JOURNEYS[pathname];
  const scrolled = useScrolled();
  const {theme} = useTheme();

  if (!journey) return null;

  const grounded = scrolled || theme === 'day';

  const showStart = pathname !== START.to;

  return (
    <nav
      className={cn(
        'on-navy sticky top-0 z-90 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-brand',
        grounded ? 'border-line-2 shadow-[0_10px_30px_-18px_var(--drop)]' : 'border-transparent bg-transparent',
        grounded && (theme === 'day' ? 'bg-bg' : 'bg-bg/85 backdrop-blur-xl')
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1220px] items-center gap-4 px-4 transition-[padding] duration-300 ease-brand min-[520px]:px-5 min-[760px]:px-[34px]',
          scrolled ? 'py-2.5 min-[760px]:py-3' : 'py-4 min-[760px]:py-5'
        )}
      >
        <Link
          to="/"
          aria-label="Guardian Care — home"
          className="min-w-0 overflow-hidden"
        >
          <Lockup size="nav" />
        </Link>

        <div className="ml-auto hidden gap-[26px] text-[12.5px] font-medium uppercase tracking-[.08em] text-ink min-[1180px]:flex">
          {journey.links.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-green">
              {link.label}
            </a>
          ))}
        </div>

        <ThemeToggle className="ml-auto min-[1180px]:ml-[22px]" />

        {journey.switcher ? (
          <Link
            to="/"
            className={cn(
              'ml-2 shrink-0 whitespace-nowrap rounded-pill border border-line-2 px-3 py-[9px] text-[11.5px] font-semibold uppercase tracking-[.06em] text-faint transition duration-200 min-[520px]:ml-3 min-[520px]:px-4 min-[520px]:tracking-[.08em] hover:border-line hover:bg-ink/5 hover:text-ink',
              showStart && 'hidden min-[640px]:block'
            )}
          >
            Switch journey
          </Link>
        ) : null}

        {showStart ? (
          <Link
            to={START.to}
            className="ml-2 shrink-0 whitespace-nowrap rounded-pill bg-[var(--cta)] px-3.5 py-[10px] text-[11.5px] font-bold uppercase tracking-[.05em] text-[var(--cta-ink)] shadow-[0_8px_24px_-12px_var(--btn-glow)] transition duration-200 min-[520px]:ml-3 min-[520px]:px-5 min-[520px]:py-[11px] min-[520px]:text-[12px] min-[520px]:tracking-[.07em] hover:bg-[var(--cta-hover)]"
          >
            {START.label}
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
