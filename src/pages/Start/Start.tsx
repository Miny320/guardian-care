import Reveal from '../../components/Reveal';

export default function Start() {
  return (
    <main className="relative isolate flex min-h-[68vh] items-center justify-center px-5 py-24">
      <Reveal className="text-center">
        <h1 className="font-display text-[clamp(40px,8vw,92px)] font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-ink">
          Dashboard is <span className="text-brand-gradient">launching soon</span>.
        </h1>
      </Reveal>
    </main>
  );
}
