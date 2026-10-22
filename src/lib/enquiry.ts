import emailjs, {EmailJSResponseStatus} from '@emailjs/browser';
import {validEmail, validMessage, validName, validTelephone} from './validate';

const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
} as const;

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type Field = keyof Enquiry;

export const FIELD_ORDER: Field[] = ['name', 'email', 'phone', 'message'];

export const EMPTY_ENQUIRY: Enquiry = {name: '', email: '', phone: '', message: ''};

export function problems(enquiry: Enquiry): Partial<Record<Field, string>> {
  const found: Partial<Record<Field, string>> = {};

  if (!enquiry.name.trim()) found.name = 'Please tell us your name.';
  else if (!validName(enquiry.name)) found.name = 'That looks too short to be a name.';

  if (!enquiry.email.trim()) found.email = 'We need an email address to reply to.';
  else if (!validEmail(enquiry.email)) found.email = 'Check this address. It needs an @ and a domain, like you@company.com.';

  if (enquiry.phone.trim() && !validTelephone(enquiry.phone))
    found.phone = 'Check this number. UK numbers start 01, 02, 03 or 07; international ones start with +.';

  if (!enquiry.message.trim()) found.message = 'Tell us what you would like to know.';
  else if (!validMessage(enquiry.message)) found.message = 'A little more detail would help us answer properly.';

  return found;
}

const GENERIC_FAILURE = 'That did not go through. Please try again, or call or email us instead.';

export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  if (Object.keys(problems(enquiry)).length > 0) {
    throw new Error('Some of these need another look.');
  }

  const name = enquiry.name.trim();
  const email = enquiry.email.trim();
  const phone = enquiry.phone.trim() || 'Not given';
  const message = enquiry.message.trim();

  try {
    await emailjs.send(
      EMAILJS.serviceId,
      EMAILJS.templateId,
      {name, email, phone, message, from_name: name, reply_to: email},
      {publicKey: EMAILJS.publicKey}
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
