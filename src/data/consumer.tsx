import type {Answers, Step} from '../components/Assessment/types';
import {plain, type Row, type Summary} from '../lib/deliver';
import {numberOf} from '../components/Assessment/types';
import type {GlyphName} from '../components/Glyph';
import type {StatusTone} from './command';

export const DEFAULT_RATES = {
  importRate: 29,
  exportRate: 15,
  standingCharge: 58
};

export const EXISTING_STEPS: Step[] = [
  {
    key: 'installed',
    kind: 'choice',
    glyph: 'existing',
    title: 'When was your solar system installed?',
    lead: 'Select your installation period.',
    options: [
      {value: '2010-2011', label: '2010–2011'},
      {value: '2012-2015', label: '2012–2015'},
      {value: '2016-2019', label: '2016–2019'},
      {value: 'after-2019', label: 'After 2019'},
      {value: 'unsure', label: 'I’m not sure'}
    ],
    why: {
      heading: 'Why are we asking?',
      body: (
        <>
          The installation period tells Guardian Care the age of your system and whether it may have
          been installed under the UK Feed-in Tariff scheme. For eligible FIT installations, tariff
          entitlement depends on more than the installation date — the eligibility date, installed
          capacity and applicable tariff band all matter — so this is a <b>starting point</b>, and
          the actual FIT information is confirmed later where it is available. The scheme closed to
          new applications in 2019.
        </>
      )
    }
  },
  {
    key: 'panels',
    kind: 'choice',
    glyph: 'generation',
    title: 'How many solar panels do you have?',
    options: [
      {value: '6-8', label: '6–8 panels'},
      {value: '9-12', label: '9–12 panels'},
      {value: '13-16', label: '13–16 panels'},
      {value: '17-20', label: '17–20 panels'},
      {value: '20-plus', label: '20+ panels'},
      {value: 'exact', label: 'Enter my exact number', input: {suffix: 'panels', placeholder: '14'}},
      {value: 'unsure', label: 'I’m not sure'}
    ],
    why: {
      heading: 'Why does this matter?',
      body: 'The number of panels begins the estimate of your original system size and what it should be capable of generating. Guardian Care combines it with the installation period and, where available, your original capacity and generation records.'
    }
  },
  {
    key: 'original',
    kind: 'choice',
    glyph: 'health',
    title: 'Is this your original solar system?',
    options: [
      {value: 'original', label: 'Yes — it is still the original system'},
      {value: 'panels-added', label: 'Panels have been added'},
      {value: 'inverter', label: 'The inverter has been replaced'},
      {value: 'battery-added', label: 'Battery storage has been added'},
      {value: 'several', label: 'Several parts have been upgraded'},
      {value: 'unsure', label: 'I’m not sure'}
    ],
    why: {
      heading: 'Why are we asking?',
      body: 'Solar systems change significantly over their lifetime. Knowing whether equipment has been added or replaced lets Guardian Care separate the original installation from later improvements, which gives a far more accurate picture of what you currently have.'
    }
  },
  {
    key: 'battery',
    kind: 'choice',
    glyph: 'storage',
    title: 'Do you have battery storage?',
    options: [
      {value: 'yes', label: 'Yes'},
      {value: 'no', label: 'No'},
      {value: 'considering', label: 'I’m considering one'},
      {value: 'unsure', label: 'I’m not sure'}
    ],
    why: {
      heading: 'Why battery storage matters',
      body: (
        <>
          Solar electricity is generated during daylight hours. If it is not used at the moment it is
          made, it can either charge a battery or be exported. Guardian Care wants to understand
          whether your system lets you <b>retain enough of what you generate</b> to use later.
        </>
      )
    }
  },
  {
    key: 'capacity',
    kind: 'choice',
    glyph: 'storage',
    title: 'Approximately how much storage do you have?',
    showIf: (answers) => answers.choice.battery === 'yes',
    options: [
      {value: 'under-5', label: 'Under 5 kWh'},
      {value: '5-7', label: '5–7 kWh'},
      {value: '8-10', label: '8–10 kWh'},
      {value: '10-15', label: '10–15 kWh'},
      {value: '15-plus', label: '15+ kWh'},
      {value: 'exact', label: 'Enter exact capacity', input: {suffix: 'kWh', placeholder: '9.5'}},
      {value: 'unsure', label: 'I’m not sure'}
    ],
    why: {
      heading: 'Why does capacity matter?',
      body: 'Capacity decides how much of a day’s surplus can be held back for the evening. It is the difference between a battery that absorbs your whole midday surplus and one that fills by lunchtime and exports the rest.'
    }
  },
  {
    key: 'surplus',
    kind: 'choice',
    glyph: 'export',
    title: 'What happens to your excess solar?',
    lead: 'Choose the answer that best describes your system.',
    options: [
      {value: 'battery', label: 'It goes into my battery'},
      {value: 'grid', label: 'It goes back to the grid'},
      {value: 'split', label: 'Some to my battery, some exported'},
      {value: 'unknown', label: 'I don’t know'}
    ],
    why: {
      heading: 'Guardian Care explains',
      body: (
        <>
          Generating electricity is valuable. But Guardian Care also wants to know what happens
          <b> after</b> it is generated. If your home cannot use it immediately and your battery
          cannot store it, the surplus is normally exported — and the opportunity is in understanding
          whether your setup makes sensible use of that generation before you have to buy electricity
          back later.
        </>
      )
    }
  },
  {
    key: 'bill',
    kind: 'choice',
    glyph: 'cost',
    title: 'Approximately what is your electricity bill?',
    lead: 'What do you normally pay each month?',
    options: [
      {value: 'under-75', label: 'Under £75'},
      {value: '75-125', label: '£75–£125'},
      {value: '125-175', label: '£125–£175'},
      {value: '175-250', label: '£175–£250'},
      {value: '250-plus', label: '£250+'},
      {value: 'exact', label: 'Enter my approximate bill', input: {suffix: '/month', placeholder: '145'}}
    ],
    why: {
      heading: 'Why do we ask?',
      body: 'Your bill is an initial indication of how much grid electricity the property still relies on. It is an estimate at this stage — Guardian Care sharpens it once actual rates and monitoring data are available.'
    }
  },
  {
    key: 'rates',
    kind: 'fields',
    glyph: 'tariff',
    title: 'What do you pay for grid electricity?',
    lead: 'Most people do not have these to hand, and the check does not need them. This is what it will assume unless you say otherwise.',
    estimate: {
      assumed: [
        {label: 'Import electricity', value: `${DEFAULT_RATES.importRate}p/kWh`},
        {label: 'Standing charge', value: `${DEFAULT_RATES.standingCharge}p/day`},
        {label: 'Export rate', value: `${DEFAULT_RATES.exportRate}p/kWh`}
      ],
      source:
        'UK averages for a standard variable tariff. Each one is replaced by your own figure as soon as supplier and monitoring data reach the platform.',
      open: 'I know my exact rates'
    },
    fields: [
      {key: 'importRate', label: 'Import electricity rate', suffix: 'p/kWh', placeholder: '29'},
      {key: 'offPeakRate', label: 'Off-peak rate', note: 'if applicable', suffix: 'p/kWh', placeholder: '—'},
      {key: 'standingCharge', label: 'Standing charge', suffix: 'p/day', placeholder: '58'},
      {key: 'exportRate', label: 'Export rate', note: 'if known', suffix: 'p/kWh', placeholder: '15'},
      {key: 'fitRate', label: 'FIT generation rate', note: 'if applicable', suffix: 'p/kWh', placeholder: '—'}
    ],
    why: {
      heading: 'Why do we ask?',
      body: (
        <>
          Because 1 kWh does not have the same financial value in every situation. Guardian Care
          compares what electricity <b>costs you to buy</b> against what it is <b>worth when
          exported</b>, and against how much of your own generation you could use yourself.
        </>
      )
    }
  }
];

