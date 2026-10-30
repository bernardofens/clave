import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { allNav, mainNav, PROFILE_ITEM } from './nav';
import { art } from './ui';
import { useT } from '../i18n';

const ICONS: Record<string, React.ReactNode> = {
  hoje: <path d="M4,15 L16,4 L28,15 L24,15 L24,28 L19,28 L19,20 L13,20 L13,28 L8,28 L8,15 Z" fill="currentColor" />,
  treinar: <g fill="currentColor"><rect x="3" y="11" width="6" height="10" /><rect x="23" y="11" width="6" height="10" /><rect x="8" y="14.5" width="16" height="3" /></g>,
  rotinas: <g fill="currentColor"><rect x="4" y="6" width="24" height="4" /><rect x="4" y="14" width="24" height="4" /><rect x="4" y="22" width="16" height="4" /></g>,
  progresso: <g fill="currentColor"><rect x="4" y="18" width="6" height="10" /><rect x="13" y="11" width="6" height="17" /><rect x="22" y="4" width="6" height="24" /></g>,
  perfil: <path d="M6,27 L7,4 L13,10 L19,10 L25,4 L26,27 Z" fill="currentColor" />,
};
export default function Layout() {
  const { pathname } = useLocation();
  const t = useT();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="shell">
      <header className="topbar">
        <div className="in">
          <Link to="/" className="brand" aria-label={t('nav.home')}><img src={art('logo')} alt="" /><b>Clave</b></Link>
          <nav className="nav" aria-label={t('nav.main')}>
            {mainNav().map(n => <NavLink key={n.to} to={n.to} end={n.end}>{t(n.label)}</NavLink>)}
          </nav>
          <div className="right">
            <NavLink to={PROFILE_ITEM.to} className="streak-pill" aria-label={t(PROFILE_ITEM.label)}><span>{t(PROFILE_ITEM.label)}</span></NavLink>
          </div>
        </div>
      </header>
      <main className="page"><Outlet /></main>
      <nav className="tabbar" aria-label={t('nav.main')}>
        {allNav().map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <svg viewBox="0 0 32 32" aria-hidden="true">{ICONS[n.icon]}</svg>{t(n.label)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
