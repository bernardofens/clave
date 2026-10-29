// Ferramentas para usar com o instrumento (ambientes de estudo, não perguntas).
import type { ToolDef } from './types';

export const TOOLS: (ToolDef & { session: boolean })[] = [
  { id: 'metronomo', title: 'Metrônomo', desc: 'Pulso, compasso, subdivisão e tap tempo.', area: 'ritmo', mobile: true, path: '/ferramentas/metronomo', art: 'metronomo', session: true },
  { id: 'ambiente', title: 'Solfejar e tocar', desc: 'Drone de contexto harmônico, metrônomo e cronômetro com meta.', area: 'ouvido', mobile: false, path: '/ferramentas/ambiente', art: 'microfone', session: true },
  { id: 'backing', title: 'Backing track', desc: 'Monte a progressão, escolha a levada e veja que escala usar em cada acorde.', area: 'harmonia', mobile: false, path: '/ferramentas/backing', art: 'caixa', session: true },
  { id: 'leitura', title: 'Gerador de leitura', desc: 'Partituras infinitas: só notas ou só ritmo, em loop de 4 compassos.', area: 'leitura', mobile: true, path: '/ferramentas/leitura', art: 'pauta-ode', session: true },
  { id: 'ritmo', title: 'Leitura rítmica', desc: 'Compassos novos a cada toque, do pulso às quiálteras. Para ler em silêncio ou ouvir com metrônomo.', area: 'ritmo', mobile: true, path: '/ferramentas/ritmo', art: 'semicolcheias', session: true },
  { id: 'tecnica', title: 'Rotinas de técnica', desc: 'Tônica-quinta-oitava, aranha e cinco dedos, com metrônomo progressivo.', area: 'tecnica', mobile: false, path: '/ferramentas/tecnica', art: 'violao', session: true },
  { id: 'tonalidade', title: 'Internalizar uma tonalidade', desc: 'Plano em etapas: notas, graus, arpejos, relativo menor e repertório.', area: 'harmonia', mobile: false, path: '/progresso#tonalidade', art: 'area-harmonia', session: false },
];
export const toolById = Object.fromEntries(TOOLS.map(t => [t.id, t]));
