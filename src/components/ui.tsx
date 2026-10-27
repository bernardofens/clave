// Peças de interface reaproveitadas em todas as telas.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const art = (name: string) => `${import.meta.env.BASE_URL}art/${name}.svg`;

export function Art({ name, alt = '', className, style }: { name: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  return <img src={art(name)} alt={alt} className={className} style={style} draggable={false} loading="lazy" />;
}
export function Tag({ children, tone }: { children: ReactNode; tone?: 'co' | 've' | 'dark' }) {
  return <span className={`tag ${tone ?? ''}`}><span>{children}</span></span>;
}
export function Btn({ children, to, onClick, tone, small, disabled, type = 'button', id, label }: {
  children: ReactNode; to?: string; onClick?: () => void; tone?: 'ghost' | 'mu' | 'co'; small?: boolean; disabled?: boolean; type?: 'button' | 'submit'; id?: string; label?: string;
}) {
  const cls = `btn ${tone ?? ''} ${small ? 'small' : ''}`;
  if (to) return <Link className={cls} to={to} id={id} aria-label={label}><span>{children}</span></Link>;
  return <button className={cls} type={type} onClick={onClick} disabled={disabled} id={id} aria-label={label} title={label}><span>{children}</span></button>;
}
export function Chip({ on, onClick, children, disabled, title }: { on?: boolean; onClick?: () => void; children: ReactNode; disabled?: boolean; title?: string }) {
  return <button type="button" className={`chip ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on} disabled={disabled} title={title}><span>{children}</span></button>;
}
export function SecTitle({ children, link }: { children: ReactNode; link?: { to: string; label: string } }) {
  return <div className="sec-title"><h2>{children}</h2>{link && <Link to={link.to}>{link.label} →</Link>}</div>;
}
export function PageHead({ tag, title, sub, aside }: { tag: string; title: ReactNode; sub?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="page-head">
      <div><Tag>{tag}</Tag><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {aside}
    </header>
  );
}
export function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L20 12 L7 20 Z" fill="currentColor" /></svg>;
}

export const fmtMin = (seconds: number) => {
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
};
