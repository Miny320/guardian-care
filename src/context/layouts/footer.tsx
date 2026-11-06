import {Link} from 'react-router';
import Lockup from '../../components/Lockup';
import {Wrap} from '../../components/ui';
import {CONTACT} from '../../data/contact';
import {SERVICE_DETAILS} from '../../data/services';
import {useCountry, useLocalPath} from '../../lib/country';

type FooterLink = {href: string; label: string; external?: boolean; newTab?: boolean};

export default function Footer() {
  const country = useCountry();
  const local = useLocalPath();

  const columns: Array<{heading: string; links: FooterLink[]}> = [
    {
      // Each service links to its own section of the Services page.
      heading: 'Services',
      links: SERVICE_DETAILS.map((service) => ({href: local(`/services#${service.key}`), label: service.title}))
    },
    {
      heading: 'Contact',
      links: [
        {href: local('/contact'), label: 'Get in touch'},
        {href: CONTACT.booking, label: 'Book a call', external: true, newTab: true},
        ...(country.phone ? [{href: country.phone.href, label: country.phone.display, external: true}] : []),
        {href: CONTACT.emailHref, label: CONTACT.email, external: true}
      ]
    }
  ];

  return (
    <footer className="border-t border-line-2 bg-transparent pb-9 pt-[50px]">
      <Wrap>
        <div className="grid grid-cols-1 gap-8 min-[460px]:grid-cols-2 min-[460px]:gap-7 min-[1000px]:grid-cols-[1.6fr_1.3fr_1fr] min-[1000px]:gap-[48px]">
          <div className="min-[460px]:col-span-2 min-[1000px]:col-span-1">
            <Lockup size="footer" />
            <p className="mt-4 max-w-[290px] text-[14.5px] font-light leading-[1.65] text-muted">
              Protection, maintenance and energy intelligence for solar homes, and for the companies that
              install them.
            </p>
            {country.accreditations.length ? (
              <p className="mt-2 max-w-[290px] text-[13px] font-medium leading-[1.6] text-muted">
                Accredited: {country.accreditations.join(' · ')}
              </p>
            ) : null}
          </div>

          {columns.map((column) => (
            <div key={column.heading} className="min-w-0">
              <div className="mb-4 text-[11.5px] font-bold uppercase tracking-[.13em] text-green">{column.heading}</div>
              <div className="flex w-full min-w-0 flex-col items-start gap-[11px] text-[14.5px] font-light text-muted [&>*]:max-w-full [&>*]:break-words">
                {column.links.map((link) =>
                  link.external ? (
                    <a
                      key={`${column.heading}-${link.label}`}
                      href={link.href}
                      {...(link.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                      className="transition-colors hover:text-green"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={`${column.heading}-${link.label}`} to={link.href} className="transition-colors hover:text-green">
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
          <span>· United States, United Kingdom, Australia, Thailand</span>
        </div>
      </Wrap>
    </footer>
  );
}
