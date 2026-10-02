import type {Answers, Step} from '../components/Assessment/types';
import {numberOf} from '../components/Assessment/types';
import type {GlyphName} from '../components/Glyph';
import type {StatusTone} from './command';

export type Goal = {
  key: string;
  glyph: GlyphName;
  label: string;
  short: string;
  tone: StatusTone;
  answer: string;
};

export const GOALS: Goal[] = [
  {
    key: 'bill',
    glyph: 'cost',
    label: 'Reduce my electricity bill',
    short: 'Pay the grid less',
    tone: 'green',
    answer:
      'Then the figure that matters is not system size. It is how many of the units you already buy could be made here instead.'
  },
  {
    key: 'generate',
    glyph: 'generation',
    label: 'Generate my own electricity',
    short: 'Make your own',
    tone: 'amber',
    answer: 'Generation is the easy half. We size the array to what your property actually uses.'
  },
  {
    key: 'battery',
    glyph: 'storage',
    label: 'Add battery storage',
    short: 'Keep the surplus',
    tone: 'purple',
    answer: 'Storage is worth what it stops you buying back. We size it to your evening import.'
  },
  {
    key: 'independent',
    glyph: 'grid',
    label: 'Reduce my reliance on the grid',
    short: 'Need less grid',
    tone: 'blue',
    answer: 'Full independence rarely pays. Importing less at your worst hours does.'
  },
  {
    key: 'ev',
    glyph: 'connect',
    label: 'Prepare for an EV',
    short: 'Charge at home',
    tone: 'orange',
    answer: 'A car changes the shape of your day. We plan for it before it arrives.'
  },
  {
    key: 'tariff',
    glyph: 'tariff',
    label: 'Use cheaper electricity tariffs',
    short: 'Buy at the right hour',
    tone: 'green',
    answer: 'Rates, storage and generation are one decision, not three.'
  },
  {
    key: 'guide',
    glyph: 'question',
    label: 'I’m not sure — help me understand my options',
    short: 'Show me where I stand',
    tone: 'ink',
    answer: 'The most common answer here. Start from your bill and see what is on the table.'
  }
];

export const GOAL_BY_KEY = Object.fromEntries(GOALS.map((goal) => [goal.key, goal])) as Record<
  string,
  Goal
>;

export const PLAN_STEPS: Step[] = [
  {
    key: 'bill',
    kind: 'choice',
    glyph: 'cost',
    title: 'What is your average monthly electricity bill?',
    options: [
      {value: 'under-75', label: 'Under £75'},
      {value: '75-125', label: '£75–£125'},
      {value: '125-175', label: '£125–£175'},
      {value: '175-250', label: '£175–£250'},
      {value: '250-plus', label: '£250+'},
      {value: 'exact', label: 'Enter exact amount', input: {suffix: '/month', placeholder: '165'}}
    ],
    why: {
      heading: 'Why we ask',
      body: 'Your bill is the figure everything else on this page is measured against.'
    }
  },
  {
    key: 'rates',
    kind: 'fields',
    glyph: 'tariff',
    title: 'What do you pay for electricity?',
    lead: 'Leave anything blank and we use a national average.',
    fields: [
      {key: 'importRate', label: 'Import rate', suffix: 'p/kWh', placeholder: '29'},
      {key: 'offPeakRate', label: 'Off-peak rate', note: 'if applicable', suffix: 'p/kWh', placeholder: '—'},
      {key: 'standingCharge', label: 'Standing charge', suffix: 'p/day', placeholder: '58'}
    ],
    why: {
      heading: 'Why this matters',
      body: (
        <>
          Panels do not reduce a bill. Not having to <b>buy at your grid rate</b> does — so the
          estimate runs on your tariff rather than an average one.
        </>
      )
    }
  },
  {
    key: 'goal',
    kind: 'choice',
    glyph: 'goal',
    title: 'What are you looking to achieve?',
    lead: 'It shapes the rest of the journey.',
    options: GOALS.map((goal) => ({value: goal.key, label: goal.label})),
    why: {
      heading: 'Why we ask',
      body: 'Reducing a bill and preparing for an electric vehicle need different system shapes. We would rather ask than assume.'
    }
  },
  {
    key: 'equipment',
    kind: 'multi',
    glyph: 'property',
    title: 'Do you have any renewable energy equipment already?',
    lead: 'Choose everything that applies.',
    options: [
      {value: 'none', label: 'Nothing installed'},
      {value: 'battery', label: 'Battery only'},
      {value: 'ev-charger', label: 'EV charger'},
      {value: 'heat-pump', label: 'Heat pump'},
      {value: 'solar-elsewhere', label: 'Existing solar elsewhere on the property'},
      {value: 'other', label: 'Other'}
    ],
    why: {
      heading: 'Why we ask',
      body: 'A heat pump or an EV charger changes both the size of the opportunity and the shape of the day it has to cover.'
    }
  },
  {
    key: 'property',
    kind: 'choice',
    glyph: 'property',
    title: 'What type of property is it?',
    options: [
      {value: 'detached', label: 'Detached'},
      {value: 'semi', label: 'Semi-detached'},
      {value: 'terraced', label: 'Terraced'},
      {value: 'bungalow', label: 'Bungalow'},
      {value: 'other', label: 'Other'}
    ],
    why: {
      heading: 'Why we ask',
      body: 'A first indication of roof area and typical consumption. The usable capacity is confirmed at assessment.'
    }
  },
  {
    key: 'roof',
    kind: 'choice',
    glyph: 'generation',
    title: 'Roughly how many panels could your roof support?',
    options: [
      {value: 'under-8', label: 'Under 8'},
      {value: '8-12', label: '8–12'},
      {value: '13-16', label: '13–16'},
      {value: '16-plus', label: '16+'},
      {value: 'unknown', label: 'I don’t know'}
    ],
    why: {
      heading: 'Not sure? That is fine.',
      body: 'We can size the system from your energy position alone. The roof is measured at assessment.'
    }
  },
  {
    key: 'storage',
    kind: 'choice',
    glyph: 'storage',
    title: 'Do you want battery storage?',
    options: [
      {value: 'yes', label: 'Yes'},
      {value: 'no', label: 'No'},
      {value: 'maybe', label: 'Maybe — explain it'}
    ],
    why: {
      heading: 'What storage actually does',
      body: (
        <>
          A battery holds the daytime surplus until production drops away. That matters most where
          the property keeps using electricity into the evening — which is <b>most</b> properties.
        </>
      )
    }
  }
];

