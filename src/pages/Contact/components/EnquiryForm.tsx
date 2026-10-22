import {useId, useRef, useState, type ReactNode} from 'react';
import Glyph from '../../../components/Glyph';
import {LABEL, SECONDARY} from '../../../components/kit';
import {cn} from '../../../lib/cn';
import {
  EMPTY_ENQUIRY,
  ENQUIRY_PENDING_NOTE,
  FIELD_ORDER,
  problems,
  sendEnquiry,
  type Enquiry,
  type Field
} from '../../../lib/enquiry';

type Status = {kind: 'idle' | 'sending' | 'sent'} | {kind: 'failed'; message: string};

export default function EnquiryForm() {
  const [enquiry, setEnquiry] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>({kind: 'idle'});
  const form = useRef<HTMLFormElement>(null);
  const id = useId();

  const found = problems(enquiry);
  const errorFor = (field: Field) => (touched[field] ? found[field] : undefined);
  const sending = status.kind === 'sending';

  function write(field: Field, value: string) {
    setEnquiry((was) => ({...was, [field]: value}));
    if (status.kind === 'failed') setStatus({kind: 'idle'});
  }

  const leave = (field: Field) => setTouched((was) => ({...was, [field]: true}));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])));
      const control = form.current?.elements.namedItem(first);
      if (control instanceof HTMLElement) control.focus();
      return;
    }

    setStatus({kind: 'sending'});
    try {
      await sendEnquiry(enquiry);
      setStatus({kind: 'sent'});
    } catch (error) {
      setStatus({
        kind: 'failed',
        message: error instanceof Error ? error.message : 'That did not go through. Try again.'
      });
    }
  }

  function reset() {
    setEnquiry(EMPTY_ENQUIRY);
    setTouched({});
    setStatus({kind: 'idle'});
  }

  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      {status.kind === 'sent' ? (
        <Sent email={enquiry.email.trim()} onAgain={reset} />
      ) : (
        <form ref={form} onSubmit={submit} noValidate>
          <div className="border-b border-line-2 px-6 py-4">
            <span className={cn(LABEL, 'text-amber')}>Send us a message</span>
          </div>

          <div className="space-y-4 px-6 py-6">
            <div className="grid gap-4 min-[620px]:grid-cols-2">
              <Input
                id={`${id}-name`}
                name="name"
                label="Your name"
                autoComplete="name"
                value={enquiry.name}
                error={errorFor('name')}
                onChange={(value) => write('name', value)}
                onBlur={() => leave('name')}
              />
              <Input
                id={`${id}-email`}
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={enquiry.email}
                error={errorFor('email')}
                onChange={(value) => write('email', value)}
                onBlur={() => leave('email')}
              />
            </div>

            <Input
              id={`${id}-phone`}
              name="phone"
              label="Phone number"
              hint="Optional, if you would rather we call"
              type="tel"
              autoComplete="tel"
              placeholder="07700 900123"
              value={enquiry.phone}
              error={errorFor('phone')}
              onChange={(value) => write('phone', value)}
              onBlur={() => leave('phone')}
            />

            <Box id={`${id}-message`} label="How can we help?" error={errorFor('message')}>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={5}
                value={enquiry.message}
                onChange={(event) => write('message', event.target.value)}
                onBlur={() => leave('message')}
                aria-invalid={Boolean(errorFor('message'))}
                aria-describedby={errorFor('message') ? `${id}-message-error` : undefined}
                placeholder="A sentence or two is plenty."
                className="mt-2 w-full min-w-0 resize-y bg-transparent text-[15.5px] font-light leading-[1.6] text-ink outline-none placeholder:text-faint/60"
              />
            </Box>

            {status.kind === 'failed' ? (
              <p role="alert" className="text-[13.5px] font-light leading-[1.5] text-red">
                {status.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--cta)] px-7 py-3.5 text-[14px] font-semibold tracking-[-0.005em] text-[var(--cta-ink)] shadow-[0_12px_30px_-14px_var(--btn-glow)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
            >
              {sending ? 'Sending…' : 'Send message →'}
            </button>

            <p className="text-[12.5px] font-light leading-[1.55] text-faint">{ENQUIRY_PENDING_NOTE}</p>
          </div>

          {/* <div className="border-t border-line-2 bg-bg/40 px-6 py-5">
            <p className="text-[13px] font-light leading-[1.6] text-muted">
              We use these details only to reply to you. No mailing list, and nothing passed on.
            </p>
          </div> */}
        </form>
      )}
    </div>
  );
}

function Box({
  id,
  label,
  hint,
  error,
  children
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          'block rounded-card bg-bg-2 p-4 ring-1 transition focus-within:ring-green/60',
          error ? 'ring-red/60' : 'ring-line-2'
        )}
      >
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-[13px] font-medium text-ink">{label}</span>
          {hint ? <span className="text-[11.5px] font-light text-faint">{hint}</span> : null}
        </span>
        {children}
      </label>
      <Problem id={`${id}-error`}>{error}</Problem>
    </div>
  );
}

function Input({
  id,
  name,
  label,
  hint,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  error,
  onChange,
  onBlur
}: {
  id: string;
  name: Field;
  label: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <Box id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={type === 'text' ? undefined : type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full min-w-0 bg-transparent text-[16px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-faint/60"
      />
    </Box>
  );
}

function Problem({id, children}: {id: string; children?: string}) {
  if (!children) return null;

  return (
    <p id={id} className="mt-2 text-[13px] font-light leading-[1.5] text-red">
      {children}
    </p>
  );
}

function Sent({email, onAgain}: {email: string; onAgain: () => void}) {
  return (
    <div role="status" className="flex min-h-[420px] flex-col justify-center px-6 py-10">
      <span className="text-green">
        <Glyph name="insight" className="h-10 w-10" />
      </span>
      <h2 className="mt-5 font-display text-[clamp(24px,2.8vw,32px)] font-semibold uppercase leading-[1.06] tracking-[-0.01em] text-ink">
        Thanks, that is with us
      </h2>
      <p className="mt-3 text-[15px] font-light leading-[1.6] text-muted">
        We will reply to <span className="mono font-medium text-ink">{email}</span>. If you do not
        see it, check the folder your provider files new senders in.
      </p>

      <p className="mt-4 rounded-card bg-bg-2 px-4 py-3 text-[12.5px] font-light leading-[1.55] text-faint ring-1 ring-line-2">
        {ENQUIRY_PENDING_NOTE}
      </p>

      <div className="mt-6">
        <button type="button" onClick={onAgain} className={SECONDARY}>
          Send another message
        </button>
      </div>
    </div>
  );
}
