// A porta por objetivo (decisão 7): a pessoa não pensa "percepção melódica", pensa "quero conhecer as
// notas no braço do baixo". Cada objetivo leva direto ao grupo certo de exercícios, ferramentas e
// aulas, qualquer que seja o módulo em que eles moram. A mesma lista serve ao Treinar, ao Perfil e,
// depois, ao onboarding (D4). Nomes e textos estão em src/i18n/content.*.ts.
import type { Instrument } from './modules';

export type GoalId =
  | 'notas-instrumento' | 'tirar-de-ouvido' | 'acordes' | 'improvisar'
  | 'ler-partitura' | 'ritmo' | 'harmonia' | 'agilidade';

export interface GoalItems {
  exercises: string[];
  tools: string[];
  lessons: string[];
}
export interface GoalBase extends GoalItems {
  id: GoalId;
  /** O que muda conforme o instrumento da pessoa; o que não aparece aqui vale para todos. */
  byInstrument?: Partial<Record<Instrument, Partial<GoalItems>>>;
}

// A ordem é a da tela. "Conhecer as notas" vem primeiro: é a função principal do produto.
export const GOALS: GoalBase[] = [
  {
    id: 'notas-instrumento',
    exercises: ['braco-nota', 'braco-ache', 'braco-intervalo', 'acorde-visual'], tools: [], lessons: ['mapear-braco'],
    byInstrument: {
      baixo: { exercises: ['braco-nota', 'braco-ache', 'braco-intervalo'] },
      piano: { exercises: ['teclado-nota', 'teclado-tecla'], lessons: [] },
    },
  },
  { id: 'tirar-de-ouvido', exercises: ['ouvido-tecla', 'ouvido-intervalo', 'ouvido-escala', 'ouvido-celulas'], tools: ['ambiente'], lessons: ['ouvido'] },
  {
    // "Reconheça o acorde" abre no violão: não é para quem toca piano nem baixo
    id: 'acordes', exercises: ['ouvido-acorde', 'pauta-acorde', 'teclado-acorde', 'acorde-visual'], tools: ['backing'], lessons: ['acordes'],
    byInstrument: { piano: { exercises: ['ouvido-acorde', 'pauta-acorde', 'teclado-acorde'] }, baixo: { exercises: ['ouvido-acorde', 'pauta-acorde', 'teclado-acorde'] } },
  },
  {
    id: 'improvisar',
    exercises: ['ouvido-celulas', 'ouvido-escala', 'braco-intervalo', 'quiz-teoria'], tools: ['backing', 'ambiente'], lessons: ['modos-gregos'],
    byInstrument: { piano: { exercises: ['ouvido-celulas', 'ouvido-escala', 'quiz-teoria'] } },
  },
  { id: 'ler-partitura', exercises: ['pauta-nota', 'pauta-construir', 'pauta-armadura'], tools: ['leitura'], lessons: ['ler-partitura'] },
  { id: 'ritmo', exercises: ['ritmo-ouvido'], tools: ['ritmo', 'metronomo', 'leitura'], lessons: ['leitura-ritmica'] },
  { id: 'harmonia', exercises: ['pauta-escala', 'pauta-intervalo', 'quiz-teoria'], tools: ['backing'], lessons: ['escala-maior', 'harmonia-funcional'] },
  { id: 'agilidade', exercises: [], tools: ['tecnica', 'metronomo'], lessons: ['tecnica'] },
];
export const goalById = Object.fromEntries(GOALS.map(g => [g.id, g])) as Record<GoalId, GoalBase>;

/** O que o objetivo mostra para quem toca este instrumento. */
export function goalItems(g: GoalBase, instrument: Instrument): GoalItems {
  return { ...g, ...g.byInstrument?.[instrument] };
}

/** Objetivos de versões anteriores e o que eles viram. Os que não estão aqui e não existem mais somem. */
export const GOAL_MIGRATION: Record<string, GoalId[]> = {
  jazz: ['improvisar', 'harmonia'], // era um gênero; o que ele pedia era improviso e harmonia
  repertorio: ['notas-instrumento', 'ler-partitura'], // "aprender músicas": saber as notas e ler
};
