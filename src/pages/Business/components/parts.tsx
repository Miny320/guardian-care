import {CC_CUSTOMERS, CC_MIX, TONE_BG, TONE_TEXT, type PortfolioBand} from '../../../data/command';
import {cn} from '../../../lib/cn';

function shuffled(bands: PortfolioBand[]): PortfolioBand[] {
  const field = bands.flatMap((band) => Array.from({length: band.count}, () => band));

  let seed = 20260921;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let index = field.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [field[index], field[swap]] = [field[swap], field[index]];
  }

  return field;
}

const FIELD = shuffled(CC_MIX);

export function Portfolio({className}: {className?: string}) {
  return (
    <div
      role="img"
      aria-label={`${CC_CUSTOMERS.toLocaleString('en-GB')} customers, ${CC_MIX.filter((band) => band.tone !== 'green')
        .map((band) => `${band.count} ${band.label.toLowerCase()}`)
        .join(', ')}`}
      className={cn(
        'grid grid-cols-[repeat(45,minmax(0,1fr))] gap-[1.5px] min-[520px]:gap-[2.5px]',
        className
      )}
    >
      {FIELD.map((band, index) => (
        <span
          key={index}
          className={cn(
            'block aspect-square rounded-[1px]',
            band.hollow
              ? 'bg-ink/[0.07] ring-1 ring-inset ring-ink/20'
              : TONE_BG[band.tone],
            band.tone === 'red' && 'animate-blip',
            band.tone === 'green' && 'opacity-55'
          )}
        />
      ))}
    </div>
  );
}

export function PortfolioKey({className}: {className?: string}) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-5 gap-y-2', className)}>
      {CC_MIX.map((band) => (
        <li key={band.label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'block h-2.5 w-2.5 shrink-0 rounded-[2px]',
              band.hollow ? 'bg-ink/[0.07] ring-1 ring-inset ring-ink/25' : TONE_BG[band.tone]
            )}
          />
          <span className={cn('mono text-[11.5px] font-semibold', TONE_TEXT[band.tone])}>
            {band.count}
          </span>
          <span className="text-[12.5px] font-light leading-none text-muted">{band.label}</span>
        </li>
      ))}
    </ul>
  );
}