const MONTHLY_BILL: Record<string, number> = {
  'under-75': 60,
  '75-125': 100,
  '125-175': 150,
  '175-250': 210,
  '250-plus': 300
};

const ROOF_PANELS: Record<string, number> = {
  'under-8': 7,
  '8-12': 10,
  '13-16': 14,
  '16-plus': 18
};

const KW_PER_PANEL = 0.44;

const KWH_PER_KWP = 900;

export const SELF_USE = {without: 0.42, with: 0.68};

export const DEFAULT_RATES = {importRate: 29, exportRate: 15, standingCharge: 58};

export function money(value: number | null): string {
  return value === null ? '—' : `£${Math.round(value).toLocaleString('en-GB')}`;
}

export type PlanPosition = {
  monthlyBill: number | null;
  annualSpend: number | null;
  importRate: number;
  standingCharge: number;
  offPeakRate: number | null;
  annualStanding: number;
  annualEnergy: number | null;
  annualKwh: number | null;
  goal: string | null;
  wantsBattery: boolean;
  systemKw: number | null;
  panels: number | null;
  annualGeneration: number | null;
  directKwh: number | null;
  directValue: number | null;
  batteryExtraKwh: number | null;
  batteryExtraValue: number | null;
  combinedValue: number | null;
  batteryKwh: number | null;
  equipment: string[];
};

export const GOAL_LABEL: Record<string, string> = Object.fromEntries(
  GOALS.map((goal) => [goal.key, goal.short])
);

