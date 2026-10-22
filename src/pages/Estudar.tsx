import { Link, useParams } from 'react-router-dom';
import { AREAS, areaById } from '../data/areas';
import { GENRES, genreById, moduleById, MODULES, ROADMAPS } from '../data/content';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';
import { useStore } from '../state/store';
import { Art, Btn, PageHead, SecTitle, Tag } from '../components/ui';
import NotFound from './NotFound';

export function moduleProgress(id: string, stats: Record<string, { correct: number }>) {
  const m = moduleById[id];
  if (!m.exercises.length) return 0;
  return m.exercises.reduce((a, e) => a + Math.min(1, (stats[e]?.correct ?? 0) / 20), 0) / m.exercises.length;
}

export default function Estudar() {
  const stats = useStore(s => s.stats);
  return (
    <div>
      <PageHead tag="Estudar" title="Aulas e trilhas" sub="Cada aula explica por que aquilo importa, como encaixar nos seus estudos e leva direto para os exercícios. Os gêneros são discos: cada faixa é uma aula ou um treino." />

      <section className="sec" style={{ marginTop: 20 }}>
        <SecTitle>Trilhas</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {ROADMAPS.map(r => {
            const p = r.steps.reduce((a, s) => a + moduleProgress(s.module, stats), 0) / r.steps.length;
            return (
              <div key={r.id} className="panel" style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <Art name={r.art} style={{ width: 84, height: 84, objectFit: 'cover' }} />
                  <div>
                    <div className="row">{r.premium ? <Tag tone="ve">Clave+</Tag> : <Tag>Grátis</Tag>}</div>
                    <h3 style={{ fontSize: 34, marginTop: 6 }}>{r.title}</h3>
                    <span className="script" style={{ color: 'var(--mu)', fontSize: 20 }}>{r.sub}</span>
                  </div>
                </div>
                <div className="progressbar"><i style={{ width: `${p * 100}%` }} /></div>
                <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4, fontSize: 14 }}>
                  {r.steps.map(s => <li key={s.module}><Link to={`/estudar/${s.module}`}>{moduleById[s.module].title}</Link> <span className="muted">· {s.note}</span></li>)}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="sec">
        <SecTitle>Gêneros</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {GENRES.map(g => (
            <Link key={g.id} to={`/estudar/genero/${g.id}`} className="cover-card">
              <Art name={g.art} alt={`Capa de ${g.name}`} />
              <div className="lbl"><h3 style={{ color: g.color }}>{g.name}</h3><span className="sub">{g.sub}</span><small>{g.cat} · {g.sides.reduce((a, s) => a + s.tracks.length, 0)} faixas</small></div>
            </Link>
          ))}
        </div>
      </section>

      {AREAS.map(a => {
        const mods = MODULES.filter(m => m.area === a.id);
        if (!mods.length) return null;
        return (
          <section key={a.id} className="sec" style={{ marginTop: 40 }}>
            <SecTitle>{a.name}</SecTitle>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {mods.map(m => (
                <Link key={m.id} to={`/estudar/${m.id}`} className="ex-card">
                  <span className="acc" style={{ background: a.color }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="row">{m.premium && <Tag tone="ve">Clave+</Tag>}</div>
                    <h3 style={{ marginTop: m.premium ? 6 : 0 }}>{m.title}</h3>
                    <p>{m.why}</p>
                    <div className="progressbar" style={{ marginTop: 10 }}><i style={{ width: `${moduleProgress(m.id, stats) * 100}%` }} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ModulePage() {
  const { id = '' } = useParams();
  const m = moduleById[id];
  if (!m) return <NotFound />;
  const a = areaById[m.area];
  return (
    <div style={{ display: 'grid', gap: 28 }}>
      <Link to="/estudar" className="eyebrow" style={{ textDecoration: 'none' }}>← Estudar</Link>
      <header className="page-head" style={{ marginBottom: 0 }}>
        <div><div className="row"><Tag>{a.name}</Tag>{m.premium && <Tag tone="ve">Clave+ · prévia</Tag>}</div><h1>{m.title}</h1></div>
        <Art name={a.art} style={{ width: 120 }} />
      </header>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="panel" style={{ background: 'var(--co)' }}><div className="eyebrow" style={{ color: 'var(--cream)' }}>Por que importa</div><p style={{ fontSize: 18, marginTop: 8 }}>{m.why}</p></div>
        <div className="panel"><div className="eyebrow">Como encaixar nos estudos</div><p style={{ fontSize: 18, marginTop: 8 }}>{m.how}</p></div>
      </div>
      <section>
        <SecTitle>Passo a passo</SecTitle>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {m.steps.map((s, i) => (
            <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline', background: 'var(--bk-2)', padding: '14px 18px' }}>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 34, color: 'var(--mu)', width: 28, flex: 'none' }}>{i + 1}</span>
              <span style={{ fontSize: 17 }}>{s}</span>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <SecTitle>Pratique</SecTitle>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {m.exercises.map(e => exerciseById[e] && (
            <Link key={e} to={`/treinar/${e}`} className="ex-card"><span className="acc" style={{ background: areaById[exerciseById[e].area].color }} /><div><h3>{exerciseById[e].title}</h3><p>{exerciseById[e].desc}</p></div></Link>
          ))}
          {m.tools.map(t => toolById[t] && (
            <Link key={t} to={toolById[t].path} className="ex-card"><span className="acc" style={{ background: 'var(--co)' }} /><Art name={toolById[t].art} style={{ width: 48, flex: 'none' }} /><div><h3>{toolById[t].title}</h3><p>{toolById[t].desc}</p></div></Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function GenrePage() {
  const { id = '' } = useParams();
  const g = genreById[id];
  if (!g) return <NotFound />;
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Link to="/estudar" className="eyebrow" style={{ textDecoration: 'none' }}>← Estudar</Link>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', gap: 32 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '16px -16px -16px 16px', background: 'var(--co)' }} />
          <Art name={g.art} alt={`Capa de ${g.name}`} style={{ position: 'relative', width: '100%' }} />
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          <span className="eyebrow">{g.cat}</span>
          <h1 style={{ fontSize: 'clamp(64px, 10vw, 128px)', color: g.color }}>{g.name}</h1>
          <span className="script" style={{ fontSize: 30 }}>{g.sub}</span>
          <p className="muted" style={{ fontSize: 17 }}>{g.desc}</p>
          {g.sides.map(side => (
            <div key={side.side}>
              <div className="eyebrow" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 6, marginBottom: 8 }}>{side.side}</div>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                {side.tracks.map((t, i) => (
                  <li key={t.title} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 20, color: 'var(--mu)', width: 18 }}>{i + 1}</span>
                    {t.to ? <Link to={t.to} style={{ fontWeight: 600 }}>{t.title}</Link> : <span style={{ fontWeight: 600 }}>{t.title} <span className="muted" style={{ fontWeight: 400 }}>(em breve)</span></span>}
                    <span style={{ flex: 1, borderBottom: '1px dotted #5a534a', transform: 'translateY(-4px)' }} />
                    <span className="num muted">{t.min}:00</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <div><Btn to={g.sides[0].tracks.find(t => t.to)?.to ?? '/treinar'}>▶ Tocar a primeira faixa</Btn></div>
        </div>
      </div>
    </div>
  );
}
