// Primeira vez: duas perguntas rápidas — o que você toca e o que quer conseguir.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../data/localized';
import { updateProfile, useStore } from '../state/store';
import { Art, Btn, Chip, Tag } from '../components/ui';
import { useT } from '../i18n';

export default function Onboarding() {
  const profile = useStore(s => s.profile);
  const [step, setStep] = useState(0);
  const nav = useNavigate();
  const t = useT();
  const { GOALS, INSTRUMENTS } = useContent();
  const finish = () => { updateProfile({ onboarded: true }); nav('/'); };
  const steps = [
    {
      title: t('onboarding.whatPlay'), art: 'correria',
      body: (
        <div style={{ display: 'grid', gap: 18 }}>
          <label style={{ display: 'grid', gap: 6, maxWidth: 360 }}>
            <span className="eyebrow">{t('common.nameLabel')}</span>
            <input id="ob-nome" value={profile.name} onChange={e => updateProfile({ name: e.target.value })} placeholder={t('common.namePlaceholder')} autoFocus
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
      title: t('onboarding.goals'), art: 'genero-jazz',
      body: (
        <div style={{ display: 'grid', gap: 12 }}>
          <p className="muted">{t('onboarding.pickMany')}</p>
          <div className="row">{GOALS.map(g => <Chip key={g.id} on={profile.goals.includes(g.id)} onClick={() => updateProfile({ goals: profile.goals.includes(g.id) ? profile.goals.filter(x => x !== g.id) : [...profile.goals, g.id] })}>{g.name}</Chip>)}</div>
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
          <Tag>{t('onboarding.step', { i: step + 1, n: steps.length })}</Tag>
          <button type="button" onClick={finish} style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer' }}>{t('onboarding.skip')}</button>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', gap: 32 }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <h1 style={{ fontSize: 'clamp(46px, 7vw, 88px)' }}>{s.title}</h1>
            {s.body}
          </div>
          <Art name={s.art} style={{ width: '100%', maxWidth: 360, justifySelf: 'center' }} />
        </div>
        <div className="row">
          {step > 0 && <Btn tone="ghost" onClick={() => setStep(step - 1)}>{t('common.back')}</Btn>}
          {step < steps.length - 1 ? <Btn onClick={() => setStep(step + 1)}>{t('common.continue')}</Btn> : <Btn tone="mu" onClick={finish}>{t('onboarding.finish')}</Btn>}
        </div>
      </main>
    </div>
  );
}
