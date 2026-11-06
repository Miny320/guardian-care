import {useCallback, useEffect} from 'react';
import {Navigate, useLocation, useParams} from 'react-router';
import Layout from '../context/layouts';
import {COUNTRIES, COUNTRY_CODES, DEFAULT_COUNTRY, isCountryCode, type Country, type CountryCode} from '../data/countries';

const COUNTRY_KEY = 'gc-country';

// Old links like /consumer and /existing, from before the site was split by country.
const RENAMED: Record<string, string> = {existing: 'consumer'};

export function rememberCountry(code: CountryCode) {
  try {
    localStorage.setItem(COUNTRY_KEY, code);
  } catch {
    // Private browsing can refuse storage; the country still comes from the URL.
  }
}

// The visitor's own choice wins; otherwise read the browser's language and time zone.
export function guessCountry(): CountryCode {
  try {
    const saved = localStorage.getItem(COUNTRY_KEY) ?? undefined;
    if (isCountryCode(saved)) return saved;
  } catch {
    // Fall through to the browser hints.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('th')) return 'th';
    if (lower === 'en-us') return 'us';
    if (lower === 'en-au') return 'au';
    if (lower === 'en-gb') return 'uk';
  }

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  if (zone.startsWith('Australia/')) return 'au';
  if (zone === 'Asia/Bangkok') return 'th';
  if (zone.startsWith('America/') || zone.startsWith('US/')) return 'us';
  return DEFAULT_COUNTRY;
}

export function useCountry(): Country {
  const {country} = useParams();
  return COUNTRIES[isCountryCode(country) ? country : DEFAULT_COUNTRY];
}

// Turns a site path like "/contact" into this country's "/au/contact".
export function useLocalPath() {
  const {code} = useCountry();
  return useCallback(
    (path: string) => {
      if (/^[a-z]+:/.test(path)) return path;
      if (path.startsWith('#')) return `/${code}${path}`;
      return `/${code}${path === '/' ? '' : path}`;
    },
    [code]
  );
}

// The current path with the country taken off the front: "/au/contact" becomes "/contact".
export function usePagePath(): string {
  const {pathname} = useLocation();
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  return rest === '' ? '/' : rest;
}

// The same page in another country, keeping any query and hash.
export function useSwitchPath() {
  const page = usePagePath();
  const {search, hash} = useLocation();
  return (code: CountryCode) => `/${code}${page === '/' ? '' : page}${search}${hash}`;
}

export function usePageTitle(title?: string) {
  const {name} = useCountry();
  useEffect(() => {
    document.title = title ? `${title} | Guardian Care ${name}` : `Guardian Care ${name} — Solar looked after, for life`;
  }, [title, name]);
}

// Wraps every /:country page: checks the code, remembers it, and tells browsers and search
// engines which language version this is and where the others live.
export function CountryLayout() {
  const {country} = useParams();
  const {pathname, search, hash} = useLocation();
  const valid = isCountryCode(country);
  const page = pathname.replace(/^\/[^/]+/, '');

  useEffect(() => {
    if (!valid) return;
    rememberCountry(country);
    document.documentElement.lang = COUNTRIES[country].lang;

    const links = COUNTRY_CODES.map((code) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = COUNTRIES[code].lang;
      link.href = `${window.location.origin}/${code}${page}`;
      link.dataset.country = 'alternate';
      return link;
    });
    links.forEach((link) => document.head.appendChild(link));
    return () => links.forEach((link) => link.remove());
  }, [valid, country, page]);

  if (!valid) {
    // Not a country: treat the whole path as a page and send it to the visitor's country.
    const segment = country ?? '';
    const target = `/${guessCountry()}/${RENAMED[segment] ?? segment}${page}`.replace(/\/+$/, '');
    return <Navigate to={`${target}${search}${hash}`} replace />;
  }

  return <Layout />;
}

export function CountryRedirect() {
  const {search, hash} = useLocation();
  return <Navigate to={`/${guessCountry()}${search}${hash}`} replace />;
}