export function readPlan(answers: Answers): PlanPosition {
  const billChoice = answers.choice.bill ?? null;
  const monthlyBill =
    billChoice === 'exact'
      ? (numberOf(answers, 'bill', 0) || null)
      : billChoice
        ? MONTHLY_BILL[billChoice]
        : null;

  const importRate = numberOf(answers, 'importRate', DEFAULT_RATES.importRate);
  const standingCharge = numberOf(answers, 'standingCharge', DEFAULT_RATES.standingCharge);
  const offPeakRaw = numberOf(answers, 'offPeakRate', 0);

  const annualSpend = monthlyBill ? Math.round(monthlyBill * 12) : null;
  const annualStanding = Math.round((standingCharge * 365) / 100);
  const annualEnergy = annualSpend ? Math.max(0, annualSpend - annualStanding) : null;
  const annualKwh = annualEnergy ? Math.round((annualEnergy / importRate) * 100) : null;

  const roofChoice = answers.choice.roof ?? null;
  const roofPanels = roofChoice && roofChoice !== 'unknown' ? ROOF_PANELS[roofChoice] : null;

  const impliedKw = annualKwh ? Math.min(6.5, Math.round((annualKwh / KWH_PER_KWP) * 10) / 10) : null;
  const systemKw = roofPanels
    ? Math.round(roofPanels * KW_PER_PANEL * 10) / 10
    : impliedKw;
  const panels = roofPanels ?? (systemKw ? Math.round(systemKw / KW_PER_PANEL) : null);

  const annualGeneration = systemKw ? Math.round((systemKw * KWH_PER_KWP) / 50) * 50 : null;

  const directKwh =
    annualGeneration && annualKwh
      ? Math.round(Math.min(annualGeneration * SELF_USE.without, annualKwh))
      : null;
  const withBatteryKwh =
    annualGeneration && annualKwh
      ? Math.round(Math.min(annualGeneration * SELF_USE.with, annualKwh))
      : null;

  const directValue = directKwh ? (directKwh * importRate) / 100 : null;
  const batteryExtraKwh =
    withBatteryKwh && directKwh ? Math.max(0, withBatteryKwh - directKwh) : null;
  const batteryExtraValue = batteryExtraKwh ? (batteryExtraKwh * importRate) / 100 : null;

  const wantsBattery = answers.choice.storage === 'yes' || answers.choice.goal === 'battery';

  const batteryKwh = batteryExtraKwh
    ? Math.max(5, Math.min(15, Math.round((batteryExtraKwh / 365) * 2.2)))
    : null;

  return {
    monthlyBill,
    annualSpend,
    importRate,
    standingCharge,
    offPeakRate: offPeakRaw > 0 ? offPeakRaw : null,
    annualStanding,
    annualEnergy,
    annualKwh,
    goal: answers.choice.goal ?? null,
    wantsBattery,
    systemKw,
    panels,
    annualGeneration,
    directKwh,
    directValue,
    batteryExtraKwh,
    batteryExtraValue,
    combinedValue:
      directValue !== null ? directValue + (batteryExtraValue ?? 0) : null,
    batteryKwh,
    equipment: answers.multi.equipment ?? []
  };
}

export const SWAP = {
  usage: 10,
  solarSupplies: 6,
  gridWithSolar: 4,
  rate: DEFAULT_RATES.importRate
};

export type StorageDay = {
  key: string;
  name: string;
  where: Array<{label: string; value: number; tone: StatusTone}>;
  later: number;
  line: string;
};

export const STORAGE_COMPARISON: StorageDay[] = [
  {
    key: 'without',
    name: 'Without a battery',
    where: [
      {label: 'Used as it was made', value: 8, tone: 'green'},
      {label: 'Exported', value: 7, tone: 'blue'}
    ],
    later: 5,
    line: 'Seven leave at midday. Five come back that evening — at the price the grid charges, not the price export paid.'
  },
  {
    key: 'with',
    name: 'With a battery',
    where: [
      {label: 'Used as it was made', value: 8, tone: 'green'},
      {label: 'Stored for later', value: 5, tone: 'purple'},
      {label: 'Exported', value: 2, tone: 'blue'}
    ],
    later: 1,
    line: 'The same fifteen. Most of the surplus simply waits until somebody is home.'
  }
];

export const STORAGE_GENERATED = STORAGE_COMPARISON[0].where.reduce(
  (total, part) => total + part.value,
  0
);

export type QuoteItem = {
  key: string;
  glyph: GlyphName;
  name: string;
  does: string;
  tone: StatusTone;
  value: (position: PlanPosition) => string;
  why: string;
};

export const QUOTE: QuoteItem[] = [
  {
    key: 'solar',
    glyph: 'generation',
    name: 'Solar panels',
    does: 'Generate it',
    tone: 'amber',
    value: (position) =>
      position.systemKw ? `${position.systemKw} kWp` : 'Sized at assessment',
    why: 'Your bill says a meaningful share of what you buy could be made where you use it.'
  },
  {
    key: 'inverter',
    glyph: 'inverter',
    name: 'Inverter',
    does: 'Make it usable',
    tone: 'green',
    value: (position) => (position.systemKw ? 'Matched to the array' : 'Matched at design'),
    why: 'Panels make DC; a house runs on AC. It is also the part that reports.'
  },
  {
    key: 'battery',
    glyph: 'storage',
    name: 'Battery storage',
    does: 'Keep it',
    tone: 'purple',
    value: (position) =>
      position.batteryKwh ? `${position.batteryKwh} kWh for review` : 'For review',
    why: 'You will generate surplus at hours you do not need it. This is what keeps it.'
  },
  {
    key: 'protection',
    glyph: 'health',
    name: 'System protection',
    does: 'Protect it',
    tone: 'orange',
    value: () => 'Included in design',
    why: 'Specified with the system, rather than sold to you after a fault.'
  },
  {
    key: 'monitoring',
    glyph: 'monitoring',
    name: 'Energy monitoring',
    does: 'See it',
    tone: 'blue',
    value: () => 'Included',
    why: 'Without it, every figure on this page stays an estimate forever.'
  },
  {
    key: 'intelligence',
    glyph: 'insight',
    name: 'Guardian Care intelligence',
    does: 'Improve it',
    tone: 'green',
    value: () => 'Included',
    why: 'So you find out whether the system did what this page estimated — and what to change if it did not.'
  }
];

