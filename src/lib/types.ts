export type Gender = 'male' | 'female';

export interface BirthInfo {
  birthDate: Date;
  gender: Gender;
  medianAge?: number;
}

export interface LifeCalculation {
  birthDate: Date;
  currentAge: number;
  medianAge: number;
  percentSpent: number;
  yearsRemaining: number;
}
