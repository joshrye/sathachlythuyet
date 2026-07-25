import { examConfig, getQuestion } from './data';
import type { ExamDefinition, ExamResult, Question, Selections, Tier } from './types';

export function resolveLicenceTier(licence: string): string {
  if (examConfig.tiers[licence]) return licence;

  const groupedTier = Object.keys(examConfig.tiers).find((tierName) =>
    tierName.split('_').includes(licence)
  );

  if (groupedTier) return groupedTier;
  return 'A1';
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function getExamDefinition(
  licence: string,
  random: () => number = Math.random
): ExamDefinition {
  const tier = examConfig.tiers[resolveLicenceTier(licence)] as Tier;
  const pool = examConfig.pools[tier.reference];
  const chosen: number[] = [];
  const used = new Set<number>();

  for (const [category, rule] of Object.entries(tier.categories)) {
    const categoryPool = pool[category];
    const source = Array.isArray(categoryPool)
      ? categoryPool
      : Array.from(
          { length: categoryPool.end - categoryPool.start + 1 },
          (_, index) => categoryPool.start + index
        );

    let added = 0;
    for (const id of shuffle(source, random)) {
      if (used.has(id)) continue;
      used.add(id);
      chosen.push(id);
      added += 1;
      if (added === rule.total_in_exam) break;
    }
  }

  const questions = chosen
    .sort((a, b) => a - b)
    .map((id) => getQuestion(id))
    .filter((question) => question !== undefined)
    .slice(0, tier.total);
  const criticalQuestionIds = pool.tinh_huong_nghiem_trong;

  if (!Array.isArray(criticalQuestionIds)) {
    throw new TypeError('The critical-question pool must be a list of question IDs');
  }

  return {
    tier,
    questions,
    criticalQuestionIds: new Set(criticalQuestionIds)
  };
}

export function formatTime(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

interface GradeExamInput {
  questions: Question[];
  selections: Selections;
  criticalQuestionIds: Set<number>;
  required: number;
}

export function gradeExam({
  questions,
  selections,
  criticalQuestionIds,
  required
}: GradeExamInput): ExamResult {
  const criticalWrong: number[] = [];
  let correct = 0;
  let unanswered = 0;

  questions.forEach((question, index) => {
    const selected = selections[index] ?? [];
    const expected = question.answers
      .filter((answer) => answer.correct)
      .map((answer) => answer.id)
      .sort();
    const isCorrect =
      selected.length === expected.length && selected.every((id, answerIndex) => id === expected[answerIndex]);

    if (!selected.length) unanswered += 1;
    if (isCorrect) correct += 1;
    if (criticalQuestionIds.has(question.index) && !isCorrect) criticalWrong.push(index + 1);
  });

  return {
    correct,
    wrong: questions.length - correct - unanswered,
    unanswered,
    passed: correct >= required && criticalWrong.length === 0,
    criticalWrong
  };
}
