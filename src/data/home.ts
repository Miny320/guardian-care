export type Service = {
  key: string;
  title: string;
  text: string;
  // The areas each service covers, shown as a short line under the text.
  tags: string[];
  image: {src: string; alt: string};
  cta: {label: string; to: string};
};

export const SERVICES_INTRO =
  'Everything your system needs, guided by a live, AI-read picture of its health: from protection and repairs to batteries and long-term maintenance.';

// What Guardian Care does, from the first assessment to looking after the customer for years.
export const SERVICES: Service[] = [
  {
    key: 'assessment',
    title: 'Solar System Assessment',
    text: 'Understand every installation before making recommendations. We capture equipment, electrical conditions and energy information to build a complete digital system profile.',
    tags: ['Assessment', 'System records', 'Engineering'],
    image: {src: '/assets/photos/service-assessment.jpg', alt: 'Guardian Care engineer completing a system assessment on a tablet outside a solar home'},
    cta: {label: 'Learn more', to: '/services#assessment'}
  },
  {
    key: 'equipment',
    title: 'Equipment & Installation Management',
    text: 'Manage solar inverters, battery storage, system upgrades and electrical improvements, from identifying requirements to coordinating installation and recording completed works.',
    tags: ['Inverters', 'Batteries', 'Upgrades'],
    image: {src: '/assets/photos/service-equipment.jpg', alt: 'A wall-mounted hybrid inverter and stacked home battery in a bright garage'},
    cta: {label: 'Learn more', to: '/services#equipment'}
  },
  {
    key: 'monitoring',
    title: 'Connected Solar Monitoring',
    text: 'Connect inverters, batteries and energy-monitoring systems to track solar generation, home consumption, grid imports, exports and system health.',
    tags: ['IoT', 'Device integrations', 'Energy data'],
    image: {src: '/assets/photos/service-monitoring.jpg', alt: 'Panels, inverter, battery, gateway and meter linked together, with live energy data on a tablet and phone'},
    cta: {label: 'Learn more', to: '/services#monitoring'}
  },
  {
    key: 'intelligence',
    title: 'AI Energy Intelligence',
    text: 'Turn energy data into meaningful intelligence. Use AI and analytics to identify unusual patterns, explain potential faults, understand performance and generate personalised energy recommendations.',
    tags: ['AI', 'Analytics', 'Energy optimisation'],
    image: {src: '/assets/photos/service-ai-intelligence.jpg', alt: 'The Guardian Care AI Energy Intelligence dashboard flagging an underperforming zone with recommended actions'},
    cta: {label: 'Learn more', to: '/services#intelligence'}
  },
  {
    key: 'operations',
    title: 'Operations & Maintenance',
    text: 'Manage system alerts, maintenance tasks, engineer assignments, installation workflows and fault resolution through one connected operations platform.',
    tags: ['Operations', 'Automation', 'Maintenance'],
    image: {src: '/assets/photos/service-operations.jpg', alt: 'An operator at the Guardian Care Operations & Maintenance Center, with fleet health, work orders and alerts on screen'},
    cta: {label: 'Learn more', to: '/services#operations'}
  },
  {
    key: 'customer',
    title: 'Customer Energy Management',
    text: 'Give homeowners a clear understanding of their energy, with system health, performance insights, personalised advice, monthly reports and ongoing support.',
    tags: ['Customer experience', 'Insights', 'Support'],
    image: {src: '/assets/photos/service-customer.jpg', alt: 'A homeowner holding the Guardian Care app outside their solar home, showing system health, energy flow and an AI insight'},
    cta: {label: 'Learn more', to: '/services#customer'}
  }
];

export type Machine = {key: string; name: string; line: string; image: string; alt: string};

// The equipment Guardian Care fits, checks and looks after, shown first in the "Why Guardian Care" slider.
export const MACHINES: Machine[] = [
  {
    key: 'battery',
    name: 'Battery storage',
    line: 'Stores the power your panels make in the day, so you use it in the evening instead of buying it back from the grid.',
    image: '/assets/parts/battery.png',
    alt: 'A home battery storage unit'
  },
  {
    key: 'inverter',
    name: 'Monitored inverter',
    line: 'Turns your panels’ power into power your home can use, and reports its output and voltage every day, so a fault is spotted early.',
    image: '/assets/parts/inverter.png',
    alt: 'A solar inverter with a voltage gauge and AC readout'
  },
  {
    key: 'protection',
    name: 'Surge protection',
    line: 'Protects your solar system and your home’s wiring from power surges, with a safe consumer unit and isolator.',
    image: '/assets/parts/protection.png',
    alt: 'A consumer unit with surge protection, a meter and an isolator'
  }
];