const KW_PER_PANEL: Record<string, number> = {
  '2010-2011': 0.19,
  '2012-2015': 0.25,
  '2016-2019': 0.3,
  'after-2019': 0.4,
  unsure: 0.28
};

const ERA_YEAR: Record<string, number> = {
  '2010-2011': 2011,
  '2012-2015': 2013,
  '2016-2019': 2017,
  'after-2019': 2021,
  unsure: 2015
};

const PANEL_COUNT: Record<string, number> = {
  '6-8': 7,
  '9-12': 11,
  '13-16': 14,
  '17-20': 18,
  '20-plus': 22,
  unsure: 12
};

const MONTHLY_BILL: Record<string, number> = {
  'under-75': 60,
  '75-125': 100,
  '125-175': 145,
  '175-250': 210,
  '250-plus': 300
};

export const ERA_LABEL: Record<string, string> = {
  '2010-2011': '2010–2011',
  '2012-2015': '2012–2015',
  '2016-2019': '2016–2019',
  'after-2019': 'After 2019',
  unsure: 'Not known'
};

export const ASSESSMENT_YEAR = 2026;

const KWH_PER_KWP = 970;

export type ExistingPosition = {
  era: string | null;
  installYear: number | null;
  ageYears: number | null;
  panels: number | null;
  systemKw: number | null;
  annualKwh: number | null;
  hasBattery: boolean;
  batteryKwh: number | null;
  potentialFit: boolean;
  monthlyBill: number | null;
  annualSpend: number | null;
  importRate: number;
  exportRate: number;
  standingCharge: number;
  fitRate: number | null;
  surplusKnown: boolean;
  exporting: boolean;
};

