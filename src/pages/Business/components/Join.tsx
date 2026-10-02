import {Link} from 'react-router';
import Glyph from '../../../components/Glyph';
import {Heading, LABEL, LABEL_BASE, PRIMARY, dottedRail, ramp, tint} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {ERAS, JOIN} from '../../../data/businessFlow';
import {cn} from '../../../lib/cn';

export default function Join() {
  return (
    <Section id="join" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow="Joining"
          title="Four steps"
          accent="to a live console."
          body="Guardian Care connects to what you already run. Nothing about how you install has to change."
        />

        <ol className="grid gap-4 min-[620px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {JOIN.map((step, index) => {
            const colour = ramp(index, JOIN.length);

            return (
              <Reveal
                key={step.key}
                delay={index * 0.07}
                as="li"
                className="glass ring-lit relative flex flex-col rounded-frame p-6 min-[760px]:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="inline-grid h-10 w-10 place-items-center rounded-tile"
                    style={{
                      background: tint(colour, 14),
                      boxShadow: `inset 0 0 0 1px ${tint(colour, 30)}`,
                      color: colour
                    }}
                  >
                    <Glyph name={step.glyph} className="h-5 w-5" />
                  </span>

                  <span className="mono text-[11px] tracking-[.12em] text-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div
                  className="mt-6 font-display text-[26px] font-semibold uppercase leading-none tracking-[-0.01em]"
                  style={{color: colour}}
                >
                  {step.name}
                </div>

                <p className="mt-3.5 text-[14.5px] font-light leading-[1.55] text-muted">
                  {step.line}
                </p>

                <span
                  className={cn(
                    LABEL_BASE,
                    'mt-6 inline-flex w-fit rounded-pill px-3 py-1.5 text-[11px] tracking-[.12em]'
                  )}
                  style={{color: colour, background: tint(colour, 10)}}
                >
                  {step.note}
                </span>

                {index < JOIN.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 top-[38px] hidden h-px w-4 min-[1100px]:block"
                    style={{background: tint(colour, 40)}}
                  />
                ) : null}
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={0.24} className="mt-4 overflow-hidden rounded-frame ring-1 ring-line-2">
          <div className="flex items-center gap-3 border-b border-line-2 px-5 py-3.5">
            <span aria-hidden="true" className="h-4 w-px" style={dottedRail('var(--color-green)')} />
            <span className={cn(LABEL, 'text-green')}>Built for Feed-in Tariff systems</span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line-2 min-[760px]:grid-cols-5">
            {ERAS.map((era) => (
              <div key={era.name} className="bg-panel/50 px-5 py-4">
                <dt className="text-[13.5px] font-medium leading-tight text-ink">{era.name}</dt>
                <dd className="mono mt-1.5 text-[11px] uppercase tracking-[.12em] text-faint">
                  {era.rate} &#183; {era.note}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.3} className="mt-16 flex justify-center min-[760px]:mt-24">
          <Link to="/start" className={PRIMARY}>
            Go to dashboard &#8594;
          </Link>
        </Reveal>
      </Wrap>
    </Section>
  );
}
