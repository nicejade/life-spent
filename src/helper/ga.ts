declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Send a single event to GA4. Uses gtag only; gtag already pushes to dataLayer,
 * so we avoid duplicate dataLayer.push to prevent double-counting in GA4.
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log(`[GA Track] ${eventName}`, eventParams);
  }
}

export const GA_EVENTS = {
  NAV_HOME: 'nav-home',
  NAV_GITHUB: 'nav-github',
  NAV_X_FOLLOW: 'nav-x-follow',
  NAV_FACEBOOK: 'nav-facebook',
  NAV_THREADS: 'nav-threads',
  NAV_YOUTUBE: 'nav-youtube',
  NAV_BILIBILI: 'nav-bilibili',
  NAV_MASTODON: 'nav-mastodon',
  NAV_BLOGGER: 'nav-blogger',
  TOGGLE_THEME: 'toggle-theme',
  SELECT_LANGUAGE: 'select-language',
  SELECT_GENDER: 'select-gender',
  SELECT_YEAR: 'select-year',
  SELECT_MONTH: 'select-month',
  SELECT_DAY: 'select-day',
  INPUT_LIFE_EXPECTANCY: 'input-life-expectancy',
  INPUT_POPULATION_MEDIAN_AGE: 'input-population-median-age',
  SUBMIT_CALCULATE: 'submit-calculate',
  VIEW_GRID: 'view-grid',
  VIEW_STRATA: 'view-strata',
  VIEW_WEEKS: 'view-weeks',
  VIEW_HEARTBEAT: 'view-heartbeat',
  SHARE_CLICK: 'share-click',
  SHARE_COPY: 'share-copy',
  RESET_CALCULATE: 'reset-calculate',
  PAGE_VIEW: 'page-view',
} as const;

export type GAEventName = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];
