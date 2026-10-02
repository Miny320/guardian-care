import {useEffect, useRef, useState} from 'react';
import type {CSSProperties, ElementType, ReactNode} from 'react';
import {cn} from '../lib/cn';

type RevealProps = {
  as?: ElementType;
  delay?: number;
  animation?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
};

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  animation = 'animate-fadeup',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      {threshold: 0.08}
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  const merged: CSSProperties | undefined =
    shown && delay ? {...style, animationDelay: `${delay}s`} : style;

  return (
    <Tag
      ref={ref}
      className={cn(shown ? animation : 'opacity-0', className)}
      style={merged}
      {...rest}
    >
      {children}
    </Tag>
  );
}
