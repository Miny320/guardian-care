import type {Answers, Step} from '../components/Assessment/types';
import {plain, type Row, type Summary} from '../lib/deliver';
import type {GlyphName} from '../components/Glyph';
import type {StatusTone} from './command';

export const BUSINESS_STEPS: Step[] = [
  {
    key: 'market',
    kind: 'choice',
    glyph: 'tariff',
    title: 'When were most of your systems installed?',
    lead: 'The tariff era decides what is worth reviewing.',
    options: [
      {value: 'fit-early', label: '2010 – 2012'},
      {value: 'fit-mid', label: '2013 – 2015'},
      {value: 'fit-late', label: '2016 – March 2019'},
      {value: 'post-fit', label: 'April 2019 onwards'},
      {value: 'mixed', label: 'A mix of all of them'}
    ],
    why: {
      heading: 'Why we ask',
      body: 'A Feed-in Tariff system was sold on a promised generation figure and has rarely been compared to it since. That gap is where the work is.'
    }
  },
  {
    key: 'customers',
    kind: 'multi',
    glyph: 'acquire',
    title: 'What type of customers do you work with?',
    lead: 'Choose all that apply.',
    options: [
      {value: 'new', label: 'New solar customers'},
      {value: 'existing', label: 'Existing solar consumers'},
      {value: 'storage', label: 'Battery and storage customers'},
      {value: 'cost', label: 'Customers looking to reduce electricity costs'},
      {value: 'aftercare', label: 'Customers needing aftercare or monitoring'},
      {value: 'mixture', label: 'A mixture of all'}
    ],
    why: {
      heading: 'Guardian Care learns from this',
      body: 'Your answer decides where the strongest opportunity is likely to be: acquiring new customers, re-engaging existing ones, improving aftercare, connecting monitoring, or creating more value from the customer base you have already installed.'
    }
  },
  {
    key: 'installed',
    kind: 'choice',
    glyph: 'business',
    title: 'How many customers have you already installed?',
    options: [
      {value: 'under-100', label: 'Under 100'},
      {value: '100-500', label: '100–500'},
      {value: '500-2000', label: '500–2,000'},
      {value: '2000-10000', label: '2,000–10,000'},
      {value: '10000-plus', label: '10,000+'}
    ],
    why: {
      heading: 'Why this matters',
      body: (
        <>
          Every completed installation is still an active energy system. Guardian Care turns finished
          jobs into a <b>visible customer portfolio</b> — so instead of only knowing who you installed
          for, you begin to know what they have, how it is performing, and when your team should
          contact them.
        </>
      )
    }
  },
  {
    key: 'aftercare',
    kind: 'choice',
    glyph: 'retain',
    title: 'What happens after you complete an installation?',
    lead: 'Choose the answer closest to your current process.',
    options: [
      {value: 'monitor', label: 'We actively monitor customers'},
      {value: 'occasional', label: 'We provide occasional aftercare'},
      {value: 'reactive', label: 'Customers contact us if something goes wrong'},
      {value: 'rarely', label: 'We rarely speak to them again'},
      {value: 'better', label: 'We want a better process'}
    ],
    why: {
      heading: 'Why we ask',
      body: (
        <>
          A relationship where the customer has to raise their hand first is a reactive one — your
          team is waiting to be told. Guardian Care moves that to{' '}
          <b>system data → insight → suggested action → customer contact</b>, which gives your
          business a genuine reason to make contact before the relationship disappears.
        </>
      )
    }
  },
  {
    key: 'improve',
    kind: 'multi',
    glyph: 'goal',
    title: 'What would you like to improve?',
    lead: 'Choose what matters most to your business.',
    options: [
      {value: 'retention', label: 'Customer retention'},
      {value: 'monitoring', label: 'Better system monitoring'},
      {value: 'battery', label: 'More battery opportunities'},
      {value: 'engineer', label: 'Better engineer data capture'},
      {value: 'aftercare', label: 'Improved customer aftercare'},
      {value: 'recurring', label: 'More recurring customer engagement'},
      {value: 'visibility', label: 'Better visibility across existing customers'},
      {value: 'sales', label: 'More structured sales opportunities'}
    ],
    why: {
      heading: 'Why we ask',
      body: 'Guardian Care is deployed in stages rather than all at once. Knowing what you want first decides which stage is worth running before the others.'
    }
  },
  {
    key: 'process',
    kind: 'choice',
    glyph: 'capture',
    title: 'How would you describe your current customer process?',
    options: [
      {value: 'move-on', label: 'We install and move on'},
      {value: 'manual', label: 'We provide aftercare but it is manual'},
      {value: 'some', label: 'We monitor some customers'},
      {value: 'database', label: 'We have a large existing database'},
      {value: 'repeat', label: 'We want to generate more repeat business'},
      {value: 'retention', label: 'We want stronger customer retention'}
    ],
    why: {
      heading: 'Why we ask',
      body: 'The starting point decides the rollout. A business with a large dormant database has a different first move from one that already monitors and wants to act on what it sees.'
    }
  }
];

