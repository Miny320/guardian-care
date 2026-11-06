import {Link} from 'react-router';
import {CtaBand, NumberedGrid, PageHero, PagePhoto, PageSection, TickList} from '../../components/page';
import {COUNTRIES, COUNTRY_CODES} from '../../data/countries';
import {useCountry, usePageTitle, useSwitchPath} from '../../lib/country';
import {cn} from '../../lib/cn';

const PRINCIPLES = [
  {name: 'Protect', line: 'Keep the equipment, the home and the people around it safe.'},
  {name: 'Maintain', line: 'Keep the system working as it should, for as long as it runs.'},
  {name: 'Optimise', line: 'Get more value from every unit of solar the system makes.'}
];

export default function About() {
  const {code, name, tariffs} = useCountry();
  const switchPath = useSwitchPath();
  usePageTitle('About us');

  const supports = [
    'Homeowners with ageing solar equipment',
    `Homeowners with questions about ${tariffs.nav.toLowerCase()}`,
    'Homeowners who want battery storage',
    'Homeowners who need an inverter replaced',
    'New solar and battery customers',
    'Solar companies that want to stay close to their customers'
  ];

  return (
    <main>
      <PageHero
        title="Solar expertise"
        accent="beyond installation."
        lead="Guardian Care looks after solar systems after they are installed: protecting the equipment, keeping it working, and helping owners get more from it."
        aside={<PagePhoto src="/assets/photos/about-engineer.jpg" alt="An engineer talking a homeowner through her solar inverter" />}
      />

      <PageSection
        title="Many solar homes were installed,"
        accent="then left to run."
        lead="Once the installer leaves, most systems are never checked again. Faults go unnoticed, equipment ages, and prices and tariffs change around them. We exist to close that gap."
      />

      <PageSection title="Everything we do comes down to" accent="three words.">
        <NumberedGrid items={PRINCIPLES} />
      </PageSection>

      <PageSection title="Who we" accent={`support in ${code === 'uk' || code === 'us' ? 'the ' : ''}${name}.`}>
        <TickList items={supports} />
      </PageSection>

      <PageSection
        title="Four markets."
        accent="One standard of care."
        lead="We work in the United Kingdom, the United States, Australia and Thailand. The rules differ in each, so each has its own advice."
      >
        <ul className="grid gap-3 min-[680px]:grid-cols-2 min-[1080px]:grid-cols-4">
          {COUNTRY_CODES.map((other) => {
            const on = other === code;
            return (
              <li key={other}>
                <Link
                  to={switchPath(other)}
                  aria-current={on ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-card px-5 py-4 transition duration-200',
                    on ? 'bg-green-glow ring-2 ring-green' : 'bg-panel ring-1 ring-line-2 hover:ring-green/50'
                  )}
                >
                  <span className="mono grid h-10 min-w-10 place-items-center rounded-tile bg-green/15 px-2 text-[12px] font-bold text-green">
                    {COUNTRIES[other].short}
                  </span>
                  <span className="text-[16px] font-medium text-ink">{COUNTRIES[other].name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageSection>

      <CtaBand title="Talk to a specialist about your system." action={{label: 'Contact us', to: '/contact'}} />
    </main>
  );
}
