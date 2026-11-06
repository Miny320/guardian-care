import Glyph, {type GlyphName} from '../../../components/Glyph';
import Reveal from '../../../components/Reveal';
import {CONTACT} from '../../../data/contact';
import {useCountry} from '../../../lib/country';

type Channel = {
  glyph: GlyphName;
  label: string;
  value: string;
  note: string;
  href: string;
  newTab?: boolean;
};

export default function Channels() {
  const {phone, chat} = useCountry();

  // Only the UK has a phone line today; everywhere else reaches us by email or a booked call.
  const channels: Channel[] = [
    ...(phone ? [{glyph: 'call' as const, label: 'Call us', value: phone.display, note: phone.hours, href: phone.href}] : []),
    ...(chat ? [{glyph: 'question' as const, label: `Chat on ${chat.label}`, value: chat.label, note: 'Message us any time', href: chat.href, newTab: true}] : []),
    {glyph: 'question', label: 'Email us', value: CONTACT.email, note: 'We reply by email', href: CONTACT.emailHref},
    {glyph: 'retain', label: 'Book a call', value: 'Pick a time', note: 'A video call at a time that suits you', href: CONTACT.booking, newTab: true}
  ];

  return (
    <Reveal as="div" delay={0.16} className="mt-10 max-w-[480px]">
      <ul className="grid gap-2.5">
        {channels.map((channel) => (
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
      </ul>
    </Reveal>
  );
}