export const MARKET_LABEL: Record<string, string> = {
  'fit-early': '2010 – 2012',
  'fit-mid': '2013 – 2015',
  'fit-late': '2016 – March 2019',
  'post-fit': 'April 2019 onwards',
  mixed: 'A mix of eras'
};

export const INSTALLED_LABEL: Record<string, string> = {
  'under-100': 'Under 100',
  '100-500': '100–500',
  '500-2000': '500–2,000',
  '2000-10000': '2,000–10,000',
  '10000-plus': '10,000+'
};

export const AFTERCARE_LABEL: Record<string, string> = {
  monitor: 'Active',
  occasional: 'Occasional',
  reactive: 'Reactive',
  rarely: 'Minimal',
  better: 'Under review'
};

const IMPROVE_LABEL: Record<string, string> = {
  retention: 'Customer retention',
  monitoring: 'System monitoring',
  battery: 'Battery opportunities',
  engineer: 'Engineer data capture',
  aftercare: 'Customer aftercare',
  recurring: 'Recurring engagement',
  visibility: 'Portfolio visibility',
  sales: 'Structured sales opportunities'
};

const INSTALLED_COUNT: Record<string, number> = {
  'under-100': 60,
  '100-500': 300,
  '500-2000': 1200,
  '2000-10000': 6000,
  '10000-plus': 14000
};

export type BusinessPosition = {
  market: string | null;
  installedBand: string | null;
  installedCount: number | null;
  aftercare: string | null;
  reactive: boolean;
  monitoringCoverage: string;
  primaryGoal: string | null;
  goals: string[];
  customerTypes: string[];
};

export function businessSummary(position: BusinessPosition): Summary {
  const UNSTATED = 'Not stated';
  const installed = position.installedBand ? INSTALLED_LABEL[position.installedBand] : UNSTATED;
  const market = position.market ? MARKET_LABEL[position.market] : UNSTATED;
  const aftercare = position.aftercare ? AFTERCARE_LABEL[position.aftercare] : UNSTATED;
  const goal = position.primaryGoal ?? UNSTATED;

  const rows: Row[] = [
    ['Installed base', installed, position.reactive ? 'Contacted only when something breaks' : undefined],
    ['Installation era', market],
    ['After handover', aftercare],
    ['Monitoring coverage', position.monitoringCoverage, 'Share of the base with live visibility'],
    ['Priority', goal, position.goals.length > 1 ? `Plus ${position.goals.length - 1} more` : undefined]
  ];

  const note = position.reactive
    ? 'On this setup the first you hear of a fault is a customer calling about a bill. Every system between handover and that call is generating less than it should, and nobody is in a position to know which ones.'
    : 'The gap is between the systems you can see and the ones you cannot. Whatever share of the base is unmonitored is the share that can only report a problem after it has cost the customer money.';

  const count = position.installedCount;
  const scale =
    count === null
      ? 'your installed base'
      : `around ${count.toLocaleString('en-GB')} installed systems`;

  const sms = plain(
    `Guardian Care: from your answers - ${scale}, monitoring coverage ${position.monitoringCoverage.toLowerCase()}, ` +
    `${position.reactive ? 'and aftercare that starts when a customer calls' : 'with aftercare already in place'}. ` +
    `Priority: ${goal.toLowerCase()}. ` +
      'The systems you cannot see are the ones that report faults late. Full breakdown by email on request.'
  );

  return {
    subject: 'Your Guardian Care portfolio position',
    intro:
      'This is what your answers describe, in the order it matters. Every line is what you told us rather than what we measured — the platform replaces all of it with live data from the systems themselves.',
    rows,
    notes: [note],
    action:
      'Connect a sample of the base and compare what the systems report against what your records say they should be doing. That comparison is the whole proposition, and it takes a fortnight.',
    sms
  };
}

export function readBusiness(answers: Answers): BusinessPosition {
  const aftercare = answers.choice.aftercare ?? null;
  const improve = answers.multi.improve ?? [];
  const installedBand = answers.choice.installed ?? null;

  const coverage =
    aftercare === 'monitor'
      ? 'Broad'
      : aftercare === 'occasional' || aftercare === 'some'
        ? 'Partial'
        : aftercare
          ? 'Limited'
          : '—';

  return {
    market: answers.choice.market ?? null,
    installedBand,
    installedCount: installedBand ? INSTALLED_COUNT[installedBand] : null,
    aftercare,
    reactive: aftercare === 'reactive' || aftercare === 'rarely',
    monitoringCoverage: coverage,
    primaryGoal: improve[0] ? IMPROVE_LABEL[improve[0]] : null,
    goals: improve.map((key) => IMPROVE_LABEL[key]).filter(Boolean),
    customerTypes: answers.multi.customers ?? []
  };
}

export type Product = {
  key: string;
  glyph: GlyphName;
  tone: StatusTone;
  name: string;
  verb: string;
  who: string;
  line: string;
  points: string[];
};

