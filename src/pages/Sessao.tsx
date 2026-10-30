// Sessão guiada: passa pelos blocos sugeridos, um de cada vez.
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { areaById } from '../data/areas';
import type { Block } from '../data/session';
import { exerciseById } from '../exercises/catalog';
import Player from '../exercises/Player';
import { logActivity } from '../state/store';
import { TOOL_COMPONENTS } from './Treinar';
import { Art, Btn, Tag } from '../components/ui';
import { fmtClock } from '../tools/common';
import { PLAN_KEY } from './Hoje';
import { itemText, useT } from '../i18n';

function loadPlan(state: unknown): Block[] {
  const fromState = (state as { plan?: Block[] } | null)?.plan;
  if (fromState) return fromState;
  try { return JSON.parse(sessionStorage.getItem(PLAN_KEY) ?? '[]'); } catch { return []; }
}

export default function Sessao() {
  const location = useLocation();
  const t = useT();
  const [plan] = useState(() => loadPlan(location.state));
  const [i, setI] = useState(0);
  const [results, setResults] = useState<{ correct: number; total: number }[]>([]);
  const [left, setLeft] = useState(0);

  const block = plan[i];
  useEffect(() => {
    if (block?.kind === 'tool') setLeft(block.minutes * 60);
  }, [i, block]);
  useEffect(() => {
    if (block?.kind !== 'tool') return;
    const t = window.setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(t);
  }, [i, block]);

  if (!plan.length) {
    return <div className="empty"><Art name="clave-dormindo" style={{ width: 180 }} /><div style={{ display: 'grid', gap: 12 }}><h1 style={{ fontSize: 48 }}>{t('session.none')}</h1><div><Btn to="/">{t('session.build')}</Btn></div></div></div>;
  }

  if (i >= plan.length) {
    const c = results.reduce((a, r) => a + r.correct, 0);
    const total = results.reduce((a, r) => a + r.total, 0);
    const minutes = plan.reduce((a, b) => a + b.minutes, 0);
    return (
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
        <div style={{ background: 'var(--ve)', padding: 30, display: 'grid', placeItems: 'center' }}><Art name="clave-regente" style={{ width: 260 }} /></div>
        <div style={{ display: 'grid', gap: 16 }}>
          <Tag>{t('session.done')}</Tag>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}>{t('session.bravo')}</h1>
          <p style={{ fontSize: 18 }}>{total ? t('session.summaryWithAnswers', { blocks: plan.length, minutes, correct: c, total }) : t('session.summary', { blocks: plan.length, minutes })}</p>
          <div className="row"><Btn to="/">{t('common.backHome')}</Btn><Btn to="/progresso" tone="ghost">{t('common.seeProgress')}</Btn></div>
        </div>
      </div>
    );
  }

  const nextBlock = (r?: { correct: number; total: number; seconds: number }) => {
    if (r && block.kind === 'exercise') {
      setResults(x => [...x, r]);
      logActivity({ id: block.id, title: itemText(t, block.id, 'title'), area: block.area, seconds: r.seconds, correct: r.correct, total: r.total });
    }
    setI(n => n + 1);
  };
  const Tool = block.kind === 'tool' ? TOOL_COMPONENTS[block.id] : null;

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', gap: 6 }} aria-label={t('session.blockOf', { i: i + 1, n: plan.length })}>
        {plan.map((b, k) => <div key={k} title={b.label ? t(b.label) : itemText(t, b.id, 'title')} style={{ flex: b.minutes, height: 8, transform: 'skewX(-12deg)', background: k < i ? 'var(--mu)' : k === i ? 'var(--cream)' : 'var(--bk-3)' }} />)}
      </div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="eyebrow">{t('session.blockOf', { i: i + 1, n: plan.length })} · {areaById[block.area].name}</span>
        <Btn small tone="ghost" onClick={() => nextBlock()}>{t('session.skip')}</Btn>
      </div>
      {block.kind === 'exercise' && exerciseById[block.id] && (
        <Player key={i} def={exerciseById[block.id]} target={block.target} onDone={nextBlock} />
      )}
      {Tool && (
        <>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 'clamp(38px, 6vw, 70px)' }}>{block.label ? t(block.label) : itemText(t, block.id, 'title')}</h1>
            <div style={{ textAlign: 'right' }}>
              <div className="num" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 48, lineHeight: 0.9, color: left === 0 ? 'var(--mu)' : 'var(--cream)' }}>{fmtClock(left)}</div>
              <span className="eyebrow">{t(left === 0 ? 'session.timeUp' : 'session.remaining')}</span>
            </div>
          </div>
          <Tool key={i} />
          <div><Btn onClick={() => nextBlock()} tone={left === 0 ? 'mu' : 'ghost'}>{t('session.finish')}</Btn></div>
        </>
      )}
    </div>
  );
}
