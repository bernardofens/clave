// Jogador de exercício: mostra a pergunta, toca o som, confere a resposta e guarda o progresso.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atTime, drum, now, playGroups } from '../audio/engine';
import { useContent } from '../data/localized';
import { getState, logActivity, recordAnswer, saveSettings, useStore } from '../state/store';
import { fromStep, mod, noteName, step as stepOf, type Note } from '../theory/core';
import Fretboard from '../components/music/Fretboard';
import Keyboard from '../components/music/Keyboard';
import RhythmLine from '../components/music/RhythmLine';
import Staff from '../components/music/Staff';
import { Btn, Chip, PlayIcon, Tag } from '../components/ui';
import type { Answer, Ctx, ExerciseDef, Question, SettingValue, Sound } from './types';
import { itemText, useLocale, useNaming, useT } from '../i18n';

type Phase = 'ask' | 'right' | 'wrong';

export function playSound(sound: Sound): number {
  if (sound.drums) {
    const bpm = sound.bpm ?? 84;
    const beat = 60 / bpm;
    const t0 = now() + 0.1;
    for (let i = 0; i < 4; i++) drum(i === 0 ? 'clique-forte' : 'clique', t0 + i * beat);
    sound.drums.forEach(o => drum('aro', t0 + (4 + o) * beat));
    for (let i = 0; i < 4; i++) drum('clique', t0 + (4 + i) * beat, 0.35);
    return 8 * beat;
  }
  return playGroups(sound.groups, { gap: sound.gap, arp: sound.arp, voice: sound.voice });
}

export function encodeSettings(v: Record<string, SettingValue>) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(v))));
}
export function decodeSettings(s: string | null): Record<string, SettingValue> | null {
  if (!s) return null;
  try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch { return null; }
}

interface Props {
  def: ExerciseDef;
  /** Em sessão guiada: quantas perguntas até terminar. */
  target?: number;
  onDone?: (r: { correct: number; total: number; seconds: number }) => void;
  initialSettings?: Record<string, SettingValue> | null;
}

