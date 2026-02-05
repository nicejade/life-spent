import type { BirthInfo, LifeCalculation } from '../types/main'
import { DEFAULT_LIFE_EXPECTANCY, DEFAULT_POPULATION_MEDIAN_AGE, MAX_HUMAN_AGE } from './constant'
import { get } from 'svelte/store'
import { locale, LOCALE_TO_INTL, t } from './i18n'

/** Strata bounds (years): 0–20, 20–40, 40–60, 60–life expectancy. */
export const STRATA_BOUNDS = [0, 20, 40, 60] as const;

/** Key age thresholds for heartbeat strip (years). */
export const AGE_THRESHOLDS = [18, 30, 35, 40, 50, 60] as const;

/** Grid cell size (px) by age band: 1–20, 20–40, 40–60, 60–median. */
export const GRID_CELL_SIZES = [30, 26, 22, 18] as const;

export interface ImpactData {
  totalWeeks: number;
  weeksSpent: number;
  strata: { start: number; end: number; label: string; spent: boolean }[];
  thresholds: { age: number; passed: boolean }[];
  gridTotalCells: number;
  gridCellsSpent: number;
  gridBands: { startAge: number; endAge: number; sizePx: number; cellsSpent: number; cellsTotal: number }[];
}

export function getImpactData(result: LifeCalculation, translations?: any): ImpactData {
  const { currentAge, lifeExpectancy } = result;
  const totalYears = currentAge >= lifeExpectancy ? MAX_HUMAN_AGE : lifeExpectancy;
  const totalWeeks = Math.round(totalYears * 52);
  const weeksSpent = Math.min(Math.round(currentAge * 52), totalWeeks);

  const currentTranslations = translations || get(t);
  const ageRangeTemplate = currentTranslations.common.ageRange;

  const strata: ImpactData['strata'] = STRATA_BOUNDS.map((start, i) => {
    const end = i === STRATA_BOUNDS.length - 1 ? lifeExpectancy : STRATA_BOUNDS[i + 1];
    const spent = currentAge >= end;
    const label = ageRangeTemplate
      .replace('{start}', String(start))
      .replace('{end}', String(end));
    return {
      start,
      end,
      label,
      spent
    };
  });

  const thresholds: ImpactData['thresholds'] = AGE_THRESHOLDS.map((age) => ({
    age,
    passed: currentAge >= age
  }));

  const gridTotalCells = currentAge >= lifeExpectancy ? MAX_HUMAN_AGE : lifeExpectancy;
  const gridCellsSpent = Math.min(Math.floor(currentAge), gridTotalCells);
  const lastBound = gridTotalCells;

  const gridBands: ImpactData['gridBands'] = STRATA_BOUNDS.map((start, i) => {
    const end = i === STRATA_BOUNDS.length - 1 ? lastBound : STRATA_BOUNDS[i + 1];
    const sizePx = GRID_CELL_SIZES[i];
    const bandYears = end - start;
    const bandCellsTotal = bandYears;
    const bandCellsSpent = Math.max(0, Math.min(bandYears, Math.ceil(currentAge - start)));
    return { startAge: start, endAge: end, sizePx, cellsSpent: bandCellsSpent, cellsTotal: bandCellsTotal };
  });

  return {
    totalWeeks,
    weeksSpent,
    strata,
    thresholds,
    gridTotalCells,
    gridCellsSpent,
    gridBands
  };
}

export function calculateLifePercent(info: BirthInfo): LifeCalculation {
  const now = new Date();
  const birth = info.birthDate;
  
  const ageInMilliseconds = now.getTime() - birth.getTime();
  const currentAge = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  
  const lifeExpectancy = info.lifeExpectancy ?? DEFAULT_LIFE_EXPECTANCY[info.gender];
  const populationMedianAge = info.populationMedianAge ?? DEFAULT_POPULATION_MEDIAN_AGE;
  const percentSpent = (currentAge / lifeExpectancy) * 100;
  const yearsRemaining = lifeExpectancy - currentAge;
  // 计算你比多少比例的人年纪大：当年龄为0时是0%，等于中位年龄时是50%，是中位年龄2倍时是100%
  const relativeAgePercent = (currentAge / populationMedianAge) * 50;
  const yearsToMedianAge = populationMedianAge - currentAge;
  
  return {
    birthDate: birth,
    currentAge: Math.max(0, currentAge),
    gender: info.gender,
    lifeExpectancy,
    populationMedianAge,
    percentSpent: Math.min(100, Math.max(0, percentSpent)),
    yearsRemaining: Math.max(0, yearsRemaining),
    relativeAgePercent: Math.max(0, relativeAgePercent),
    yearsToMedianAge
  };
}

export function formatAge(age: number): string {
  const currentLocale = get(locale);
  const translations = get(t);
  const years = Math.floor(age);
  const yearsOldText = translations.common.yearsOld;
  return `${years} ${yearsOldText}`;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year} / ${month} / ${day}`;
}

export function formatDateLong(date: Date): string {
  const currentLocale = get(locale);
  const intlLocale = LOCALE_TO_INTL[currentLocale];
  return date.toLocaleDateString(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function validateBirthDate(date: Date): boolean {
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 150, 0, 1);
  return date <= now && date >= minDate;
}
