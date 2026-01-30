import type { BirthInfo, LifeCalculation } from './types';

const DEFAULT_MEDIAN_AGE = {
  male: 73,
  female: 79
} as const;

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
