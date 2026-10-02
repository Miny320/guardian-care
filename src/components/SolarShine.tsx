export type Shine = {
  top: string;
  side: 'left' | 'right';
  offset: string;
  tone: string;
  under: string;
  core: string;
  blur: number;
  breath: number;
};

export default function SolarShine({suns}: {suns: Shine[]}) {
  return (
    <>
      {suns.map((sun) => (
        <div
          key={`${sun.top}-${sun.side}`}
          className="animate-bloom absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: sun.top,
            [sun.side]: sun.offset,
            height: sun.core,
            width: sun.core,
            filter: `blur(${sun.blur}px)`,
            animationDuration: `${sun.breath}s`,
            background: `radial-gradient(circle, color-mix(in srgb, ${sun.tone} var(--shine-core), transparent) 0%, color-mix(in srgb, ${sun.under} calc(var(--shine-core) * 0.5), transparent) 38%, transparent 72%)`
          }}
        />
      ))}
    </>
  );
}
