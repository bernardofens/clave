import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../data/localized';
import { areaXP, levelOf } from '../data/session';
import { minutesByArea, setPlan, streakDays, useStore } from '../state/store';
import { buildScale, harmonicField, majorTonic, noteName, relativeMinor } from '../theory/core';
import { Art, Btn, Chip, fmtMin, PageHead, SecTitle } from '../components/ui';
import { itemText, localeTag, useLocale, useNaming, useT } from '../i18n';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';

export default function Progresso() {
  const stats = useStore(s => s.stats);
  const history = useStore(s => s.history);
  const badges = useStore(s => s.badges);
  const plan = useStore(s => s.plan);
  const naming = useNaming();
  const { hash } = useLocation();
  const t = useT();
  const { AREAS, BADGES } = useContent();
  const lang = localeTag(useLocale());
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [hash]);

  const xp = areaXP(stats, history);
  const byArea = minutesByArea(history, 30);
  const totalMin = Object.values(byArea).reduce((a, b) => a + b, 0);
  const answers = Object.values(stats).reduce((a, s) => a + s.attempts, 0);
  const right = Object.values(stats).reduce((a, s) => a + s.correct, 0);

  return (
    <div>
      <PageHead tag={t('progress.tag')} title={t('progress.title')} sub={t('progress.sub')} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {[
          [t('progress.streak'), String(streakDays(history))],
          [t('progress.minutes30'), String(Math.round(totalMin))],
          [t('progress.answers'), String(answers)],
          [t('progress.accuracy'), answers ? `${Math.round((right / answers) * 100)}%` : '–'],
        ].map(([l, v]) => (
          <div key={l} className="panel"><div className="eyebrow">{l}</div><div className="num" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 56, lineHeight: 1 }}>{v}</div></div>
        ))}
      </div>

      <section className="sec">
        <SecTitle>{t('progress.areas')}</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {AREAS.map(a => {
            const lv = levelOf(xp[a.id]);
            return (
              <div key={a.id} className="panel" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Art name={a.art} style={{ width: 72, flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 30 }}>{a.name}</h3>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 30, color: 'var(--mu)' }}>{t('progress.level', { n: lv.level })}</span>
                  </div>
                  <div className="progressbar" style={{ margin: '8px 0 6px' }}><i style={{ width: `${lv.progress * 100}%` }} /></div>
                  <div className="muted" style={{ fontSize: 13 }}>{t('progress.xpLine', { xp: xp[a.id], next: lv.toNext, level: lv.level + 1, time: fmtMin((byArea[a.id] ?? 0) * 60) })}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sec" id="tonalidade">
        <SecTitle>{t('progress.tonality')}</SecTitle>
        {!plan ? (
          <div className="panel" style={{ display: 'grid', gap: 14 }}>
            <p style={{ maxWidth: '62ch' }}>{t('progress.tonalityIntro')}</p>
            <div className="row">
              <span className="eyebrow">{t('progress.pickKey')}</span>
              {Array.from({ length: 13 }, (_, i) => i - 6).map(f => <Chip key={f} onClick={() => setPlan({ fifths: f, done: [], startedAt: Date.now() })}>{t('progress.major', { note: noteName(majorTonic(f), naming) })}</Chip>)}
            </div>
          </div>
        ) : <TonalityPlan />}
      </section>

      <section className="sec">
        <SecTitle>{t('progress.badges')}</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {BADGES.map(b => {
            const got = badges[b.id];
            return (
              <div key={b.id} className="panel" style={{ textAlign: 'center', display: 'grid', gap: 6, justifyItems: 'center', opacity: got ? 1 : 0.7 }}>
                <Art name={got ? b.art : 'medalha-bloqueada'} alt={got ? b.name : t('progress.locked', { name: b.name })} style={{ width: 96 }} />
                <b style={{ fontFamily: 'var(--display)', fontSize: 22, textTransform: 'uppercase' }}>{b.name}</b>
                <span className="muted" style={{ fontSize: 13 }}>{got ? t('progress.since', { date: new Date(got).toLocaleDateString(lang) }) : b.desc}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sec">
        <SecTitle>{t('progress.history')}</SecTitle>
        {history.length === 0 ? (
          <div className="empty"><Art name="clave-dormindo" style={{ width: 160 }} /><div><h3 style={{ fontSize: 28 }}>{t('progress.emptyTitle')}</h3><p className="muted">{t('progress.emptyText')}</p></div></div>
        ) : (
          <div className="panel" style={{ padding: 0 }}>
            {history.slice(0, 40).map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, padding: '10px 16px', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
                <div style={{ minWidth: 0 }}><b>{exerciseById[h.id] || toolById[h.id] ? itemText(t, h.id, 'title') : h.title}</b> <span className="muted" style={{ fontSize: 13 }}>· {AREAS.find(a => a.id === h.area)?.name}</span></div>
                <span className="num muted" style={{ fontSize: 14 }}>{h.total ? `${h.correct}/${h.total}` : fmtMin(h.seconds)}</span>
                <span className="num muted" style={{ fontSize: 13 }}>{new Date(h.at).toLocaleString(lang, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TonalityPlan() {
  const plan = useStore(s => s.plan)!;
  const naming = useNaming();
  const t = useT();
  const { TONALITY_STEPS } = useContent();
  const conv = useLocale();
  const tonic = majorTonic(plan.fifths);
  const rel = relativeMinor(plan.fifths);
  const scale = buildScale(tonic, 'maior');
  const field = harmonicField(tonic, 'maior', true, conv);
  const groups = [...new Set(TONALITY_STEPS.map(s => s.group))];
  const toggle = (id: string) => setPlan({ ...plan, done: plan.done.includes(id) ? plan.done.filter(x => x !== id) : [...plan.done, id] });
  const pct = plan.done.length / TONALITY_STEPS.length;
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
      <div style={{ background: 'var(--co)', padding: 22, display: 'grid', gap: 12 }}>
        <span className="eyebrow" style={{ color: 'var(--cream)' }}>{t('progress.currentKey')}</span>
        <h3 style={{ fontSize: 64 }}>{t('progress.major', { note: noteName(tonic, naming) })}</h3>
        <div><b>{t('progress.scale')}</b> {scale.map(n => noteName(n, naming)).join(' · ')}</div>
        <div><b>{t('progress.relative')}</b> {t('progress.minor', { note: noteName(rel, naming) })}</div>
        <div><b>{t('progress.field')}</b> {field.map(d => `${d.roman} ${d.symbol}`).join(' · ')}</div>
        <div className="progressbar" style={{ background: 'rgba(0,0,0,.3)' }}><i style={{ width: `${pct * 100}%` }} /></div>
        <div className="row"><Btn small tone="ghost" onClick={() => setPlan(null)}>{t('progress.changeKey')}</Btn></div>
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        {groups.map(gname => (
          <div key={gname}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{gname}</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {TONALITY_STEPS.filter(s => s.group === gname).map(s => {
                const done = plan.done.includes(s.id);
                return (
                  <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bk-2)', padding: '10px 12px' }}>
                    <label className="switch" style={{ flex: 'none' }}><input type="checkbox" id={`plan-${s.id}`} checked={done} onChange={() => toggle(s.id)} aria-label={s.text} /></label>
                    <span style={{ flex: 1, textDecoration: done ? 'line-through' : undefined, opacity: done ? 0.6 : 1 }}>{s.text}</span>
                    {s.to && <Link to={s.to} style={{ color: 'var(--mu)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{t('common.open')}</Link>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
