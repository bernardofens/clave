// As seis áreas de habilidade: os "grupos musculares" da academia musical.
// Aqui fica só a estrutura; nomes e textos estão em src/i18n/content.*.ts e chegam pelas telas
// já no idioma da pessoa (useContent, em src/data/localized.ts).

export type AreaId = 'ouvido' | 'tecnica' | 'mapeamento' | 'harmonia' | 'ritmo' | 'leitura';

export interface AreaBase {
  id: AreaId;
  color: string; // token CSS
  art: string;
}
export interface Area extends AreaBase {
  name: string;
  short: string;
  why: string;
}

export const AREAS: AreaBase[] = [
  { id: 'ouvido', color: 'var(--co)', art: 'area-ouvido' },
  { id: 'tecnica', color: 'var(--ve)', art: 'area-tecnica' },
  { id: 'mapeamento', color: 'var(--mu)', art: 'area-mapeamento' },
  { id: 'harmonia', color: 'var(--cream)', art: 'area-harmonia' },
  { id: 'ritmo', color: 'var(--cream)', art: 'area-ritmo' },
  { id: 'leitura', color: 'var(--ve)', art: 'area-leitura' },
];

export type Instrument = 'piano' | 'violao' | 'baixo';
export const INSTRUMENTS: { id: Instrument; art: string }[] = [
  { id: 'piano', art: 'teclado' },
  { id: 'violao', art: 'violao' },
  { id: 'baixo', art: 'baixo' },
];

export type ProfileKind = 'iniciante' | 'hobby' | 'musico' | 'produtor';
export const PROFILE_KINDS: { id: ProfileKind }[] = [
  { id: 'iniciante' },
  { id: 'hobby' },
  { id: 'musico' },
  { id: 'produtor' },
];

export type GoalId = 'improvisar' | 'harmonia' | 'tirar-de-ouvido' | 'ler-partitura' | 'agilidade' | 'jazz' | 'repertorio';
export const GOALS: { id: GoalId; areas: AreaId[] }[] = [
  { id: 'improvisar', areas: ['ouvido', 'mapeamento', 'harmonia'] },
  { id: 'harmonia', areas: ['harmonia', 'ouvido'] },
  { id: 'tirar-de-ouvido', areas: ['ouvido', 'mapeamento'] },
  { id: 'ler-partitura', areas: ['leitura', 'ritmo'] },
  { id: 'agilidade', areas: ['tecnica', 'ritmo'] },
  { id: 'jazz', areas: ['harmonia', 'ouvido', 'ritmo'] },
  { id: 'repertorio', areas: ['mapeamento', 'ritmo', 'leitura'] },
];
