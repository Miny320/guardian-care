import type {GlyphName} from '../components/Glyph';
import type {StatusTone} from './command';

export const LIVE = {
  solar: 24.8,
  home: 14.2,
  battery: 5.3,
  grid: 5.3,
  charge: 82,
  status: 'System healthy',
  ai: 'Everything is operating normally.'
};

export const LIVE_BALANCES = LIVE.home + LIVE.battery + LIVE.grid === LIVE.solar;

export type Journey = {
  key: 'existing' | 'plan' | 'business';
  index: string;
  name: string;
  eyebrow: string;
  headline: string;
  paras: string[];
  list?: {label: string; items: string[]};
  close?: string;
  cta: string;
  to: string;
  tone: StatusTone;
  glyph: GlyphName;
};

export const JOURNEYS: Journey[] = [
  {
    key: 'existing',
    index: '01',
    name: 'Existing solar',
    eyebrow: 'Already have solar?',
    headline: 'Understand how your system is performing today',
    paras: [
      'Your solar system may have been installed years ago, but your energy usage, electricity prices, equipment and household needs can change over time. Guardian Care helps you understand what your system is doing now.'
    ],
    list: {
      label: 'We give you a clear view of',
      items: [
        'What your solar system is generating',
        'How much electricity you are using yourself',
        'How much is being stored',
        'How much is being exported',
        'How much electricity you are still buying from the grid',
        'What your grid electricity is costing you',
        'Whether there are areas worth reviewing'
      ]
    },
    cta: 'Check my existing solar system',
    to: '/consumer',
    tone: 'amber',
    glyph: 'solarRoof'
  },
  {
    key: 'plan',
    index: '02',
    name: 'New solar',
    eyebrow: 'Looking to reduce your electricity costs?',
    headline: 'Build the right system around your home',
    paras: [
      'Guardian Care helps you understand your current electricity position before recommending solar panels, battery storage or energy optimisation.'
    ],
    list: {
      label: 'We start with the important questions',
      items: [
        'What are you currently paying for electricity?',
        'How dependent are you on the grid?',
        'Could solar generate a meaningful proportion of your energy?',
        'Would battery storage help you use more of that electricity yourself?'
      ]
    },
    close: 'Then we build an energy solution around your property.',
    cta: 'Get my solar & energy quote',
    to: '/plan',
    tone: 'green',
    glyph: 'savings'
  },
  {
    key: 'business',
    index: '03',
    name: 'For business',
    eyebrow: 'Guardian Care for business',
    headline: 'Acquire. Capture. Retain.',
    paras: [
      'Guardian Care helps renewable energy companies turn every customer interaction into a structured energy intelligence journey.',
      'From the first onsite assessment through to long-term monitoring, Guardian Care gives your team the tools to understand the customer’s system, explain what is happening clearly, and keep that customer connected after the work is completed.'
    ],
    cta: 'Explore for business',
    to: '/business',
    tone: 'blue',
    glyph: 'business'
  }
];

export type Phase = {
  key: 'establish' | 'connect' | 'operate';
  name: string;
  line: string;
  tone: StatusTone;
};

export const PHASES: Phase[] = [
  {
    key: 'establish',
    name: 'Establish',
    line: 'What is there, and what it needs',
    tone: 'amber'
  },
  {key: 'connect', name: 'Connect', line: 'Estimates become readings', tone: 'green'},
  {key: 'operate', name: 'Operate', line: 'For as long as the system runs', tone: 'blue'}
];

export type LifecycleStage = {
  index: string;
  name: string;
  line: string;
  phase: Phase['key'];
  glyph: GlyphName;
};

