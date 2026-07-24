import { asset } from '$app/paths';
import questionsData from '../assets/data/questions.json';
import configData from '../assets/data/exam-config.json';
import type { ExamConfig, Question } from './types';

const questionMap = new Map<number, Question>(
  questionsData.map((question) => [question.index, question])
);

export const examConfig: ExamConfig = configData;

export const licenceOptions = Object.freeze(
  Object.keys(examConfig.tiers).flatMap((tierName) => tierName.split('_'))
);

export const uiImages = Object.freeze({
  wallpaperUrl: asset('/images/ui/wallpaper.webp'),
  cardUrl: asset('/images/ui/login-header.webp'),
  portraitUrl: asset('/images/ui/candidate-portrait.webp'),
  checklistUrl: asset('/images/ui/checklist.png'),
  closeUrl: asset('/images/ui/close.png'),
  questionMarkUrl: asset('/images/ui/questionmark.png'),
  warnUrl: asset('/images/ui/warn.png')
});

export function getQuestion(id: number): Question | undefined {
  return questionMap.get(id);
}

export function getQuestionImageUrl(filename: string): string {
  return asset(`/images/questions/${filename}`);
}
