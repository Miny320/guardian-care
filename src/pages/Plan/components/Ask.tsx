import {useState} from 'react';
import {Link} from 'react-router';
import {Heading, PRIMARY} from '../../../components/kit';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';
import {QUESTIONS} from '../../../data/plan';
import {cn} from '../../../lib/cn';

export default function Ask() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="ask" hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading
          title="Before anybody"
          accent="takes your details."
          body="No form. No callback. The questions that actually decide it, answered in the order people ask them."
        />

        <ul className="mx-auto max-w-[880px] overflow-hidden rounded-frame bg-line-2 ring-lit grid gap-px">
          {QUESTIONS.map((item, index) => {
            const on = open === index;

            return (
              <Reveal key={item.q} as="li" delay={index * 0.03} className="bg-panel">
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setOpen(on ? null : index)}
                    className={cn(
                      'flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-200 min-[760px]:px-7',
                      on ? 'bg-panel-2' : 'hover:bg-panel-2/60'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mono shrink-0 text-[11px] font-semibold tracking-[.12em] transition-colors',
                        on ? 'text-amber' : 'text-faint'
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={cn(
                        'min-w-0 flex-1 text-[15.5px] leading-[1.4] transition-colors min-[760px]:text-[17px]',
                        on ? 'font-medium text-ink' : 'font-light text-ink/85'
                      )}
                    >
                      {item.q}
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'relative grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-200',
                        on ? 'border-amber text-amber' : 'border-line-2 text-faint'
                      )}
                    >
                      <span className="absolute h-px w-3 bg-current" />
                      <span
                        className={cn(
                          'absolute h-3 w-px bg-current transition-transform duration-300 ease-brand',
                          on ? 'scale-y-0' : 'scale-y-100'
                        )}
                      />
                    </span>
                  </button>
                </h3>

                {on ? (
                  <div className="bg-panel-2 px-5 pb-6 min-[760px]:px-7">
                    <p className="max-w-[640px] border-l-2 border-amber/45 pl-5 text-[15px] font-light leading-[1.65] text-muted min-[760px]:ml-8">
                      {item.a}
                    </p>
                  </div>
                ) : null}
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={0.12} className="mt-16 flex justify-center min-[760px]:mt-24">
          <Link to="/start" className={PRIMARY}>
            Go to dashboard &#8594;
          </Link>
        </Reveal>
      </Wrap>
    </Section>
  );
}
