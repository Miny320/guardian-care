import Reveal from '../../components/Reveal';
import {usePageTitle} from '../../lib/country';

// Where "Open my dashboard" leads. The dashboard is not live yet, so the page says only that.
export default function Start() {
  usePageTitle('Dashboard');

  return (
    <main className="under-nav grid min-h-[80svh] place-items-center px-5">
      <Reveal
        as="h1"
        className="text-balance text-center font-display text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink"
      >
        Dashboard will launch soon
      </Reveal>
    </main>
  );
}
