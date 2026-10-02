export default function ContactField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src="/assets/photos/contact.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: 'var(--img-grade) blur(14px)',
          transform: 'scale(1.06)'
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 900px 620px at 50% 0%, color-mix(in srgb, var(--color-bg) 48%, transparent), transparent 72%)',
            'linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 58%, transparent) 0%, color-mix(in srgb, var(--color-bg) 68%, transparent) 42%, color-mix(in srgb, var(--color-bg) 86%, transparent) 78%, var(--color-bg) 100%)',
            'linear-gradient(90deg, color-mix(in srgb, var(--color-bg) 34%, transparent), transparent 22%, transparent 78%, color-mix(in srgb, var(--color-bg) 34%, transparent))'
          ].join(', ')
        }}
      />
    </div>
  );
}
