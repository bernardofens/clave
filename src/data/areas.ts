// As seis áreas de habilidade: os "grupos musculares" da academia musical.

export type AreaId = 'ouvido' | 'tecnica' | 'mapeamento' | 'harmonia' | 'ritmo' | 'leitura';

export interface Area {
  id: AreaId;
  name: string;
  short: string;
  why: string;
  color: string; // token CSS
  art: string;
}

export const AREAS: Area[] = [
  {
    id: 'ouvido', name: 'Ouvido', short: 'Percepção musical',
    why: 'Reconhecer intervalos, escalas e acordes de ouvido é o que permite tirar músicas, improvisar e tocar com outras pessoas.',
    color: 'var(--co)', art: 'area-ouvido',
  },
  {
    id: 'tecnica', name: 'Técnica', short: 'Precisão e agilidade',
    why: 'Digitação certa e mãos soltas tiram o instrumento do caminho, para você pensar na música e não nos dedos. Sempre com metrônomo.',
    color: 'var(--ve)', art: 'area-tecnica',
  },
  {
    id: 'mapeamento', name: 'Mapeamento', short: 'Topografia do instrumento',
    why: 'Saber onde cada nota está e enxergar a geometria dos intervalos no braço ou no teclado dá fluência para tocar o que você ouve.',
    color: 'var(--mu)', art: 'area-mapeamento',
  },
  {
    id: 'harmonia', name: 'Harmonia', short: 'Teoria e harmonia',
    why: 'Internalizar as notas das escalas e os acordes de cada campo harmônico é o que transforma decoreba em escolha musical.',
    color: 'var(--cream)', art: 'area-harmonia',
  },
  {
    id: 'ritmo', name: 'Ritmo', short: 'Tempo interno',
    why: 'Precisão rítmica e "time" são o que faz a música soar bem, mesmo com poucas notas.',
    color: 'var(--cream)', art: 'area-ritmo',
  },
  {
    id: 'leitura', name: 'Leitura', short: 'Partitura em tempo real',
    why: 'Ler partitura abre o repertório escrito. Treinamos separado as notas e o ritmo, e depois juntamos.',
    color: 'var(--ve)', art: 'area-leitura',
  },
];
export const areaById = Object.fromEntries(AREAS.map(a => [a.id, a])) as Record<AreaId, Area>;

export type Instrument = 'piano' | 'violao' | 'baixo';
export const INSTRUMENTS: { id: Instrument; name: string; art: string }[] = [
  { id: 'piano', name: 'Piano / teclado', art: 'teclado' },
  { id: 'violao', name: 'Violão / guitarra', art: 'violao' },
  { id: 'baixo', name: 'Baixo', art: 'baixo' },
];

export type ProfileKind = 'iniciante' | 'hobby' | 'musico' | 'produtor';
export const PROFILE_KINDS: { id: ProfileKind; name: string; desc: string }[] = [
  { id: 'iniciante', name: 'Começando agora', desc: 'Quero aprender do zero, com um caminho guiado.' },
  { id: 'hobby', name: 'Toco por prazer', desc: 'Quero evoluir no meu ritmo, sem pressão.' },
  { id: 'musico', name: 'Músico', desc: 'Toco sério e quero lapidar áreas específicas.' },
  { id: 'produtor', name: 'Produtor', desc: 'Faço música no computador e quero mais teoria e ouvido.' },
];

export type GoalId = 'improvisar' | 'harmonia' | 'tirar-de-ouvido' | 'ler-partitura' | 'agilidade' | 'jazz' | 'repertorio';
export const GOALS: { id: GoalId; name: string; areas: AreaId[] }[] = [
  { id: 'improvisar', name: 'Improvisar com fluidez', areas: ['ouvido', 'mapeamento', 'harmonia'] },
  { id: 'harmonia', name: 'Criar progressões bonitas', areas: ['harmonia', 'ouvido'] },
  { id: 'tirar-de-ouvido', name: 'Tirar músicas de ouvido', areas: ['ouvido', 'mapeamento'] },
  { id: 'ler-partitura', name: 'Ler partitura', areas: ['leitura', 'ritmo'] },
  { id: 'agilidade', name: 'Ganhar agilidade', areas: ['tecnica', 'ritmo'] },
  { id: 'jazz', name: 'Tocar jazz', areas: ['harmonia', 'ouvido', 'ritmo'] },
  { id: 'repertorio', name: 'Aprender músicas', areas: ['mapeamento', 'ritmo', 'leitura'] },
];
