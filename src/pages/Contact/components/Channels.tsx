import Glyph, {type GlyphName} from '../../../components/Glyph';
import Reveal from '../../../components/Reveal';
import {CONTACT} from '../../../data/contact';

type Channel = {
  glyph: GlyphName;
  label: string;
  value: string;
  note: string;
  href: string;
  newTab?: boolean;
};

const CHANNELS: Channel[] = [
  {glyph: 'call', label: 'Call us', value: CONTACT.phone, note: CONTACT.hours, href: CONTACT.phoneHref},
  {glyph: 'question', label: 'Email us', value: CONTACT.email, note: 'We reply by email', href: CONTACT.emailHref},
  {
    glyph: 'retain',
    label: 'Book a call',
    value: 'Pick a time',
    note: 'A time that suits you',
    href: CONTACT.booking,
    newTab: true
  }
];

export default function Channels() {
  return (
    <Reveal as="ul" delay={0.16} className="mt-10 grid max-w-[480px] gap-2.5">
      {CHANNELS.map((channel) => (
        <li key={channel.label}>
          <a
            href={channel.href}
            {...(channel.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            className="group glass ring-lit flex items-center gap-4 rounded-card px-5 py-4 transition duration-200 ease-brand hover:-translate-y-0.5"
          >
            <Glyph name={channel.glyph} className="h-7 w-7 shrink-0 text-green" />
            <span className="min-w-0 flex-1">
              <span className="mono block text-[11px] font-semibold uppercase tracking-[.12em] text-faint">
                {channel.label}
              </span>
              <span className="mt-1 block truncate text-[16px] font-medium text-ink transition-colors group-hover:text-green">
                {channel.value}
              </span>
              <span className="mt-0.5 block text-[12.5px] font-light text-faint">{channel.note}</span>
            </span>
            <span aria-hidden="true" className="shrink-0 text-faint transition-colors group-hover:text-green">
              {channel.newTab ? '↗' : '→'}
            </span>
          </a>
        </li>
      ))}
    </Reveal>
  );
}
