export enum LanguageProficiency {
  Native = 'Native',
  FluentC2 = 'Fluent (C2)',
  AdvancedC1 = 'Advanced (C1)',
  UpperIntermediateB2 = 'Upper Intermediate (B2)',
  IntermediateB1 = 'Intermediate (B1)',
  ElementaryA2 = 'Elementary (A2)',
  BeginnerA1 = 'Beginner (A1)'
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
  certificate?: string;
  certificateDate?: string;
  certificateUrl?: string;
  notes?: string;
}