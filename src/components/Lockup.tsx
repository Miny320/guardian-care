import {cn} from '../lib/cn';

const SIZES = {
  entry: {
    mark: 'h-16 w-16',
    gap: 'gap-[13px]',
    words: '',
    name: 'text-[22px] tracking-[.32em]',
    sub: 'text-[15px] tracking-[.42em]'
  },
  nav: {
    mark: 'h-10 w-10',
    gap: 'gap-0 min-[400px]:gap-[13px]',
    words: 'sr-only min-[400px]:not-sr-only',
    name: 'text-[15px] tracking-[.18em]',
    sub: 'text-[11px] tracking-[.28em]'
  },
  footer: {
    mark: 'h-11 w-11',
    gap: 'gap-[13px]',
    words: '',
    name: 'text-[15px] tracking-[.32em]',
    sub: 'text-[11px] tracking-[.42em]'
  }
} as const;

type LockupProps = {
  size?: keyof typeof SIZES;
  // On a light background the mark needs its dark-ink version.
  light?: boolean;
  className?: string;
};

export default function Lockup({size = 'nav', light = false, className}: LockupProps) {
  const s = SIZES[size];

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <img
        src={light ? '/assets/logo-mark-day.png' : '/assets/logo-mark.png'}
        alt=""
        aria-hidden="true"
        width={256}
        height={236}
        className={cn('shrink-0 object-contain', s.mark)}
      />

      <div className={s.words}>
        <div className={cn('font-display font-extrabold leading-none text-ink', s.name)}>GUARDIAN</div>
        <div className={cn('mt-[3px] font-display font-extrabold leading-none text-brand-gradient', s.sub)}>
          CARE
        </div>
      </div>
    </div>
  );
}
