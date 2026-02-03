export type Gender = 'male' | 'female';

export interface SelectItem {
  name: string
  value?: string
  disabled?: boolean
}

export interface BirthInfo {
  birthDate: Date;
  gender: Gender;
  medianAge?: number;
}

export interface LifeCalculation {
  birthDate: Date;
  currentAge: number;
  gender: Gender;
  medianAge: number;
  percentSpent: number;
  yearsRemaining: number;
}
