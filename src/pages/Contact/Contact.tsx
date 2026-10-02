import {useRef, useState} from 'react';
import ContactField from './ContactField';
import Glyph from '../../components/Glyph';
import Reveal from '../../components/Reveal';
import {Section, Wrap} from '../../components/ui';
import {LABEL, SECONDARY} from '../../components/kit';
import {CONTACT} from '../../data/contact';
import {cn} from '../../lib/cn';
import {
  EMPTY_ENQUIRY,
  ROLES,
  problems,
  sendEnquiry,
  type Enquiry,
  type Field
} from '../../lib/enquiry';

export default function Contact() {
  const [enquiry, setEnquiry] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [failure, setFailure] = useState('');
  const form = useRef<HTMLFormElement>(null);

  const found = problems(enquiry);
  const sending = status === 'sending';

  const errorFor = (field: Field) => (touched[field] ? found[field] : undefined);

  function write(field: Field, value: string) {
    setEnquiry((was) => ({...was, [field]: value}));
    if (status === 'failed') setStatus('idle');
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;

    const order: Field[] = ['name', 'email', 'phone', 'role', 'message'];

    if (Object.keys(found).length > 0) {
      setTouched(Object.fromEntries(order.map((field) => [field, true])));

      const first = order.find((field) => found[field]);
      if (first) {
        const control = form.current?.elements.namedItem(first);
        if (control instanceof HTMLElement) control.focus();
      }
      return;
    }

    setStatus('sending');
    try {
      await sendEnquiry(enquiry);
      setStatus('sent');
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'That did not go through. Try again.');
      setStatus('failed');
    }
  }

  return (
    <main className="relative isolate overflow-hidden">
      <ContactField />

      <Section className="py-10 min-[760px]:py-14">
        <Wrap>
          <Reveal>
            <h1 className="mx-auto max-w-[720px] text-center font-display text-[clamp(34px,6vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink">
              Ask us <span className="text-brand-gradient">anything.</span>
            </h1>
          </Reveal>

          <div className="mt-8 grid gap-4 min-[760px]:mt-10 min-[1000px]:grid-cols-[1.25fr_0.75fr] min-[1000px]:items-start">
            <Reveal className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
              {status === 'sent' ? (
                <Sent
                  onAgain={() => {
                    setEnquiry(EMPTY_ENQUIRY);
                    setTouched({});
                    setStatus('idle');
                  }}
                />
              ) : (
                <form ref={form} noValidate onSubmit={submit}>
                  <div className="border-b border-line-2 px-6 py-4">
                    <span className={cn(LABEL, 'text-amber')}>Send us a message</span>
                  </div>

                  <div className="grid gap-4 px-6 py-6 min-[620px]:grid-cols-2">
                    <Text
                      field="name"
                      label="Full name"
                      placeholder="Alex Hartley"
                      autoComplete="name"
                      value={enquiry.name}
                      error={errorFor('name')}
                      onWrite={write}
                      onLeave={setTouched}
                    />

                    <Text
                      field="email"
                      label="Email address"
                      type="email"
                      inputMode="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      value={enquiry.email}
                      error={errorFor('email')}
                      onWrite={write}
                      onLeave={setTouched}
                    />

                    <Text
                      field="phone"
                      label="Phone number"
                      type="tel"
                      inputMode="tel"
                      placeholder="07700 900123"
                      autoComplete="tel"
                      value={enquiry.phone}
                      error={errorFor('phone')}
                      onWrite={write}
                      onLeave={setTouched}
                    />

                    <FieldShell
                      field="role"
                      label="Which are you?"
                      error={errorFor('role')}
                      value={enquiry.role}
                    >
                      <span className="relative mt-2.5 flex items-center">
                        <select
                          id="role"
                          name="role"
                          value={enquiry.role}
                          aria-invalid={errorFor('role') ? true : undefined}
                          aria-describedby={errorFor('role') ? 'role-error' : undefined}
                          onChange={(event) => write('role', event.target.value)}
                          onBlur={() => setTouched((was) => ({...was, role: true}))}
                          className={cn(
                            'w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 text-[15.5px] outline-none',
                            enquiry.role ? 'font-medium text-ink' : 'font-light text-faint/60'
                          )}
                        >
                          <option value="" disabled>
                            Choose one…
                          </option>
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className="pointer-events-none absolute right-0 h-3 w-3 text-faint"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 4.5 6 8l3.5-3.5" />
                        </svg>
                      </span>
                    </FieldShell>

                    <div className="min-[620px]:col-span-2">
                      <FieldShell
                        field="message"
                        label="How can we help?"
                        error={errorFor('message')}
                        value={enquiry.message}
                      >
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={enquiry.message}
                          placeholder="Tell us about your system, your portfolio, or whatever brought you here."
                          aria-invalid={errorFor('message') ? true : undefined}
                          aria-describedby={errorFor('message') ? 'message-error' : undefined}
                          onChange={(event) => write('message', event.target.value)}
                          onBlur={() => setTouched((was) => ({...was, message: true}))}
                          className="mt-2.5 w-full min-w-0 resize-y bg-transparent text-[15.5px] font-light leading-[1.6] text-ink outline-none placeholder:text-faint/60"
                        />
                      </FieldShell>
                    </div>
                  </div>

                  <div className="border-line-2 px-6 py-6">
                    {status === 'failed' ? (
                      <p role="alert" className="mb-3 text-[13.5px] font-light leading-[1.5] text-red">
                        {failure}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--cta)] px-7 py-3.5 text-[14px] font-semibold tracking-[-0.005em] text-[var(--cta-ink)] shadow-[0_12px_30px_-14px_var(--btn-glow)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40 min-[620px]:w-auto"
                    >
                      {sending ? 'Sending…' : 'Send my message →'}
                    </button>
                  </div>
                </form>
              )}
            </Reveal>

            <Reveal delay={0.08} className="grid gap-4">
              <div className="glass ring-lit overflow-hidden rounded-frame">
                <div className="border-b border-line-2 px-6 py-4">
                  <span className={cn(LABEL, 'text-faint')}>Or reach us directly</span>
                </div>
                <div className="px-6 py-6">
                  <Direct
                    glyph="call"
                    label="Call us"
                    value={CONTACT.phone}
                    href={CONTACT.phoneHref}
                    note={CONTACT.hours}
                  />
                  <div className="my-5 border-t border-line-2" />
                  <Direct
                    glyph="connect"
                    label="Email us"
                    value={CONTACT.email}
                    href={CONTACT.emailHref}
                    note="We answer within one working day"
                  />
                </div>
              </div>

              <div className="glass ring-lit overflow-hidden rounded-frame">
                <div className="border-b border-line-2 px-6 py-4">
                  <span className={cn(LABEL, 'text-faint')}>What happens next</span>
                </div>
                <ol className="px-6 py-6">
                  {NEXT.map((step, index) => (
                    <li key={step} className="flex items-start gap-4 pb-5 last:pb-0">
                      <span className="mono grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-2 text-[11px] font-semibold text-faint">
                        {index + 1}
                      </span>
                      <span className="pt-1 text-[14.5px] font-light leading-[1.55] text-muted">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </Wrap>
      </Section>
    </main>
  );
}

const NEXT = [
  'Your message is routed by the role you picked, so it reaches somebody who works on that.',
  'We reply by email, or call if that is quicker for what you asked.',
  'Nothing is added to a mailing list. This is an enquiry, not a sign-up.'
];

function FieldShell({
  field,
  label,
  error,
  children
}: {
  field: Field;
  label: string;
  error?: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={field}
        className={cn(
          'block rounded-card bg-field p-4 ring-1 transition focus-within:bg-field-lit focus-within:ring-green/60',
          error ? 'ring-red/70' : 'ring-line-2'
        )}
      >
        <span className="block text-[13px] font-medium text-ink">{label}</span>
        {children}
      </label>

      {error ? (
        <p
          id={`${field}-error`}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-light leading-[1.45] text-red"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Text({
  field,
  label,
  value,
  error,
  onWrite,
  onLeave,
  ...input
}: {
  field: Field;
  label: string;
  value: string;
  error?: string;
  onWrite: (field: Field, value: string) => void;
  onLeave: React.Dispatch<React.SetStateAction<Partial<Record<Field, boolean>>>>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell field={field} label={label} error={error} value={value}>
      <input
        {...input}
        id={field}
        name={field}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${field}-error` : undefined}
        onChange={(event) => onWrite(field, event.target.value)}
        onBlur={() => onLeave((was) => ({...was, [field]: true}))}
        className="mt-2.5 w-full min-w-0 bg-transparent text-[15.5px] font-medium text-ink outline-none placeholder:font-light placeholder:text-faint/60"
      />
    </FieldShell>
  );
}

function Direct({
  glyph,
  label,
  value,
  href,
  note
}: {
  glyph: 'call' | 'connect';
  label: string;
  value: string;
  href: string;
  note: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 shrink-0 text-green">
        <Glyph name={glyph} className="h-7 w-7" />
      </span>
      <span className="min-w-0">
        <span className={cn(LABEL, 'block text-faint')}>{label}</span>
        <a
          href={href}
          className="mono mt-1.5 block break-words text-[16px] font-semibold text-ink transition-colors hover:text-green"
        >
          {value}
        </a>
        <span className="mt-1 block text-[13px] font-light text-faint">{note}</span>
      </span>
    </div>
  );
}

function Sent({onAgain}: {onAgain: () => void}) {
  return (
    <div className="flex min-h-[420px] flex-col justify-center px-6 py-8">
      <span className="text-green">
        <Glyph name="insight" className="h-10 w-10" />
      </span>
      <h2 className="mt-5 font-display text-[clamp(24px,3vw,34px)] font-semibold uppercase leading-[1.04] tracking-[-0.01em] text-ink">
        Thank you
      </h2>
      <p className="mt-3 max-w-[460px] text-[15.5px] font-light leading-[1.6] text-muted">
        Your message is on its way to whoever handles the role you picked. We answer within one
        working day.
      </p>

      <div className="mt-6">
        <button type="button" onClick={onAgain} className={SECONDARY}>
          Write another message
        </button>
      </div>
    </div>
  );
}
