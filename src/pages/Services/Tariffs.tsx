import type {ReactNode} from 'react';
import {CtaBand, Faq, Note, PageHero, PageSection, TickList} from '../../components/page';
import type {CountryCode} from '../../data/countries';
import {useCountry, usePageTitle} from '../../lib/country';

type Block = {title: string; accent: string; lead: string; points: string[]; note?: string};

type TariffPage = {
  title: string;
  accent: string;
  lead: string;
  blocks: Block[];
  faq: Array<{q: string; a: ReactNode}>;
  disclaimer: string;
  closing: string;
};

// General guidance per market, written in 2026. Rules change: review these before relying on them.
const PAGES: Record<CountryCode, TariffPage> = {
  uk: {
    title: 'FIT & SEG,',
    accent: 'explained plainly.',
    lead: 'Many older systems still receive Feed-in Tariff payments. Newer ones are paid for export through the Smart Export Guarantee. We help you keep either working properly when your system changes.',
    blocks: [
      {
        title: 'Looking after a system on',
        accent: 'the Feed-in Tariff.',
        lead: 'The Feed-in Tariff closed to new applicants in March 2019, but existing agreements keep paying for the rest of their term.',
        points: [
          'Reviewing your original installation information',
          'Understanding your generation meter records',
          'Checking whether generation has dropped over time',
          'Explaining what an upgrade or repair could mean for your payments',
          'Helping with the paperwork your FIT licensee may ask for'
        ]
      },
      {
        title: 'Getting paid through',
        accent: 'the Smart Export Guarantee.',
        lead: 'Since January 2020, larger energy suppliers must offer at least one tariff that pays for the electricity you export.',
        points: [
          'An eligible installation, usually with an MCS certificate',
          'A meter that records your export, usually a smart meter',
          'Export rates vary widely between suppliers, so it pays to compare',
          'SEG is not available in Northern Ireland'
        ],
        note: 'FIT generation payments and FIT export payments are separate. You can keep FIT generation payments and take SEG for your export if you opt out of FIT export payments, but you cannot be paid twice for the same exported electricity.'
      }
    ],
    faq: [
      {q: 'Can I receive FIT and SEG payments at the same time?', a: 'Yes, in one combination: FIT generation payments together with SEG export payments, after opting out of FIT export payments.'},
      {q: 'Will adding a battery affect my Feed-in Tariff?', a: 'It shouldn’t, if it is installed correctly. The generation meter must keep recording only the electricity your panels generate, which is why batteries on FIT systems are usually AC-coupled.'},
      {q: 'What happens to my FIT if I replace my inverter?', a: 'Replacing a failed inverter does not normally end your agreement, but your FIT licensee may want evidence of the change. We can explain what they are likely to ask for.'},
      {q: 'What do I need for a SEG export tariff?', a: 'Generally an eligible installation, evidence such as an MCS certificate, and a meter that records half-hourly export, usually a smart meter.'}
    ],
    disclaimer: 'General information only. Your FIT licensee or SEG supplier has the final say on your agreement.',
    closing: 'Planning a change to a FIT or SEG system?'
  },
  us: {
    title: 'Net metering,',
    accent: 'explained plainly.',
    lead: 'What your exported solar is worth depends on your state and your utility. We help you understand your rules, and get more value from the power you make.',
    blocks: [
      {
        title: 'Net metering or',
        accent: 'net billing?',
        lead: 'There are two main ways a utility pays for the solar you send to the grid.',
        points: [
          'Net metering credits your export at or close to the retail rate',
          'Net billing credits your export at a lower rate than you pay for grid power',
          'California moved new customers to net billing in April 2023, and other states are reviewing their rules',
          'Under net billing, when you use your solar matters as much as how much you make'
        ]
      },
      {
        title: 'Changes that',
        accent: 'affect your system.',
        lead: 'Most changes to a grid-connected system need your utility’s approval first.',
        points: [
          'Adding a battery or more panels usually needs a new or updated interconnection application',
          'Replacing an inverter may need to be reported to your utility',
          'Some utilities limit how much you can export',
          'Fixed monthly charges apply even when your solar covers all your usage'
        ],
        note: 'The 30% federal residential solar tax credit (Section 25D) ended for systems completed after December 31, 2025. Unused credit from an earlier installation can still carry forward. Check your situation with a tax professional.'
      }
    ],
    faq: [
      {q: 'Is the federal solar tax credit still available?', a: 'Not for new homeowner-owned systems completed after December 31, 2025. State and utility incentives may still apply, and they vary by location.'},
      {q: 'Will adding a battery affect my net metering?', a: 'It can. Your utility may need to approve the battery before it is connected, and some programs have rules about charging a battery from the grid.'},
      {q: 'Why isn’t my electricity bill zero?', a: 'Most utilities charge fixed monthly fees, and under net billing your export is credited at less than the price of the power you buy back.'},
      {q: 'Does a battery make sense under net billing?', a: 'Often, because storing midday solar for the evening is worth more than exporting it at a low rate. We size it from your real usage.'}
    ],
    disclaimer: 'General information only. Your utility and your state’s rules have the final say.',
    closing: 'Want to understand your export rules?'
  },
  au: {
    title: 'Feed-in tariffs,',
    accent: 'explained plainly.',
    lead: 'The rate you are paid for exported solar is set by your retailer, and it has fallen in most states. We help you use more of your own solar and choose the right setup.',
    blocks: [
      {
        title: 'How feed-in tariffs',
        accent: 'work now.',
        lead: 'Feed-in tariffs differ by state and by retailer, so two identical systems can earn very different amounts.',
        points: [
          'Your retailer sets your feed-in rate; some states set a minimum',
          'Midday export is usually the least valuable power your system makes',
          'Some retailers now pay different rates at different times of day',
          'Your local network may limit how much you can export'
        ]
      },
      {
        title: 'Help with',
        accent: 'the upfront cost.',
        lead: 'Two federal schemes reduce what you pay at installation. Your installer applies them for you.',
        points: [
          'The Small-scale Renewable Energy Scheme lowers the cost of new rooftop solar',
          'The Cheaper Home Batteries Program gives an upfront discount on eligible batteries',
          'Battery discounts step down over time, so check the current amount with your quote',
          'A battery can be added to an existing solar system'
        ]
      }
    ],
    faq: [
      {q: 'Why has my feed-in tariff dropped?', a: 'Retailers have cut feed-in rates as more homes export solar in the middle of the day, when power is plentiful and cheap.'},
      {q: 'Should I export or store my solar?', a: 'With low feed-in rates, using your own solar in the evening is usually worth more than exporting it. We work it out from your real usage.'},
      {q: 'Can I add a battery to my existing system?', a: 'Usually, yes, either through a hybrid inverter or as a separate AC-coupled battery. Your network may need to approve the change.'},
      {q: 'Why is my export being limited?', a: 'Some networks cap exports to protect the local grid. Monitoring shows how often it happens, and a battery can soak up what would otherwise be lost.'}
    ],
    disclaimer: 'General information only. Your retailer and network have the final say on your rates and connection.',
    closing: 'Getting less for your solar than you used to?'
  },
  th: {
    title: 'Net billing,',
    accent: 'explained plainly.',
    lead: 'Homes with rooftop solar can sell surplus power to the grid, but it is bought back for well under the price of grid electricity. We help you use more of your own solar.',
    blocks: [
      {
        title: 'Selling your',
        accent: 'surplus solar.',
        lead: 'Residential rooftop solar is connected and bought back through your electricity authority.',
        points: [
          'MEA serves Bangkok, Nonthaburi and Samut Prakan; PEA serves the rest of the country',
          'Exported power is bought back at about THB 2.20 per kWh',
          'Grid electricity costs around THB 3.9 per kWh',
          'Limits apply to how much capacity the scheme accepts'
        ],
        note: 'Thailand’s rooftop solar rules were under review in 2026. Check the current buyback rate and conditions with MEA or PEA before you rely on them.'
      },
      {
        title: 'Getting the most',
        accent: 'from your system.',
        lead: 'Because exported power earns little more than half the price of grid power, self-consumption decides the payback.',
        points: [
          'Run air conditioning and appliances while the sun is up',
          'Store daytime surplus in a battery for the evening',
          'Get approval from MEA or PEA before connecting or changing your system',
          'Monitor your system so a fault does not quietly cost you'
        ]
      }
    ],
    faq: [
      {q: 'Do I need permission to connect rooftop solar?', a: 'Yes. Grid-connected systems need approval from your electricity authority, MEA or PEA, before they are connected.'},
      {q: 'Is it better to sell or use my solar?', a: 'Using it is usually better, because you save the full grid price on every unit you use yourself, but earn much less on each unit you export.'},
      {q: 'Is a battery worth it?', a: 'It depends on how much power your home uses after dark. We size it from your real usage, not from the biggest battery available.'},
      {q: 'Will the buyback rate change?', a: 'It may. The rules were under review in 2026, so we check the current conditions for your system.'}
    ],
    disclaimer: 'General information only. MEA, PEA and the Energy Regulatory Commission have the final say on your connection and rates.',
    closing: 'Want to get more from your solar?'
  }
};

export default function Tariffs() {
  const {code, tariffs} = useCountry();
  const page = PAGES[code];
  usePageTitle(tariffs.label);

  return (
    <main>
      <PageHero
        title={page.title}
        accent={page.accent}
        lead={page.lead}
        action={{label: 'Ask about your tariff', to: '/contact?service=tariff'}}
      />

      {page.blocks.map((block) => (
        <PageSection key={block.title} title={block.title} accent={block.accent} lead={block.lead}>
          <TickList items={block.points} />
          {block.note ? <Note>{block.note}</Note> : null}
        </PageSection>
      ))}

      <PageSection title="Common questions," accent="answered plainly." lead={page.disclaimer}>
        <Faq items={page.faq} />
      </PageSection>

      <CtaBand title={page.closing} action={{label: 'Ask about your tariff', to: '/contact?service=tariff'}} />
    </main>
  );
}
