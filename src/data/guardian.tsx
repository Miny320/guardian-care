import type {GlyphName} from '../components/Glyph';
import type {StatusTone} from './command';

export const PILLARS: Array<{glyph: GlyphName; line: string}> = [
  {glyph: 'insight', line: 'Understand your system'},
  {glyph: 'savings', line: 'Unlock its true potential'},
  {glyph: 'retain', line: 'For a cleaner, brighter tomorrow'}
];

export const SCRIPT = ['Same home.', 'Real insights.', 'A brighter tomorrow.'];

export const PROMISE = 'We don’t recommend anything your system doesn’t need.';

export const GAP = {
  expected: 100,
  actual: 62,
  years: 12,
  line: 'Generation at 62% of the level this system was sold on. Twelve years, unnoticed.'
};

export type Finding = {
  key: string;
  priority: 'High priority' | 'Recommended' | 'Opportunity';
  tone: StatusTone;
  glyph: GlyphName;
  evidence: string;
  solution: string;
};

export const FINDINGS: Finding[] = [
  {
    key: 'surge',
    priority: 'High priority',
    tone: 'red',
    glyph: 'health',
    evidence: 'No surge protection found',
    solution: 'Protection review'
  },
  {
    key: 'voltage',
    priority: 'High priority',
    tone: 'red',
    glyph: 'grid',
    evidence: '244 V recorded, against a 235 V threshold',
    solution: 'Voltage regulation'
  },
  {
    key: 'inverter',
    priority: 'Recommended',
    tone: 'orange',
    glyph: 'inverter',
    evidence: 'Generation at 62% of expected, original inverter',
    solution: 'Monitored inverter'
  },
  {
    key: 'isolator',
    priority: 'Recommended',
    tone: 'orange',
    glyph: 'tool',
    evidence: 'AC isolator needs attention',
    solution: 'Isolator update'
  },
  {
    key: 'manufacturer',
    priority: 'Recommended',
    tone: 'amber',
    glyph: 'connect',
    evidence: 'Inverter manufacturer no longer trading',
    solution: 'Supported equipment'
  },
  {
    key: 'battery',
    priority: 'Opportunity',
    tone: 'green',
    glyph: 'storage',
    evidence: 'No battery, surplus exported daily',
    solution: 'Battery storage'
  }
];

export type Provision = {key: string; glyph: GlyphName; name: string; line: string};

export const PROVIDES: Provision[] = [
  {key: 'generation', glyph: 'generation', name: 'Generation tracking', line: 'Against what it should make'},
  {key: 'intelligence', glyph: 'insight', name: 'Energy intelligence', line: 'Made, used, bought, sold, stored'},
  {key: 'cost', glyph: 'cost', name: 'Cost tracking', line: 'What the grid still costs you'},
  {key: 'reports', glyph: 'portfolio', name: 'Weekly reporting', line: 'In plain English'},
  {key: 'alerts', glyph: 'monitoring', name: 'Performance alerts', line: 'When something changes'},
  {key: 'faults', glyph: 'tool', name: 'Fault support', line: 'Someone to call'},
  {key: 'fit', glyph: 'tariff', name: 'FIT visibility', line: 'For the rest of your term'}
];

export const PRICE = {free: '30 days free', then: '£69.99', per: '/month'};

export const NOT_SURE = {
  label: 'Not sure',
  line: 'Every question takes “not sure” for an answer. Your engineer confirms the rest.'
};