export type Question = {q: string; a: string};

export const QUESTIONS: Question[] = [
  {
    q: 'How much could solar reduce my electricity bill?',
    a: 'By whatever it stops you buying: the generation you could realistically use yourself, times the rate you pay. Both come from your figures, not from a brochure.'
  },
  {
    q: 'How many panels might I need?',
    a: 'An indicative range now, from your energy position and what your roof can carry. Pitch, orientation and shading are measured before anything is specified.'
  },
  {
    q: 'Do I need a battery?',
    a: 'Only if you generate well past what the house uses at midday and then buy it back after dark. If your usage already sits in daylight hours, it has less to do.'
  },
  {
    q: 'How much storage could I need?',
    a: 'Enough to absorb a typical day’s surplus without sitting half-empty — sized from your evening import, then confirmed at assessment.'
  },
  {
    q: 'What happens when I generate more than I use?',
    a: 'It goes to the nearest place that will take it: your home, then a battery, then the grid. Exported units earn well under what the same unit costs to buy back.'
  },
  {
    q: 'Will I still need electricity from the grid?',
    a: 'Almost certainly. Complete independence is not the objective — reducing unnecessary dependence is.'
  },
  {
    q: 'What happens after installation?',
    a: 'Monitoring is connected, and the estimates on this page become readings: what you generate, use, store, export and still buy.'
  }
];

export type DashReading = {
  key: string;
  glyph: GlyphName;
  label: string;
  value: string;
  unit: string;
  tone: StatusTone;
};

export const DASHBOARD: DashReading[] = [
  {key: 'generated', glyph: 'generation', label: 'Generated', value: '18.4', unit: 'kWh', tone: 'green'},
  {key: 'free', glyph: 'consumption', label: 'Used free', value: '9.6', unit: 'kWh', tone: 'ink'},
  {key: 'stored', glyph: 'storage', label: 'Stored', value: '5.1', unit: 'kWh', tone: 'purple'},
  {key: 'exported', glyph: 'export', label: 'Exported', value: '3.7', unit: 'kWh', tone: 'blue'},
  {key: 'import', glyph: 'import', label: 'Grid import', value: '1.8', unit: 'kWh', tone: 'amber'},
  {key: 'cost', glyph: 'cost', label: 'Grid energy cost', value: '£0.52', unit: 'at 29p/kWh', tone: 'orange'}
];

export type Suggestion = {
  key: string;
  name: string;
  glyph: GlyphName;
  tone: StatusTone;
  says: string;
  review: string;
};

export const SUGGESTIONS: Suggestion[] = [
  {
    key: 'import',
    name: 'High grid import',
    glyph: 'import',
    tone: 'orange',
    says: 'Your property is purchasing more electricity than expected.',
    review: 'Solar performance, battery usage or tariff configuration.'
  },
  {
    key: 'export',
    name: 'High export',
    glyph: 'export',
    tone: 'blue',
    says: 'A significant amount of solar energy is being sent back to the grid.',
    review: 'Battery utilisation or storage capacity.'
  },
  {
    key: 'battery',
    name: 'Battery underutilised',
    glyph: 'storage',
    tone: 'purple',
    says: 'Available battery capacity may not be being used effectively.',
    review: 'Battery and tariff settings.'
  },
  {
    key: 'performance',
    name: 'Performance change',
    glyph: 'health',
    tone: 'amber',
    says: 'Generation has moved away from its expected position.',
    review: 'System performance, weather-adjusted.'
  }
];

const EXAMPLE_BILL = 165;

export const EXAMPLE = {
  monthlyBill: EXAMPLE_BILL,
  annualSpend: EXAMPLE_BILL * 12,
  importRate: DEFAULT_RATES.importRate,
  annualKwh: Math.round(
    ((EXAMPLE_BILL * 12 - (DEFAULT_RATES.standingCharge * 365) / 100) /
      DEFAULT_RATES.importRate) *
      100
  )
};