export function readPosition(answers: Answers): ExistingPosition {
  const era = answers.choice.installed ?? null;
  const installYear = era ? ERA_YEAR[era] : null;

  const panelChoice = answers.choice.panels ?? null;
  const panels =
    panelChoice === 'exact'
      ? (numberOf(answers, 'panels', 0) || null)
      : panelChoice
        ? PANEL_COUNT[panelChoice]
        : null;

  const perPanel = era ? KW_PER_PANEL[era] : KW_PER_PANEL.unsure;
  const systemKw = panels ? Math.round(panels * perPanel * 10) / 10 : null;

  const hasBattery =
    answers.choice.battery === 'yes' || answers.choice.original === 'battery-added';

  const capacityChoice = answers.choice.capacity ?? null;
  const capacityBand: Record<string, number> = {
    'under-5': 4,
    '5-7': 6,
    '8-10': 9,
    '10-15': 12.5,
    '15-plus': 16,
    unsure: 0
  };
  const batteryKwh =
    capacityChoice === 'exact'
      ? (numberOf(answers, 'capacity', 0) || null)
      : capacityChoice
        ? capacityBand[capacityChoice] || null
        : null;

  const billChoice = answers.choice.bill ?? null;
  const monthlyBill =
    billChoice === 'exact'
      ? (numberOf(answers, 'bill', 0) || null)
      : billChoice
        ? MONTHLY_BILL[billChoice]
        : null;

  const fitRateRaw = numberOf(answers, 'fitRate', 0);

  return {
    era,
    installYear,
    ageYears: installYear ? ASSESSMENT_YEAR - installYear : null,
    panels,
    systemKw,
    annualKwh: systemKw ? Math.round((systemKw * KWH_PER_KWP) / 100) * 100 : null,
    hasBattery,
    batteryKwh,
    potentialFit: Boolean(installYear && installYear < 2019),
    monthlyBill,
    annualSpend: monthlyBill ? Math.round(monthlyBill * 12) : null,
    importRate: numberOf(answers, 'importRate', DEFAULT_RATES.importRate),
    exportRate: numberOf(answers, 'exportRate', DEFAULT_RATES.exportRate),
    standingCharge: numberOf(answers, 'standingCharge', DEFAULT_RATES.standingCharge),
    fitRate: fitRateRaw > 0 ? fitRateRaw : null,
    surplusKnown: Boolean(answers.choice.surplus && answers.choice.surplus !== 'unknown'),
    exporting: answers.choice.surplus === 'grid' || answers.choice.surplus === 'split'
  };
}

export type SummaryRow = {key: string; label: string; value: string; note: string};

