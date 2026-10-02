export type StatusTone = 'green' | 'blue' | 'amber' | 'orange' | 'red' | 'purple' | 'ink';

export const TONE_TEXT: Record<StatusTone, string> = {
  green: 'text-green',
  blue: 'text-blue',
  amber: 'text-amber',
  orange: 'text-orange',
  red: 'text-red',
  purple: 'text-purple',
  ink: 'text-ink'
};

export const TONE_BG: Record<StatusTone, string> = {
  green: 'bg-green',
  blue: 'bg-blue',
  amber: 'bg-amber',
  orange: 'bg-orange',
  red: 'bg-red',
  purple: 'bg-purple',
  ink: 'bg-ink'
};

export const TONE_VAR: Record<StatusTone, string> = {
  green: 'var(--color-green)',
  blue: 'var(--color-blue)',
  amber: 'var(--color-amber)',
  orange: 'var(--color-orange)',
  red: 'var(--color-red)',
  purple: 'var(--color-purple)',
  ink: 'var(--color-ink)'
};

export type StatusGlyph = 'tick' | 'eye' | 'bang' | 'spanner' | 'rise' | 'alert';

export type Kpi = {value: string; label: string; tone: StatusTone};

export const CC_KPIS: Kpi[] = [
  {value: '1,245', label: 'Customers', tone: 'ink'},
  {value: '1,036', label: 'Monitored', tone: 'green'},
  {value: '61', label: 'Offline', tone: 'amber'},
  {value: '42', label: 'Fault alerts', tone: 'red'},
  {value: '21', label: 'Engineer reviews', tone: 'orange'},
  {value: '34', label: 'Installation jobs', tone: 'blue'}
];

export type AttentionRow = {
  name: string;
  location: string;
  status: string;
  tone: StatusTone;
  glyph: StatusGlyph;
  summary: string;
  fields: Array<[string, string]>;
  recommendation: string;
  actions: string[];
};

export const CC_ROWS: AttentionRow[] = [
  {
    name: 'J. Whitmore',
    location: 'Chelmsford, CM2',
    status: 'Opportunity',
    tone: 'purple',
    glyph: 'rise',
    summary: 'Exported 312 kWh last month while importing evenings',
    fields: [
      ['Status', 'Opportunity'],
      ['Detected', 'High export, no storage'],
      ['Est. value', '£4,200 install']
    ],
    recommendation:
      'Their system is healthy — this is not a fault conversation. Lead on the pattern: they are selling surplus at export rates each afternoon and buying it back at retail each evening.',
    actions: ['Contact customer', 'Create opportunity', 'Send advice', 'Assign staff']
  },
  {
    name: 'S. Aroon',
    location: 'Grays, RM15',
    status: 'Technical',
    tone: 'orange',
    glyph: 'spanner',
    summary: 'Inverter offline 06:14 — no generation recorded today',
    fields: [
      ['Status', 'Technical'],
      ['Detected', 'Inverter not reporting'],
      ['Duration', '6 hours']
    ],
    recommendation:
      'Confirm it is not a monitoring dropout before contacting. If generation is genuinely zero, this is same-day — the customer is losing yield every hour it stands.',
    actions: ['Book engineer', 'Contact customer', 'Escalate', 'Resolve']
  },
  {
    name: 'M. Haddad',
    location: 'Seaton, EX12',
    status: 'Review',
    tone: 'amber',
    glyph: 'bang',
    summary: 'Battery reaching 34% overnight against a 90% norm',
    fields: [
      ['Status', 'Review'],
      ['Detected', 'Storage underutilised'],
      ['Recoverable', '~2.1 kWh/day']
    ],
    recommendation:
      'Most cases here are charge windows misaligned to tariff periods rather than hardware. A call usually resolves it without a visit.',
    actions: ['Contact customer', 'Request information', 'Send advice', 'Book engineer']
  },
  {
    name: 'R. Delgado',
    location: 'Axmouth, EX12',
    status: 'Urgent',
    tone: 'red',
    glyph: 'alert',
    summary: 'Generation 41% below own baseline for 12 consecutive days',
    fields: [
      ['Status', 'Urgent'],
      ['Detected', 'Sustained underperformance'],
      ['Tariff exposure', 'High']
    ],
    recommendation:
      'Twelve days is past the point where this reads as weather. On their rate the shortfall is material — lead with the figure, not the diagnosis.',
    actions: ['Book engineer', 'Contact customer', 'Escalate', 'Assign staff']
  }
];

export type StatusDefinition = {
  name: string;
  tone: StatusTone;
  glyph: StatusGlyph;
  description: string;
};

export const STATUSES: StatusDefinition[] = [
  {name: 'Healthy', tone: 'green', glyph: 'tick', description: 'Operating to profile. No action required.'},
  {
    name: 'Monitor',
    tone: 'blue',
    glyph: 'eye',
    description: 'Something is being observed but has not yet crossed into action.'
  },
  {name: 'Review', tone: 'amber', glyph: 'bang', description: 'The customer should be contacted.'},
  {name: 'Technical', tone: 'orange', glyph: 'spanner', description: 'Engineer involvement required.'},
  {
    name: 'Opportunity',
    tone: 'purple',
    glyph: 'rise',
    description: 'A relevant product or service opportunity has been detected.'
  },
  {
    name: 'Urgent',
    tone: 'red',
    glyph: 'alert',
    description: 'A significant system problem requiring same-day action.'
  }
];

export type PortfolioBand = {label: string; tone: StatusTone; count: number; hollow?: boolean};

const CC_TOTAL = 1245;

const CC_ATTENTION_BANDS: PortfolioBand[] = [
  {label: 'Offline', tone: 'amber', count: 61},
  {label: 'Fault alerts', tone: 'red', count: 42},
  {label: 'Engineer reviews', tone: 'orange', count: 21},
  {label: 'Installation jobs', tone: 'blue', count: 34},
  {label: 'Awaiting onboarding', tone: 'ink', count: 51, hollow: true}
];

export const CC_MIX: PortfolioBand[] = [
  {
    label: 'Healthy',
    tone: 'green',
    count: CC_ATTENTION_BANDS.reduce((rest, band) => rest - band.count, CC_TOTAL)
  },
  ...CC_ATTENTION_BANDS
];

export const CC_CUSTOMERS = CC_TOTAL;

export const CC_ATTENTION = CC_ATTENTION_BANDS.filter((band) => !band.hollow).reduce(
  (total, band) => total + band.count,
  0
);
