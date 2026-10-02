import Glyph from '../../../components/Glyph';
import {Heading, LABEL, PRIMARY, Tile, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {NOT_SURE, PRICE, PROVIDES} from '../../../data/guardian';
import {cn} from '../../../lib/cn';

export default function Activation() {
  return (
    <Section id="activate" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Guardian Care active"
          title="Then someone"
          accent="is watching it."
          body="The assessment tells you where you stand today. This is what keeps telling you."
        />

        <div className="grid gap-4 min-[980px]:grid-cols-[1.25fr_0.75fr]">
          <ul className="grid gap-px overflow-hidden rounded-frame bg-line-2 ring-1 ring-line-2 min-[620px]:grid-cols-2">
            {PROVIDES.map((item, index) => (
              <Reveal
                key={item.key}
                as="li"
                delay={(index % 2) * 0.05}
                className="flex items-start gap-3.5 bg-panel/50 p-5 last:min-[620px]:col-span-2"
              >
                <Tile tone="green" size="sm">
                  <Glyph name={item.glyph} className="h-4 w-4" />
                </Tile>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-tight text-ink">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-[13px] font-light leading-[1.45] text-muted">
                    {item.line}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>

          <Reveal
            delay={0.12}
            className="flex flex-col rounded-frame p-6 min-[760px]:p-8"
            style={{
              background: 'linear-gradient(160deg, var(--color-green-glow), var(--color-blue-glow))',
              boxShadow: `inset 0 0 0 1px ${tint('var(--color-green)', 22)}`
            }}
          >
            <div className={cn(LABEL, 'text-green')}>Our offer</div>

            <div className="mt-5 font-display text-[clamp(32px,5vw,46px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink">
              {PRICE.free}
            </div>

            <div className="mt-6 border-t border-line-2 pt-5">
              <div className="mono text-[11px] uppercase tracking-[.12em] text-faint">Then</div>
              <div className="mono mt-2 text-[clamp(30px,4.4vw,40px)] font-semibold leading-none text-ink">
                {PRICE.then}
                <span className="mono text-[17px] font-normal text-muted">{PRICE.per}</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <a href="#check" className={PRIMARY}>
                Start my system check &#8594;
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.2}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-frame px-6 py-5 text-center"
          style={{
            background: tint('var(--color-green)', 5),
            boxShadow: `inset 0 0 0 1px ${tint('var(--color-green)', 16)}`
          }}
        >
          <span className={cn(LABEL, 'text-green')}>&#9671; {NOT_SURE.label}</span>
          <span className="text-[15.5px] font-light leading-[1.5] text-ink/90">
            {NOT_SURE.line}
          </span>
        </Reveal>
      </Wrap>
    </Section>
  );
}
