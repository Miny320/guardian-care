import {useLayoutEffect, useRef, useState, type ComponentType, type ReactNode} from 'react';
import Glyph, {type GlyphName} from '../../../components/Glyph';
import {PRIMARY} from '../../../components/kit';
import Modal from '../../../components/Modal';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import type {Country} from '../../../data/countries';
import {useCountry} from '../../../lib/country';
import {cn} from '../../../lib/cn';
import Business from '../../Business/Business';
import Consumer from '../../Consumer/Consumer';
import Plan from '../../Plan/Plan';

type View = {
  key: string;
  tab: string;
  action: string;
  journey: ComponentType<{embedded?: boolean}>;
  Screen: ComponentType<{country: Country}>;
};

const VIEWS: View[] = [
  {key: 'existing', tab: 'Already have solar', action: 'Check my solar', journey: Consumer, Screen: OwnerScreen},
  {key: 'plan', tab: 'Looking to reduce costs', action: 'Get my free plan', journey: Plan, Screen: PlanScreen},
  {key: 'business', tab: 'Solar companies', action: 'See where to start', journey: Business, Screen: BusinessScreen}
];

export default function LiveDashboard() {
  const country = useCountry();
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  const view = VIEWS[at];
  const Journey = view.journey;

  return (
    <Section id="dashboard" className="py-24 min-[760px]:py-32">
      <Wrap>
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 className="text-balance font-display text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[0.94] tracking-[-0.02em] text-ink">
            Real-Time Visibility. <span className="text-brand-gradient">AI-Driven Intelligence.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Choose a journey"
            className="grid w-full grid-cols-1 gap-1 rounded-frame bg-panel p-1.5 ring-1 ring-line-2 min-[620px]:inline-flex min-[620px]:w-auto min-[620px]:rounded-pill"
          >
            {VIEWS.map((item, index) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={`dash-tab-${item.key}`}
                aria-selected={index === at}
                aria-controls="dash-panel"
                onClick={() => setAt(index)}
                className={cn(
                  'rounded-pill px-5 py-2.5 text-[14px] font-semibold transition duration-200',
                  index === at ? 'bg-green text-bg' : 'text-muted hover:text-ink'
                )}
              >
                {item.tab}
              </button>
            ))}
          </div>
        </Reveal>

        <div id="dash-panel" role="tabpanel" aria-labelledby={`dash-tab-${view.key}`} className="mt-10">
          <Screenshot key={view.key} label={`Example Guardian Care dashboard: ${view.tab}`}>
            <view.Screen country={country} />
          </Screenshot>

          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={PRIMARY}>
              {view.action} →
            </button>
          </div>
        </div>
      </Wrap>

      {open ? (
        <Modal label={view.tab} onClose={() => setOpen(false)}>
          <Journey embedded />
        </Modal>
      ) : null}
    </Section>
  );
}

// Each screen is drawn at a real desktop size and shrunk to fit, so it reads as a product
// screenshot on any device rather than reflowing into a different layout.
const SCREEN_W = 1440;
const SCREEN_H = 900;