export const LIFECYCLE: LifecycleStage[] = [
  {
    index: '01',
    name: 'Capture',
    line: 'An unknown installation becomes a structured record',
    phase: 'establish',
    glyph: 'capture'
  },
  {
    index: '02',
    name: 'Analyse',
    line: 'The record is read for faults and for opportunity',
    phase: 'establish',
    glyph: 'insight'
  },
  {
    index: '03',
    name: 'Update',
    line: 'Correct, protect or improve what is installed',
    phase: 'establish',
    glyph: 'tool'
  },
  {
    index: '04',
    name: 'Connect',
    line: 'Monitoring goes on, and estimates become readings',
    phase: 'connect',
    glyph: 'connect'
  },
  {
    index: '05',
    name: 'Monitor',
    line: 'Measured daily against its own baseline, not an average',
    phase: 'operate',
    glyph: 'monitoring'
  },
  {
    index: '06',
    name: 'Advise',
    line: 'What the readings mean, in the customer’s own language',
    phase: 'operate',
    glyph: 'question'
  },
  {
    index: '07',
    name: 'Maintain',
    line: 'Faults resolved, service scheduled, performance held',
    phase: 'operate',
    glyph: 'health'
  },
  {
    index: '08',
    name: 'Retain',
    line: 'The relationship lasts as long as the equipment does',
    phase: 'operate',
    glyph: 'retain'
  }
];

export const CONVENTIONAL_END = 3;

export const LIFECYCLE_LOOP =
  'Retain feeds the next capture. The record grows rather than restarting — which is why a system Guardian Care has held for five years is worth more than one it met yesterday.';

export type FlowNode = {
  key: string;
  name: string;
  value: string;
  unit: string;
  glyph: GlyphName;
  tone: StatusTone;
};

export const ARRAY_NODE: FlowNode = {
  key: 'solar',
  name: 'Solar array',
  value: LIVE.solar.toFixed(1),
  unit: 'kW',
  glyph: 'generation',
  tone: 'amber'
};

export const DESTINATIONS: FlowNode[] = [
  {
    key: 'home',
    name: 'Home',
    value: LIVE.home.toFixed(1),
    unit: 'kW',
    glyph: 'consumption',
    tone: 'ink'
  },
  {
    key: 'battery',
    name: 'Battery',
    value: String(LIVE.charge),
    unit: '%',
    glyph: 'storage',
    tone: 'purple'
  },
  {key: 'grid', name: 'Grid', value: LIVE.grid.toFixed(1), unit: 'kW', glyph: 'grid', tone: 'blue'}
];

export const VERBS = ['Generate', 'Store', 'Consume', 'Export'];

export type Stage = {
  key: string;
  name: string;
  line: string;
  items: string[];
  tone: StatusTone;
  glyph: GlyphName;
};

export const PIPELINE: Stage[] = [
  {
    key: 'data',
    name: 'Data',
    line: 'What the system reports.',
    items: ['Generation', 'Consumption', 'Battery', 'Weather', 'Tariffs', 'Faults'],
    tone: 'blue',
    glyph: 'monitoring'
  },
  {
    key: 'ai',
    name: 'Intelligence',
    line: 'What it means.',
    items: ['Analyse', 'Interpret', 'Detect', 'Predict', 'Explain'],
    tone: 'amber',
    glyph: 'insight'
  },
  {
    key: 'action',
    name: 'Action',
    line: 'What happens next.',
    items: ['Alert', 'Advise', 'Task', 'Resolve', 'Optimise'],
    tone: 'green',
    glyph: 'goal'
  }
];

export type Representation = {
  audience: 'operations' | 'customer';
  label: string;
  headline: string;
  lines: string[];
  actionLabel: string;
  action: string;
  buttons: string[];
};

export const INSIGHT: Representation[] = [
  {
    audience: 'operations',
    label: 'Operations view',
    headline: 'Production is 14% below the expected range today.',
    lines: [
      'Weather conditions are normal.',
      'Inverter communication is stable.',
      'String 2 shows an unusual production pattern.'
    ],
    actionLabel: 'Recommended action',
    action: 'Review String 2 during the next engineering visit.',
    buttons: ['View system', 'Create task']
  },
  {
    audience: 'customer',
    label: 'Customer view',
    headline: 'Your system is producing a little less than usual today.',
    lines: [
      'The weather is not the cause.',
      'Your monitoring connection is working normally.',
      'Part of your array is being checked.'
    ],
    actionLabel: 'What happens now',
    action: 'Guardian Care is reviewing the alert. There is nothing you need to do.',
    buttons: ['View my system']
  }
];

