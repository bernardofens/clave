// Cartões de exercício, ferramenta e aula, no mesmo desenho no Treinar e na tela de cada objetivo.
import { Link } from 'react-router-dom';
import { useContent } from '../data/localized';
import { lessonProgress } from '../data/progress';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';
import { itemText, useT } from '../i18n';
import { toggleArsenal, useStore } from '../state/store';
import { Art } from './ui';

export function ExerciseCard({ id, color }: { id: string; color: string }) {
  const t = useT();
  const st = useStore(s => s.stats[id]);
  const pinned = useStore(s => s.arsenal.includes(id));
  return (
    <div style={{ position: 'relative' }}>
      <Link to={`/treinar/${id}`} className="ex-card">
        <span className="acc" style={{ background: color }} />
        <div style={{ minWidth: 0, paddingRight: 26 }}>
          <h3>{itemText(t, id, 'title')}</h3>
          <p>{itemText(t, id, 'desc')}</p>
          <div className="meta"><span className="mini-tag">{t(`train.groups.${exerciseById[id].group}`)}</span>{st && <span className="mini-tag">{t('train.done', { count: st.attempts })}</span>}</div>
        </div>
        {st && <span className="pct num">{Math.round((st.correct / st.attempts) * 100)}%</span>}
      </Link>
      <button type="button" onClick={() => toggleArsenal(id)} aria-pressed={pinned} aria-label={t(pinned ? 'train.unpin' : 'train.pin')}
        style={{ position: 'absolute', right: 10, top: 10, border: 0, background: 'none', cursor: 'pointer', fontSize: 20, color: pinned ? 'var(--mu)' : 'var(--muted)' }}>{pinned ? '★' : '☆'}</button>
    </div>
  );
}

export function ToolCard({ id, color }: { id: string; color: string }) {
  const t = useT();
  const tool = toolById[id];
  return (
    <Link to={tool.path} className="ex-card">
      <span className="acc" style={{ background: color }} />
      <Art name={tool.art} style={{ width: 48, height: 48, objectFit: 'contain', flex: 'none' }} />
      <div style={{ minWidth: 0 }}>
        <h3>{itemText(t, id, 'title')}</h3>
        <p>{itemText(t, id, 'desc')}</p>
        <div className="meta"><span className="mini-tag">{t('train.toolTag')}</span><span className="mini-tag">{t(tool.mobile ? 'common.mobile' : 'common.withInstrument')}</span></div>
      </div>
    </Link>
  );
}

export function LessonCard({ id, color }: { id: string; color: string }) {
  const { lessonById } = useContent();
  const stats = useStore(s => s.stats);
  return (
    <Link to={`/estudar/${id}`} className="ex-card">
      <span className="acc" style={{ background: color }} />
      <div style={{ minWidth: 0 }}>
        <h3>{lessonById[id].title}</h3>
        <div className="progressbar" style={{ marginTop: 10 }}><i style={{ width: `${lessonProgress(id, stats) * 100}%` }} /></div>
      </div>
    </Link>
  );
}
