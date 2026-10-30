// Ferramentas para usar com o instrumento (ambientes de estudo, não perguntas).
// Título e descrição ficam nos textos de cada idioma (tools.<id> em src/i18n).
import type { ToolDef } from './types';

export const TOOLS: (ToolDef & { session: boolean })[] = [
  { id: 'metronomo', area: 'ritmo', mobile: true, path: '/ferramentas/metronomo', art: 'metronomo', session: true },
  { id: 'ambiente', area: 'ouvido', mobile: false, path: '/ferramentas/ambiente', art: 'microfone', session: true },
  { id: 'backing', area: 'harmonia', mobile: false, path: '/ferramentas/backing', art: 'caixa', session: true },
  { id: 'leitura', area: 'leitura', mobile: true, path: '/ferramentas/leitura', art: 'pauta-ode', session: true },
  { id: 'ritmo', area: 'ritmo', mobile: true, path: '/ferramentas/ritmo', art: 'semicolcheias', session: true },
  { id: 'tecnica', area: 'tecnica', mobile: false, path: '/ferramentas/tecnica', art: 'violao', session: true },
  { id: 'tonalidade', area: 'harmonia', mobile: false, path: '/progresso#tonalidade', art: 'area-harmonia', session: false },
];
export const toolById = Object.fromEntries(TOOLS.map(t => [t.id, t]));
