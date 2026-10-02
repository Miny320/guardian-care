import {useState} from 'react';
import {cn} from '../lib/cn';

export default function Photo({
  src,
  alt,
  className,
  imgClassName,
  veil = true,
  children
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  veil?: boolean;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-panel', className)}>
      {failed ? (
        <div
          className="h-full w-full"
          role="img"
          aria-label={alt}
          style={{background: 'var(--photo-fallback)'}}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('img-graded h-full w-full object-cover', imgClassName)}
        />
      )}

      {veil ? <div className="bg-photo-veil pointer-events-none absolute inset-0" /> : null}
      {children}
    </div>
  );
}