function Screenshot({label, children}: {label: string; children: ReactNode}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setScale(el.clientWidth / SCREEN_W);
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      className="animate-fadeup relative overflow-hidden rounded-frame shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-line-2"
      style={{height: SCREEN_H * scale + 34}}
    >
      <div className="flex h-[34px] items-center gap-3 border-b border-line-2 bg-bg-2 px-4" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green/70" />
        </span>
        <span className="mono flex-1 truncate text-center text-[11px] text-faint">app.guardiancare · dashboard</span>
        <span className="mono rounded-pill bg-amber/15 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[.1em] text-amber">
          Example
        </span>
      </div>
      <div aria-hidden="true" className="origin-top-left" style={{width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})`}}>
        {children}
      </div>
    </div>
  );
}

// ---- The Guardian Care app, in the style of its existing journey screens -----------------------
// Deep green chrome, a numbered journey across the top, a sky panel on the left, the stage's work
// in the middle and a "why" panel on the right, with the customer and stage along the bottom.

const APP = {
  bar: '#0b2a22',
  bg: '#0e221d',
  panel: '#12302a',
  panel2: '#173a32',
  line: 'rgba(120, 200, 160, 0.16)',
  accent: '#3ccf7a',
  text: '#eaf3ef',
  muted: '#a9bdb5',
  faint: '#7f968e'
};

const SANS = {fontFamily: "'Manrope', sans-serif"};

// Glyph draws in the current text colour, so colour it through a wrapper.
function Icon({name, className, color}: {name: GlyphName; className?: string; color: string}) {
  return (
    <span className="inline-flex" style={{color}}>
      <Glyph name={name} className={className} />
    </span>
  );
}


// The customer shown along the bottom of each screen, placed in the visitor's own country.
const PLACE: Record<string, string> = {uk: '1 Test Street, London', us: '1 Test Street, Austin', au: '1 Test Street, Sydney', th: '1 Test Road, Bangkok'};

function App({
  journey,
  steps,
  current,
  who,
  where,
  stage,
  status,
  photo,
  why,
  children
}: {
  journey: string;
  steps: string[];
  current: number;
  who: string;
  where: string;
  stage: string;
  status: string;
  photo: string;
  why: {title: string; text: string; items: Array<{glyph: GlyphName; title: string; text: string}>; note?: string};
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col" style={{...SANS, background: APP.bg, color: APP.text}}>
      {/* Top bar: logo, journey steps, strapline */}
      <div className="flex h-[124px] shrink-0" style={{background: APP.bar}}>
        <div className="flex w-[284px] items-center gap-3 bg-white px-8">
          <img src="/assets/logo-mark-day.png" alt="" className="h-[86px] w-[92px] object-contain" />
          <div className="leading-tight tracking-[.3em] text-[#2c3e4f]">
            <div className="text-[14px] font-medium">GUARDIAN</div>
            <div className="text-[14px] font-medium">CARE</div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="text-[12px] font-bold uppercase tracking-[.2em]">{journey}</div>
          <ol className="mt-3 flex w-full justify-center">
            {steps.map((step, index) => {
              const done = index < current;
              const on = index === current;
              return (
                <li key={step} className="relative flex w-[72px] flex-col items-center text-center">
                  {index > 0 ? (
                    <span
                      className="absolute right-1/2 top-[13px] h-[2px] w-full"
                      style={{background: index <= current ? APP.accent : APP.line}}
                    />
                  ) : null}
                  <span
                    className="relative grid h-[28px] w-[28px] place-items-center rounded-full text-[12px] font-bold"
                    style={
                      done
                        ? {background: APP.accent, color: APP.bar}
                        : on
                          ? {background: APP.accent, color: APP.bar, boxShadow: `0 0 0 4px rgba(60,207,122,0.25)`}
                          : {background: APP.panel, color: APP.muted, boxShadow: `inset 0 0 0 1.5px ${APP.faint}`}
                    }
                  >
                    {done ? '✓' : index + 1}
                  </span>
                  <span
                    className="mt-2 px-1 text-[11px] leading-[1.15]"
                    style={{color: on || done ? APP.text : APP.muted, fontWeight: on ? 700 : 500}}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex items-center gap-4 border-l px-8" style={{borderColor: APP.line}}>
          <Icon name="retain" className="h-9 w-9" color={APP.accent} />
          <div className="text-[14px] leading-[1.3]">
            Homes.
            <br />
            People.
            <br />
            <span className="font-bold">A Cleaner Tomorrow.</span>
          </div>
          <span className="ml-3 grid h-11 w-11 place-items-center rounded-full ring-2 ring-white/80">
            <Glyph name="existing" className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sky panel: a sunny street of solar homes, shaded at the top so the handwriting reads. */}
        <div className="relative w-[350px] shrink-0 overflow-hidden bg-[#2f6aa5]">
          <img src="/assets/photos/dashboard-sky.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_45%]" />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{background: 'linear-gradient(180deg, rgba(10,40,80,0.45) 0%, rgba(10,40,80,0.15) 32%, transparent 55%)'}}
          />
          <div className="relative px-7 pt-10 text-white" style={{fontFamily: "'Caveat', cursive"}}>
            <div className="text-[36px] font-bold leading-[1.2] [text-shadow:0_2px_10px_rgba(0,0,0,0.25)]">
              Same home.
              <br />
              Real insights.
              <br />A brighter tomorrow.
            </div>
            <span className="mt-2 block h-[3px] w-[140px] rounded-full" style={{background: APP.accent}} />
          </div>
        </div>

        {/* Stage content */}
        <div className="min-w-0 flex-1 overflow-hidden px-7 pt-7">{children}</div>

        {/* Why panel */}
        <div className="w-[380px] shrink-0 py-6 pr-6">
          <div className="h-full overflow-hidden rounded-[16px] p-5" style={{background: APP.panel, boxShadow: `inset 0 0 0 1px ${APP.line}`}}>
            <img src={photo} alt="" className="h-[200px] w-full rounded-[10px] object-cover" />
            <div className="mt-5 text-[22px] font-bold leading-tight">{why.title}</div>
            <p className="mt-2.5 text-[14.5px] leading-[1.5]" style={{color: APP.muted}}>
              {why.text}
            </p>
            <ul className="mt-4 space-y-3.5">
              {why.items.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{background: APP.panel2}}>
                    <Icon name={item.glyph} className="h-5 w-5" color={APP.accent} />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold">{item.title}</span>
                    <span className="block text-[13.5px] leading-[1.4]" style={{color: APP.muted}}>
                      {item.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {why.note ? (
              <div className="mt-4 rounded-[10px] px-4 py-3 text-[13px] leading-[1.45]" style={{background: '#163050', color: APP.text}}>
                {why.note}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Customer and stage */}
      <div className="flex h-[76px] shrink-0 items-center border-t px-8" style={{background: APP.bar, borderColor: APP.line}}>
        <img src="/assets/logo-mark.png" alt="" className="h-10 w-10 object-contain opacity-80" />
        <span className="mx-6 h-10 w-px" style={{background: APP.line}} />
        <span className="grid h-11 w-11 place-items-center rounded-full" style={{background: APP.panel2}}>
          <Icon name="property" className="h-5 w-5" color={APP.accent} />
        </span>
        <span className="ml-3">
          <span className="block text-[15px] font-bold">{who}</span>
          <span className="block text-[13px]" style={{color: APP.muted}}>
            {where}
          </span>
        </span>
        <span className="ml-auto border-l pl-7 text-right" style={{borderColor: APP.line}}>
          <span className="block text-[15px] font-bold">{stage}</span>
          <span className="block text-[13px]" style={{color: APP.accent}}>
            ✓ {status}
          </span>
        </span>
      </div>
    </div>
  );
}

function Panel({glyph, title, text, children}: {glyph: GlyphName; title: string; text?: string; children: ReactNode}) {
  return (
    <div className="rounded-[16px] p-5" style={{background: APP.panel, boxShadow: `inset 0 0 0 1px ${APP.line}`}}>
      <div className="flex gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{background: APP.panel2}}>
          <Icon name={glyph} className="h-5 w-5" color={APP.accent} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-bold">{title}</div>
          {text ? (
            <div className="mt-1 text-[14px]" style={{color: APP.muted}}>
              {text}
            </div>
          ) : null}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({label, value, unit, tone = APP.text}: {label: string; value: string; unit?: string; tone?: string}) {
  return (
    <div className="rounded-[10px] px-4 py-3" style={{background: APP.bg, boxShadow: `inset 0 0 0 1px ${APP.line}`}}>
      <div className="text-[12px]" style={{color: APP.faint}}>
        {label}
      </div>
      <div className="mt-1 text-[24px] font-bold leading-none" style={{color: tone}}>
        {value}
        {unit ? (
          <span className="ml-1 text-[12px] font-medium" style={{color: APP.faint}}>
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Heading({title, lead, sub}: {title: string; lead: string; sub: string}) {
  return (
    <div>
      <div className="text-[46px] font-bold leading-none tracking-[-0.01em]">{title}</div>
      <div className="mt-3 text-[17px] font-semibold">{lead}</div>
      <div className="mt-1 text-[15px]" style={{color: APP.muted}}>
        {sub}
      </div>
    </div>
  );
}

// Small sums keep their pence or cents; larger ones round to whole units.
function money(country: Country, amount: number) {
  const digits = amount < 20 ? 2 : 0;
  return `${country.demo.currency}${amount.toLocaleString(country.lang, {minimumFractionDigits: digits, maximumFractionDigits: digits})}`;
}

function linePath(values: number[], w: number, h: number, max: number) {
  return values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * w).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(' ');
}

const CORE_STEPS = [
  'Customer Details',
  'System Setup',
  'Energy Details',
  'Feed-in & Export',
  'Analyse Installation',
  'Expected Results',
  'Engineer Assessment',
  'Accurate Results',
  'System Requirements',
  'Accept Update',
  'Guardian Care Activation'
];

// ---- Already have solar: the activated, live view ----------------------------------------------

const SOLAR = [0, 0, 0, 0, 0, 0, 0.1, 0.4, 0.9, 1.6, 2.3, 2.9, 3.3, 3.4, 3.1, 2.6, 1.9, 1.1, 0.4, 0.1, 0, 0, 0, 0];
const USE = [0.3, 0.3, 0.2, 0.2, 0.2, 0.3, 0.6, 0.9, 0.7, 0.5, 0.5, 0.6, 0.8, 0.6, 0.5, 0.6, 0.9, 1.4, 1.8, 1.6, 1.2, 0.9, 0.6, 0.4];

function OwnerScreen({country}: {country: Country}) {
  const made = SOLAR.slice(0, 14).reduce((a, b) => a + b, 0);
  const saved = made * 0.75 * country.demo.importRate + made * 0.25 * country.demo.exportRate;
  const W = 640;
  const H = 150;

  return (
    <App
      journey="Core journey"
      steps={CORE_STEPS}
      current={10}
      who="Test Customer"
      where={PLACE[country.code]}
      stage="Stage 11 of 11"
      status="Live"
      photo="/assets/photos/hero-engineer.jpg"
      why={{
        title: 'What we’re watching',
        text: 'Your system is checked every day against what it should be making, and you hear from us when it matters.',
        items: [
          {glyph: 'health', title: 'System health', text: 'Panels, inverter and battery, checked daily.'},
          {glyph: 'savings', title: 'Your savings', text: 'What your solar is worth, in your own currency.'},
          {glyph: 'call', title: 'Engineer support', text: 'If something goes wrong, our team fixes it.'}
        ],
        note: 'Everything looks good today. Your next report arrives on Monday.'
      }}
    >
      <Heading title="Your Solar Today" lead="Your system is healthy and running well." sub="Last reading at 13:00 · updated every few minutes" />

      <div className="mt-6 space-y-4">
        <Panel glyph="generation" title="Right now" text="What your system is doing at this moment.">
          <div className="grid grid-cols-4 gap-3">
            <Stat label="Making now" value="3.4" unit="kW" tone="#ffd261" />
            <Stat label="Home using" value="0.6" unit="kW" />
            <Stat label="Battery" value="78" unit="%" tone="#9d8cff" />
            <Stat label="Saved today" value={money(country, saved)} tone={APP.accent} />
          </div>
        </Panel>

        <Panel glyph="monitoring" title="Today’s solar and home use" text="Solar in yellow, your home in blue.">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height: H}} preserveAspectRatio="none">
            <path d={`${linePath(SOLAR, W, H, 3.6)} L${W},${H} L0,${H} Z`} fill="#ffd261" opacity="0.18" />
            <path d={linePath(SOLAR, W, H, 3.6)} fill="none" stroke="#ffd261" strokeWidth="2.5" />
            <path d={linePath(USE, W, H, 3.6)} fill="none" stroke="#3fa3ff" strokeWidth="2" strokeDasharray="5 4" />
            <line x1={(13 / 23) * W} x2={(13 / 23) * W} y1="0" y2={H} stroke={APP.accent} strokeDasharray="2 3" />
          </svg>
        </Panel>
      </div>
    </App>
  );
}

// ---- Looking to reduce costs: the estimate stage ----------------------------------------------

const PLAN_STEPS = ['Your Bill', 'Your Usage', 'Your Goal', 'Your Home', 'Your Roof', 'Storage', 'Your Estimate', 'Roof Survey', 'Your Quote'];

function PlanScreen({country}: {country: Country}) {
  const monthly = 10 * 30 * country.demo.importRate;
  const bars = [
    {label: 'Today', value: monthly, tone: '#ff9d4d'},
    {label: 'With solar', value: monthly * 0.55, tone: '#ffd261'},
    {label: 'Solar + battery', value: monthly * 0.3, tone: APP.accent}
  ];

  return (
    <App
      journey="Energy plan journey"
      steps={PLAN_STEPS}
      current={6}
      who="Test Customer"
      where={PLACE[country.code]}
      stage="Stage 7 of 9"
      status="Saved"
      photo="/assets/photos/service-battery.jpg"
      why={{
        title: 'How we worked this out',
        text: 'Your estimate is built from your own bill and usage, not from a product we would like to sell you.',
        items: [
          {glyph: 'cost', title: 'Your real bill', text: 'We start from what you pay today.'},
          {glyph: 'solarRoof', title: 'Sized to your home', text: 'The right system, not the biggest one.'},
          {glyph: 'tool', title: 'Checked on site', text: 'An engineer confirms it before any quote.'}
        ],
        note: 'Every figure here is an estimate until your roof survey.'
      }}
    >
      <Heading title="Your Energy Estimate" lead="Here is what solar could change for you." sub="Based on your answers so far." />

      <div className="mt-6 space-y-4">
        <Panel glyph="savings" title="Your monthly bill" text="Today, and with the system we suggest.">
          <div className="flex h-[150px] items-end gap-6 px-2">
            {bars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[16px] font-bold">{money(country, bar.value)}</span>
                <div className="w-full rounded-t-[6px]" style={{height: `${(bar.value / monthly) * 100}px`, background: bar.tone}} />
                <span className="text-[12.5px]" style={{color: APP.muted}}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel glyph="solarRoof" title="What we suggest" text="Choose to keep this, or talk it through with us.">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Solar" value="4.4" unit="kWp" tone="#ffd261" />
            <Stat label="Battery" value="5" unit="kWh" tone="#9d8cff" />
            <Stat label="Could save" value={money(country, monthly * 0.7 * 12)} unit="/yr" tone={APP.accent} />
          </div>
        </Panel>
      </div>
    </App>
  );
}

// ---- Solar companies: the live portfolio console ----------------------------------------------

const PARTNER_STEPS = ['Business Details', 'Customer Base', 'Connect Systems', 'Live Console', 'Customer App', 'Growth'];

const QUEUE = [
  {id: 'Customer 1042', issue: 'Inverter offline for 6h', status: 'Critical', tone: '#ff6b5a'},
  {id: 'Customer 0877', issue: 'Output 24% below expected', status: 'Action', tone: '#ff9d4d'},
  {id: 'Customer 1310', issue: 'High export, no battery', status: 'Opportunity', tone: '#9d8cff'},
  {id: 'Customer 0215', issue: 'Running normally', status: 'Healthy', tone: APP.accent}
];

function BusinessScreen({country}: {country: Country}) {
  return (
    <App
      journey="Partner journey"
      steps={PARTNER_STEPS}
      current={3}
      who="Your Solar Company"
      where={`1,245 customers · ${country.name}`}
      stage="Stage 4 of 6"
      status="Live"
      photo="/assets/photos/service-intelligence.jpg"
      why={{
        title: 'Why it matters',
        text: 'You hear about a problem before your customer does, and the fix is ready to book.',
        items: [
          {glyph: 'monitoring', title: 'Every system, live', text: 'Online, offline and faults in one place.'},
          {glyph: 'tool', title: 'Jobs, ready to book', text: 'Faults become engineer visits.'},
          {glyph: 'goal', title: 'Spot opportunities', text: 'Batteries and upgrades worth a call.'}
        ],
        note: '22 customers need action today. Most urgent first.'
      }}
    >
      <Heading title="Portfolio Console" lead="Every customer you look after, on one screen." sub="Updated 2 minutes ago." />

      <div className="mt-6 space-y-4">
        <Panel glyph="portfolio" title="Your customers" text="Status across every installed system.">
          <div className="grid grid-cols-4 gap-3">
            <Stat label="Customers" value="1,245" />
            <Stat label="Online" value="1,182" tone={APP.accent} />
            <Stat label="Offline" value="41" tone="#ffd261" />
            <Stat label="Need action" value="22" tone="#ff6b5a" />
          </div>
        </Panel>

        <Panel glyph="monitoring" title="Today’s queue" text="Sorted by urgency.">
          <div className="overflow-hidden rounded-[10px]" style={{boxShadow: `inset 0 0 0 1px ${APP.line}`}}>
            {QUEUE.map((row, index) => (
              <div
                key={row.id}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px]"
                style={{background: APP.bg, borderTop: index ? `1px solid ${APP.line}` : undefined}}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{background: row.tone}} />
                <span className="w-[130px] font-semibold">{row.id}</span>
                <span className="flex-1" style={{color: APP.muted}}>
                  {row.issue}
                </span>
                <span className="text-[12px] font-bold uppercase tracking-[.06em]" style={{color: row.tone}}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </App>
  );
}
