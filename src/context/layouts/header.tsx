import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Link, useLocation} from 'react-router';
import Lockup from '../../components/Lockup';
import {COUNTRIES, COUNTRY_CODES} from '../../data/countries';
import {useCountry, useLocalPath, usePagePath, useSwitchPath} from '../../lib/country';
import {cn} from '../../lib/cn';
import {BUTTON_BASE, BUTTON_SIZE, SOLID_LOOK} from '../../components/kit';

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

// Closes a popover on outside click or Escape.
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return ref;
}

const START = {to: '/contact', label: 'Start with Guardian Care'};

// The only two links in the header.
const LINKS = [
  // {to: '/services', label: 'All services'},
  // {to: '/contact', label: 'Contact'}
];

export default function Header() {
  const page = usePagePath();
  const {pathname} = useLocation();
  const scrolled = useScrolled();
  const local = useLocalPath();
  const [menu, setMenu] = useState<'country' | 'mobile' | null>(null);

  // Any navigation closes whatever is open.
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setMenu(null);
  }

  const showStart = page !== START.to;
  const solid = scrolled || menu === 'mobile';

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-90 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-brand',
        solid ? 'on-light border-line-2 bg-bg shadow-[0_10px_30px_-18px_var(--drop)]' : 'border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1220px] items-center gap-3 px-4 transition-[padding] duration-300 ease-brand min-[520px]:px-5 min-[760px]:px-[34px]',
          scrolled ? 'py-2.5 min-[760px]:py-3' : 'py-4 min-[760px]:py-5'
        )}
      >
        <Link to={local('/')} aria-label="Guardian Care — home" className="min-w-0 overflow-hidden">
          <Lockup size="nav" light={solid} />
        </Link>

        <div className="ml-auto hidden items-center gap-7 text-[12.5px] font-medium uppercase tracking-[.04em] text-ink min-[760px]:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={local(link.to)}
              aria-current={page === link.to ? 'page' : undefined}
              className={cn('whitespace-nowrap transition-colors hover:text-green', page === link.to && 'text-green')}
            >
              {link.label}
            </Link>
          ))}
        </div>
{/* 
        <CountrySwitcher
          className="ml-auto min-[1180px]:ml-[22px]"
          open={menu === 'country'}
          onToggle={() => setMenu(menu === 'country' ? null : 'country')}
          onClose={() => setMenu(null)}
        /> */}

        {showStart ? (
          <Link
            to={local(START.to)}
            className={cn('hidden shrink-0 whitespace-nowrap min-[640px]:inline-flex', BUTTON_BASE, SOLID_LOOK, 'px-5 py-[11px] text-[14px]')}
          >
            {START.label}
          </Link>
        ) : null}

        <button
          type="button"
          onClick={() => setMenu(menu === 'mobile' ? null : 'mobile')}
          aria-expanded={menu === 'mobile'}
          aria-controls="mobile-menu"
          aria-label={menu === 'mobile' ? 'Close menu' : 'Open menu'}
          className="ml-auto grid h-[38px] w-[38px] shrink-0 place-items-center rounded-pill border border-line-2 text-ink min-[760px]:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {menu === 'mobile' ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menu === 'mobile' ? (
        <div id="mobile-menu" className="max-h-[calc(100svh-70px)] overflow-y-auto border-t border-line-2 min-[760px]:hidden">
          <div className="mx-auto max-w-[1220px] px-4 pb-8 pt-4 min-[520px]:px-5">
            {LINKS.map((link) => (
              <MenuLink key={link.to} to={local(link.to)} active={page === link.to}>
                {link.label}
              </MenuLink>
            ))}
            {showStart ? (
              <Link
                to={local(START.to)}
                className={cn('mt-6 flex w-full', BUTTON_BASE, BUTTON_SIZE, SOLID_LOOK)}
              >
                {START.label}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

function MenuLink({to, active, children}: {to: string; active?: boolean; children: ReactNode}) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'block rounded-tile px-4 py-3 text-[15px] font-medium normal-case tracking-normal transition-colors',
        active ? 'bg-green/15 text-green' : 'text-ink hover:bg-ink/5 hover:text-green'
      )}
    >
      {children}
    </Link>
  );
}

function CountrySwitcher({
  className,
  open,
  onToggle,
  onClose
}: {
  className?: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const {code, short, name} = useCountry();
  const switchPath = useSwitchPath();
  const ref = useDismiss(open, onClose);

  return (
    <div ref={ref} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`Country: ${name}. Change country`}
        className="flex h-[38px] items-center gap-1.5 rounded-pill border border-line-2 px-3 text-[12px] font-bold uppercase tracking-[.08em] text-ink transition duration-200 hover:border-line hover:bg-ink/5"
      >
        <Globe />
        {short}
        <span aria-hidden="true" className={cn('text-[10px] transition-transform', open && 'rotate-180')}>
          ▾
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-10 mt-3 w-[230px] overflow-hidden rounded-card bg-panel p-2 shadow-lift ring-1 ring-line-2">
          {COUNTRY_CODES.map((other) => (
            <Link
              key={other}
              to={switchPath(other)}
              aria-current={other === code ? 'true' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-tile px-3 py-2.5 text-[14.5px] font-medium transition-colors',
                other === code ? 'bg-green/15 text-green' : 'text-ink hover:bg-ink/5 hover:text-green'
              )}
            >
              <span className="mono w-7 text-[11.5px] font-bold tracking-[.06em]">{COUNTRIES[other].short}</span>
              {COUNTRIES[other].name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
    </svg>
  );
}
