export const STORAGE_KEY = 'life-spent-settings';
export const MIN_YEAR = 1929;

export const DEFAULT_LIFE_EXPECTANCY = {
  male: 75.37,
  female: 80.88
} as const;

export const DEFAULT_POPULATION_MEDIAN_AGE = 31.1;

/** Human known maximum age; used when current age exceeds life expectancy. */
export const MAX_HUMAN_AGE = 122;

export const DEFAULT_BIRTH_YEAR = '1996'
export const DEFAULT_BIRTH_MONTH = '1';
export const DEFAULT_BIRTH_DAY = '1';

export const POPULATION_MEDIAN_AGE_MIN = 16;
export const POPULATION_MEDIAN_AGE_MAX = 70;

export const LIFE_EXPECTANCY_MIN = 50;
export const LIFE_EXPECTANCY_MAX = 110;
