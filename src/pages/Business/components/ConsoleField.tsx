import CurrentField, {type Weather} from '../../../components/CurrentField';
import SolarShine, {type Shine} from '../../../components/SolarShine';

const SUNS: Shine[] = [
  {
    top: '-6%',
    side: 'left',
    offset: '-14%',
    tone: 'var(--wash-green)',
    under: 'var(--wash-blue)',
    core: 'min(34vmax, 340px)',
    blur: 60,
    breath: 21
  },
  {
    top: '26%',
    side: 'right',
    offset: '-16%',
    tone: 'var(--wash-blue)',
    under: 'var(--wash-green)',
    core: 'min(36vmax, 360px)',
    blur: 60,
    breath: 26
  },
  {
    top: '58%',
    side: 'left',
    offset: '-18%',
    tone: 'var(--wash-blue)',
    under: 'var(--wash-amber)',
    core: 'min(32vmax, 320px)',
    blur: 60,
    breath: 31
  }
];

const WEATHER: Weather = {
  arcs: 26,
  flares: 3,
  tones: ['var(--bolt-blue)', 'var(--bolt-blue)', 'var(--bolt-green)', 'var(--bolt-amber)'],
  reach: [110, 300],
  thick: [6, 11],
  strike: [420, 820],
  gap: [520, 3600],
  flareSize: [150, 260],
  flareBurn: [1300, 1900],
  flareGap: [4200, 11000]
};

export default function ConsoleField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <SolarShine suns={SUNS} />
      <CurrentField weather={WEATHER} />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 90%, transparent), transparent 20%, transparent 80%, color-mix(in srgb, var(--color-bg) 90%, transparent)), linear-gradient(180deg, transparent 0%, transparent 95%, color-mix(in srgb, var(--color-bg) 85%, transparent))'
        }}
      />
    </div>
  );
}
