import {validEmail, validMessage, validName, validTelephone} from './validate';

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type Field = keyof Enquiry;

export const FIELD_ORDER: Field[] = ['name', 'email', 'phone', 'message'];

export const EMPTY_ENQUIRY: Enquiry = {name: '', email: '', phone: '', message: ''};

export const ENQUIRY_PENDING_NOTE =
  '';

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

const FAKE_LATENCY_MS = 900;

export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  if (Object.keys(problems(enquiry)).length > 0) {
    throw new Error('Some of these need another look.');
  }

  await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));

  if (import.meta.env.DEV) {
    console.info('[enquiry] not connected — would have sent:', enquiry);
  }
}
