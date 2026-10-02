export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function digitsOf(value: string): string {
  return value.replace(/[\s()\-.]/g, '');
}

export function validMobile(value: string): boolean {
  return /^(?:\+447|07)\d{9}$/.test(digitsOf(value));
}

export function validTelephone(value: string): boolean {
  const digits = digitsOf(value);

  if (/^\+\d{8,15}$/.test(digits)) return true;
  if (/^00\d{8,15}$/.test(digits)) return true;
  return /^0\d{9,10}$/.test(digits);
}

export function validMessage(value: string, least = 10): boolean {
  return value.trim().length >= least;
}

export function validName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && /\p{L}/u.test(trimmed);
}
