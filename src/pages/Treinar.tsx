import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AREAS, areaById, type AreaId } from '../data/areas';
import { MODULES } from '../data/content';
import { EXERCISES, exerciseById } from '../exercises/catalog';
import Player, { decodeSettings } from '../exercises/Player';
import { toolById, TOOLS } from '../exercises/tools';
import { GROUPS } from '../exercises/types';
import { toggleArsenal, useStore } from '../state/store';
import Ambiente from '../tools/Ambiente';
import Backing from '../tools/Backing';
import { Metronome } from '../tools/common';
import Leitura from '../tools/Leitura';
import Tecnica from '../tools/Tecnica';
import { Art, Chip, PageHead, SecTitle, Tag } from '../components/ui';
import NotFound from './NotFound';

export const TOOL_COMPONENTS: Record<string, () => React.ReactElement> = {
  metronomo: () => <Metronome />,
  ambiente: () => <Ambiente />,
  backing: () => <Backing />,
  leitura: () => <Leitura />,
  tecnica: () => <Tecnica />,
};

export default function Treinar() {
  const stats = useStore(s => s.stats);
  const arsenal = useStore(s => s.arsenal);
  const [mobileOnly, setMobileOnly] = useState(false);
  const [area, setArea] = useState<AreaId | 'todas'>('todas');
  const areas = AREAS.filter(a => area === 'todas' || a.id === area);
  const tools = TOOLS.filter(t => t.id !== 'tonalidade' && (!mobileOnly || t.mobile) && (area === 'todas' || t.area === area));

  return (
    <div>
      <PageHead tag="Academia" title="Treinar" sub="Cada área é um grupo muscular. Escolha um exercício, personalize e repita até virar reflexo. A estrela coloca o exercício no seu arsenal." />
      <div className="row" style={{ marginBottom: 8 }}>
        <Chip on={area === 'todas'} onClick={() => setArea('todas')}>Todas</Chip>
        {AREAS.map(a => <Chip key={a.id} on={area === a.id} onClick={() => setArea(a.id)}>{a.name}</Chip>)}
        <label className="switch" style={{ marginLeft: 'auto' }}><input type="checkbox" id="mobile-only" checked={mobileOnly} onChange={e => setMobileOnly(e.target.checked)} />Só sem instrumento</label>
      </div>

      {tools.length > 0 && (
        <section className="sec" style={{ marginTop: 32 }}>
          <SecTitle>Ferramentas</SecTitle>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
            {tools.map(t => (
              <Link key={t.id} to={t.path} className="ex-card">
                <span className="acc" style={{ background: areaById[t.area].color }} />
                <Art name={t.art} style={{ width: 56, height: 56, objectFit: 'contain', flex: 'none' }} />
                <div style={{ minWidth: 0 }}>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                  <div className="meta"><span className="mini-tag">{areaById[t.area].name}</span>{t.mobile ? <span className="mini-tag">sem instrumento</span> : <span className="mini-tag">com instrumento</span>}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {areas.map(a => {
        const list = EXERCISES.filter(e => e.area === a.id && (!mobileOnly || e.mobile));
        if (!list.length) return null;
        return (
          <section key={a.id} className="sec" style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
              <Art name={a.art} style={{ width: 64 }} />
              <div><h2 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)' }}>{a.name}</h2><span className="muted">{a.short}</span></div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
              {list.map(e => {
                const st = stats[e.id];
                const pinned = arsenal.includes(e.id);
                return (
                  <div key={e.id} style={{ position: 'relative' }}>
                    <Link to={`/treinar/${e.id}`} className="ex-card">
                      <span className="acc" style={{ background: a.color }} />
                      <div style={{ minWidth: 0, paddingRight: 26 }}>
                        <h3>{e.title}</h3>
                        <p>{e.desc}</p>
                        <div className="meta"><span className="mini-tag">{GROUPS[e.group]}</span>{st && <span className="mini-tag">{st.attempts} feitas</span>}</div>
                      </div>
                      {st && <span className="pct num">{Math.round((st.correct / st.attempts) * 100)}%</span>}
                    </Link>
                    <button type="button" onClick={() => toggleArsenal(e.id)} aria-pressed={pinned} aria-label={pinned ? 'Tirar do arsenal' : 'Pôr no arsenal'}
                      style={{ position: 'absolute', right: 10, top: 10, border: 0, background: 'none', cursor: 'pointer', fontSize: 20, color: pinned ? 'var(--mu)' : 'var(--muted)' }}>{pinned ? '★' : '☆'}</button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ExercisePage() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const def = exerciseById[id];
  if (!def) return <NotFound />;
  const shared = decodeSettings(params.get('c'));
  const mod = MODULES.find(m => m.exercises.includes(id));
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/treinar" className="eyebrow" style={{ textDecoration: 'none' }}>← Treinar</Link>
        {mod && <Link to={`/estudar/${mod.id}`} className="eyebrow" style={{ textDecoration: 'none', color: 'var(--mu)' }}>Aula: {mod.title} →</Link>}
      </div>
      {shared && <div className="panel" style={{ background: 'var(--bk-3)', padding: 12 }}>Você abriu um treino compartilhado, com configurações próprias.</div>}
      <Player key={id + (shared ? 'c' : '')} def={def} initialSettings={shared} />
    </div>
  );
}

export function ToolPage() {
  const { id = '' } = useParams();
  const t = toolById[id];
  const Comp = TOOL_COMPONENTS[id];
  if (!t || !Comp) return <NotFound />;
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Link to="/treinar" className="eyebrow" style={{ textDecoration: 'none' }}>← Treinar</Link>
      <header className="page-head" style={{ marginBottom: 0 }}>
        <div><div className="row"><Tag>{areaById[t.area].name}</Tag>{t.mobile ? <Tag tone="dark">sem instrumento</Tag> : <Tag tone="co">com instrumento</Tag>}</div><h1>{t.title}</h1><p>{t.desc}</p></div>
        <Art name={t.art} style={{ width: 110 }} />
      </header>
      <Comp />
    </div>
  );
}
