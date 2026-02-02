import type { BirthInfo, LifeCalculation } from '../types/main'

export const DEFAULT_MEDIAN_AGE = {
  male: 73,
  female: 79
} as const;

/** Human known maximum age; used when current age exceeds median. */
export const MAX_HUMAN_AGE = 122;

/** Strata bounds (years): 0–20, 20–40, 40–60, 60–median. */
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

export function getImpactData(result: LifeCalculation): ImpactData {
  const { currentAge, medianAge } = result;
  const totalYears = currentAge >= medianAge ? MAX_HUMAN_AGE : medianAge;
  const totalWeeks = Math.round(totalYears * 52);
  const weeksSpent = Math.min(Math.round(currentAge * 52), totalWeeks);

  const strata: ImpactData['strata'] = STRATA_BOUNDS.map((start, i) => {
    const end = i === STRATA_BOUNDS.length - 1 ? medianAge : STRATA_BOUNDS[i + 1];
    const spent = currentAge >= end;
    return {
      start,
      end,
      label: `${start}–${end} 岁`,
      spent
    };
  });

  const thresholds: ImpactData['thresholds'] = AGE_THRESHOLDS.map((age) => ({
    age,
    passed: currentAge >= age
  }));

  const gridTotalCells = currentAge >= medianAge ? MAX_HUMAN_AGE : medianAge;
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
  
  const medianAge = info.medianAge ?? DEFAULT_MEDIAN_AGE[info.gender];
  const percentSpent = (currentAge / medianAge) * 100;
  const yearsRemaining = medianAge - currentAge;
  
  return {
    birthDate: birth,
    currentAge: Math.max(0, currentAge),
    medianAge,
    percentSpent: Math.min(100, Math.max(0, percentSpent)),
    yearsRemaining: Math.max(0, yearsRemaining)
  };
}

export function formatAge(age: number): string {
  const years = Math.floor(age);
  const months = Math.floor((age - years) * 12);
  return months > 0 ? `${years} 年 ${months} 个月` : `${years} 年`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
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
