import {useEffect, useRef, type ReactNode} from 'react';
import {createPortal} from 'react-dom';

// A full-height pop-up on the native <dialog>, so focus, Escape and screen readers behave.
// It renders into <body>, outside every themed section, so it sets its own light palette: a cream
// background with dark text.
export default function Modal({label, onClose, children}: {label: string; onClose: () => void; children: ReactNode}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    // The page behind stays still while the pop-up scrolls.
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // A click on the dimmed area outside the panel lands on the dialog itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="in-modal on-light m-auto h-[min(94svh,1100px)] max-h-none w-[min(1240px,96vw)] max-w-none overflow-y-auto overscroll-contain rounded-panel bg-bg p-0 text-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] ring-1 ring-line-2 backdrop:bg-[#011227]/75 backdrop:backdrop-blur-sm"
    >
      {/* Only the button takes clicks; the bar it sits in lets them through to the content. */}
      <div className="pointer-events-none sticky top-0 z-20 flex justify-end p-3 min-[760px]:p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-panel text-ink ring-1 ring-line-2 transition hover:bg-green hover:text-bg hover:ring-green"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="min-[760px]:-mt-[76px]">{children}</div>
    </dialog>,
    document.body
  );
}