export const PRODUCTS: Product[] = [
  {
    key: 'onsite',
    glyph: 'capture',
    tone: 'amber',
    name: 'Onsite',
    verb: 'Capture it',
    who: 'Your engineers',
    line: 'One visit turns an unknown installation into a digital record.',
    points: ['System profile', 'Electrical condition', 'Findings raised automatically']
  },
  {
    key: 'operations',
    glyph: 'portfolio',
    tone: 'green',
    name: 'Operations',
    verb: 'Run it',
    who: 'Your team',
    line: 'One screen for every system you have ever installed.',
    points: ['Portfolio at a glance', 'Alerts by priority', 'Tasks that assign themselves']
  },
  {
    key: 'customer',
    glyph: 'insight',
    tone: 'blue',
    name: 'My Guardian Care',
    verb: 'Show them',
    who: 'Your customer',
    line: 'The customer sees their own energy, in their own words.',
    points: ['Today at a glance', 'Plain-English advice', 'A monthly report']
  }
];

export type Watch = {
  key: string;
  glyph: GlyphName;
  tone: StatusTone;
  trigger: string;
  action: string;
};

export const WATCH: Watch[] = [
  {
    key: 'offline',
    glyph: 'connect',
    tone: 'amber',
    trigger: 'Monitoring goes quiet',
    action: 'Raised before the customer notices'
  },
  {
    key: 'generation',
    glyph: 'health',
    tone: 'orange',
    trigger: 'Generation drifts below baseline',
    action: 'Weather-adjusted first, then escalated'
  },
  {
    key: 'fault',
    glyph: 'inverter',
    tone: 'red',
    trigger: 'An inverter reports a fault',
    action: 'Engineer task, same day'
  },
  {
    key: 'battery',
    glyph: 'storage',
    tone: 'purple',
    trigger: 'A battery never empties',
    action: 'Schedule reviewed remotely, no visit'
  },
  {
    key: 'export',
    glyph: 'export',
    tone: 'blue',
    trigger: 'Exports high, imports higher',
    action: 'Storage opportunity, with the evidence'
  },
  {
    key: 'tariff',
    glyph: 'tariff',
    tone: 'green',
    trigger: 'A tariff stops matching use',
    action: 'Advice sent, in plain English'
  }
];

export const EVENT = {
  raw: 'Inverter fault 205',
  customer: {
    who: 'What your customer sees',
    tone: 'blue' as StatusTone,
    glyph: 'insight' as GlyphName,
    line: 'We have spotted something on your solar system. Guardian Care is looking into it.'
  },
  operator: {
    who: 'What your team sees',
    tone: 'orange' as StatusTone,
    glyph: 'tool' as GlyphName,
    line: 'Fault 205 — fourth occurrence in 72 hours. Engineering review triggered.',
    fields: [
      ['Customer', 'R. Delgado'],
      ['System', '6.4 kWp hybrid'],
      ['Last visit', '14 months ago']
    ] as Array<[string, string]>
  }
};

export const OPPORTUNITY = {
  exported: 2200,
  imported: 1800,
  window: 'the last 12 months',
  weak: 'Have you considered adding a battery?',
  strong:
    'Your system sold 2,200 kWh to the grid this year and bought 1,800 kWh back after dark. Storage would keep most of it.'
};

export type JoinStep = {
  key: string;
  glyph: GlyphName;
  name: string;
  line: string;
  note: string;
};

export const JOIN: JoinStep[] = [
  {
    key: 'talk',
    glyph: 'question',
    name: 'Talk',
    line: 'Tell us the shape of your installed base.',
    note: 'One call'
  },
  {
    key: 'connect',
    glyph: 'connect',
    name: 'Connect',
    line: 'We link your monitoring and your existing records.',
    note: 'No rebuild'
  },
  {
    key: 'onboard',
    glyph: 'retain',
    name: 'Onboard',
    line: 'Your customers get a dashboard with your name on it.',
    note: 'Your branding'
  },
  {
    key: 'operate',
    glyph: 'portfolio',
    name: 'Operate',
    line: 'You open the console and it is already running.',
    note: 'Day one'
  }
];

export const ERAS: Array<{name: string; rate: string; note: string}> = [
  {name: '2010 – 2012', rate: 'Highest FIT', note: 'Most to protect'},
  {name: '2013 – 2015', rate: 'High FIT', note: 'Inverters now ageing'},
  {name: '2016 – Mar 2019', rate: 'Lower FIT', note: 'Still in term'},
  {name: 'Apr 2019 on', rate: 'SEG export', note: 'Storage rarely fitted'},
  {name: 'Unknown', rate: 'We find it', note: 'From the MCS record'}
];

export const ROLLOUT = [
  'Recapture customer system information',
  'Build digital system profiles',
  'Connect suitable monitoring',
  'Identify energy and support opportunities',
  'Create structured customer follow-up'
];
