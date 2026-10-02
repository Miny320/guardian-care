import {useEffect, useRef, useState} from 'react';
import {cn} from '../lib/cn';

const PARTS = /^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/;
const DURATION = 1100;

function ease(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function Counter({value, className}: {value: string; className?: string}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [rendered, setRendered] = useState(value);

  if (rendered !== value) {
    setRendered(value);
    setShown(value);
  }

  const match = PARTS.exec(value);
  const prefix = match?.[1] ?? '';
  const digits = match?.[2] ?? '';
  const suffix = match?.[3] ?? '';
  const target = Number(digits.replace(/,/g, ''));
  const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
  const grouped = digits.includes(',');
  const countable = Boolean(match) && Number.isFinite(target);

  useEffect(() => {
    const node = ref.current;

    if (!node || !countable) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let start = 0;

    function paint(at: number) {
      const [whole, fraction] = at.toFixed(decimals).split('.');
      const body = grouped ? Number(whole).toLocaleString('en-US') : whole;
      setShown(`${prefix}${body}${fraction ? `.${fraction}` : ''}${suffix}`);
    }

    function step(now: number) {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      paint(target * ease(t));
      if (t < 1) frame = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          frame = requestAnimationFrame(step);
        }
      },
      {threshold: 0.4}
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [countable, prefix, suffix, target, decimals, grouped]);

  return (
    <span ref={ref} className={cn('[font-variant-numeric:tabular-nums]', className)}>
      {shown}
    </span>
  );
}
