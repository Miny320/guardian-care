import {useCallback, useSyncExternalStore} from 'react';

export type Theme = 'night' | 'day';

export const THEME_KEY = 'gc-theme';

function current(): Theme {
  if (typeof document === 'undefined') return 'night';
  return document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
}

function remember(theme: Theme): boolean {
  try {
    localStorage.setItem(THEME_KEY, theme);
    return true;
  } catch {
    return false;
  }
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  remember(theme);
}

const listeners = new Set<() => void>();

let snapshot: Theme = current();

function notify(next: Theme) {
  if (snapshot === next) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== THEME_KEY) return;
  const next: Theme = event.newValue === 'day' ? 'day' : 'night';
  document.documentElement.dataset.theme = next;
  notify(next);
}

function subscribe(listener: () => void) {
  if (listeners.size === 0 && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function read(): Theme {
  return snapshot;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, serverRead);

  const toggle = useCallback(() => {
    const next: Theme = snapshot === 'day' ? 'night' : 'day';
    apply(next);
    notify(next);
  }, []);

  return {theme, toggle};
}

function serverRead(): Theme {
  return 'night';
}
