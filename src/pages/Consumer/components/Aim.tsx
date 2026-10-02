import {Link} from 'react-router';
import Glyph from '../../../components/Glyph';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {AIMS, AIM_SUM} from '../../../data/consumer';
import {Heading, PRIMARY, Tile, ramp} from '../../../components/kit';

export default function Aim() {
  return (
    <Section id="aim" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          eyebrow=" Our aim"
          title="Get more from the solar"
          accent="you already own."
          body="You have already paid for the system. This is about getting what you paid for."
        />

        <ul className="ring-lit grid gap-px overflow-hidden rounded-frame bg-line-2 min-[620px]:grid-cols-2 min-[1000px]:grid-cols-3">
          {AIMS.map((aim, index) => (
            <Reveal
              key={aim.line}
              as="li"
              delay={index * 0.05}
              className="flex items-center gap-4 bg-panel px-6 py-6 min-[760px]:px-7 min-[760px]:py-7"
            >
              <Tile colour={ramp(index, AIMS.length)} size="md">
                <Glyph name={aim.glyph} bold className="h-6 w-6" />
              </Tile>
              <span className="text-[16px] font-normal leading-[1.4] text-ink">{aim.line}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal
          delay={0.2}
          className="mt-4 rounded-frame p-px"
          style={{
            background:
              'linear-gradient(100deg, var(--ramp-far), var(--ramp-mid) 50%, var(--color-blue))'
          }}
        >
          <div className="flex flex-col items-start gap-4 rounded-[5px] bg-[linear-gradient(180deg,var(--color-panel),var(--color-bg-2))] px-6 py-6 min-[760px]:flex-row min-[760px]:items-center min-[760px]:gap-6 min-[760px]:px-8">
            <Tile colour="var(--ramp-mid)" size="md">
              <Glyph name="solarRoof" bold className="h-6 w-6" />
            </Tile>
            <span className="font-display text-[clamp(21px,2.6vw,28px)] font-semibold uppercase leading-[1.08] text-ink">
              And, above all: <span className="text-brand-gradient">{AIM_SUM}.</span>
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.26} className="mt-16 flex justify-center min-[760px]:mt-24">
          <Link to="/start" className={PRIMARY}>
            Go to dashboard &#8594;
          </Link>
        </Reveal>
      </Wrap>
    </Section>
  );
}
