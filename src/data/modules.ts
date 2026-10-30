// Os cinco módulos de habilidade (decisão 6): Teoria, Técnica e as três de Percepção.
// O módulo diz onde o exercício mora no app; o que ele testa são as etiquetas (src/exercises/taxonomy.ts).
// Aqui fica só a estrutura; nomes e textos estão em src/i18n/content.*.ts e chegam às telas já no
// idioma da pessoa (useContent, em src/data/localized.ts).
import type { ModuleId } from '../exercises/taxonomy';

export interface ModuleBase {
  id: ModuleId;
  color: string; // token CSS
  /** Ilustração provisória: reaproveita a da área antiga mais próxima até o redesenho em design/art.mjs. */
  art: string;
}
export const MODULE_LIST: ModuleBase[] = [
  { id: 'theory', color: 'var(--mu)', art: 'area-leitura' },
  { id: 'technique', color: 'var(--ve)', art: 'area-tecnica' },
  { id: 'perception.melodic', color: 'var(--co)', art: 'area-ouvido' },
  { id: 'perception.harmonic', color: 'var(--cream)', art: 'area-harmonia' },
  { id: 'perception.rhythmic', color: 'var(--mu)', art: 'area-ritmo' },
];

export type Instrument = 'piano' | 'violao' | 'baixo';
export const INSTRUMENTS: { id: Instrument; art: string }[] = [
  { id: 'piano', art: 'teclado' },
  { id: 'violao', art: 'violao' },
  { id: 'baixo', art: 'baixo' },
];

export type GoalId = 'improvisar' | 'harmonia' | 'tirar-de-ouvido' | 'ler-partitura' | 'agilidade' | 'jazz' | 'repertorio';
// Os módulos de cada objetivo só servem ao gerador de sessão; a porta por objetivo (D1) os substitui.
export const GOALS: { id: GoalId; modules: ModuleId[] }[] = [
  { id: 'improvisar', modules: ['perception.melodic', 'perception.harmonic', 'theory'] },
  { id: 'harmonia', modules: ['theory', 'perception.harmonic'] },
  { id: 'tirar-de-ouvido', modules: ['perception.melodic', 'perception.harmonic', 'theory'] },
  { id: 'ler-partitura', modules: ['theory', 'perception.rhythmic'] },
  { id: 'agilidade', modules: ['technique', 'perception.rhythmic'] },
  { id: 'jazz', modules: ['theory', 'perception.harmonic', 'perception.melodic', 'perception.rhythmic'] },
  { id: 'repertorio', modules: ['theory', 'perception.rhythmic'] },
];
