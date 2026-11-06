import {useId, useRef, useState, type ReactNode} from 'react';
import {useSearchParams} from 'react-router';
import Glyph from '../../../components/Glyph';
import {LABEL, PRIMARY, SECONDARY} from '../../../components/kit';
import type {Country} from '../../../data/countries';
import {useCountry} from '../../../lib/country';
import {cn} from '../../../lib/cn';
import {EMPTY_ENQUIRY, problems, sendEnquiry, type Enquiry, type Field} from '../../../lib/enquiry';

type Status = {kind: 'idle' | 'sending' | 'sent'} | {kind: 'failed'; message: string};

type Choice = {value: string; label: string};

const STEPS = ['Service', 'Your installation', 'What you need', 'Your details', 'Review & send'];

function services(country: Country): Choice[] {
  return [
    {value: 'assessment', label: 'Solar system assessment'},
    {value: 'inverter', label: 'Inverter replacement'},
    {value: 'battery', label: 'Battery storage'},
    {value: 'protection', label: 'Solar protection'},
    {value: 'maintenance', label: 'Maintenance & diagnostics'},
    {value: 'intelligence', label: 'Energy intelligence'},
    {value: 'tariff', label: country.tariffs.label},
    {value: 'new', label: 'New solar installation'},
    {value: 'business', label: 'Guardian Care for business'},
    {value: 'general', label: 'General enquiry'}
  ];
}

const YES_NO: Choice[] = [
  {value: 'Yes', label: 'Yes'},
  {value: 'No', label: 'No'},
  {value: 'Not sure', label: 'Not sure'}
];

const INSTALLED: Choice[] = [
  {value: 'Before 2015', label: 'Before 2015'},
  {value: '2015–2019', label: '2015–2019'},
  {value: '2020 or later', label: '2020 or later'},
  {value: 'Not sure', label: 'Not sure'}
];

function postcodeLabel({code}: Country) {
  return code === 'us' ? 'ZIP code' : code === 'th' ? 'Postal code' : 'Postcode';
}

