import emailjs, {EmailJSResponseStatus} from '@emailjs/browser';
import {validEmail, validMessage, validName, validTelephone} from './validate';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
/** Inbox that receives the forms; sent as {{to_email}} so the template's "To Email" can use it. */
const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL?.trim() ?? '';

// const EMAILJS = {
//   serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
//   templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//   publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
// } as const;

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type Field = keyof Enquiry;

// Everything else the multi-step form gathers, sent along with the message.
export type EnquiryContext = {country: string; service: string; details: Array<[string, string]>};

export const FIELD_ORDER: Field[] = ['name', 'email', 'phone', 'message'];

export const EMPTY_ENQUIRY: Enquiry = {name: '', email: '', phone: '', message: ''};

export function problems(enquiry: Enquiry): Partial<Record<Field, string>> {
  const found: Partial<Record<Field, string>> = {};

  if (!enquiry.name.trim()) found.name = 'Please tell us your name.';
  else if (!validName(enquiry.name)) found.name = 'That looks too short to be a name.';

  if (!enquiry.email.trim()) found.email = 'We need an email address to reply to.';
  else if (!validEmail(enquiry.email)) found.email = 'Check this address. It needs an @ and a domain, like you@company.com.';

  if (enquiry.phone.trim() && !validTelephone(enquiry.phone))
    found.phone = 'Check this number. Include the area code, or start with + and the country code.';

  if (!enquiry.message.trim()) found.message = 'Tell us what you would like to know.';
  else if (!validMessage(enquiry.message)) found.message = 'A little more detail would help us answer properly.';

  return found;
}

const GENERIC_FAILURE = 'That did not go through. Please try again, or call or email us instead.';

export async function sendEnquiry(enquiry: Enquiry, context?: EnquiryContext): Promise<void> {
  if (Object.keys(problems(enquiry)).length > 0) {
    throw new Error('Some of these need another look.');
  }

  const name = enquiry.name.trim();
  const email = enquiry.email.trim();
  const phone = enquiry.phone.trim() || 'Not given';
  const summary = context
    ? [['Country', context.country], ['Service', context.service], ...context.details]
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n')
    : '';
  // The EmailJS template only prints {{message}}, so the form's answers ride at the top of it.
  const message = summary ? `${summary}\n\n${enquiry.message.trim()}` : enquiry.message.trim();

  try {
    await emailjs.send(
      SERVICE_ID, TEMPLATE_ID, 
      {
        name,
        email,
        phone,
        message,
        from_name: name,
        reply_to: email,
        country: context?.country ?? '',
        service: context?.service ?? ''
      },
      {publicKey: PUBLIC_KEY}
    );
  } catch (error) {
    if (import.meta.env.DEV) console.error('[enquiry] EmailJS failed:', error);

    if (error instanceof EmailJSResponseStatus && error.status === 0) {
      throw new Error('We could not reach the server. Check your connection and try again.');
    }
    if (import.meta.env.DEV && error instanceof EmailJSResponseStatus) {
      throw new Error(`EmailJS ${error.status}: ${error.text}`);
    }
    throw new Error(GENERIC_FAILURE);
  }
}
