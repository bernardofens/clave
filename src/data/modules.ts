// Os cinco módulos de habilidade (decisão 6): Teoria, Técnica e as três de Percepção.
// O módulo diz onde o exercício mora no app; o que ele testa são as etiquetas (src/exercises/taxonomy.ts).
// Aqui fica só a estrutura; nomes e textos estão em src/i18n/content.*.ts e chegam às telas já no
// idioma da pessoa (useContent, em src/data/localized.ts).
import type { ModuleId } from '../exercises/taxonomy';

export interface ModuleBase {
  id: ModuleId;
  color: string; // token CSS
  /** Emblema do módulo (design/art.mjs → public/art). */
  art: string;
}
export const MODULE_LIST: ModuleBase[] = [
  { id: 'theory', color: 'var(--mu)', art: 'modulo-teoria' },
  { id: 'technique', color: 'var(--ve)', art: 'modulo-tecnica' },
  { id: 'perception.melodic', color: 'var(--co)', art: 'modulo-percepcao-melodica' },
  { id: 'perception.harmonic', color: 'var(--cream)', art: 'modulo-percepcao-harmonica' },
  { id: 'perception.rhythmic', color: 'var(--mu)', art: 'modulo-percepcao-ritmica' },
];

export type Instrument = 'piano' | 'violao' | 'baixo';
export const INSTRUMENTS: { id: Instrument; art: string }[] = [
  { id: 'piano', art: 'teclado' },
  { id: 'violao', art: 'violao' },
  { id: 'baixo', art: 'baixo' },
];
