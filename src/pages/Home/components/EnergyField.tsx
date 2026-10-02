import {TONE_VAR} from '../../../data/command';
import type {StatusTone} from '../../../data/command';
import {LIVE} from '../../../data/platform';

const VB = {w: 1600, h: 900};

const SUN = {x: 215, y: 160, r: 48};

const ARRAY_ART = [
  'M 265 478 L 525 448 L 525 570 L 265 600 Z',
  'M 330 470 L 330 592',
  'M 395 462 L 395 584',
  'M 460 455 L 460 577',
  'M 265 539 L 525 509',
  'M 350 585 L 350 645',
  'M 465 572 L 465 632',
  'M 325 645 L 375 645',
  'M 440 632 L 490 632'
];

const HOUSE_ART = [
  'M 1104 592 L 1190 522 L 1276 592',
  'M 1122 586 L 1122 682',
  'M 1258 586 L 1258 682',
  'M 1122 682 L 1258 682',
  'M 1196 682 L 1196 636 L 1234 636 L 1234 682',
  'M 1142 610 L 1178 610 L 1178 642 L 1142 642 Z',
  'M 1242 556 L 1242 526 L 1262 526 L 1262 578'
];

const BATTERY_ART = [
  'M 288 748 L 372 748 L 372 842 L 288 842 Z',
  'M 313 748 L 313 735 L 347 735 L 347 748',
  'M 342 768 L 318 800 L 338 800 L 331 826 L 356 792 L 336 792 Z',
  `M 288 ${(842 - 94 * (LIVE.charge / 100)).toFixed(1)} L 372 ${(842 - 94 * (LIVE.charge / 100)).toFixed(1)}`
];

const PYLON_ART = [
  'M 1352 456 L 1392 232',
  'M 1458 456 L 1418 232',
  'M 1392 232 L 1418 232',
  'M 1340 304 L 1470 304',
  'M 1330 370 L 1480 370',
  'M 1340 304 L 1340 322',
  'M 1470 304 L 1470 322',
  'M 1330 370 L 1330 388',
  'M 1480 370 L 1480 388',
  'M 1364 388 L 1446 456',
  'M 1446 388 L 1364 456'
];

const RAYS = [
  'M 255 196 C 280 280, 290 380, 300 466',
  'M 262 186 C 300 260, 330 370, 358 458',
  'M 266 172 C 320 232, 390 350, 430 450',
  'M 265 156 C 330 196, 430 320, 495 444',
  'M 261 140 C 336 160, 452 280, 520 436'
];

const SUN_SPOKES = Array.from({length: 12}, (_, i) => {
  const a = (i * Math.PI * 2) / 12;
  const [x1, y1] = [SUN.x + Math.cos(a) * 60, SUN.y + Math.sin(a) * 60];
  const [x2, y2] = [SUN.x + Math.cos(a) * 84, SUN.y + Math.sin(a) * 84];
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
});

type Flow = {
  key: string;
  d: string;
  tone: StatusTone;
  weight: number;
  delay: number;
  faint?: boolean;
};

const FLOWS: Flow[] = [
  {
    key: 'array-house',
    d: 'M 520 490 C 720 482, 980 540, 1100 578',
    tone: 'amber',
    weight: 2.8,
    delay: 0
  },
  {
    key: 'array-battery',
    d: 'M 380 596 C 370 660, 350 710, 336 744',
    tone: 'purple',
    weight: 2.2,
    delay: -1.4
  },
  {
    key: 'array-pylon',
    d: 'M 520 460 C 760 330, 1120 258, 1378 292',
    tone: 'blue',
    weight: 2.2,
    delay: -2.6,
    faint: true
  },
  {
    key: 'battery-house',
    d: 'M 376 800 C 620 860, 950 730, 1128 664',
    tone: 'purple',
    weight: 2,
    delay: -0.8
  },
  {
    key: 'house-pylon',
    d: 'M 1262 570 C 1330 500, 1370 420, 1392 384',
    tone: 'blue',
    weight: 2,
    delay: -2
  }
];

const DOTS = {strokeDasharray: '2 8', strokeLinecap: 'round' as const, fill: 'none'};

export default function EnergyField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 h-auto w-full min-w-[980px] -translate-x-1/2 -translate-y-1/2"
      >
        <defs>
          <radialGradient id="ef-sun">
            <stop offset="0%" stopColor="var(--ramp-far)" stopOpacity="0.36" />
            <stop offset="42%" stopColor="var(--ramp-far)" stopOpacity="0.11" />
            <stop offset="100%" stopColor="var(--ramp-far)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={SUN.x} cy={SUN.y} r="300" fill="url(#ef-sun)" />
        <circle
          cx={SUN.x}
          cy={SUN.y}
          r={SUN.r}
          stroke="var(--ramp-far)"
          strokeWidth="2.6"
          opacity="0.62"
          {...DOTS}
        />
        {SUN_SPOKES.map((d) => (
          <path key={d} d={d} stroke="var(--ramp-far)" strokeWidth="2.6" opacity="0.44" {...DOTS} />
        ))}

        {RAYS.map((d, index) => (
          <path
            key={d}
            d={d}
            stroke="var(--ramp-far)"
            strokeWidth="2.4"
            opacity="0.42"
            style={{animation: `crawl ${2.4 + index * 0.18}s linear infinite`}}
            {...DOTS}
          />
        ))}

        {FLOWS.map((flow) => (
          <path
            key={flow.key}
            d={flow.d}
            stroke={TONE_VAR[flow.tone]}
            strokeWidth={flow.weight}
            opacity={flow.faint ? 0.28 : 0.5}
            style={{animation: 'crawl 3.4s linear infinite', animationDelay: `${flow.delay}s`}}
            {...DOTS}
          />
        ))}

        {ARRAY_ART.map((d) => (
          <path key={d} d={d} stroke="var(--ramp-far)" strokeWidth="2.6" opacity="0.58" {...DOTS} />
        ))}
        {HOUSE_ART.map((d) => (
          <path key={d} d={d} stroke="var(--color-ink)" strokeWidth="2.6" opacity="0.56" {...DOTS} />
        ))}
        {BATTERY_ART.map((d) => (
          <path key={d} d={d} stroke={TONE_VAR.purple} strokeWidth="2.6" opacity="0.56" {...DOTS} />
        ))}
        {PYLON_ART.map((d) => (
          <path key={d} d={d} stroke={TONE_VAR.blue} strokeWidth="2.6" opacity="0.5" {...DOTS} />
        ))}
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 52% 40% at 50% 38%, color-mix(in srgb, var(--color-bg) 90%, transparent), color-mix(in srgb, var(--color-bg) 48%, transparent) 62%, color-mix(in srgb, var(--color-bg) 10%, transparent) 100%)'
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 60%, transparent) 0%, transparent 24%, transparent 78%, color-mix(in srgb, var(--color-bg) 90%, transparent) 100%)'
        }}
      />
    </div>
  );
}
