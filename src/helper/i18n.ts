import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { getTranslations } from './translations/index';
import type { Translations } from './translations';
import type { Locale } from './translations';

// Re-export Locale for convenience
export type { Locale };

export const SUPPORTED_LOCALES: Locale[] = ['zh', 'zh-TW', 'en', 'ja', 'fr', 'ru', 'th'];

export const LOCALE_NAMES: Record<Locale, string> = {
  'zh': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'fr': 'Français',
  'ru': 'Русский',
  'th': 'ไทย',
};

export const LOCALE_TO_INTL: Record<Locale, string> = {
  'zh': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en': 'en-US',
  'ja': 'ja-JP',
  'fr': 'fr-FR',
  'ru': 'ru-RU',
  'th': 'th-TH',
};

const STORAGE_KEY = 'lifespent-locale';

function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const fallbackLang = navigator.language || (navigator as any).userLanguage || 'en';
  const preferredLangs = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages
    : [fallbackLang];

  // Try exact match first in preference order
  for (const lang of preferredLangs) {
    if (SUPPORTED_LOCALES.includes(lang as Locale)) {
      return lang as Locale;
    }
  }

  // Try language code match (e.g., 'zh-CN' -> 'zh', 'en-US' -> 'en')
  for (const lang of preferredLangs) {
    const langCode = lang.split('-')[0];
    const matched = SUPPORTED_LOCALES.find(locale => locale.split('-')[0] === langCode);
    if (matched) {
      return matched;
    }
  }
  
  // Fallback to English
  return 'en';
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const pathLocale = getLocaleFromPath(window.location.pathname);
  if (pathLocale) {
    return pathLocale;
  }

  return detectBrowserLocale();
}

function createLocaleStore(): Writable<Locale> {
  const store = writable<Locale>(getInitialLocale());
  
  return {
    subscribe: store.subscribe,
    set: (value: Locale) => {
      store.set(value);
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // ignore storage errors
      }
    },
    update: store.update,
  };
}

export const locale = createLocaleStore();

export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  
  const firstSegment = segments[0];
  if (SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return null;
}

export function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  
  const firstSegment = segments[0];
  if (SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
}

export function getLocalizedPath(path: string, targetLocale?: Locale): string {
  const currentLocale = targetLocale || get(locale);
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove any existing locale prefix
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    segments.shift();
  }
  
  const basePath = segments.length > 0 ? '/' + segments.join('/') : '/';
  
  if (currentLocale === 'en') {
    return basePath === '/' ? '/en/' : `/en${basePath}`;
  }
  
  return basePath === '/' ? `/${currentLocale}/` : `/${currentLocale}${basePath}`;
}

export const t: Readable<Translations> = derived(locale, ($locale) => {
  return getTranslations($locale);
});

export function formatString(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}
