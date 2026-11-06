import {useEffect, useMemo, useRef, useState} from 'react';
import {geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoProjection} from 'd3-geo';
import type {Feature, Geometry} from 'geojson';
import {feature} from 'topojson-client';
import type {GeometryCollection, Topology} from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';
import type {HomeMarket} from '../../../data/home';

const SIZE = 600;
const RADIUS = 284;
const TURN_MS = 1100;

type Country = Feature<Geometry, {name: string}>;
type Rotation = [number, number];

const topology = world as unknown as Topology<{countries: GeometryCollection<{name: string}>}>;
const COUNTRIES = (feature(topology, topology.objects.countries) as unknown as {features: Country[]}).features;
const GRATICULE = geoGraticule10();

// Rotation that puts a point at the centre of the globe, tilted a little so it does not sit dead centre.
function facing([lon, lat]: [number, number]): Rotation {
  return [-lon, Math.max(-50, Math.min(50, -lat + 8))];
}

const ARC_STEPS = 64;

// Every market linked to every other: the Guardian Care network.
function pairs<T>(items: T[]): Array<[T, T]> {
  return items.flatMap((a, i) => items.slice(i + 1).map((b): [T, T] => [a, b]));
}

// A great-circle arc lifted off the surface, highest in the middle. Parts behind the globe are
// left out, so a link can disappear over the horizon and come back on the other side.
function arcPath(from: [number, number], to: [number, number], projection: GeoProjection, centre: [number, number]) {
  const along = geoInterpolate(from, to);
  const lift = 0.04 + 0.07 * (geoDistance(from, to) / Math.PI);
  let d = '';
  let drawing = false;
  for (let i = 0; i <= ARC_STEPS; i++) {
    const t = i / ARC_STEPS;
    const point = along(t);
    const height = 1 + lift * Math.sin(Math.PI * t);
    const flat = projection(point);
    if (!flat) {
      drawing = false;
      continue;
    }
    const x = SIZE / 2 + (flat[0] - SIZE / 2) * height;
    const y = SIZE / 2 + (flat[1] - SIZE / 2) * height;
    // Behind the globe, a raised point only shows where it pokes out past the edge.
    const visible = geoDistance(point, centre) < Math.PI / 2 || Math.hypot(x - SIZE / 2, y - SIZE / 2) > RADIUS;
    if (!visible) {
      drawing = false;
      continue;
    }
    d += `${drawing ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    drawing = true;
  }
  return d;
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Globe({
  markets,
  selected,
  onSelect
}: {
  markets: HomeMarket[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  const byId = useMemo(() => new Map(markets.map((market) => [market.geoId, market])), [markets]);
  const centroids = useMemo(() => new Map(markets.map((market) => [market.key, market.at])), [markets]);

  const [rotation, setRotation] = useState<Rotation>(() => facing(centroids.get(selected) ?? [0, 0]));
  const current = useRef(rotation);
  useEffect(() => {
    current.current = rotation;
  }, [rotation]);

  // Turn the globe to the selected country, taking the short way round.
  useEffect(() => {
    const target = facing(centroids.get(selected) ?? [0, 0]);
    const [fromLon, fromLat] = current.current;
    let delta = ((target[0] - fromLon + 540) % 360) - 180;
    if (Math.abs(delta) < 0.01) delta = 0;
    const latDelta = target[1] - fromLat;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : TURN_MS;

    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const k = ease(t);
      setRotation([fromLon + delta * k, fromLat + latDelta * k]);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [selected, centroids]);

  // Dragging spins the globe; a press that barely moves counts as a click on whatever is under it.
  const drag = useRef<{x: number; y: number; from: Rotation; moved: boolean} | null>(null);

  function onPointerDown(event: React.PointerEvent<SVGSVGElement>) {
    drag.current = {x: event.clientX, y: event.clientY, from: current.current, moved: false};
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (!state.moved && Math.hypot(dx, dy) < 4) return;
    if (!state.moved) event.currentTarget.setPointerCapture(event.pointerId);
    state.moved = true;
    setRotation([state.from[0] + dx * 0.35, Math.max(-60, Math.min(60, state.from[1] - dy * 0.35))]);
  }

  function onPointerUp() {
    drag.current = null;
  }

  function pick(key: string) {
    if (drag.current?.moved) return;
    onSelect(key);
  }

  const projection = geoOrthographic().scale(RADIUS).translate([SIZE / 2, SIZE / 2]).rotate(rotation).clipAngle(90);
  const path = geoPath(projection);
  const centre: [number, number] = [-rotation[0], -rotation[1]];

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[560px] touch-none select-none overflow-visible"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="globe-sea" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--color-blue) 26%, var(--color-bg-2))" />
          <stop offset="70%" stopColor="var(--color-bg-2)" />
          <stop offset="100%" stopColor="var(--color-bg)" />
        </radialGradient>
        <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="color-mix(in srgb, var(--color-green) 22%, transparent)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS + 14} fill="url(#globe-glow)" />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="url(#globe-sea)"
        stroke="color-mix(in srgb, var(--color-ink) 16%, transparent)"
      />
      <path d={path(GRATICULE) ?? ''} fill="none" stroke="color-mix(in srgb, var(--color-ink) 7%, transparent)" />

      {COUNTRIES.map((country) => {
        // A few disputed territories have no ISO code in the map data, so fall back to the name.
        const key = country.id === undefined ? country.properties.name : String(country.id);
        const market = byId.get(String(country.id));
        const d = path(country);
        if (!d) return null;

        if (!market) {
          return (
            <path
              key={key}
              d={d}
              fill="color-mix(in srgb, var(--color-ink) 13%, transparent)"
              stroke="color-mix(in srgb, var(--color-ink) 10%, transparent)"
              strokeWidth={0.5}
            />
          );
        }

        const on = market.key === selected;
        return (
          <path
            key={key}
            d={d}
            onClick={() => pick(market.key)}
            className="cursor-pointer transition-[fill] duration-300"
            fill={`color-mix(in srgb, var(--color-green) ${on ? 62 : 28}%, transparent)`}
            stroke="var(--color-green)"
            strokeWidth={on ? 2.6 : 2}
            strokeDasharray="0 5"
            strokeLinecap="round"
            style={on ? {filter: 'drop-shadow(0 0 10px color-mix(in srgb, var(--color-green) 70%, transparent))'} : undefined}
          />
        );
      })}

      {/* The network: a faint base line with light flowing along it, brighter for the chosen market. */}
      {pairs(markets).map(([a, b]) => {
        const d = arcPath(a.at, b.at, projection, centre);
        if (!d) return null;
        const lit = a.key === selected || b.key === selected;
        return (
          <g key={`${a.key}-${b.key}`} fill="none" strokeLinecap="round" className="pointer-events-none">
            <path d={d} stroke="var(--color-green)" strokeOpacity={lit ? 0.45 : 0.2} strokeWidth={lit ? 1.6 : 1.1} />
            <path d={d} stroke="var(--color-green)" strokeOpacity={lit ? 0.95 : 0.5} strokeWidth={lit ? 2.2 : 1.6} strokeDasharray="2 14">
              <animate attributeName="stroke-dashoffset" values="32;0" dur="1.6s" repeatCount="indefinite" />
            </path>
          </g>
        );
      })}

      {markets.map((market) => {
        const at = centroids.get(market.key)!;
        if (geoDistance(at, centre) > Math.PI / 2 - 0.12) return null;
        const point = projection(at);
        if (!point) return null;
        const on = market.key === selected;

        return (
          <g
            key={market.key}
            transform={`translate(${point[0]} ${point[1]})`}
            onClick={() => pick(market.key)}
            className="cursor-pointer"
          >
            <circle r={18} fill="transparent" />
            {on ? (
              <circle r={7} fill="none" stroke="var(--color-green)" strokeWidth={2}>
                <animate attributeName="r" values="7;18" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
              </circle>
            ) : null}
            <circle r={on ? 6 : 4.5} fill={on ? 'var(--color-green)' : 'var(--color-ink)'} stroke="var(--color-bg)" strokeWidth={2} />
            <text
              y={-14}
              textAnchor="middle"
              className="mono"
              style={{fontSize: 13, fontWeight: 700, letterSpacing: '0.12em'}}
              fill={on ? 'var(--color-green)' : 'var(--color-ink)'}
              stroke="var(--color-bg)"
              strokeWidth={4}
              paintOrder="stroke"
            >
              {market.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
