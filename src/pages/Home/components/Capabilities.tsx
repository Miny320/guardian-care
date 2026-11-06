import {useEffect, useRef, useState} from 'react';
import Reveal from '../../../components/Reveal';
import {Section, Wrap} from '../../../components/ui';

// What the platform brings together. The percentages are placeholders: replace them with real
// figures (for example detection rates or fleet coverage) before launch.
const CAPABILITIES = [
  {name: 'Real-Time System Monitoring', value: 96},
  {name: 'AI Fault Detection & Diagnostics', value: 92},
  {name: 'Predictive Maintenance', value: 88},
  {name: 'Personalised Energy Optimisation', value: 90},
  {name: 'Connected Field Operations', value: 94}
];

// The Guardian Care mark held by a robotic hand, with the platform's capabilities in a panel
// that overlaps the image. The bars fill once the panel scrolls into view.
export default function Capabilities() {
  const panel = useRef<HTMLDivElement>(null);
  // Without IntersectionObserver the bars simply start full.
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = panel.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      {threshold: 0.3}
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Section id="capabilities" className="pb-24 pt-4 min-[760px]:pb-32">
      <Wrap>
        <div className="relative min-[900px]:pb-24">
          {/* The image fades in slowly as it scrolls into view. */}
          <Reveal animation="animate-fadein" className="overflow-hidden min-[900px]:w-[74%]">
            <img
              src="/assets/photos/ai-hand.jpg"
              alt="The Guardian Care mark hovering above an open robotic hand"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-[center_35%] min-[900px]:aspect-[16/10]"
            />
          </Reveal>

          <div
            ref={panel}
            className="relative mx-4 -mt-16 bg-[#1b2433] px-7 py-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] min-[560px]:mx-10 min-[760px]:px-11 min-[760px]:py-11 min-[900px]:absolute min-[900px]:right-0 min-[900px]:top-[22%] min-[900px]:mx-0 min-[900px]:mt-0 min-[900px]:w-[50%]"
          >
            <ul className="grid gap-8">
              {CAPABILITIES.map((item, index) => (
                <li key={item.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[clamp(16px,1.4vw,19px)] font-semibold text-white">{item.name}</span>
                    <span className="shrink-0 text-[clamp(16px,1.4vw,19px)] font-bold text-white">{item.value}%</span>
                  </div>
                  <div aria-hidden="true" className="mt-4 h-[3px] w-full bg-white/15">
                    <div
                      className="h-full bg-[#c6ec6e] transition-[width] duration-[1400ms] ease-brand motion-reduce:transition-none"
                      style={{width: shown ? `${item.value}%` : '0%', transitionDelay: `${index * 120}ms`}}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
