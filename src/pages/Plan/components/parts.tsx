import type {ReactNode} from 'react';
import {TONE_TEXT, TONE_VAR, type StatusTone} from '../../../data/command';
import {cn} from '../../../lib/cn';

export type Segment = {
  tone: StatusTone;
  count: number;
  label?: string;
  hollow?: boolean;
};

export function Units({
  segments,
  pad,
  className
}: {
  segments: Segment[];
  pad?: number;
  className?: string;
}) {
  const filled = segments.reduce((total, segment) => total + segment.count, 0);
  const columns = Math.max(pad ?? 0, filled);

  const cells: ReactNode[] = [];

  for (const segment of segments) {
    const colour = TONE_VAR[segment.tone];

    for (let index = 0; index < segment.count; index += 1) {
      cells.push(
        <span
          key={`${segment.tone}-${segment.label ?? ''}-${index}`}
          className="block aspect-square rounded-tile"
          style={
            segment.hollow
              ? {
                  boxShadow: `inset 0 0 0 1.5px color-mix(in srgb, ${colour} 72%, transparent)`,
                  background: `color-mix(in srgb, ${colour} 15%, transparent)`
                }
              : {
                  background: colour,
                  boxShadow: `0 4px 14px -6px color-mix(in srgb, ${colour} 75%, transparent), inset 0 1px 0 rgba(255,255,255,0.32)`
                }
          }
        />
      );
    }
  }

  for (let index = filled; index < columns; index += 1) {
    cells.push(
      <span
        key={`pad-${index}`}
        className="block aspect-square rounded-tile border border-dashed border-line-2"
      />
    );
  }

  return (
    <div
      className={cn('grid gap-[3px] min-[520px]:gap-1.5', className)}
      style={{gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`}}
      aria-hidden="true"
    >
      {cells}
    </div>
  );
}

export function UnitKey({segments, className}: {segments: Segment[]; className?: string}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2', className)}>
      {segments
        .filter((segment) => segment.label && segment.count > 0)
        .map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={
                segment.hollow
                  ? {
                      border: `1px solid color-mix(in srgb, ${TONE_VAR[segment.tone]} 75%, transparent)`,
                      background: `color-mix(in srgb, ${TONE_VAR[segment.tone]} 16%, transparent)`
                    }
                  : {background: TONE_VAR[segment.tone]}
              }
            />
            <span className={cn('mono text-[11.5px] font-semibold', TONE_TEXT[segment.tone])}>
              {segment.count}
            </span>
            <span className="text-[12.5px] font-light leading-none text-muted">
              {segment.label}
            </span>
          </li>
        ))}
    </ul>
  );
}

export {Caption, Figure, Panel} from '../../../components/kit';
