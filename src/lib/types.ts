export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

export interface Question {
  index: number;
  image: string | null;
  text: string;
  answers: Answer[];
}

export interface CategoryRule {
  total_in_exam: number;
}

export interface Tier {
  reference: string;
  duration: number;
  total: number;
  required: number;
  categories: Record<string, CategoryRule>;
}

export interface QuestionRange {
  start: number;
  end: number;
}

export type QuestionPool = Record<string, number[] | QuestionRange>;

export interface ExamConfig {
  pools: Record<string, QuestionPool>;
  tiers: Record<string, Tier>;
}

export interface CandidateInfo {
  birthDate: string;
  name: string;
  identity: string;
  address: string;
}

export interface Session {
  candidateNumber: string;
  licence: string;
  candidate: CandidateInfo;
}

export type Selections = number[][];

export interface ExamResult {
  correct: number;
  wrong: number;
  unanswered: number;
  passed: boolean;
  criticalWrong: number[];
}

export interface ExamDefinition {
  tier: Tier;
  questions: Question[];
  criticalQuestionIds: Set<number>;
}