export function summaryOf(position: ExistingPosition): SummaryRow[] {
  const {hasBattery, exporting} = position;

  return [
    {
      key: 'age',
      label: 'System age',
      value: position.ageYears === null ? 'To be confirmed' : `${position.ageYears} years`,
      note: position.era ? `Installed ${ERA_LABEL[position.era]}` : 'Installation date not given'
    },
    {
      key: 'generation',
      label: 'Estimated generation',
      value:
        position.annualKwh === null
          ? 'To be confirmed'
          : `≈ ${position.annualKwh.toLocaleString('en-GB')} kWh / yr`,
      note:
        position.systemKw === null ? 'Needs a panel count' : `From a ${position.systemKw} kWp system`
    },
    {
      key: 'equipment',
      label: 'Current equipment',
      value: position.panels === null ? 'To be confirmed' : `${position.panels} panels · inverter`,
      note: hasBattery ? 'Plus battery storage' : 'No battery recorded'
    },
    {
      key: 'battery',
      label: 'Battery position',
      value: hasBattery
        ? position.batteryKwh
          ? `${position.batteryKwh} kWh battery`
          : 'Battery fitted'
        : 'No storage',
      note: hasBattery
        ? exporting
          ? 'Surplus is still being exported'
          : 'Holding surplus for later'
        : 'Surplus is exported as it is made'
    },
    {
      key: 'grid',
      label: 'Grid dependency',
      value: hasBattery ? (exporting ? 'Moderate' : 'Lower') : 'Higher',
      note: hasBattery ? 'Battery covers part of the evening' : 'Evenings are met from the grid'
    },
    {
      key: 'cost',
      label: 'Electricity costs',
      value:
        position.monthlyBill === null ? 'To be confirmed' : `≈ £${position.monthlyBill} / month`,
      note: `Grid rate ${position.importRate}p/kWh`
    },
    {
      key: 'fit',
      label: 'FIT or export position',
      value: position.potentialFit ? 'FIT likely' : 'Export payments',
      note: 'Rate to be confirmed'
    }
  ];
}

export type Observation = {headline: string; body: string; next: string};

export function observe(position: ExistingPosition): Observation {
  const buying = position.monthlyBill !== null && position.monthlyBill > 0;

  if (!position.hasBattery) {
    return {
      headline: 'Your system appears to generate without storage',
      body: buying
        ? 'Surplus that is not used in the home as it is made is exported. Your bill suggests the property still buys electricity from the grid — most likely in the evening, at a rate well above what those exported units earned.'
        : 'Surplus that is not used in the home as it is made is exported, rather than being held back for later in the day.',
      next: 'Measure when your solar is produced, how much of it your home uses, and how much leaves and re-enters through the grid. Until those are measured, whether storage would pay here is a guess.'
    };
  }

  if (position.exporting) {
    return {
      headline: 'You have storage, and surplus is still leaving the property',
      body: 'A battery that exports while it still has room is usually a timing question rather than a hardware one — charge settings made for a tariff that has since changed, or reserve the system does not need.',
      next: 'Measure when your battery charges, when it empties, and how that lines up with the hours your home actually uses electricity.'
    };
  }

  return {
    headline: 'You have generation and storage. The question is timing',
    body: 'On paper this is the complete setup. Whether it delivers depends on the battery filling from surplus rather than from the grid, and emptying into the hours you are at home.',
    next: 'Monitor generation, storage and grid import across a full day, so the system is judged on what it does rather than on what it contains.'
  };
}

export function consumerSummary(position: ExistingPosition): Summary {
  const finding = observe(position);
  const rows: Row[] = summaryOf(position).map((row) => [row.label, row.value, row.note]);

  const size = position.systemKw === null ? '' : ` (~${position.systemKw} kWp)`;
  const yearly =
    position.annualKwh === null
      ? '. '
      : ` should generate around ${position.annualKwh.toLocaleString('en-GB')} kWh a year. `;

  const sms = plain(
    `Guardian Care: your ${position.panels ?? 'solar'} panel system${size}${yearly}` +
    `${position.hasBattery ? 'You have storage. ' : 'No battery recorded. '}` +
    `Grid electricity costs ${position.importRate}p/kWh; exported units earn ${position.exportRate}p. ` +
      'Next: measure when you generate against when you actually use it.'
  );

  return {
    subject: 'Your Guardian Care system summary',
    intro:
      'This is the initial position built from your answers. Every figure in it is calculated rather than measured — connecting monitoring is the step that turns them into readings.',
    rows,
    notes: [`${finding.headline}. ${finding.body}`],
    action: finding.next,
    sms
  };
}