export default function Player({ def, target, onDone, initialSettings }: Props) {
  const naming = useNaming();
  const instrument = useStore(s => s.profile.instrument);
  const soundOn = useStore(s => s.sound);
  const t = useT();
  const { moduleById } = useContent();
  const saved = useStore(s => s.settings[def.id]);
  const settings = useMemo(() => ({ ...def.defaults, ...(initialSettings ?? saved ?? {}) }), [def, saved, initialSettings]);
  const locale = useLocale();
  const ctx = useMemo(() => ({ naming, instrument, conv: locale, t }), [naming, instrument, locale, t]);
  const make = useCallback(() => def.make(settings, ctx), [def, settings, ctx]);

  const [q, setQ] = useState<Question>(make);
  const [phase, setPhase] = useState<Phase>('ask');
  const [picked, setPicked] = useState<string | null>(null);
  const [acc, setAcc] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');
  const started = useRef(Date.now());
  const scoreRef = useRef(score);
  scoreRef.current = score;

  // ao sair, registra a atividade no histórico
  useEffect(() => {
    const t0 = started.current;
    return () => {
      const s = scoreRef.current;
      if (s.total > 0 && !target) logActivity({ id: def.id, title: itemText(t, def.id, 'title'), module: def.primaryModule, seconds: Math.round((Date.now() - t0) / 1000), correct: s.correct, total: s.total });
    };
  }, [def, target, t]);

  const play = useCallback((sound?: Sound) => {
    if (!sound || !getState().sound) return;
    const dur = playSound(sound);
    setPlaying(true);
    setHeard(true);
    atTime(now() + dur, () => setPlaying(false));
  }, []);

  const next = useCallback(() => {
    const nq = make();
    setQ(nq);
    setPhase('ask');
    setPicked(null);
    setAcc(0);
    if (nq.autoplay && heard) window.setTimeout(() => play(nq.sound), 250);
  }, [make, heard, play]);

  // configurações mudaram: recomeça
  useEffect(() => { setQ(make()); setPhase('ask'); setPicked(null); }, [make]);

  const submit = useCallback((ok: boolean, pickedId: string) => {
    if (phase !== 'ask') return;
    const streak = ok ? score.streak + 1 : 0;
    const ns = { correct: score.correct + (ok ? 1 : 0), total: score.total + 1, streak };
    setScore(ns);
    setPicked(pickedId);
    setPhase(ok ? 'right' : 'wrong');
    recordAnswer(def.id, ok);
    if (!q.autoplay && soundOn) play(q.sound);
    if (target && ns.total >= target) {
      window.setTimeout(() => onDone?.({ correct: ns.correct, total: ns.total, seconds: Math.round((Date.now() - started.current) / 1000) }), ok ? 900 : 1800);
      return;
    }
    if (ok) window.setTimeout(next, 850);
  }, [phase, score, def.id, q, soundOn, play, target, onDone, next]);

  // atalhos de teclado: 1-9 para opções, Enter para seguir, espaço para ouvir de novo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'Enter' && phase === 'wrong') { e.preventDefault(); next(); }
      if (e.key === ' ' && q.sound && q.autoplay) { e.preventDefault(); play(q.sound); }
      const n = Number(e.key);
      if (q.answer.kind === 'choice' && n >= 1 && n <= q.answer.options.length && phase === 'ask') {
        const o = q.answer.options[n - 1];
        submit(o.id === q.answer.correct, o.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, q, next, play, submit]);

  const area = moduleById[def.primaryModule];
  const pct = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  const copyLink = async () => {
    const url = `${location.origin}/treinar/${def.id}?c=${encodeSettings(settings)}`;
    try { await navigator.clipboard.writeText(url); setToast(t('player.copied')); } catch { setToast(url); }
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="player">
      <div className="player-head">
        <div>
          <div className="row"><Tag>{area.name}</Tag>{def.mobile && <Tag tone="dark">{t('common.mobile')}</Tag>}</div>
          <h1>{itemText(t, def.id, 'title')}</h1>
        </div>
        <div className="score">
          <div><b className="num">{score.correct}/{score.total}</b><span>{t('player.hits')}</span></div>
          <div><b className="num" style={{ color: 'var(--mu)' }}>{pct}%</b><span>{t('player.accuracy')}</span></div>
          <div><b className="num">{score.streak}</b><span>{t('player.streak')}</span></div>
        </div>
      </div>
      {target && <div className="progressbar" aria-label={t('player.progressOf', { done: score.total, total: target })}><i style={{ width: `${(score.total / target) * 100}%` }} /></div>}

      <Stage q={q} phase={phase} playing={playing} heard={heard} onPlay={() => play(q.sound)} naming={naming} picked={picked} acc={acc} onAnswer={submit} />

      <AnswerArea q={q} phase={phase} picked={picked} acc={acc} setAcc={setAcc} onAnswer={submit} naming={naming} />

      <div className="player-foot">
        <div className="reveal" aria-live="polite">
          {phase === 'wrong' && <>{t('player.answer')} <b>{q.reveal}</b></>}
          {phase === 'right' && <span className="muted">{t('player.right')} {score.streak >= 5 ? t('player.inARow', { n: score.streak }) : ''}</span>}
          {phase === 'ask' && <span className="muted">{itemText(t, def.id, 'desc')}</span>}
        </div>
        <div className="row">
          {phase === 'wrong' && <Btn onClick={next} tone="mu">{t('player.next')}</Btn>}
          <Btn small tone="ghost" onClick={() => setShowSettings(v => !v)}>{t(showSettings ? 'player.close' : 'player.customize')}</Btn>
          <Btn small tone="ghost" onClick={copyLink}>{t('player.copyLink')}</Btn>
        </div>
      </div>

      {showSettings && <SettingsPanel def={def} ctx={ctx} values={settings} onChange={v => saveSettings(def.id, v)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

// ---------------- palco: o que é perguntado ----------------
function Stage({ q, phase, playing, heard, onPlay, naming, picked, acc, onAnswer }: {
  q: Question; phase: Phase; playing: boolean; heard: boolean; onPlay: () => void; naming: 'pt' | 'en';
  picked: string | null; acc: number; onAnswer: (ok: boolean, id: string) => void;
}) {
  const t = useT();
  const v = q.visual;
  const a = q.answer;
  const fb = phase === 'right' ? <div className="feedback ok">{t('player.feedbackRight')}</div> : phase === 'wrong' ? <div className="feedback bad">{t('player.feedbackWrong')}</div> : null;
  const isText = v.kind === 'text' && v.text;

  // respostas que acontecem no próprio palco (teclado, braço, pauta)
  if (a.kind === 'key') {
    const marks: Record<number, string> = {};
    if (picked) marks[Number(picked)] = phase === 'right' ? 'var(--mu)' : 'var(--ve)';
    if (phase === 'wrong') for (let m = a.lo; m <= a.hi; m++) if (mod(m, 12) === a.correctPc) marks[m] = 'var(--mu)';
    return (
      <div className="stage dark">
        {fb}
        <div className="prompt">{q.prompt}</div>
        {v.kind === 'ear' && <Listen playing={playing} heard={heard} onPlay={onPlay} />}
        <div style={{ width: '100%', marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <Keyboard lo={a.lo} hi={a.hi} marks={marks} naming={naming} onPress={m => phase === 'ask' && onAnswer(mod(m, 12) === a.correctPc, String(m))} labels="do" />
        </div>
      </div>
    );
  }
  if (a.kind === 'fret') {
    const marks = [];
    if (picked) { const [s, f] = picked.split(':').map(Number); marks.push({ s, f, color: phase === 'right' ? 'var(--mu)' : 'var(--ve)' }); }
    if (phase === 'wrong') for (let f = a.from; f <= a.to; f++) if (mod(a.tuning[a.onlyString ?? 0] + f, 12) === a.correctPc) marks.push({ s: a.onlyString ?? 0, f, color: 'var(--mu)', label: '✓' });
    return (
      <div className="stage dark">
        {fb}
        <div className="prompt">{q.prompt}</div>
        <Fretboard tuning={a.tuning} from={a.from} to={a.to} marks={marks} onlyString={a.onlyString} naming={naming}
          onPick={(s, f) => phase === 'ask' && onAnswer(mod(a.tuning[s] + f, 12) === a.correctPc, `${s}:${f}`)} />
      </div>
    );
  }
  if (a.kind === 'staff') {
    const cols: Note[][] = [];
    if (picked) cols.push([fromStep(Number(picked.split(':')[0]), Number(picked.split(':')[1]))]);
    const shown = phase === 'wrong' ? [[...(cols[0] ?? []), a.correct]] : cols;
    return (
      <div className="stage">
        {fb}
        <div className="prompt">{q.prompt}</div>
        <Staff clef={a.clef} columns={shown.map(c => ({ notes: c.map(n => ({ note: n })) }))} colWidth={90} ghostAcc={acc}
          onPick={phase === 'ask' ? s => onAnswer(s === stepOf(a.correct) && acc === a.correct.acc, `${s}:${acc}`) : undefined} />
        <div className="hint">{t('player.tapStaff')}</div>
      </div>
    );
  }

  return (
    <div className={`stage ${v.kind === 'staff' ? '' : 'dark'}`}>
      {fb}
      {isText ? <div className="prompt text">{q.prompt}</div> : <div className="prompt">{q.prompt}</div>}
      {v.kind === 'staff' && <Staff clef={v.clef} fifths={v.fifths} columns={v.columns.map(c => ({ notes: c.map(n => ({ note: n })) }))} colWidth={v.columns.length > 4 ? 44 : 64} />}
      {v.kind === 'keyboard' && <Keyboard lo={v.lo} hi={v.hi} marks={Object.fromEntries(v.marks.map(m => [m, 'var(--mu)']))} naming={naming} />}
      {v.kind === 'fretboard' && <Fretboard tuning={v.tuning} from={v.from} to={v.to} marks={v.marks} muted={v.muted} naming={naming} />}
      {v.kind === 'ear' && <><Listen playing={playing} heard={heard} onPlay={onPlay} />{v.hint && <div className="hint">{v.hint}</div>}</>}
    </div>
  );
}

function Listen({ playing, heard, onPlay }: { playing: boolean; heard: boolean; onPlay: () => void }) {
  const t = useT();
  return (
    <>
      <button type="button" className={`listen ${playing ? 'playing' : ''}`} onClick={onPlay} aria-label={t(heard ? 'player.listenAgain' : 'player.listen')}><PlayIcon /></button>
      <div className="hint">{t(heard ? 'player.hintAgain' : 'player.hintFirst')}</div>
    </>
  );
}

// ---------------- área de resposta ----------------
function AnswerArea({ q, phase, picked, acc, setAcc, onAnswer, naming }: {
  q: Question; phase: Phase; picked: string | null; acc: number; setAcc: (n: number) => void; onAnswer: (ok: boolean, id: string) => void; naming: 'pt' | 'en';
}) {
  const t = useT();
  const a: Answer = q.answer;
  const state = (id: string, correct: boolean) => (phase === 'ask' ? '' : correct ? 'right' : picked === id ? 'wrong' : '');

  if (a.kind === 'choice') {
    const rhythm = a.options.some(o => o.rhythm);
    return (
      <div className={`answers ${a.wide ? 'wide' : ''} ${rhythm ? 'rhythm' : ''}`}>
        {a.options.map((o, i) => (
          <button key={o.id} type="button" className={`ans ${rhythm ? 'rhythm' : ''} ${state(o.id, o.id === a.correct)}`} disabled={phase !== 'ask'} onClick={() => onAnswer(o.id === a.correct, o.id)}>
            {i < 9 && <span className="k">{i + 1}</span>}
            {o.rhythm ? <RhythmLine bars={o.rhythm} label={t('player.option', { n: i + 1 })} /> : o.label}
          </button>
        ))}
      </div>
    );
  }
  const accRow = (allowed: boolean) => allowed && (
    <div className="accrow" role="group" aria-label={t('player.accidental')}>
      {[[-1, '♭'], [0, '♮'], [1, '♯']].map(([v, l]) => <Chip key={v} on={acc === v} onClick={() => setAcc(Number(v))}>{l}</Chip>)}
    </div>
  );
  if (a.kind === 'spelled') {
    return (
      <div>
        {accRow(a.accidentals)}
        <div className="letters">
          {[0, 1, 2, 3, 4, 5, 6].map(l => {
            const id = `${l}:${acc}`;
            return (
              <button key={l} type="button" className={`ans ${phase === 'ask' ? '' : l === a.correct.letter ? 'right' : picked?.startsWith(`${l}:`) ? 'wrong' : ''}`}
                disabled={phase !== 'ask'} onClick={() => onAnswer(l === a.correct.letter && acc === a.correct.acc, id)}>
                {noteName({ letter: l as 0, acc: phase === 'ask' ? acc : l === a.correct.letter ? a.correct.acc : acc }, naming)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  if (a.kind === 'staff') return <div>{accRow(a.accidentals)}</div>;
  return null;
}

// ---------------- personalizar ----------------
function SettingsPanel({ def, ctx, values, onChange }: { def: ExerciseDef; ctx: Ctx; values: Record<string, SettingValue>; onChange: (v: Record<string, SettingValue>) => void }) {
  const t = useT();
  return (
    <div className="settings">
      {def.settings(ctx).map(s => (
        <div className="field" key={s.id}>
          <span>{s.label}</span>
          {s.type === 'toggle' && (
            <label className="switch"><input type="checkbox" id={`set-${def.id}-${s.id}`} checked={!!values[s.id]} onChange={e => onChange({ ...values, [s.id]: e.target.checked })} />{t(values[s.id] ? 'common.yes' : 'common.no')}</label>
          )}
          {s.type === 'single' && (
            <div className="row">{s.options!.map(o => <Chip key={o.id} on={values[s.id] === o.id} onClick={() => onChange({ ...values, [s.id]: o.id })}>{o.label}</Chip>)}</div>
          )}
          {s.type === 'multi' && (
            <div className="row">{s.options!.map(o => {
              const cur = (values[s.id] as string[]) ?? [];
              const on = cur.includes(o.id);
              return <Chip key={o.id} on={on} onClick={() => {
                const nextV = on ? cur.filter(x => x !== o.id) : [...cur, o.id];
                if (nextV.length) onChange({ ...values, [s.id]: nextV });
              }}>{o.label}</Chip>;
            })}</div>
          )}
        </div>
      ))}
      <div className="row"><Btn small tone="ghost" onClick={() => onChange({ ...def.defaults })}>{t('player.resetDefaults')}</Btn></div>
    </div>
  );
}

