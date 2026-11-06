import {Link} from 'react-router';
import {useLocalPath, usePagePath} from '../../lib/country';
import {BUTTON_BASE, SOLID_LOOK} from '../../components/kit';
import {cn} from '../../lib/cn';

// Pages that already are the action, or have their own form, don't need the bar.
const HIDDEN = new Set(['/consumer', '/plan', '/business', '/contact', '/start']);

export function useMobileAction() {
  return !HIDDEN.has(usePagePath());
}

// On phones the header button is hidden, so the main action sits at the foot of the screen.
export default function MobileAction() {
  const local = useLocalPath();
  if (!useMobileAction()) return null;

  return (
    <div className="on-light fixed inset-x-0 bottom-0 z-80 border-t border-line-2 bg-bg/95 px-4 py-3 backdrop-blur-md min-[640px]:hidden">
      <Link
        to={local('/consumer')}
        className={cn('flex w-full', BUTTON_BASE, SOLID_LOOK, 'px-5 py-3.5 text-[16px]')}
      >
        Free solar check →
      </Link>
    </div>
  );
}