export default function EnquiryForm() {
  const country = useCountry();
  const [params] = useSearchParams();
  const options = services(country);
  const requested = params.get('service');

  const [step, setStep] = useState(0);
  const [service, setService] = useState(options.some((item) => item.value === requested) ? requested! : '');
  const [hasSolar, setHasSolar] = useState('');
  const [hasBattery, setHasBattery] = useState('');
  const [installed, setInstalled] = useState('');
  const [postcode, setPostcode] = useState('');
  const [enquiry, setEnquiry] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>({kind: 'idle'});
  const form = useRef<HTMLFormElement>(null);
  const id = useId();

  const found = problems(enquiry);
  const errorFor = (field: Field) => (touched[field] ? found[field] : undefined);
  const sending = status.kind === 'sending';
  const serviceLabel = options.find((item) => item.value === service)?.label ?? '';

  const details: Array<[string, string]> = [
    ['Has solar', hasSolar || 'Not answered'],
    ...(hasSolar === 'Yes' ? [['Installed', installed || 'Not answered'] as [string, string]] : []),
    ['Has a battery', hasBattery || 'Not answered'],
    [postcodeLabel(country), postcode.trim() || 'Not given']
  ];

  // Fields each step must have right before moving on.
  const stepFields: Field[][] = [[], [], ['message'], ['name', 'email', 'phone'], []];

  function write(field: Field, value: string) {
    setEnquiry((was) => ({...was, [field]: value}));
    if (status.kind === 'failed') setStatus({kind: 'idle'});
  }

  const leave = (field: Field) => setTouched((was) => ({...was, [field]: true}));

  function stepReady(index: number) {
    if (index === 0) return service !== '';
    if (index === 1) return hasSolar !== '' && hasBattery !== '';
    return stepFields[index].every((field) => !found[field]);
  }

  function next() {
    if (!stepReady(step)) {
      const fields = stepFields[step];
      setTouched((was) => ({...was, ...Object.fromEntries(fields.map((field) => [field, true]))}));
      const first = fields.find((field) => found[field]);
      const control = first ? form.current?.elements.namedItem(first) : null;
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    setStep((was) => Math.min(STEPS.length - 1, was + 1));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    if (sending) return;

    setStatus({kind: 'sending'});
    try {
      await sendEnquiry(enquiry, {country: country.name, service: serviceLabel, details});
      setStatus({kind: 'sent'});
    } catch (error) {
      setStatus({kind: 'failed', message: error instanceof Error ? error.message : 'That did not go through. Try again.'});
    }
  }

  function reset() {
    setStep(0);
    setService('');
    setHasSolar('');
    setHasBattery('');
    setInstalled('');
    setPostcode('');
    setEnquiry(EMPTY_ENQUIRY);
    setTouched({});
    setStatus({kind: 'idle'});
  }

  if (status.kind === 'sent') {
    return (
      <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
        <Sent email={enquiry.email.trim()} onAgain={reset} />
      </div>
    );
  }

  return (
    <div className="glass shadow-lift ring-lit overflow-hidden rounded-frame">
      <form ref={form} onSubmit={submit} noValidate>
        <div className="border-b border-line-2 px-6 py-4">
          <div className="flex items-baseline justify-between gap-4">
            <span className={cn(LABEL, 'text-amber')}>{STEPS[step]}</span>
            <span className="mono text-[11px] text-faint">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {STEPS.map((label, index) => (
              <span
                key={label}
                className={cn('h-[3px] flex-1 rounded-full', index < step ? 'bg-green/55' : index === step ? 'bg-green' : 'bg-line-2')}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          {step === 0 ? (
            <Choices legend="What can we help you with?" options={options} value={service} onPick={setService} columns />
          ) : null}

          {step === 1 ? (
            <>
              <Choices legend="Do you have solar panels?" options={YES_NO} value={hasSolar} onPick={setHasSolar} />
              {hasSolar === 'Yes' ? (
                <Choices legend="Roughly when was it installed?" options={INSTALLED} value={installed} onPick={setInstalled} />
              ) : null}
              <Choices legend="Do you have a battery?" options={YES_NO} value={hasBattery} onPick={setHasBattery} />
            </>
          ) : null}

          {step === 2 ? (
            <Box id={`${id}-message`} label="How can we help?" error={errorFor('message')}>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={6}
                value={enquiry.message}
                onChange={(event) => write('message', event.target.value)}
                onBlur={() => leave('message')}
                aria-invalid={Boolean(errorFor('message'))}
                aria-describedby={errorFor('message') ? `${id}-message-error` : undefined}
                placeholder="A sentence or two is plenty."
                className="mt-2 w-full min-w-0 resize-y bg-transparent text-[15.5px] font-light leading-[1.6] text-ink outline-none placeholder:text-faint/60"
              />
            </Box>
          ) : null}

          {step === 3 ? (
            <>
              <div className="grid gap-4 min-[620px]:grid-cols-2">
                <Input id={`${id}-name`} name="name" label="Your name" autoComplete="name" value={enquiry.name} error={errorFor('name')} onChange={(value) => write('name', value)} onBlur={() => leave('name')} />
                <Input id={`${id}-email`} name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" value={enquiry.email} error={errorFor('email')} onChange={(value) => write('email', value)} onBlur={() => leave('email')} />
              </div>
              <div className="grid gap-4 min-[620px]:grid-cols-2">
                <Input id={`${id}-phone`} name="phone" label="Phone number" hint="Optional" type="tel" autoComplete="tel" value={enquiry.phone} error={errorFor('phone')} onChange={(value) => write('phone', value)} onBlur={() => leave('phone')} />
                <Input id={`${id}-postcode`} label={postcodeLabel(country)} hint="Optional" autoComplete="postal-code" value={postcode} onChange={setPostcode} onBlur={() => undefined} />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <dl className="divide-y divide-line-2 overflow-hidden rounded-card ring-1 ring-line-2">
              {[
                ['Country', country.name],
                ['Service', serviceLabel],
                ...details,
                ['Name', enquiry.name.trim()],
                ['Email', enquiry.email.trim()],
                ['Phone', enquiry.phone.trim() || 'Not given'],
                ['Message', enquiry.message.trim()]
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 bg-bg-2/60 px-4 py-3 min-[520px]:grid-cols-[140px_1fr]">
                  <dt className="text-[13px] font-light text-faint">{label}</dt>
                  <dd className="whitespace-pre-line text-[14.5px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {status.kind === 'failed' ? (
            <p role="alert" className="text-[13.5px] font-light leading-[1.5] text-red">
              {status.message}
            </p>
          ) : null}

          {step < 2 && !stepReady(step) ? (
            <p className="text-[13px] font-light text-faint">Choose an answer to continue. “Not sure” is always fine.</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((was) => was - 1)} className={SECONDARY}>
                ← Back
              </button>
            ) : null}
            <button
              type="submit"
              disabled={sending || (step < 2 && !stepReady(step))}
              className={cn('flex-1', PRIMARY, 'disabled:pointer-events-none disabled:opacity-40')}
            >
              {step < STEPS.length - 1 ? 'Continue →' : sending ? 'Sending…' : 'Send message →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Choices({
  legend,
  options,
  value,
  onPick,
  columns
}: {
  legend: string;
  options: Choice[];
  value: string;
  onPick: (value: string) => void;
  columns?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-[15px] font-medium text-ink">{legend}</legend>
      <div className={cn('mt-3 grid gap-2', columns ? 'min-[520px]:grid-cols-2' : 'grid-cols-2 min-[520px]:grid-cols-4')}>
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(option.value)}
              className={cn(
                'rounded-card px-4 py-3 text-left text-[14.5px] transition duration-200',
                on ? 'bg-green-glow font-medium text-ink ring-2 ring-green' : 'bg-bg-2 text-ink ring-1 ring-line-2 hover:ring-green/45'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Box({id, label, hint, error, children}: {id: string; label: string; hint?: string; error?: string; children: ReactNode}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn('block rounded-card bg-bg-2 p-4 ring-1 transition focus-within:ring-green/60', error ? 'ring-red/60' : 'ring-line-2')}
      >
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-[13px] font-medium text-ink">{label}</span>
          {hint ? <span className="text-[11.5px] font-light text-faint">{hint}</span> : null}
        </span>
        {children}
      </label>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] font-light leading-[1.5] text-red">
          {error}
        </p>
      ) : null}
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
  name?: Field;
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

function Sent({email, onAgain}: {email: string; onAgain: () => void}) {
  return (
    <div role="status" className="flex min-h-[420px] flex-col justify-center px-6 py-10">
      <span className="text-green">
        <Glyph name="insight" className="h-10 w-10" />
      </span>
      <h2 className="mt-5 font-display text-[clamp(24px,2.8vw,32px)] font-extrabold leading-[1.06] tracking-[-0.01em] text-ink">
        Thanks, that is with us
      </h2>
      <p className="mt-3 text-[15px] font-light leading-[1.6] text-muted">
        We will reply to <span className="mono font-medium text-ink">{email}</span>. If you do not see it, check the
        folder your provider files new senders in.
      </p>
      <div className="mt-6">
        <button type="button" onClick={onAgain} className={SECONDARY}>
          Send another message
        </button>
      </div>
    </div>
  );
}
