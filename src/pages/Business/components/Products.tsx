import Glyph from '../../../components/Glyph';
import {Heading, LABEL, Tile, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {PRODUCTS} from '../../../data/businessFlow';
import {TONE_TEXT, TONE_VAR} from '../../../data/command';
import {cn} from '../../../lib/cn';

export default function Products() {
  return (
    <Section id="products" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="The platform"
          title="Three products."
          accent="One customer record."
          body="Your engineers capture it. Your team runs it. Your customer sees it. Nobody retypes anything."
        />

        <div className="grid gap-4 min-[860px]:grid-cols-3">
          {PRODUCTS.map((product, index) => (
            <Reveal
              key={product.key}
              delay={index * 0.07}
              className="glass ring-lit flex flex-col rounded-frame p-6 min-[760px]:p-7"
            >
              <div className="flex items-center gap-3.5">
                <Tile tone={product.tone}>
                  <Glyph name={product.glyph} className="h-5 w-5" />
                </Tile>
                <div>
                  <div className={cn(LABEL, TONE_TEXT[product.tone])}>{product.name}</div>
                  <div className="mono mt-1 text-[11px] text-faint">{product.who}</div>
                </div>
              </div>

              <div className="mt-7 font-display text-[clamp(28px,3.6vw,38px)] font-semibold uppercase leading-[0.95] tracking-[-0.015em] text-ink">
                {product.verb}
              </div>

              <p className="mt-4 text-[15px] font-light leading-[1.55] text-muted">
                {product.line}
              </p>

              <ul className="mt-auto space-y-2.5 border-t border-line-2 pt-6 [&>li]:flex [&>li]:items-center [&>li]:gap-2.5">
                {product.points.map((point) => (
                  <li key={point} className="text-[13.5px] font-light leading-tight text-ink/85">
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 shrink-0 rounded-full"
                      style={{background: TONE_VAR[product.tone]}}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal
          delay={0.2}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-frame px-6 py-5 text-center"
          style={{
            background: tint('var(--color-green)', 5),
            boxShadow: `inset 0 0 0 1px ${tint('var(--color-green)', 18)}`
          }}
        >
          <span className={cn(LABEL, 'text-green')}>&#9671; One record</span>
          <span className="text-[15px] font-light leading-[1.5] text-muted">
            The engineer&rsquo;s capture, the console&rsquo;s alerts and the customer&rsquo;s
            dashboard are the same file, read three ways.
          </span>
        </Reveal>
      </Wrap>
    </Section>
  );
}
