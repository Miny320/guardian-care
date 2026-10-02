import {useEffect, useRef, useState} from 'react';

export type Weather = {
  arcs: number;
  flares: number;
  tones: string[];
  reach: [number, number];
  thick: [number, number];
  strike: [number, number];
  gap: [number, number];
  flareSize: [number, number];
  flareBurn: [number, number];
  flareGap: [number, number];
};

const SUN = 'var(--bolt-amber)';

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const pick = (xs: string[]) => xs[Math.floor(Math.random() * xs.length)];

export default function CurrentField({weather}: {weather: Weather}) {
  const host = useRef<HTMLDivElement>(null);

  const [still, setStill] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let top = 0;
    let height = 0;

    const measure = () => {
      const box = el.getBoundingClientRect();
      top = box.top + window.scrollY;
      height = box.height;
    };

    measure();

    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(el);
    window.addEventListener('resize', measure);

    const bandY = () => {
      const seen = window.scrollY - top + Math.random() * window.innerHeight;
      return Math.max(0, Math.min(Math.max(height - 1, 0), seen));
    };

    const edgeX = () => {
      const roll = Math.random();
      const inset = roll * roll * 34;
      return Math.random() < 0.5 ? inset : 100 - inset;
    };

    const dressArc = (node: HTMLElement) => {
      const thick = rand(weather.thick[0], weather.thick[1]);
      node.style.setProperty('--arc-a', `${Math.round(rand(0, 360))}deg`);
      node.style.setProperty('--arc-tone', pick(weather.tones));
      node.style.setProperty(
        '--arc-dur',
        `${Math.round(rand(weather.strike[0], weather.strike[1]))}ms`
      );
      node.style.left = `${edgeX().toFixed(2)}%`;
      node.style.top = `${Math.round(bandY())}px`;
      node.style.width = `${Math.round(rand(weather.reach[0], weather.reach[1]))}px`;
      node.style.height = `${thick.toFixed(1)}px`;
      node.style.marginTop = `${(-thick / 2).toFixed(1)}px`;
    };

    const dressFlare = (node: HTMLElement) => {
      const size = Math.round(rand(weather.flareSize[0], weather.flareSize[1]));
      node.style.setProperty('--flare-tone', SUN);
      node.style.setProperty(
        '--arc-dur',
        `${Math.round(rand(weather.flareBurn[0], weather.flareBurn[1]))}ms`
      );
      node.style.left = `${edgeX().toFixed(2)}%`;
      node.style.top = `${Math.round(bandY())}px`;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
    };

    const slots = Array.from(el.children) as HTMLElement[];

    if (still) {
      for (const node of slots) {
        node.style.animationName = 'none';
        if (node.dataset.kind === 'arc') dressArc(node);
        else dressFlare(node);
        node.dataset.still = '';
      }
      return () => {
        observer?.disconnect();
        window.removeEventListener('resize', measure);
      };
    }

    const timers = new Set<number>();
    const stops: Array<() => void> = [];

    for (const node of slots) {
      const arc = node.dataset.kind === 'arc';
      const dress = arc ? dressArc : dressFlare;
      const name = arc ? 'arc-strike' : 'sun-flare';
      const gap = arc ? weather.gap : weather.flareGap;

      delete node.dataset.still;

      const fire = () => {
        dress(node);
        node.style.animationName = name;
      };

      const rest = (ms: number) => {
        node.style.animationName = 'none';
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          fire();
        }, ms);
        timers.add(timer);
      };

      const onEnd = () => rest(rand(gap[0], gap[1]));
      node.addEventListener('animationend', onEnd);
      stops.push(() => node.removeEventListener('animationend', onEnd));

      rest(Math.random() * gap[1]);
    }

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
      for (const stop of stops) stop();
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [weather, still]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="mask-reading pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {Array.from({length: weather.arcs}, (_, i) => (
        <span key={`arc-${i}`} data-kind="arc" className="paint-arc absolute" />
      ))}
      {Array.from({length: weather.flares}, (_, i) => (
        <span key={`flare-${i}`} data-kind="flare" className="paint-flare absolute" />
      ))}
    </div>
  );
}
