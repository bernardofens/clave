import { useContent } from '../data/localized';
import { minutesByModule, streakDays, useStore } from '../state/store';
import { Art, fmtMin, PageHead, SecTitle } from '../components/ui';
import { itemText, localeTag, useLocale, useT } from '../i18n';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';

export default function Progresso() {
  const stats = useStore(s => s.stats);
  const history = useStore(s => s.history);
  const t = useT();
  const { MODULES, moduleById } = useContent();
  const lang = localeTag(useLocale());

  const byModule = minutesByModule(history, 30);
  const totalMin = Object.values(byModule).reduce((a, b) => a + b, 0);
  const maxMin = Math.max(10, ...Object.values(byModule));
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
        <SecTitle>{t('progress.modules')}</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {MODULES.map(m => (
            <div key={m.id} className="panel" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Art name={m.art} style={{ width: 72, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 30 }}>{m.name}</h3>
                <div className="progressbar" style={{ margin: '8px 0 6px' }}><i style={{ width: `${((byModule[m.id] ?? 0) / maxMin) * 100}%`, background: m.color }} /></div>
                <div className="muted" style={{ fontSize: 13 }}>{t('progress.monthTime', { time: fmtMin((byModule[m.id] ?? 0) * 60) })}</div>
              </div>
            </div>
          ))}
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
                <div style={{ minWidth: 0 }}><b>{exerciseById[h.id] || toolById[h.id] ? itemText(t, h.id, 'title') : h.title}</b> <span className="muted" style={{ fontSize: 13 }}>· {moduleById[h.module]?.name}</span></div>
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
