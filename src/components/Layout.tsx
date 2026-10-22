import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { streakDays, useStore } from '../state/store';
import { art } from './ui';

const ICONS: Record<string, React.ReactNode> = {
  hoje: <path d="M4,15 L16,4 L28,15 L24,15 L24,28 L19,28 L19,20 L13,20 L13,28 L8,28 L8,15 Z" fill="currentColor" />,
  treinar: <g fill="currentColor"><rect x="3" y="11" width="6" height="10" /><rect x="23" y="11" width="6" height="10" /><rect x="8" y="14.5" width="16" height="3" /></g>,
  estudar: <g fill="currentColor"><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="4" fill="var(--bk)" /></g>,
  progresso: <g fill="currentColor"><rect x="4" y="18" width="6" height="10" /><rect x="13" y="11" width="6" height="17" /><rect x="22" y="4" width="6" height="24" /></g>,
  perfil: <path d="M6,27 L7,4 L13,10 L19,10 L25,4 L26,27 Z" fill="currentColor" />,
};
const NAV = [
  { to: '/', label: 'Hoje', icon: 'hoje', end: true },
  { to: '/treinar', label: 'Treinar', icon: 'treinar' },
  { to: '/estudar', label: 'Estudar', icon: 'estudar' },
  { to: '/progresso', label: 'Progresso', icon: 'progresso' },
];

export default function Layout() {
  const history = useStore(s => s.history);
  const streak = streakDays(history);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="shell">
      <header className="topbar">
        <div className="in">
          <Link to="/" className="brand" aria-label="Clave, início"><img src={art('logo')} alt="" /><b>Clave</b></Link>
          <nav className="nav" aria-label="Principal">
            {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>)}
            <NavLink to="/comunidade">Comunidade</NavLink>
            <NavLink to="/mentor">Mentor</NavLink>
          </nav>
          <div className="right">
            <Link to="/progresso" className="streak-pill" title="Dias seguidos estudando"><b className="num">{streak}</b><span>{streak === 1 ? 'dia' : 'dias'}</span></Link>
            <NavLink to="/perfil" className="streak-pill" aria-label="Perfil"><span>Perfil</span></NavLink>
          </div>
        </div>
      </header>
      <main className="page"><Outlet /></main>
      <nav className="tabbar" aria-label="Principal">
        {[...NAV, { to: '/perfil', label: 'Perfil', icon: 'perfil', end: false }].map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <svg viewBox="0 0 32 32" aria-hidden="true">{ICONS[n.icon]}</svg>{n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
