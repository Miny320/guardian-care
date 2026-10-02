import {TONE_VAR} from '../../../data/command';
import type {StatusTone} from '../../../data/command';
import {cn} from '../../../lib/cn';

export default function Conduit({
  direction = 'down',
  tone = 'amber',
  delay = 0,
  duration = 2.8,
  className
}: {
  direction?: 'down' | 'right';
  tone?: StatusTone;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const colour = TONE_VAR[tone];
  const vertical = direction === 'down';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative block overflow-hidden',
        vertical ? 'w-px' : 'h-px w-full',
        className
      )}
      style={{background: `color-mix(in srgb, ${colour} 22%, transparent)`}}
    >
      <span
        className="absolute inset-0 block"
        style={{
          [vertical ? 'height' : 'width']: '34%',
          background: vertical
            ? `linear-gradient(180deg, transparent, ${colour}, transparent)`
            : `linear-gradient(90deg, transparent, ${colour}, transparent)`,
          animation: `${vertical ? 'conduit' : 'conduit-x'} ${duration}s linear infinite`,
          animationDelay: `${delay}s`
        }}
      />
    </span>
  );
}

export function LiveDot({tone = 'green', className}: {tone?: StatusTone; className?: string}) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative block h-2 w-2 shrink-0 rounded-full', className)}
      style={{background: TONE_VAR[tone]}}
    >
      <span
        className="absolute inset-0 block rounded-full"
        style={{
          background: TONE_VAR[tone],
          animation: 'live 2.4s ease-in-out infinite'
        }}
      />
    </span>
  );
}
