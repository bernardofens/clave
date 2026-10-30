import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { streakDays, useStore } from '../state/store';
import { art } from './ui';
import { useT, type MessageKey } from '../i18n';

const ICONS: Record<string, React.ReactNode> = {
  hoje: <path d="M4,15 L16,4 L28,15 L24,15 L24,28 L19,28 L19,20 L13,20 L13,28 L8,28 L8,15 Z" fill="currentColor" />,
  treinar: <g fill="currentColor"><rect x="3" y="11" width="6" height="10" /><rect x="23" y="11" width="6" height="10" /><rect x="8" y="14.5" width="16" height="3" /></g>,
  estudar: <g fill="currentColor"><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="4" fill="var(--bk)" /></g>,
  progresso: <g fill="currentColor"><rect x="4" y="18" width="6" height="10" /><rect x="13" y="11" width="6" height="17" /><rect x="22" y="4" width="6" height="24" /></g>,
  perfil: <path d="M6,27 L7,4 L13,10 L19,10 L25,4 L26,27 Z" fill="currentColor" />,
};
const NAV: { to: string; label: MessageKey; icon: string; end?: boolean }[] = [
  { to: '/', label: 'nav.today', icon: 'hoje', end: true },
  { to: '/treinar', label: 'nav.train', icon: 'treinar' },
  { to: '/estudar', label: 'nav.study', icon: 'estudar' },
  { to: '/progresso', label: 'nav.progress', icon: 'progresso' },
];

export default function Layout() {
  const history = useStore(s => s.history);
  const streak = streakDays(history);
  const { pathname } = useLocation();
  const t = useT();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="shell">
      <header className="topbar">
        <div className="in">
          <Link to="/" className="brand" aria-label={t('nav.home')}><img src={art('logo')} alt="" /><b>Clave</b></Link>
          <nav className="nav" aria-label={t('nav.main')}>
            {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}>{t(n.label)}</NavLink>)}
            <NavLink to="/comunidade">{t('nav.community')}</NavLink>
            <NavLink to="/mentor">{t('nav.mentor')}</NavLink>
          </nav>
          <div className="right">
            <Link to="/progresso" className="streak-pill" title={t('nav.streakTitle')}><b className="num">{streak}</b><span>{t('nav.streakUnit', { count: streak })}</span></Link>
            <NavLink to="/perfil" className="streak-pill" aria-label={t('nav.profile')}><span>{t('nav.profile')}</span></NavLink>
          </div>
        </div>
      </header>
      <main className="page"><Outlet /></main>
      <nav className="tabbar" aria-label={t('nav.main')}>
        {[...NAV, { to: '/perfil', label: 'nav.profile' as MessageKey, icon: 'perfil', end: false }].map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <svg viewBox="0 0 32 32" aria-hidden="true">{ICONS[n.icon]}</svg>{t(n.label)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
