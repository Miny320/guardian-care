import {useTheme} from '../lib/theme';
import {cn} from '../lib/cn';

export default function ThemeToggle({className}: {className?: string}) {
  const {theme, toggle} = useTheme();
  const toDay = theme === 'night';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === 'day'}
      aria-label={toDay ? 'Switch to the light theme' : 'Switch to the dark theme'}
      title={toDay ? 'Light theme' : 'Dark theme'}
      className={cn(
        'grid h-[34px] w-[34px] shrink-0 place-items-center rounded-pill border border-line-2 text-faint min-[520px]:h-[38px] min-[520px]:w-[38px]',
        'transition duration-200 ease-brand hover:border-line hover:bg-ink/5 hover:text-ink',
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[17px] w-[17px]"
      >
        {toDay ? (
          <>
            <circle cx="12" cy="12" r="4.3" />
            <path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
          </>
        ) : (
          <path d="M20.5 14.3A8.8 8.8 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8Z" />
        )}
      </svg>
    </button>
  );
}
