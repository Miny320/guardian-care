import {Link} from 'react-router';
import Lockup from '../../components/Lockup';
import {Wrap} from '../../components/ui';
import {CONTACT} from '../../data/contact';
import {cn} from '../../lib/cn';

type FooterLink = {href: string; label: string; external?: boolean};

const COLUMNS: Array<{heading: string; links: FooterLink[]}> = [
  {
    heading: 'Journeys',
    links: [
      {href: '/consumer', label: 'I already have solar'},
      {href: '/plan', label: 'I’m looking for solar'},
      {href: '/business', label: 'Guardian Care for business'}
    ]
  },
  {
    heading: 'Markets',
    links: [
      {href: '/business?market=uk#markets', label: 'United Kingdom'},
      {href: '/business?market=us#markets', label: 'United States'},
      {href: '/business?market=au#markets', label: 'Australia'},
      {href: '/business?market=apac#markets', label: 'Southeast Asia · UAE'}
    ]
  },
  {
    heading: 'Contact',
    links: [
      {href: '/contact', label: 'Contact Us'},
      {href: CONTACT.phoneHref, label: CONTACT.phone, external: true},
      {href: CONTACT.emailHref, label: CONTACT.email, external: true}
    ]
  }
];

export default function Footer() {
  return (
    <footer
      className={cn(
        'on-navy border-t border-line-2 bg-bg pb-9 pt-[50px]'
      )}
    >
      <Wrap>
        <div className="grid grid-cols-1 gap-8 min-[460px]:grid-cols-2 min-[460px]:gap-7 min-[820px]:grid-cols-[2.2fr_1fr_1fr_1fr] min-[820px]:gap-[34px]">
          <div className="min-[460px]:col-span-2 min-[820px]:col-span-1">
            <Lockup size="footer" />
            <p className="mt-4 max-w-[290px] text-[14.5px] font-light leading-[1.65] text-muted">
              Energy intelligence for solar households and the companies that install for them. We
              establish the baseline, measure the system, calculate the difference and explain what
              it means.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading} className="min-w-0">
              <div className="mb-4 text-[11.5px] font-bold uppercase tracking-[.13em] text-green">
                {column.heading}
              </div>
              <div className="flex w-full min-w-0 flex-col items-start gap-[11px] text-[14.5px] font-light text-muted [&>*]:max-w-full [&>*]:break-words">
                {column.links.map((link) =>
                  link.external ? (
                    <a
                      key={`${column.heading}-${link.label}`}
                      href={link.href}
                      className="transition-colors hover:text-green"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={`${column.heading}-${link.label}`}
                      to={link.href}
                      className="transition-colors hover:text-green"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-t border-line-2 pt-6 text-center text-[12.5px] font-light text-faint">
          <span>© Guardian Care · Energy, understood.</span>
        </div>
      </Wrap>
    </footer>
  );
}