export const HOME = {
  installed: 2014,
  era: '2012-2015',
  panels: 14,
  batteryKwh: 5.2,
  batteryAdded: 2022,
  importRate: 30,
  exportRate: 15,
  monthlyBill: 70
};

const HOME_KW = Math.round(HOME.panels * KW_PER_PANEL[HOME.era] * 10) / 10;

export const HOME_POSITION: ExistingPosition = {
  era: HOME.era,
  installYear: HOME.installed,
  ageYears: ASSESSMENT_YEAR - HOME.installed,
  panels: HOME.panels,
  systemKw: HOME_KW,
  annualKwh: Math.round((HOME_KW * KWH_PER_KWP) / 100) * 100,
  hasBattery: true,
  batteryKwh: HOME.batteryKwh,
  potentialFit: true,
  monthlyBill: HOME.monthlyBill,
  annualSpend: HOME.monthlyBill * 12,
  importRate: HOME.importRate,
  exportRate: HOME.exportRate,
  standingCharge: DEFAULT_RATES.standingCharge,
  fitRate: null,
  surplusKnown: true,
  exporting: true
};

export const DAY = {
  generated: 18,
  used: 9,
  stored: 5,
  exported: 4,
  imported: 2
};

export const HOME_USE = DAY.used + DAY.stored + DAY.imported;

export const GRID_COST = (DAY.imported * HOME.importRate) / 100;

export function pounds(value: number): string {
  return `£${value.toFixed(2)}`;
}

export type Part = {name: string; says: string; glyph: GlyphName};

export const PARTS: Part[] = [
  {name: 'Solar panels', says: 'Generating, quietly, on the roof', glyph: 'solarRoof'},
  {name: 'An inverter', says: 'A number on a screen in the loft', glyph: 'inverter'},
  {name: 'Battery storage', says: 'Its own app and its own login', glyph: 'storage'},
  {name: 'A generation meter', says: 'Read now and then for FIT', glyph: 'monitoring'},
  {name: 'An electricity supplier', says: 'A bill, weeks after the fact', glyph: 'cost'},
  {name: 'FIT or export payments', says: 'A statement a few times a year', glyph: 'fit'},
  {name: 'Monitoring apps', says: 'Graphs you are left to interpret', glyph: 'portfolio'}
];

export const JOINED: Array<{reading: string; tone: StatusTone}> = [
  {reading: `${DAY.generated.toFixed(1)} kWh made`, tone: 'amber'},
  {reading: 'No faults', tone: 'green'},
  {reading: `${DAY.stored.toFixed(1)} kWh held`, tone: 'purple'},
  {reading: 'Read for you', tone: 'ink'},
  {reading: `${pounds(GRID_COST)} bought`, tone: 'orange'},
  {reading: `${DAY.exported.toFixed(1)} kWh sent`, tone: 'blue'},
  {reading: 'One screen', tone: 'green'}
];

export const PROFILE_FIELDS: Array<[string, string]> = [
  ['Installation date', String(HOME.installed)],
  ['Number of panels', String(HOME.panels)],
  ['Original or upgraded', `Battery added ${HOME.batteryAdded}`],
  ['Inverter', 'String inverter'],
  ['Battery storage', `${HOME.batteryKwh} kWh`],
  ['Existing monitoring', 'Manufacturer app'],
  ['Generation information', 'FIT meter readings'],
  ['Electricity tariff', 'Standard variable'],
  ['Import rate', `${HOME.importRate}p/kWh`],
  ['Export rate', `${HOME.exportRate}p/kWh`],
  ['FIT information', 'Eligible · to confirm']
];

export type Tracked = {
  key: string;
  name: string;
  line: string;
  glyph: GlyphName;
  tone: StatusTone;
};

