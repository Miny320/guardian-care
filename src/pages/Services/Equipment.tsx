import {CtaBand, Note, NumberedGrid, PageHero, PagePhoto, PageSection, TickList} from '../../components/page';
import type {CountryCode} from '../../data/countries';
import {useCountry, usePageTitle} from '../../lib/country';

const INVERTERS = [
  {
    name: 'String inverters',
    line: 'One inverter for a whole run of panels. Simple, proven, and the most common setup on older homes.'
  },
  {
    name: 'Hybrid inverters',
    line: 'Runs your panels and a battery from one box, so adding storage later is straightforward.'
  },
  {
    name: 'Microinverters & optimisers',
    line: 'Small units on each panel, so one shaded or faulty panel does not drag the rest down.'
  },
  {
    name: 'Replacement & upgrades',
    line: 'When an inverter fails or its maker stops supporting it, we find a compatible replacement.'
  }
];

const BATTERY = [
  'Store daytime solar and use it in the evening',
  'Buy less electricity at the most expensive times',
  'Add a battery to an existing system without replacing it',
  'Sized from your real usage, not the biggest box on offer'
];

// Why a battery is worth looking at, in each market's own terms.
const BATTERY_NOTE: Record<CountryCode, string> = {
  uk: 'If your system receives Feed-in Tariff payments, a battery is usually added as AC-coupled storage, so your generation meter keeps recording only solar generation.',
  us: 'Where your utility has moved from net metering to net billing, exported solar earns less than the power you buy back, which makes storing it more valuable. Your utility may need to approve the change before a battery is connected.',
  au: 'The federal Cheaper Home Batteries Program gives an upfront discount on eligible home batteries, applied through your installer. The discount steps down over time, so check the current amount when you get a quote.',
  th: 'Under residential net billing, exported solar is bought back for less than the price of grid power, so using more of your own solar in the evening usually pays better than exporting it.'
};

export default function Equipment() {
  const {code} = useCountry();
  usePageTitle('Inverters & battery storage');

  return (
    <main>
      <PageHero
        title="Solar equipment, built around"
        accent="the system you have."
        lead="Inverters and batteries chosen for your home and your usage. We look at what is already installed before recommending anything new."
        action={{label: 'Book a system assessment', to: '/contact?service=assessment'}}
        aside={<PagePhoto src="/assets/photos/service-battery.jpg" alt="A hybrid inverter and home battery installed on a garage wall" />}
      />

      <PageSection
        id="inverters"
        title="Reliable solar starts with"
        accent="the right inverter."
        lead="The inverter turns your panels’ power into power your home can use. It is also the part most likely to fail as a system ages."
        media={<PagePhoto src="/assets/photos/service-inverter.jpg" alt="An engineer checking a wall-mounted string inverter in a loft" flip />}
      >
        <NumberedGrid items={INVERTERS} columns={2} />
      </PageSection>

      <PageSection
        id="battery-storage"
        title="Store more of your solar."
        accent="Use it when you need it."
        lead="We don’t recommend a battery before we’ve looked at how and when your home uses electricity."
        media={<PagePhoto src="/assets/photos/service-ac-coupled.jpg" alt="An AC-coupled battery installed beside an older string inverter" flip />}
      >
        <TickList items={BATTERY} />
        <Note>{BATTERY_NOTE[code]}</Note>
      </PageSection>

      <CtaBand title="Not sure what suits your system?" action={{label: 'Request a battery quote', to: '/contact?service=battery'}} />
    </main>
  );
}
