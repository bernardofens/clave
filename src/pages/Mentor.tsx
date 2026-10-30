// Mentor: prévia por regras. As respostas são geradas a partir do progresso salvo, e as
// palavras que disparam cada uma vêm do idioma (mentor.kw* em src/i18n).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AreaId } from '../data/areas';
import { useContent, type Content } from '../data/localized';
import { areaXP, levelOf } from '../data/session';
import { EXERCISES } from '../exercises/catalog';
import { getState, streakDays, useStore } from '../state/store';
import { Art, Chip, PageHead } from '../components/ui';
import { itemText, useT, type MessageKey, type Translate } from '../i18n';

interface Msg { from: 'eu' | 'clave'; text: string; links?: { to: string; label: string }[] }

function weakest(): { area: AreaId; ex?: string; acc?: number } {
  const { stats, history } = getState();
  const tried = EXERCISES.filter(e => (stats[e.id]?.attempts ?? 0) >= 8).map(e => ({ e, acc: stats[e.id].correct / stats[e.id].attempts }));
  if (tried.length) {
    const w = tried.sort((a, b) => a.acc - b.acc)[0];
    return { area: w.e.area, ex: w.e.id, acc: w.acc };
  }
  const xp = areaXP(stats, history);
  return { area: (Object.keys(xp) as AreaId[]).sort((a, b) => xp[a] - xp[b])[0] };
}

function answer(q: string, t: Translate, { AREAS, areaById, MODULES }: Content): Msg {
  const s = getState();
  const lower = q.toLowerCase();
  const has = (key: MessageKey) => t(key).split('|').some(w => lower.includes(w));
  if (has('mentor.kwWeak')) {
    const w = weakest();
    if (w.ex) {
      const title = itemText(t, w.ex, 'title');
      return { from: 'clave', text: t('mentor.weakExercise', { title, pct: Math.round((w.acc ?? 0) * 100) }), links: [{ to: `/treinar/${w.ex}`, label: t('mentor.trainExercise', { title }) }] };
    }
    return { from: 'clave', text: t('mentor.weakArea', { area: areaById[w.area].name }), links: [{ to: '/treinar', label: t('mentor.openTrain') }] };
  }
  if (has('mentor.kwToday')) {
    const w = weakest();
    const mod = MODULES.find(m => m.area === w.area && !m.premium);
    const area = areaById[w.area].name;
    return { from: 'clave', text: mod ? t('mentor.todayLesson', { area, title: mod.title }) : t('mentor.today', { area }), links: [{ to: '/', label: t('mentor.buildSession') }, ...(mod ? [{ to: `/estudar/${mod.id}`, label: mod.title }] : [])] };
  }
  if (has('mentor.kwModes')) {
    return { from: 'clave', text: t('mentor.modes'), links: [{ to: '/estudar/modos-gregos', label: t('mentor.modesLesson') }, { to: '/ferramentas/ambiente', label: t('mentor.drone') }] };
  }
  if (has('mentor.kwWeek')) {
    const goals = s.profile.goals.length ? s.profile.goals : ['improvisar'];
    return { from: 'clave', text: t('mentor.week', { count: goals.length }), links: [{ to: '/progresso#tonalidade', label: t('mentor.tonalityPlan') }] };
  }
  if (has('mentor.kwProgress')) {
    const xp = areaXP(s.stats, s.history);
    const best = AREAS.map(a => ({ a, lv: levelOf(xp[a.id]).level })).sort((x, y) => y.lv - x.lv)[0];
    return { from: 'clave', text: t('mentor.progress', { count: streakDays(s.history), area: best.a.name, level: best.lv }), links: [{ to: '/progresso', label: t('common.seeProgress') }] };
  }
  return { from: 'clave', text: t('mentor.fallback') };
}

const PROMPTS: MessageKey[] = ['mentor.prompt1', 'mentor.prompt2', 'mentor.prompt3', 'mentor.prompt4', 'mentor.prompt5'];

export default function Mentor() {
  const name = useStore(s => s.profile.name);
  const t = useT();
  const content = useContent();
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ from: 'clave', text: name ? t('mentor.helloNamed', { name }) : t('mentor.hello') }]);
  const [text, setText] = useState('');
  const ask = (q: string) => { if (!q.trim()) return; setMsgs(m => [...m, { from: 'eu', text: q }, answer(q, t, content)]); setText(''); };

  return (
    <div>
      <PageHead tag={t('mentor.tag')} title={t('mentor.title')} sub={t('mentor.sub')} aside={<Art name="clave-mentor" style={{ width: 150 }} />} />
      <div className="panel" style={{ display: 'grid', gap: 14, maxWidth: 820 }}>
        <div style={{ display: 'grid', gap: 10 }} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} style={{ justifySelf: m.from === 'eu' ? 'end' : 'start', maxWidth: '85%', background: m.from === 'eu' ? 'var(--co)' : 'var(--cream)', color: m.from === 'eu' ? 'var(--cream)' : 'var(--bk)', padding: '10px 14px' }}>
              <p>{m.text}</p>
              {m.links && <div className="row" style={{ marginTop: 8 }}>{m.links.map(l => <Link key={l.to} to={l.to} style={{ fontWeight: 600 }}>{l.label} →</Link>)}</div>}
            </div>
          ))}
        </div>
        <div className="row">{PROMPTS.map(p => <Chip key={p} onClick={() => ask(t(p))}>{t(p)}</Chip>)}</div>
        <form className="row" onSubmit={e => { e.preventDefault(); ask(text); }}>
          <input id="mentor-q" value={text} onChange={e => setText(e.target.value)} placeholder={t('mentor.placeholder')} aria-label={t('mentor.question')}
            style={{ flex: 1, minWidth: 200, background: 'var(--bk-3)', border: 0, color: 'var(--cream)', padding: '10px 12px', font: 'inherit' }} />
          <button className="btn small" type="submit"><span>{t('mentor.send')}</span></button>
        </form>
      </div>
    </div>
  );
}
