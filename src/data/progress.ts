import { LESSONS } from './content';

/** Quanto da aula a pessoa já praticou: acertos nos exercícios ligados a ela (até 20 por exercício). */
export function lessonProgress(id: string, stats: Record<string, { correct: number }>) {
  const m = LESSONS.find(x => x.id === id)!;
  if (!m.exercises.length) return 0;
  return m.exercises.reduce((a, e) => a + Math.min(1, (stats[e]?.correct ?? 0) / 20), 0) / m.exercises.length;
}
