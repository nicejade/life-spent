export type Gender = 'male' | 'female';

export interface SelectItem {
  name: string
  value?: string
  disabled?: boolean
}

export interface BirthInfo {
  birthDate: Date;
  gender: Gender;
  lifeExpectancy?: number;
  populationMedianAge?: number;
}

export interface LifeCalculation {
  birthDate: Date;
  currentAge: number;
  gender: Gender;
  lifeExpectancy: number;
  populationMedianAge: number;
  percentSpent: number;
  yearsRemaining: number;
  relativeAgeDeltaPercent: number;
  relativeAgeDeltaYears: number;
  yearsToMedianAge: number;
}
