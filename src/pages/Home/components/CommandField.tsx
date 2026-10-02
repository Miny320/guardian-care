import CurrentField, {type Weather} from '../../../components/CurrentField';
import SolarShine, {type Shine} from '../../../components/SolarShine';

const SUNS: Shine[] = [
  {
    top: '34vh',
    side: 'left',
    offset: '6%',
    tone: 'var(--wash-amber)',
    under: 'var(--wash-green)',
    core: 'min(46vmax, 460px)',
    blur: 90,
    breath: 19
  },
  {
    top: '30%',
    side: 'right',
    offset: '-12%',
    tone: 'var(--wash-green)',
    under: 'var(--wash-blue)',
    core: 'min(38vmax, 380px)',
    blur: 90,
    breath: 23
  },
  {
    top: '66%',
    side: 'left',
    offset: '-16%',
    tone: 'var(--wash-blue)',
    under: 'var(--wash-green)',
    core: 'min(42vmax, 420px)',
    blur: 90,
    breath: 29
  }
];

const WEATHER: Weather = {
  arcs: 18,
  flares: 4,
  tones: ['var(--bolt-amber)', 'var(--bolt-amber)', 'var(--bolt-green)', 'var(--bolt-blue)'],
  reach: [150, 430],
  thick: [7, 13],
  strike: [640, 1180],
  gap: [900, 5200],
  flareSize: [180, 340],
  flareBurn: [1500, 2300],
  flareGap: [3400, 9000]
};

export default function CommandField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <SolarShine suns={SUNS} />
      <CurrentField weather={WEATHER} />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 85%, transparent), transparent 18%, transparent 82%, color-mix(in srgb, var(--color-bg) 85%, transparent)), linear-gradient(180deg, transparent 0%, transparent 96%, color-mix(in srgb, var(--color-bg) 90%, transparent))'
        }}
      />
    </div>
  );
}
