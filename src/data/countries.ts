export type CountryCode = 'uk' | 'us' | 'au' | 'th';

export type Country = {
  code: CountryCode;
  name: string;
  short: string;
  // BCP 47 tag for <html lang> and hreflang.
  lang: string;
  serviceArea: string;
  // Only the UK has a phone line, an office and a registered company today.
  phone?: {display: string; href: string; hours: string};
  address?: string;
  company?: string;
  words: {
    // What a visitor in this country calls the box of breakers.
    panel: string;
    // Who they buy grid electricity from.
    supplier: string;
  };
  // The page about getting paid for exported solar, named the way locals name it.
  tariffs: {label: string; nav: string};
  // Illustrative rates for the energy-intelligence demo. Not quotes.
  demo: {currency: string; importRate: number; exportRate: number; rateUnit: string};
  // Typical yearly output of 1 kWp of rooftop solar, used by the savings calculator.
  kwhPerKwp: number;
  // Accreditations Guardian Care holds in this country. Leave empty until confirmed:
  // anything listed here is shown to visitors as a claim.
  accreditations: string[];
  // A chat channel local customers prefer, such as LINE in Thailand. Shown only once set.
  chat?: {label: string; href: string};
};

export const COUNTRIES: Record<CountryCode, Country> = {
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    short: 'UK',
    lang: 'en-GB',
    serviceArea: 'Nationwide, covering the UK mainland',
    phone: {display: '0330 122 1279', href: 'tel:+443301221279', hours: 'Mon–Fri, 9:30am–5:30pm UK time'},
    address: 'Southend Road, Grays, England, RM17 5NL',
    company: 'Registered in England and Wales · Company No. 14901790',
    words: {panel: 'consumer unit', supplier: 'energy supplier'},
    tariffs: {label: 'FIT & SEG support', nav: 'FIT & SEG'},
    demo: {currency: '£', importRate: 0.25, exportRate: 0.15, rateUnit: 'p'},
    kwhPerKwp: 900,
    accreditations: []
  },
  us: {
    code: 'us',
    name: 'United States',
    short: 'US',
    lang: 'en-US',
    serviceArea: 'Serving homeowners and installers across the United States',
    words: {panel: 'electrical panel', supplier: 'utility'},
    tariffs: {label: 'Net metering & export', nav: 'Net metering'},
    demo: {currency: '$', importRate: 0.18, exportRate: 0.08, rateUnit: '¢'},
    kwhPerKwp: 1350,
    accreditations: []
  },
  au: {
    code: 'au',
    name: 'Australia',
    short: 'AU',
    lang: 'en-AU',
    serviceArea: 'Serving homeowners and installers across Australia',
    words: {panel: 'switchboard', supplier: 'electricity retailer'},
    tariffs: {label: 'Feed-in tariffs', nav: 'Feed-in tariffs'},
    demo: {currency: '$', importRate: 0.3, exportRate: 0.05, rateUnit: 'c'},
    kwhPerKwp: 1450,
    accreditations: []
  },
  th: {
    code: 'th',
    name: 'Thailand',
    short: 'TH',
    lang: 'en-TH',
    serviceArea: 'Serving homeowners and installers across Thailand',
    words: {panel: 'consumer unit', supplier: 'electricity authority (MEA or PEA)'},
    tariffs: {label: 'Net billing', nav: 'Net billing'},
    demo: {currency: '฿', importRate: 3.9, exportRate: 2.2, rateUnit: '฿'},
    kwhPerKwp: 1350,
    accreditations: []
  }
};

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export const DEFAULT_COUNTRY: CountryCode = 'uk';

export function isCountryCode(value: string | undefined): value is CountryCode {
  return value !== undefined && value in COUNTRIES;
}
