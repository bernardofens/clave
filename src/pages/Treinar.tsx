import { lazy, Suspense, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AREAS, areaById, type AreaId } from '../data/areas';
import { MODULES } from '../data/content';
import { EXERCISES, exerciseById } from '../exercises/catalog';
import Player, { decodeSettings } from '../exercises/Player';
import { toolById, TOOLS } from '../exercises/tools';
import { toggleArsenal, useStore } from '../state/store';
import Ambiente from '../tools/Ambiente';
import Backing from '../tools/Backing';
import { Metronome } from '../tools/common';
import Leitura from '../tools/Leitura';
import Tecnica from '../tools/Tecnica';
import { Art, Chip, PageHead, SecTitle, Tag } from '../components/ui';
import NotFound from './NotFound';
import { itemText, useT } from '../i18n';

// A leitura rítmica traz a VexFlow; só baixa quando a ferramenta abre.
const Ritmo = lazy(() => import('../tools/Ritmo'));

export const TOOL_COMPONENTS: Record<string, () => React.ReactElement> = {
  metronomo: () => <Metronome />,
  ambiente: () => <Ambiente />,
  backing: () => <Backing />,
  leitura: () => <Leitura />,
  ritmo: () => <Suspense fallback={<LoadingScore />}><Ritmo /></Suspense>,
  tecnica: () => <Tecnica />,
};

function LoadingScore() {
  const t = useT();
  return <p className="muted">{t('train.loadingScore')}</p>;
}

export default function Treinar() {
  const t = useT();
  const stats = useStore(s => s.stats);
  const arsenal = useStore(s => s.arsenal);
  const [mobileOnly, setMobileOnly] = useState(false);
  const [area, setArea] = useState<AreaId | 'todas'>('todas');
  const areas = AREAS.filter(a => area === 'todas' || a.id === area);
  const tools = TOOLS.filter(tool => tool.id !== 'tonalidade' && (!mobileOnly || tool.mobile) && (area === 'todas' || tool.area === area));

  return (
    <div>
      <PageHead tag={t('train.tag')} title={t('train.title')} sub={t('train.sub')} />
      <div className="row" style={{ marginBottom: 8 }}>
        <Chip on={area === 'todas'} onClick={() => setArea('todas')}>{t('train.all')}</Chip>
        {AREAS.map(a => <Chip key={a.id} on={area === a.id} onClick={() => setArea(a.id)}>{a.name}</Chip>)}
        <label className="switch" style={{ marginLeft: 'auto' }}><input type="checkbox" id="mobile-only" checked={mobileOnly} onChange={e => setMobileOnly(e.target.checked)} />{t('train.mobileOnly')}</label>
      </div>

      {tools.length > 0 && (
        <section className="sec" style={{ marginTop: 32 }}>
          <SecTitle>{t('train.tools')}</SecTitle>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
            {tools.map(tool => (
              <Link key={tool.id} to={tool.path} className="ex-card">
                <span className="acc" style={{ background: areaById[tool.area].color }} />
                <Art name={tool.art} style={{ width: 56, height: 56, objectFit: 'contain', flex: 'none' }} />
                <div style={{ minWidth: 0 }}>
                  <h3>{itemText(t, tool.id, 'title')}</h3>
                  <p>{itemText(t, tool.id, 'desc')}</p>
                  <div className="meta"><span className="mini-tag">{areaById[tool.area].name}</span><span className="mini-tag">{t(tool.mobile ? 'common.mobile' : 'common.withInstrument')}</span></div>
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
                        <h3>{itemText(t, e.id, 'title')}</h3>
                        <p>{itemText(t, e.id, 'desc')}</p>
                        <div className="meta"><span className="mini-tag">{t(`train.groups.${e.group}`)}</span>{st && <span className="mini-tag">{t('train.done', { count: st.attempts })}</span>}</div>
                      </div>
                      {st && <span className="pct num">{Math.round((st.correct / st.attempts) * 100)}%</span>}
                    </Link>
                    <button type="button" onClick={() => toggleArsenal(e.id)} aria-pressed={pinned} aria-label={t(pinned ? 'train.unpin' : 'train.pin')}
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
  const t = useT();
  const def = exerciseById[id];
  if (!def) return <NotFound />;
  const shared = decodeSettings(params.get('c'));
  const mod = MODULES.find(m => m.exercises.includes(id));
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Link to="/treinar" className="eyebrow" style={{ textDecoration: 'none' }}>{t('train.back')}</Link>
        {mod && <Link to={`/estudar/${mod.id}`} className="eyebrow" style={{ textDecoration: 'none', color: 'var(--mu)' }}>{t('train.lesson', { title: mod.title })}</Link>}
      </div>
      {shared && <div className="panel" style={{ background: 'var(--bk-3)', padding: 12 }}>{t('train.shared')}</div>}
      <Player key={id + (shared ? 'c' : '')} def={def} initialSettings={shared} />
    </div>
  );
}

export function ToolPage() {
  const { id = '' } = useParams();
  const t = useT();
  const tool = toolById[id];
  const Comp = TOOL_COMPONENTS[id];
  if (!tool || !Comp) return <NotFound />;
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <Link to="/treinar" className="eyebrow" style={{ textDecoration: 'none' }}>{t('train.back')}</Link>
      <header className="page-head" style={{ marginBottom: 0 }}>
        <div><div className="row"><Tag>{areaById[tool.area].name}</Tag>{tool.mobile ? <Tag tone="dark">{t('common.mobile')}</Tag> : <Tag tone="co">{t('common.withInstrument')}</Tag>}</div><h1>{itemText(t, tool.id, 'title')}</h1><p>{itemText(t, tool.id, 'desc')}</p></div>
        <Art name={tool.art} style={{ width: 110 }} />
      </header>
      <Comp />
    </div>
  );
}