export type Kpi = {value: string; label: string; tone: StatusTone};

export const PORTFOLIO: Kpi[] = [
  {value: '1,245', label: 'Customers', tone: 'ink'},
  {value: '1,036', label: 'Online', tone: 'green'},
  {value: '61', label: 'Offline', tone: 'amber'},
  {value: '42', label: 'Faults', tone: 'red'}
];

export type PriorityLevel = {
  name: string;
  tone: StatusTone;
  meaning: string;
  filled: boolean;
};

export const PRIORITIES: PriorityLevel[] = [
  {name: 'Critical', tone: 'red', meaning: 'Potential outage, electrical fault or major performance problem.', filled: true},
  {name: 'Action', tone: 'orange', meaning: 'Operational intervention should be scheduled.', filled: true},
  {name: 'Attention', tone: 'amber', meaning: 'Guardian Care should review.', filled: true},
  {name: 'Advisory', tone: 'blue', meaning: 'The customer should be informed.', filled: false},
  {name: 'Information', tone: 'green', meaning: 'No intervention required.', filled: false}
];

export type Event = {
  ref: string;
  priority: string;
  summary: string;
  detail: string;
};

export const EVENTS: Event[] = [
  {
    ref: '#4821',
    priority: 'Critical',
    summary: 'Inverter communication lost',
    detail: 'Offline 6h 14m · remote troubleshooting attempted · engineer task created'
  },
  {
    ref: '#1904',
    priority: 'Action',
    summary: 'Generation below expected',
    detail: '28% under weather-adjusted baseline for 12 consecutive days'
  },
  {
    ref: '#3318',
    priority: 'Attention',
    summary: 'Battery opportunity detected',
    detail: 'Sustained afternoon export against evening import · storage modelled'
  },
  {
    ref: '#0921',
    priority: 'Advisory',
    summary: 'Tariff review recommended',
    detail: 'Charge window no longer aligned to the customer’s off-peak period'
  }
];

export const TODAY = {
  generated: 24.6,
  used: 14.2,
  stored: 5.1,
  exported: 5.3,
  status: 'Your system is healthy',
  ai: 'Your system produced 8% more energy than the same period last month.'
};

export const TODAY_BALANCES =
  Math.abs(TODAY.used + TODAY.stored + TODAY.exported - TODAY.generated) < 0.05;

export const TODAY_ROWS: Array<{label: string; value: number; tone: StatusTone}> = [
  {label: 'Used', value: TODAY.used, tone: 'ink'},
  {label: 'Stored', value: TODAY.stored, tone: 'purple'},
  {label: 'Exported', value: TODAY.exported, tone: 'blue'}
];

export type RecordNode = {name: string; line: string; glyph: GlyphName};

export const RECORD_ROOTS: RecordNode[] = [
  {name: 'Property', line: 'Address, type, electrical infrastructure', glyph: 'property'},
  {name: 'System', line: 'Panels, inverter, battery, protection', glyph: 'solarRoof'},
  {name: 'Energy', line: 'Tariff, metering, import, export', glyph: 'tariff'}
];

export const RECORD_SPINE: RecordNode[] = [
  {name: 'Monitoring', line: 'The record starts reporting against itself', glyph: 'monitoring'},
  {name: 'Events', line: 'Deviation becomes a classified exception', glyph: 'health'},
  {name: 'Jobs', line: 'Exceptions that need hands become scheduled work', glyph: 'tool'},
  {name: 'Communication', line: 'The customer hears about something real', glyph: 'question'},
  {name: 'Reports', line: 'Performance and progress, on a cadence', glyph: 'capture'},
  {name: 'Advice', line: 'What the readings suggest doing differently', glyph: 'insight'},
  {name: 'Optimise', line: 'And the position improves, measurably', glyph: 'goal'}
];

export const RECORD_CLAIM =
  'Nothing gets lost between the site, the system, the operator and the customer.';
