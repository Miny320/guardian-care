export type Market = {
  key: string;
  name: string;
  short: string;
  export: {label: string; value: string};
  incentive: {label: string; value: string};
  accreditation: {label: string; value: string};
  headline: string;
  body: string;
  operational: string[];
};

export const MARKETS: Market[] = [
  {
    key: 'uk',
    name: 'United Kingdom',
    short: 'UK',
    export: {label: 'Export paid under', value: 'Smart Export Guarantee'},
    incentive: {label: 'Legacy scheme', value: 'Feed-in Tariff, closed 2019'},
    accreditation: {label: 'Installer standard', value: 'MCS'},
    headline: 'One portfolio, two payment regimes',
    body: 'The Feed-in Tariff closed to new applicants in 2019 and the Smart Export Guarantee replaced it the following January. Any installer who has been trading for more than six years is therefore maintaining a base split across both, on different payment mechanisms, with the older half now past the design life of its first inverter.',
    operational: [
      'FIT and SEG systems sit side by side in the same base and are worth different amounts per exported unit.',
      'Retail tariffs carry a daily standing charge on top of the unit rate, so self-consumption is worth more than the headline rate suggests.',
      'The oldest systems are at the age where inverter failure stops being an exception.'
    ]
  },
  {
    key: 'us',
    name: 'United States',
    short: 'US',
    export: {label: 'Export paid under', value: 'Net metering, set by state'},
    incentive: {label: 'Federal support', value: 'Investment Tax Credit'},
    accreditation: {label: 'Installer standard', value: 'NABCEP, widely used'},
    headline: 'The same array pays back differently either side of a state line',
    body: 'Export is settled state by state and often utility by utility rather than nationally. California’s move to net billing under NEM 3.0 in 2023 is the clearest example: the same rooftop that once exported at close to retail value now earns considerably less for it, which moves the whole case toward self-consumption and storage.',
    operational: [
      'A portfolio that crosses utility territories is running under several different export rules at once.',
      'Where net billing applies, when a system generates matters as much as how much it generates.',
      'Retrofit storage becomes a live conversation with existing customers, not only a new-install option.'
    ]
  },
  {
    key: 'au',
    name: 'Australia',
    short: 'AU',
    export: {label: 'Export paid under', value: 'Feed-in tariff, set by state and retailer'},
    incentive: {label: 'Federal support', value: 'SRES, via STCs'},
    accreditation: {label: 'Installer standard', value: 'Clean Energy Council'},
    headline: 'Abundant midday generation makes timing the whole question',
    body: 'Australia has among the highest rooftop solar penetration in the world, and feed-in tariffs are set by state and retailer rather than federally. Where a great deal of generation arrives in the middle of the day and export is paid modestly, the value of a system is decided by how much of its own output the property uses.',
    operational: [
      'Feed-in rates differ by state and by retailer, so two identical systems earn differently.',
      'Export at the middle of the day is the least valuable unit the system produces.',
      'Battery and load-shifting advice depends on measured consumption, not on system size.'
    ]
  },
  {
    key: 'apac',
    name: 'Southeast Asia · UAE',
    short: 'SEA · UAE',
    export: {label: 'Export paid under', value: 'Net metering or net billing, by country'},
    incentive: {label: 'Programmes', value: 'Shams Dubai, SolarNova and others'},
    accreditation: {label: 'Installer standard', value: 'Set per market'},
    headline: 'Fewer, larger assets — and downtime that is immediately material',
    body: 'Arrangements are set per country and frequently per utility, from net metering under Shams Dubai through to programmes such as SolarNova in Singapore. The weight of installed capacity sits on commercial and industrial rooftops rather than on housing, which changes what an aftercare operation is for.',
    operational: [
      'A single commercial roof can represent more capacity than a hundred homes.',
      'One site offline is a visible loss rather than a rounding error, so detection time is the metric.',
      'Reporting is usually owed to a business with its own finance team, not to a householder.'
    ]
  }
];

export const COMMON = [
  'Hardware, accreditation and tariff rules differ. What a system did last Tuesday does not.',
  'Guardian Care reads generation, consumption, storage and grid flow the same way in every market, then applies the local tariff on top.',
  'Your branding, your customer relationship, your commercial terms — in each territory you already operate in.'
];