export const TRACKED: Tracked[] = [
  {
    key: 'generation',
    name: 'Solar generation',
    line: 'How much electricity your system is producing.',
    glyph: 'generation',
    tone: 'amber'
  },
  {
    key: 'used',
    name: 'Free electricity used',
    line: 'How much solar electricity is used directly within your property.',
    glyph: 'consumption',
    tone: 'green'
  },
  {
    key: 'stored',
    name: 'Battery storage',
    line: 'How much energy is being stored for later use.',
    glyph: 'storage',
    tone: 'purple'
  },
  {
    key: 'exported',
    name: 'Grid export',
    line: 'How much surplus electricity is leaving the property.',
    glyph: 'export',
    tone: 'blue'
  },
  {
    key: 'imported',
    name: 'Grid import',
    line: 'How much electricity you are still purchasing.',
    glyph: 'import',
    tone: 'orange'
  },
  {
    key: 'cost',
    name: 'Grid cost',
    line: 'What that imported electricity is costing, based on your tariff.',
    glyph: 'cost',
    tone: 'ink'
  }
];

export type Opportunity = {
  key: string;
  name: string;
  seen: string;
  suggest: string;
  tone: StatusTone;
  glyph: GlyphName;
  identified: string;
  matters: string;
  recommend: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    key: 'export',
    name: 'High export',
    seen: 'You may be sending significant surplus solar electricity back to the grid.',
    suggest: 'Review battery storage or existing battery capacity.',
    tone: 'blue',
    glyph: 'export',
    identified: `${DAY.exported} kWh of today’s ${DAY.generated} kWh left your home around midday, after your battery had already filled.`,
    matters: `Exported electricity earns around ${HOME.exportRate}p a unit. This evening you bought ${DAY.imported} kWh back at ${HOME.importRate}p — twice the price.`,
    recommend:
      'Review your battery settings and capacity, so more of the midday surplus is kept for the evening.'
  },
  {
    key: 'import',
    name: 'High grid consumption',
    seen: 'You may still be buying more electricity from the grid than expected.',
    suggest: 'Review generation, battery usage or tariff setup.',
    tone: 'orange',
    glyph: 'import',
    identified:
      'Your grid import this week is around a third above your usual level for the time of year, mostly between 6pm and 9pm.',
    matters: `At ${HOME.importRate}p/kWh that is money spent even though your panels are generating normally.`,
    recommend:
      'Review your generation, how your battery is used in the evening, and whether your tariff still suits how you live.'
  },
  {
    key: 'battery',
    name: 'Battery underused',
    seen: 'Your battery may not be storing or supplying as much energy as expected.',
    suggest: 'Review battery settings or energy strategy.',
    tone: 'purple',
    glyph: 'storage',
    identified:
      'On sunny days this week your battery reached only around 60% charge before surplus began leaving the property.',
    matters:
      'Storage you have already paid for is sitting partly empty, while cheap export goes out and full-price electricity comes back in.',
    recommend:
      'Review the battery’s charge settings and your energy strategy. This is usually a settings change, not a hardware fault.'
  },
  {
    key: 'generation',
    name: 'Generation change',
    seen: 'Your system may be generating differently from its expected position.',
    suggest: 'System performance review.',
    tone: 'amber',
    glyph: 'health',
    identified:
      'Over the last three weeks your system generated around 12% less than expected for the sunshine it received.',
    matters:
      'Less generation means less free electricity — and a small fault quietly costs more the longer it goes unnoticed.',
    recommend:
      'A system performance review, covering the inverter, any new shading and the condition of the panels.'
  }
];

export const AIMS: Array<{line: string; glyph: GlyphName}> = [
  {line: 'Use more of the electricity you generate', glyph: 'consumption'},
  {line: 'Reduce unnecessary grid consumption', glyph: 'import'},
  {line: 'Understand what your battery is doing', glyph: 'storage'},
  {line: 'Understand what you are exporting', glyph: 'export'},
  {line: 'See what electricity is costing you', glyph: 'cost'},
  {line: 'Identify changes in system performance', glyph: 'health'}
];

export const AIM_SUM = 'Take better advantage of the solar system you already own';

export const NEXT_STEPS: Array<{index: string; name: string; line: string}> = [
  {index: '01', name: 'Your system summary', line: 'Built from your answers. You are here.'},
  {
    index: '02',
    name: 'Connect monitoring',
    line: 'A CT clamp or compatible monitoring, where suitable.'
  },
  {index: '03', name: 'Your Guardian Care login', line: 'Your dashboard, alerts and recommendations.'}
];
