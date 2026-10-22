// Primeira vez: quatro perguntas rápidas para o Clave entender quem você é.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AREAS, GOALS, INSTRUMENTS, PROFILE_KINDS } from '../data/areas';
import { updateProfile, useStore } from '../state/store';
import { Art, Btn, Chip, Tag } from '../components/ui';

const LEVELS = ['Nunca estudei', 'Básico', 'Intermediário', 'Avançado'];

export default function Onboarding() {
  const profile = useStore(s => s.profile);
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const finish = () => { updateProfile({ onboarded: true }); nav('/'); };
  const steps = [
    {
      title: 'O que você toca?', art: 'correria',
      body: (
        <div style={{ display: 'grid', gap: 18 }}>
          <label style={{ display: 'grid', gap: 6, maxWidth: 360 }}>
            <span className="eyebrow">Como o Clave te chama</span>
            <input id="ob-nome" value={profile.name} onChange={e => updateProfile({ name: e.target.value })} placeholder="Seu nome" autoFocus
              style={{ background: 'var(--bk-3)', border: 0, color: 'var(--cream)', padding: '12px 14px', font: 'inherit', fontSize: 18 }} />
          </label>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {INSTRUMENTS.map(i => (
              <button key={i.id} type="button" onClick={() => updateProfile({ instrument: i.id })} aria-pressed={profile.instrument === i.id}
                style={{ border: 0, cursor: 'pointer', padding: 16, display: 'grid', gap: 10, justifyItems: 'center', background: profile.instrument === i.id ? 'var(--mu)' : 'var(--bk-2)', color: profile.instrument === i.id ? 'var(--bk)' : 'var(--cream)' }}>
                <Art name={i.art} style={{ height: 90, width: 'auto' }} />
                <b>{i.name}</b>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Como você se descreve?', art: 'clave-sentado',
      body: (
        <div style={{ display: 'grid', gap: 10 }}>
          {PROFILE_KINDS.map(k => (
            <button key={k.id} type="button" onClick={() => updateProfile({ kind: k.id })} aria-pressed={profile.kind === k.id}
              style={{ border: 0, cursor: 'pointer', textAlign: 'left', padding: '14px 18px', background: profile.kind === k.id ? 'var(--mu)' : 'var(--bk-2)', color: profile.kind === k.id ? 'var(--bk)' : 'var(--cream)' }}>
              <b style={{ fontFamily: 'var(--display)', fontSize: 26, textTransform: 'uppercase' }}>{k.name}</b><div>{k.desc}</div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'O que você quer conseguir?', art: 'genero-jazz',
      body: (
        <div style={{ display: 'grid', gap: 12 }}>
          <p className="muted">Escolha quantos quiser.</p>
          <div className="row">{GOALS.map(g => <Chip key={g.id} on={profile.goals.includes(g.id)} onClick={() => updateProfile({ goals: profile.goals.includes(g.id) ? profile.goals.filter(x => x !== g.id) : [...profile.goals, g.id] })}>{g.name}</Chip>)}</div>
        </div>
      ),
    },
    {
      title: 'Onde você está hoje?', art: 'haltere',
      body: (
        <div style={{ display: 'grid', gap: 12 }}>
          <p className="muted">Sem pressão: isso só ajusta o começo. O nível de verdade vem dos seus acertos.</p>
          {AREAS.map(a => (
            <div key={a.id} style={{ display: 'grid', gap: 6 }}>
              <b>{a.name} <span className="muted" style={{ fontWeight: 400 }}>· {a.short}</span></b>
              <div className="row">{LEVELS.map((l, i) => <Chip key={i} on={profile.levels[a.id] === i} onClick={() => updateProfile({ levels: { ...profile.levels, [a.id]: i } })}>{l}</Chip>)}</div>
            </div>
          ))}
        </div>
      ),
    },
  ];
  const s = steps[step];
  return (
    <div className="shell">
      <div className="rule3" />
      <main className="page" style={{ maxWidth: 1000, display: 'grid', gap: 28 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Tag>Passo {step + 1} de {steps.length}</Tag>
          <button type="button" onClick={finish} style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}>Pular por agora</button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', gap: 32 }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <h1 style={{ fontSize: 'clamp(46px, 7vw, 88px)' }}>{s.title}</h1>
            {s.body}
          </div>
          <Art name={s.art} style={{ width: '100%', maxWidth: 360, justifySelf: 'center' }} />
        </div>
        <div className="row">
          {step > 0 && <Btn tone="ghost" onClick={() => setStep(step - 1)}>Voltar</Btn>}
          {step < steps.length - 1 ? <Btn onClick={() => setStep(step + 1)}>Continuar</Btn> : <Btn tone="mu" onClick={finish}>Montar minha primeira sessão</Btn>}
        </div>
      </main>
    </div>
  );
}
