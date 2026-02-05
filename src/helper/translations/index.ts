import type { Translations, Locale } from '../translations';
import { zh } from './zh';
import { zhTW } from './zh-TW';
import { en } from './en';
import { ja } from './ja';
import { fr } from './fr';
import { ru } from './ru';
import { th } from './th';

export const translations: Record<Locale, Translations> = {
  'zh': zh,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja,
  'fr': fr,
  'ru': ru,
  'th': th,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}
