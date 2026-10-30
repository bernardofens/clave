// Prévia da comunidade: ainda não há servidor, então o feed usa dados de exemplo.
// Os links de treino compartilhado já funcionam de verdade (configurações vão no próprio link).
import { Link } from 'react-router-dom';
import { encodeSettings } from '../exercises/Player';
import type { SettingValue } from '../exercises/types';
import { Art, PageHead, SecTitle, Tag } from '../components/ui';
import { useT, type MessageKey } from '../i18n';

const SAMPLE_POSTS: { who: string; kind: MessageKey; text: MessageKey; ex?: string; s?: Record<string, SettingValue>; likes: number }[] = [
  { who: 'Marina', kind: 'community.post1Kind', text: 'community.post1Text', ex: 'ouvido-intervalo', s: { intervalos: ['5', '7'], direcao: 'misto' }, likes: 42 },
  { who: 'Caio', kind: 'community.post2Kind', text: 'community.post2Text', likes: 31 },
  { who: 'Duda', kind: 'community.post3Kind', text: 'community.post3Text', ex: 'pauta-nota', s: { claves: ['fa'], extensao: 'pauta', acidentes: false }, likes: 18 },
];

export default function Comunidade() {
  const t = useT();
  return (
    <div>
      <PageHead tag={t('community.tag')} title={t('community.title')} sub={t('community.sub')} aside={<Art name="genero-forro" style={{ width: 150 }} />} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start', gap: 28 }}>
        <section>
          <SecTitle>{t('community.feed')}</SecTitle>
          <div style={{ display: 'grid', gap: 12 }}>
            {SAMPLE_POSTS.map((p, i) => (
              <article key={i} className="panel" style={{ display: 'grid', gap: 10 }}>
                <div className="row"><b>{t('community.sample', { name: p.who })}</b><span className="muted" style={{ fontSize: 13 }}>{t(p.kind)}</span></div>
                <p>{t(p.text)}</p>
                {p.ex && <Link to={`/treinar/${p.ex}?c=${encodeSettings(p.s!)}`} className="btn small co" style={{ justifySelf: 'start' }}><span>{t('community.openWorkout')}</span></Link>}
                <span className="muted" style={{ fontSize: 13 }}>♥ {p.likes}</span>
              </article>
            ))}
          </div>
        </section>
        <section>
          <SecTitle>{t('community.share')}</SecTitle>
          <div className="panel" style={{ display: 'grid', gap: 8 }}>
            <p>{t('community.shareText')}</p>
          </div>
          <SecTitle>{t('community.rules')}</SecTitle>
          <div className="panel">
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
              <li>{t('community.rule1')}</li>
              <li>{t('community.rule2')}</li>
              <li>{t('community.rule3')}</li>
            </ul>
            <div style={{ marginTop: 12 }}><Tag tone="dark">{t('community.building')}</Tag></div>
          </div>
        </section>
      </div>
    </div>
  );
}
