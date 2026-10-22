import Channels from './components/Channels';
import EnquiryForm from './components/EnquiryForm';
import Reveal from '../../components/Reveal';
import {LABEL_BASE} from '../../components/kit';
import {Wrap} from '../../components/ui';
import {cn} from '../../lib/cn';

export default function Contact() {
  return (
    <main className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] -top-[24%] -z-10 h-[72vw] w-[72vw] rounded-full blur-[150px] min-[1000px]:h-[52vw] min-[1000px]:w-[52vw]"
        style={{background: 'radial-gradient(circle, color-mix(in srgb, var(--wash-amber) 12%, transparent), transparent 64%)'}}
      />

      <Wrap>
        <div className="grid items-start gap-12 py-16 min-[760px]:py-24 min-[1080px]:grid-cols-[0.92fr_1.08fr] min-[1080px]:gap-16">
          <div className="min-[1080px]:sticky min-[1080px]:top-28">
            <Reveal className={cn(LABEL_BASE, 'text-[12px] tracking-[.12em] text-green')}>
              Contact
            </Reveal>

            <Reveal
              as="h1"
              delay={0.05}
              className="mt-6 font-display text-[clamp(40px,5.4vw,68px)] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-ink"
            >
              Talk to <span className="text-brand-gradient">team.</span>
            </Reveal>

            <Reveal
              as="p"
              delay={0.1}
              className="mt-6 max-w-[480px] text-[17px] font-light leading-[1.65] text-muted"
            >
              Whether you have solar already, are thinking about it, or install it for others, tell
              us what you need and someone from the team will come back to you.
            </Reveal>

            <Channels />
          </div>

          <Reveal delay={0.12} className="min-w-0">
            <EnquiryForm />
          </Reveal>
        </div>
      </Wrap>
    </main>
  );
}
