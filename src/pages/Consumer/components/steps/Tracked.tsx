import Glyph from '../../../../components/Glyph';
import {TRACKED} from '../../../../data/consumer';
import {Tile} from '../../../../components/kit';

export default function Tracked() {
  return (
    <ul className="ring-lit grid gap-px overflow-hidden rounded-frame bg-line-2 min-[520px]:grid-cols-2">
      {TRACKED.map((item) => (
        <li key={item.key} className="flex items-start gap-4 bg-panel px-5 py-5 min-[520px]:px-6">
          <Tile tone={item.tone} size="md">
            <Glyph name={item.glyph} bold className="h-6 w-6" />
          </Tile>
          <span className="min-w-0">
            <span className="block font-display text-[18px] font-semibold uppercase leading-[1.05] text-ink">
              {item.name}
            </span>
            <span className="mt-1.5 block text-[13.5px] font-light leading-[1.5] text-muted">
              {item.line}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
