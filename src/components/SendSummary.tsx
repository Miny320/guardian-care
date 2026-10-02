import {useId, useState} from 'react';
import Glyph from './Glyph';
import Reveal from './Reveal';
import {Section, Wrap} from './ui';
import {Heading, LABEL, SECONDARY} from './kit';
import {cn} from '../lib/cn';
import {
  PENDING_NOTE,
  segments,
  sendSummary,
  validFor,
  type Channel,
  type Summary
} from '../lib/deliver';

type SendSummaryProps = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  summary: Summary;
  verb: string;
};

type Status = {kind: 'idle' | 'sending' | 'sent'} | {kind: 'failed'; message: string};

export default function SendSummary({
  id,
  eyebrow,
  title,
  accent,
  body,
  summary,
  verb
}: SendSummaryProps) {
  const [channel, setChannel] = useState<Channel>('email');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState<Status>({kind: 'idle'});
  const field = useId();

  const ready = validFor(channel, to);
  const sending = status.kind === 'sending';

  function pick(next: Channel) {
    if (next === channel) return;
    setChannel(next);
    setTo('');
    setStatus({kind: 'idle'});
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || sending) return;

    setStatus({kind: 'sending'});
    try {
      await sendSummary({channel, to: to.trim(), summary});
      setStatus({kind: 'sent'});
    } catch (error) {
      setStatus({
        kind: 'failed',
        message: error instanceof Error ? error.message : 'That did not go through. Try again.'
      });
    }
  }

  return (
    <Section id={id} hairline className="py-16 min-[760px]:py-24">
      <Wrap>
        <Heading eyebrow={eyebrow} title={title} accent={accent} body={body} />

        <div className="grid gap-4 min-[1080px]:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="glass shadow-lift ring-lit flex flex-col overflow-hidden rounded-frame">
            {status.kind === 'sent' ? (
              <Sent channel={channel} to={to.trim()} onAgain={() => setStatus({kind: 'idle'})} />
            ) : (
              <form onSubmit={submit} className="flex flex-1 flex-col">
                <div className="border-b border-line-2 px-6 py-4">
                  <span className={cn(LABEL, 'text-amber')}>Where should it go?</span>
                </div>

                <div className="flex-1 px-6 py-6">
                  <div
                    role="radiogroup"
                    aria-label="How would you like your summary?"
                    className="grid grid-cols-2 gap-2.5"
                  >
                    {CHANNELS.map((option) => {
                      const picked = channel === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={picked}
                          onClick={() => pick(option.value)}
                          className={cn(
                            'flex items-center gap-3 rounded-card px-4 py-3.5 text-left transition duration-200 ease-brand',
                            picked
                              ? 'bg-green-glow ring-2 ring-green'
                              : 'bg-bg-2 ring-1 ring-line-2 hover:-translate-y-0.5 hover:ring-green/45'
                          )}
                        >
                          <Tick picked={picked} />
                          <span className="min-w-0">
                            <span
                              className={cn(
                                'block text-[15px] leading-[1.35]',
                                picked ? 'font-medium text-ink' : 'font-light text-ink'
                              )}
                            >
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] font-light leading-[1.4] text-faint">
                              {option.note}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <label
                    htmlFor={field}
                    className="mt-4 block rounded-card bg-bg-2 p-4 ring-1 ring-line-2 transition focus-within:ring-green/60"
                  >
                    <span className="block text-[13px] font-medium text-ink">
                      {channel === 'email' ? 'Your email address' : 'Your mobile number'}
                    </span>
                    <input
                      id={field}
                      type={channel === 'email' ? 'email' : 'tel'}
                      inputMode={channel === 'email' ? 'email' : 'tel'}
                      autoComplete={channel === 'email' ? 'email' : 'tel'}
                      value={to}
                      onChange={(event) => {
                        setTo(event.target.value);
                        if (status.kind === 'failed') setStatus({kind: 'idle'});
                      }}
                      placeholder={channel === 'email' ? 'you@example.com' : '07700 900123'}
                      className="mono mt-2.5 w-full min-w-0 bg-transparent text-[17px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-faint/60"
                    />
                  </label>

                  {status.kind === 'failed' ? (
                    <p role="alert" className="mt-3 text-[13.5px] font-light leading-[1.5] text-red">
                      {status.message}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!ready || sending}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--cta)] px-7 py-3.5 text-[14px] font-semibold tracking-[-0.005em] text-[var(--cta-ink)] shadow-[0_12px_30px_-14px_var(--btn-glow)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
                  >
                    {sending ? 'Sending…' : `${verb} →`}
                  </button>

                  <p className="mt-3 text-[12.5px] font-light leading-[1.55] text-faint">
                    {PENDING_NOTE}
                  </p>
                </div>

                <div className="border-t border-line-2 bg-bg/40 px-6 py-5">
                  <p className="text-[13px] font-light leading-[1.6] text-muted">
                    One message with the summary above. No account, no attachment, and nothing
                    else sent to you unless you ask for it.
                  </p>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            {channel === 'email' ? (
              <EmailPreview summary={summary} />
            ) : (
              <SmsPreview text={summary.sms} />
            )}
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}

const CHANNELS = [
  {value: 'email' as const, label: 'Email it', note: 'The full summary'},
  {value: 'sms' as const, label: 'Text it', note: 'The short version'}
];

function Tick({picked}: {picked: boolean}) {
  return (
    <span
      className={cn(
        'grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-200',
        picked ? 'border-green bg-green text-bg' : 'border-line-2 text-transparent'
      )}
    >
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 6.2 4.8 9 10 3.2" />
      </svg>
    </span>
  );
}

function EmailPreview({summary}: {summary: Summary}) {
  return (
    <div className="glass ring-lit overflow-hidden rounded-frame">
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-6 py-4">
        <span className={cn(LABEL, 'text-faint')}>What arrives</span>
        <span className="mono text-[11px] text-faint">Preview</span>
      </div>

      <div className="border-b border-line-2 px-6 py-4">
        <dl className="space-y-1.5">
          <div className="flex gap-3">
            <dt className="mono w-[52px] shrink-0 text-[11px] uppercase tracking-[.08em] text-faint">
              From
            </dt>
            <dd className="text-[13.5px] font-light text-muted">Guardian Care</dd>
          </div>
          <div className="flex gap-3">
            <dt className="mono w-[52px] shrink-0 text-[11px] uppercase tracking-[.08em] text-faint">
              Subject
            </dt>
            <dd className="text-[13.5px] font-medium text-ink">{summary.subject}</dd>
          </div>
        </dl>
      </div>

      <div className="px-6 py-6">
        <p className="text-[15px] font-light leading-[1.65] text-muted">{summary.intro}</p>

        <dl className="mt-5 overflow-hidden rounded-card ring-1 ring-line-2">
          {summary.rows.map(([label, value, note], index) => (
            <div
              key={label}
              className={cn(
                'flex items-baseline justify-between gap-4 px-4 py-3',
                index % 2 === 0 ? 'bg-bg-2/60' : 'bg-transparent'
              )}
            >
              <dt className="min-w-0 text-[13px] font-light text-muted">
                {label}
                {note ? (
                  <span className="mt-0.5 block text-[11.5px] leading-[1.4] text-faint">{note}</span>
                ) : null}
              </dt>
              <dd className="mono shrink-0 text-[14px] font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {summary.notes.map((note) => (
          <p key={note} className="mt-4 text-[14.5px] font-light leading-[1.65] text-muted">
            {note}
          </p>
        ))}

        <p className="mt-5 border-l-2 border-amber/50 pl-4 text-[14.5px] font-light leading-[1.6] text-ink/90">
          → {summary.action}
        </p>
      </div>
    </div>
  );
}

function SmsPreview({text}: {text: string}) {
  const parts = segments(text);

  return (
    <div className="glass ring-lit overflow-hidden rounded-frame">
      <div className="flex items-center justify-between gap-4 border-b border-line-2 px-6 py-4">
        <span className={cn(LABEL, 'text-faint')}>What arrives</span>
        <span className="mono text-[11px] text-faint">Preview</span>
      </div>

      <div className="px-6 py-7">
        <div className="mono mb-3 text-[11px] uppercase tracking-[.08em] text-faint">
          Guardian Care
        </div>

        <div className="max-w-[420px] rounded-[18px] rounded-bl-[6px] bg-bg-2 px-5 py-4 ring-1 ring-line-2">
          <p className="whitespace-pre-line text-[14.5px] font-light leading-[1.6] text-ink">
            {text}
          </p>
        </div>

        <p className="mono mt-3 text-[11px] text-faint">
          {text.length} characters · {parts} message{parts === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}

function Sent({
  channel,
  to,
  onAgain
}: {
  channel: Channel;
  to: string;
  onAgain: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col justify-center px-6 py-8">
      <span className="text-green">
        <Glyph name="insight" className="h-10 w-10" />
      </span>
      <h3 className="mt-5 font-display text-[clamp(22px,2.6vw,30px)] font-semibold uppercase leading-[1.06] tracking-[-0.01em] text-ink">
        That is on its way
      </h3>
      <p className="mt-3 text-[15px] font-light leading-[1.6] text-muted">
        Your summary is addressed to <span className="mono font-medium text-ink">{to}</span>.
        {channel === 'email'
          ? ' If it has not arrived in a few minutes, check the folder your provider files new senders in.'
          : ' Standard message rates from your network apply.'}
      </p>

      <p className="mt-4 rounded-card bg-bg-2 px-4 py-3 text-[12.5px] font-light leading-[1.55] text-faint ring-1 ring-line-2">
        {PENDING_NOTE}
      </p>

      <div className="mt-6">
        <button type="button" onClick={onAgain} className={SECONDARY}>
          Send it somewhere else
        </button>
      </div>
    </div>
  );
}