// What changes with Guardian Care, following its real workflow: assess, monitor, find faults,
// fix, protect, store, handle local export rules, advise, and keep installers connected.
// Written for every market, so no country-specific schemes are named here.
export const BEFORE_AFTER: Array<{topic: string; before: string; after: string}> = [
  {
    topic: 'Assessment',
    before: 'Most owners don’t know exactly what is on their roof: how old the equipment is, how it is wired, or whether it was ever set up to suit the way their home uses power today.',
    after: 'An engineer records your panels, inverter, battery, wiring and protection in one system profile, so every recommendation starts from what you actually have, not from guesswork.'
  },
  {
    topic: 'Monitoring',
    before: 'After installation, few systems are ever checked again. Output can fall for months through dirt, shading or a failing part, and the only sign is a slightly higher bill.',
    after: 'Your generation, home use, imports and exports are monitored and compared with what the system should be producing, so a drop is spotted early rather than years later.'
  },
  {
    topic: 'Faults',
    before: 'When the inverter shows an error or the system keeps switching off, the original installer may have moved on and the manufacturer may no longer support the equipment.',
    after: 'We diagnose the fault, often remotely, then repair it or fit a compatible replacement, and confirm the system is back to the output it should be making.'
  },
  {
    topic: 'Safety',
    before: 'Many owners have no idea whether surge protection, isolators and breakers are fitted correctly, and ageing parts can put both the equipment and the home at risk.',
    after: 'We inspect the protective equipment and electrical connections, explain what we find in plain words, and only recommend the upgrades your system genuinely needs.'
  },
  {
    topic: 'Storage',
    before: 'Solar makes most of its power at midday, when many homes are empty. The surplus is exported for a low rate, then electricity is bought back at full price in the evening.',
    after: 'We look at when your home really uses power and size battery storage to match, often adding it to your existing system without replacing the inverter.'
  },
  {
    topic: 'Local rules',
    before: 'Export payments, net metering and feed-in rules differ from country to country and change often, and a change to your system can quietly affect what you are paid.',
    after: 'We explain the rules where you live, check that any upgrade keeps your export payments intact, and help with the paperwork your utility or supplier asks for.'
  },
  {
    topic: 'Advice',
    before: 'Monitoring apps show graphs and numbers but rarely say what they mean, so most owners never act on them and keep paying more than they need to.',
    after: 'You get clear reports and alerts that say what happened, why it matters and what to do next, with our team ready to step in when action is needed.'
  },
  {
    topic: 'Installers',
    before: 'Solar companies lose touch with customers once the job is done. Customers find faults first, call in frustration, and often go elsewhere for their next upgrade.',
    after: 'Installers see every customer’s system on one console, hear about problems first, and keep the relationship that brings repeat work and referrals.'
  }
];

export type HomeMarket = {
  key: string;
  // ISO 3166 numeric code, as used by the world-atlas country shapes on the globe.
  geoId: string;
  // Where the globe pin sits and turns to, as [longitude, latitude], on the mainland.
  at: [number, number];
  short: string;
  name: string;
  headline: string;
  facts: Array<{label: string; value: string}>;
  helps: string;
};

export const HOME_MARKETS: HomeMarket[] = [
  {
    key: 'us',
    geoId: '840',
    at: [-98, 39],
    short: 'US',
    name: 'United States',
    headline: 'Export rules change from state to state.',
    facts: [
      {label: 'Export paid under', value: 'Net metering or net billing, set by state'},
      {label: 'Federal homeowner credit', value: 'Ended for systems completed after 2025'}
    ],
    helps: 'Where net billing applies, when a system generates matters as much as how much. Guardian Care shows customers how to use more of their own power and when storage pays.'
  },
  {
    key: 'au',
    geoId: '036',
    at: [134, -25],
    short: 'AU',
    name: 'Australia',
    headline: 'Some of the highest rooftop solar uptake in the world.',
    facts: [
      {label: 'Export paid under', value: 'Feed-in tariff, set by state and retailer'},
      {label: 'Federal support', value: 'Upfront discounts on solar and home batteries'}
    ],
    helps: 'Midday export is the least valuable unit a system makes. Guardian Care turns measured use into battery and load-shifting advice.'
  },
  {
    key: 'th',
    geoId: '764',
    at: [101, 15],
    short: 'TH',
    name: 'Thailand',
    headline: 'Exported power earns well under the retail price.',
    facts: [
      {label: 'Export paid under', value: 'Residential net billing, about THB 2.20/kWh'},
      {label: 'Retail electricity', value: 'Around THB 3.9/kWh'}
    ],
    helps: 'With export worth little more than half of what grid power costs, self-consumption decides the payback. Guardian Care measures it and shows where it can rise.'
  },
  {
    key: 'uk',
    geoId: '826',
    at: [-2, 54],
    short: 'UK',
    name: 'United Kingdom',
    headline: 'A large base of ageing systems, on two payment schemes.',
    facts: [
      {label: 'Export paid under', value: 'Smart Export Guarantee'},
      {label: 'Legacy scheme', value: 'Feed-in Tariff, closed 2019'}
    ],
    helps: 'The oldest systems are past the life of their first inverter. Guardian Care finds the ones underperforming before the customer does.'
  }
];
