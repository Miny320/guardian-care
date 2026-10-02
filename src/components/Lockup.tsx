import {cn} from '../lib/cn';
import {useTheme} from '../lib/theme';

const SIZES = {
  entry: {
    mark: 'h-16 w-16',
    gap: 'gap-[13px]',
    words: '',
    navy: false,
    name: 'text-[22px] tracking-[.32em]',
    sub: 'text-[15px] tracking-[.42em]'
  },
  nav: {
    mark: 'h-10 w-10',
    gap: 'gap-0 min-[400px]:gap-[13px]',
    words: 'sr-only min-[400px]:not-sr-only',
    navy: true,
    name: 'text-[15px] tracking-[.26em]',
    sub: 'text-[11px] tracking-[.36em]'
  },
  footer: {
    mark: 'h-11 w-11',
    gap: 'gap-[13px]',
    words: '',
    navy: true,
    name: 'text-[15px] tracking-[.32em]',
    sub: 'text-[11px] tracking-[.42em]'
  }
} as const;

type LockupProps = {
  size?: keyof typeof SIZES;
  className?: string;
};

export default function Lockup({size = 'nav', className}: LockupProps) {
  const s = SIZES[size];
  const {theme} = useTheme();

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <img
        src={
          theme === 'day' && !s.navy ? '/assets/logo-mark-day.png' : '/assets/logo-mark.png'
        }
        alt=""
        aria-hidden="true"
        width={256}
        height={236}
        className={cn('shrink-0 object-contain', s.mark)}
      />

      <div className={s.words}>
        <div className={cn('font-display font-medium leading-none text-ink', s.name)}>GUARDIAN</div>
        <div className={cn('mt-[3px] font-display font-medium leading-none text-brand-gradient', s.sub)}>
          CARE
        </div>
      </div>
    </div>
  );
}
