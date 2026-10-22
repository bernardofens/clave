import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AREAS, areaById } from '../data/areas';
import { suggestSession, type Block } from '../data/session';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';
import { minutesByArea, streakDays, toggleArsenal, useStore } from '../state/store';
import { Art, Btn, Chip, fmtMin, SecTitle, Tag } from '../components/ui';

export const PLAN_KEY = 'clave:plano-sessao';

function sceneForNow() {
  const h = new Date().getHours();
  if (h < 9) return { art: 'cena-cafe', hello: 'Bom dia' };
  if (h < 12) return { art: 'cena-metro', hello: 'Bom dia' };
  if (h < 18) return { art: 'cena-escritorio', hello: 'Boa tarde' };
  if (h < 20) return { art: 'cena-onibus', hello: 'Boa noite' };
  if (h < 22) return { art: 'cena-rua', hello: 'Boa noite' };
  return { art: 'cena-quarto', hello: 'Boa noite' };
}

export default function Hoje() {
  const profile = useStore(s => s.profile);
  const history = useStore(s => s.history);
  const arsenal = useStore(s => s.arsenal);
  const stats = useStore(s => s.stats);
  const [minutes, setMinutes] = useState(10);
  const [withInst, setWithInst] = useState(false);
  const [seed, setSeed] = useState(0);
  const nav = useNavigate();
  const scene = sceneForNow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const plan = useMemo(() => suggestSession(minutes, withInst, profile, history), [minutes, withInst, profile, seed]);
  const total = plan.reduce((a, b) => a + b.minutes, 0);
  const byArea = minutesByArea(history, 30);
  const maxMin = Math.max(10, ...Object.values(byArea));
  const streak = streakDays(history);

  const start = () => {
    try { sessionStorage.setItem(PLAN_KEY, JSON.stringify(plan)); } catch { /* segue */ }
    nav('/sessao', { state: { plan } });
  };

  return (
    <div>
      {!profile.onboarded && (
        <div className="panel" style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 24, background: 'var(--mu)', color: 'var(--bk)', flexWrap: 'wrap' }}>
          <Art name="clave-espiando" style={{ width: 110 }} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ fontSize: 34 }}>Primeira vez aqui?</h2>
            <p>Conte em 2 minutos o que você toca e o que quer aprender. O Clave usa isso para montar suas sessões.</p>
          </div>
          <Btn to="/comecar" tone="co">Começar</Btn>
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, .8fr) minmax(0, 1.2fr)', gap: 0 }} className="hoje-hero">
        <div style={{ position: 'relative', minHeight: 300, overflow: 'hidden' }}>
          <Art name={scene.art} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 16, alignContent: 'start', padding: 28 }}>
          <div><Tag>Hoje</Tag></div>
          <h1 style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>{scene.hello}{profile.name ? `, ${profile.name}` : ''}</h1>
          <p style={{ fontSize: 18 }}>Quanto tempo você tem agora?</p>
          <div className="row" role="group" aria-label="Tempo disponível">
            {[5, 10, 20, 30, 45].map(m => <Chip key={m} on={minutes === m} onClick={() => setMinutes(m)}>{m} min</Chip>)}
          </div>
          <div className="row" role="group" aria-label="Instrumento">
            <Chip on={!withInst} onClick={() => setWithInst(false)}>Sem instrumento</Chip>
            <Chip on={withInst} onClick={() => setWithInst(true)}>Com o instrumento</Chip>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--co)', padding: 22, display: 'grid', gap: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 36 }}>Sua sessão · {total} min</h2>
          <div className="row">
            <Btn small tone="ghost" onClick={() => setSeed(s => s + 1)}>Sortear outra</Btn>
            <Btn onClick={start} tone="mu">▶ Começar</Btn>
          </div>
        </div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
          {plan.map((b: Block, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(0,0,0,.25)', padding: '10px 14px' }}>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 26, width: 24, color: 'var(--mu)' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>{b.title}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{areaById[b.area].name} · {b.kind === 'exercise' ? `${b.target} perguntas` : 'ferramenta'}</div>
              </div>
              <span className="num" style={{ fontWeight: 600 }}>{b.minutes} min</span>
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 14, opacity: 0.9 }}>A sessão pesa seus objetivos e as áreas que você treinou menos nos últimos dias.</p>
      </section>

      <section className="sec">
        <SecTitle link={{ to: '/treinar', label: 'Ver todos' }}>Meu arsenal</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {arsenal.map(id => {
            const e = exerciseById[id];
            const t = toolById[id];
            const item = e ?? t;
            if (!item) return null;
            const st = stats[id];
            return (
              <div key={id} style={{ position: 'relative' }}>
                <Link to={e ? `/treinar/${id}` : t.path} className="ex-card">
                  <span className="acc" style={{ background: areaById[item.area].color }} />
                  <div style={{ minWidth: 0 }}>
                    <h3>{item.title}</h3>
                    <p>{areaById[item.area].name}{st ? ` · ${Math.round((st.correct / st.attempts) * 100)}% de acerto` : ''}</p>
                  </div>
                </Link>
                <button type="button" onClick={() => toggleArsenal(id)} aria-label={`Tirar ${item.title} do arsenal`} style={{ position: 'absolute', right: 8, top: 8, border: 0, background: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }}>×</button>
              </div>
            );
          })}
          <Link to="/treinar" className="ex-card" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--muted)' }}>+ Adicionar exercício</Link>
        </div>
      </section>

      <section className="sec grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div>
          <SecTitle link={{ to: '/progresso', label: 'Histórico' }}>Últimos 30 dias</SecTitle>
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            {AREAS.map(a => (
              <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 56px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{a.name}</span>
                <div style={{ height: 14, background: 'var(--bk-3)' }}><div style={{ height: '100%', width: `${((byArea[a.id] ?? 0) / maxMin) * 100}%`, background: a.color }} /></div>
                <span className="num muted" style={{ textAlign: 'right' }}>{fmtMin((byArea[a.id] ?? 0) * 60)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SecTitle>Sequência</SecTitle>
          <div className="panel" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Art name={streak >= 7 ? 'medalha-sequencia' : 'clave-sentado'} style={{ width: 110 }} />
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 72, lineHeight: 0.9, color: 'var(--mu)' }} className="num">{streak}</div>
              <p>{streak === 0 ? 'Nenhum dia seguido ainda. Cinco minutos hoje já contam.' : streak === 1 ? 'dia estudando. Volte amanhã para manter.' : 'dias seguidos estudando.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
