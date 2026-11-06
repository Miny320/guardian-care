import {CtaBand, Note, NumberedGrid, PageHero, PagePhoto, PageSection} from '../../components/page';
import {useCountry, usePageTitle} from '../../lib/country';

export default function Protection() {
  const {words} = useCountry();
  usePageTitle('Solar protection');

  const checks = [
    {name: 'Surge protection', line: 'Whether surge protective devices are fitted, and whether they suit your solar system.'},
    {name: `Your ${words.panel}`, line: `How your solar is connected into your ${words.panel}, and whether it has a dedicated, protected circuit.`},
    {name: 'Dedicated solar circuits', line: 'Separate boards or circuits for solar and battery equipment, where the installation needs them.'},
    {name: 'AC and DC protection', line: 'The protective devices on both sides of the inverter, and whether they are still in good order.'},
    {name: 'Isolation', line: 'That the system can be safely switched off for maintenance or in an emergency.'},
    {name: 'Equipment condition', line: 'The age, wear and suitability of what is installed today.'}
  ];

  return (
    <main>
      <PageHero
        title="Protect the equipment behind"
        accent="your solar."
        lead="Power surges and ageing parts can damage an inverter, a battery or your home’s wiring. We check what is protecting your system and explain what, if anything, it needs."
        action={{label: 'Arrange a protection check', to: '/contact?service=protection'}}
        aside={<PagePhoto src="/assets/photos/service-protection.jpg" alt="Surge protection devices and breakers inside a solar consumer unit" />}
      />

      <PageSection title="What our check" accent="can include." lead="Every system is different, so we only look at what applies to yours.">
        <NumberedGrid items={checks} />
        <Note>
          The right protection depends on the installation and can only be decided after a proper technical
          inspection. We will never recommend a device without looking at your system first.
        </Note>
      </PageSection>

      <CtaBand title="Find out what’s protecting your system." action={{label: 'Arrange a protection check', to: '/contact?service=protection'}} />
    </main>
  );
}
