// Conteúdo de estudo. Cada módulo segue a mesma receita:
// por que importa, como encaixar nos estudos, um tutorial curto e os exercícios/ferramentas.
// Aqui fica a estrutura (ids, ligações, links); os textos estão em src/i18n/content.*.ts e chegam
// às telas já no idioma da pessoa (useContent, em src/data/localized.ts).
import type { AreaId } from './areas';

export interface ModuleBase {
  id: string;
  area: AreaId;
  exercises: string[];
  tools: string[];
  premium?: boolean;
}
export interface Module extends ModuleBase {
  title: string;
  why: string;
  how: string;
  steps: string[];
}

export const MODULES: ModuleBase[] = [
  { id: 'ler-partitura', area: 'leitura', exercises: ['pauta-nota', 'pauta-construir', 'pauta-armadura'], tools: ['leitura'], },
  { id: 'leitura-ritmica', area: 'ritmo', exercises: ['ritmo-ouvido'], tools: ['ritmo', 'leitura', 'metronomo'], },
  { id: 'mapear-braco', area: 'mapeamento', exercises: ['braco-nota', 'braco-ache', 'braco-intervalo', 'acorde-visual'], tools: [], },
  { id: 'escala-maior', area: 'harmonia', exercises: ['pauta-escala', 'quiz-teoria', 'ouvido-escala'], tools: ['tonalidade'], },
  { id: 'modos-gregos', area: 'harmonia', exercises: ['quiz-teoria', 'ouvido-escala'], tools: ['backing', 'ambiente'], },
  { id: 'acordes', area: 'harmonia', exercises: ['pauta-acorde', 'teclado-acorde', 'acorde-visual', 'ouvido-acorde'], tools: ['backing'], },
  { id: 'harmonia-funcional', area: 'harmonia', premium: true, exercises: ['quiz-teoria'], tools: ['backing'], },
  { id: 'ouvido', area: 'ouvido', exercises: ['ouvido-intervalo', 'ouvido-acorde', 'ouvido-escala', 'ouvido-tecla', 'ouvido-celulas'], tools: ['ambiente'], },
  { id: 'tecnica', area: 'tecnica', exercises: [], tools: ['tecnica', 'metronomo'], },
];

export interface RoadmapBase {
  id: string;
  art: string;
  premium: boolean;
  modules: string[];
}
export interface Roadmap extends Omit<RoadmapBase, 'modules'> {
  title: string;
  sub: string;
  steps: { module: string; note: string }[];
}
export const ROADMAPS: RoadmapBase[] = [
  { id: 'geral', art: 'haltere', premium: false, modules: ['ler-partitura', 'leitura-ritmica', 'mapear-braco', 'escala-maior', 'ouvido', 'acordes', 'modos-gregos', 'harmonia-funcional'] },
  { id: 'jazz', art: 'genero-jazz', premium: true, modules: ['acordes', 'modos-gregos', 'harmonia-funcional', 'ouvido'] },
  { id: 'erudito', art: 'genero-classico', premium: true, modules: ['ler-partitura', 'leitura-ritmica', 'escala-maior', 'tecnica'] },
];

export interface GenreBase {
  id: string;
  art: string;
  cat: string;
  color: string;
  sides: { side: string; tracks: { id: string; min: number; to?: string }[] }[];
}
export interface Genre extends GenreBase {
  name: string;
  sub: string;
  desc: string;
  sides: { side: string; tracks: { id: string; title: string; min: number; to?: string }[] }[];
}
export const GENRES: GenreBase[] = [
  {
    id: 'samba', art: 'genero-samba', cat: 'CLV 1503', color: 'var(--mu)',
    sides: [
      { side: 'a', tracks: [{ id: 'levada', min: 6, to: '/ferramentas/leitura' }, { id: 'toques', min: 9 }, { id: 'partido', min: 10 }, { id: 'teleco', min: 8 }] },
      { side: 'b', tracks: [{ id: 'progressao', min: 8, to: '/ferramentas/backing?p=samba' }, { id: 'secundarios', min: 10, to: '/estudar/harmonia-funcional' }] },
    ],
  },
  {
    id: 'jazz', art: 'genero-jazz', cat: 'CLV 1501', color: 'var(--mu)',
    sides: [
      { side: 'a', tracks: [{ id: 'tetrades', min: 8, to: '/estudar/acordes' }, { id: 'iivi', min: 10, to: '/ferramentas/backing?p=ii-v-i' }, { id: 'sub5', min: 7, to: '/treinar/quiz-teoria' }] },
      { side: 'b', tracks: [{ id: 'blues', min: 12, to: '/ferramentas/backing?p=blues' }, { id: 'celulas', min: 8, to: '/treinar/ouvido-celulas' }] },
    ],
  },
  {
    id: 'rock', art: 'genero-rock', cat: 'CLV 1502', color: 'var(--ve)',
    sides: [{ side: 'a', tracks: [{ id: 'palhetada', min: 6, to: '/ferramentas/tecnica' }, { id: 'power', min: 8, to: '/treinar/braco-intervalo' }, { id: 'pop', min: 8, to: '/ferramentas/backing?p=pop' }] }],
  },
  {
    id: 'classico', art: 'genero-classico', cat: 'CLV 1504', color: 'var(--co)',
    sides: [{ side: 'a', tracks: [{ id: 'ode', min: 8, to: '/ferramentas/leitura' }, { id: 'armaduras', min: 6, to: '/treinar/pauta-armadura' }, { id: 'escalas', min: 8, to: '/treinar/pauta-escala' }] }],
  },
  {
    id: 'hiphop', art: 'genero-hiphop', cat: 'CLV 1505', color: 'var(--cream)',
    sides: [{ side: 'a', tracks: [{ id: 'semis', min: 6, to: '/ferramentas/leitura' }, { id: 'ritmo', min: 6, to: '/treinar/ritmo-ouvido' }] }],
  },
  {
    id: 'forro', art: 'genero-forro', cat: 'CLV 1506', color: 'var(--ve)',
    sides: [{ side: 'a', tracks: [{ id: 'mixolidio', min: 8, to: '/estudar/modos-gregos' }, { id: 'levada', min: 6, to: '/ferramentas/backing?p=baiao' }] }],
  },
];

/** Passos do plano "internalizar uma tonalidade". */
export const TONALITY_STEPS: { id: string; group: string; to?: string }[] = [
  { id: 'solfejar', group: 'notas', to: '/ferramentas/ambiente' },
  { id: 'graus-quiz', group: 'notas', to: '/treinar/quiz-teoria' },
  { id: 'posicoes', group: 'notas' },
  { id: 'arpejos-5', group: 'acordes', to: '/ferramentas/backing' },
  { id: 'arpejos-8', group: 'acordes' },
  { id: 'penta-maior', group: 'acordes' },
  { id: 'relativa', group: 'relativo' },
  { id: 'menor-blues', group: 'relativo' },
  { id: 'leitura', group: 'repertorio', to: '/ferramentas/leitura' },
  { id: 'musica', group: 'repertorio' },
];
