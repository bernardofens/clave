// Navegação principal (decisão 6): Hoje · Treinar · Rotinas · Progresso · Perfil.
// Comunidade e Mentor saíram do menu: portas que não abrem não devem aparecer. O Mentor continua
// acessível pelo Progresso, e as rotas de Comunidade e de Trilhas/Gêneros seguem vivas, sem entrada.
import type { MessageKey } from '../i18n';

/** Rotinas só entra no menu quando a D3 entregar o executor; a rota e o ícone já estão prontos. */
export const ROUTINES_READY = false;

export interface NavItem {
  to: string;
  label: MessageKey;
  icon: 'hoje' | 'treinar' | 'rotinas' | 'progresso' | 'perfil';
  end?: boolean;
}

const MAIN: NavItem[] = [
  { to: '/', label: 'nav.today', icon: 'hoje', end: true },
  { to: '/treinar', label: 'nav.train', icon: 'treinar' },
  { to: '/rotinas', label: 'nav.routines', icon: 'rotinas' },
  { to: '/progresso', label: 'nav.progress', icon: 'progresso' },
];
export const PROFILE_ITEM: NavItem = { to: '/perfil', label: 'nav.profile', icon: 'perfil' };

/** Itens do menu principal, sem o Perfil (que fica à direita no topo). */
export function mainNav(routinesReady: boolean = ROUTINES_READY): NavItem[] {
  return MAIN.filter(i => routinesReady || i.icon !== 'rotinas');
}
/** Todos os itens, na ordem da barra inferior do celular. */
export function allNav(routinesReady: boolean = ROUTINES_READY): NavItem[] {
  return [...mainNav(routinesReady), PROFILE_ITEM];
}
