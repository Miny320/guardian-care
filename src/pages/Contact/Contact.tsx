import ContactField from './ContactField';
import Scheduler from './Scheduler';
import Reveal from '../../components/Reveal';
import {Section, Wrap} from '../../components/ui';

export default function Contact() {
  return (
    <main className="relative isolate overflow-hidden">
      <ContactField />

      <Section className="py-10 min-[760px]:py-14">
        <Wrap>
          <Reveal>
            <h1 className="mx-auto max-w-[720px] text-center font-display text-[clamp(34px,6vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink">
              Book a <span className="text-brand-gradient">time.</span>
            </h1>
          </Reveal>

          <Reveal className="mx-auto mt-8 min-w-0 max-w-[920px] min-[760px]:mt-10">
            <Scheduler />
          </Reveal>
        </Wrap>
      </Section>
    </main>
  );
}
