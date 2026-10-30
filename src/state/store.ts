// Estado do usuário, salvo no navegador (localStorage). Sem login por enquanto:
// a forma dos dados já pensa em subir isso para um servidor depois.
import { useSyncExternalStore } from 'react';
import type { AreaId, GoalId, Instrument, ProfileKind } from '../data/areas';
import type { Naming } from '../theory/core';
import type { SettingValue } from '../exercises/types';
import type { AgeGroup } from './age';
import type { Locale } from '../i18n';

export interface Profile {
  name: string;
  kind: ProfileKind;
  instrument: Instrument;
  goals: GoalId[];
  levels: Record<AreaId, number>; // 0 a 3, autoavaliação do onboarding
  onboarded: boolean;
}
export interface Stat {
  attempts: number;
  correct: number;
  bestStreak: number;
  last: number;
}
export interface Activity {
  at: number;
  id: string; // exercício ou ferramenta
  title: string;
  area: AreaId;
  seconds: number;
  correct?: number;
  total?: number;
}
export interface TonalityPlan {
  fifths: number;
  done: string[];
  startedAt: number;
}
/** Sessão da conta (Supabase). Null = sem conta, só localStorage. */
export interface Account {
  userId: string;
  email: string | null;
}
export interface State {
  v: 1;
  profile: Profile;
  /** Idioma escolhido no perfil; null = automático, segue o navegador. */
  locale: Locale | null;
  /** Nome das notas escolhido no perfil; null = segue o idioma. */
  naming: Naming | null;
  sound: boolean;
  stats: Record<string, Stat>;
  history: Activity[];
  arsenal: string[];
  badges: Record<string, number>;
  settings: Record<string, Record<string, SettingValue>>;
  plan: TonalityPlan | null;
  account: Account | null;
  // Guardado para não perguntar a data de nascimento de novo; a data em si nunca fica aqui
  // (fica só no servidor, e só para quem tem conta — ver src/state/age.ts).
  ageGroup: AgeGroup | null;
}

const KEY = 'clave:v1';
export const DEFAULT_STATE: State = {
  v: 1,
  profile: {
    name: '',
    kind: 'hobby',
    instrument: 'violao',
    goals: [],
    levels: { ouvido: 1, tecnica: 1, mapeamento: 1, harmonia: 1, ritmo: 1, leitura: 1 },
    onboarded: false,
  },
  locale: null,
  naming: null,
  sound: true,
  stats: {},
  history: [],
  arsenal: ['pauta-nota', 'ouvido-intervalo', 'braco-nota', 'quiz-teoria'],
  badges: {},
  settings: {},
  plan: null,
  account: null,
  ageGroup: null,
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<State>;
    return { ...DEFAULT_STATE, ...parsed, profile: { ...DEFAULT_STATE.profile, ...parsed.profile } };
  } catch {
    return DEFAULT_STATE;
  }
}

let state: State = load();
const listeners = new Set<() => void>();

export function getState() {
  return state;
}
export function setState(fn: (s: State) => State) {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sem armazenamento: segue só em memória */
  }
  listeners.forEach(l => l());
}
export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    l => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => select(state),
  );
}
export function resetAll() {
  setState(() => DEFAULT_STATE);
}

// ---------------- ações ----------------
export function updateProfile(p: Partial<Profile>) {
  setState(s => ({ ...s, profile: { ...s.profile, ...p } }));
}
export function recordAnswer(id: string, correct: boolean, streak: number) {
  setState(s => {
    const prev = s.stats[id] ?? { attempts: 0, correct: 0, bestStreak: 0, last: 0 };
    return {
      ...s,
      stats: {
        ...s.stats,
        [id]: { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0), bestStreak: Math.max(prev.bestStreak, streak), last: Date.now() },
      },
    };
  });
  checkBadges();
}
export function logActivity(a: Omit<Activity, 'at'>) {
  if (a.seconds < 5 && !a.total) return;
  setState(s => ({ ...s, history: [{ ...a, at: Date.now() }, ...s.history].slice(0, 500) }));
  checkBadges();
}
export function toggleArsenal(id: string) {
  setState(s => ({ ...s, arsenal: s.arsenal.includes(id) ? s.arsenal.filter(x => x !== id) : [...s.arsenal, id] }));
}
export function saveSettings(id: string, values: Record<string, SettingValue>) {
  setState(s => ({ ...s, settings: { ...s.settings, [id]: values } }));
}
export function setPlan(plan: TonalityPlan | null) {
  setState(s => ({ ...s, plan }));
}
export function setAccount(account: Account | null) {
  setState(s => ({ ...s, account }));
}
export function setLocale(locale: Locale | null) {
  setState(s => ({ ...s, locale }));
}
export function setAgeGroup(ageGroup: AgeGroup | null) {
  setState(s => ({ ...s, ageGroup }));
}

// ---------------- derivados ----------------
export function dayKey(t: number) {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
/** Dias seguidos com alguma atividade, contando até hoje (ou ontem). */
export function streakDays(history: Activity[]) {
  const days = new Set(history.map(h => dayKey(h.at)));
  let n = 0;
  const d = new Date();
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
export function minutesByArea(history: Activity[], sinceDays = 30) {
  const since = Date.now() - sinceDays * 864e5;
  const out: Record<string, number> = {};
  history.filter(h => h.at >= since).forEach(h => (out[h.area] = (out[h.area] ?? 0) + h.seconds / 60));
  return out;
}

// ---------------- medalhas ----------------
// Nome e descrição de cada medalha ficam em src/i18n/content.*.ts (badges.<id>).
export const BADGES = [
  { id: 'primeira-sessao', art: 'medalha-primeira-sessao' },
  { id: 'sequencia', art: 'medalha-sequencia' },
  { id: 'ouvido', art: 'medalha-ouvido' },
  { id: 'leitor', art: 'medalha-leitor' },
  { id: 'braco', art: 'medalha-braco' },
  { id: 'improviso', art: 'medalha-improviso' },
] as const;

function checkBadges() {
  const s = state;
  const sum = (prefix: string) => Object.entries(s.stats).filter(([k]) => k.startsWith(prefix)).reduce((a, [, v]) => a + v.correct, 0);
  const earned: string[] = [];
  if (s.history.length > 0) earned.push('primeira-sessao');
  if (streakDays(s.history) >= 7) earned.push('sequencia');
  if (sum('ouvido-') >= 50) earned.push('ouvido');
  if ((s.stats['pauta-nota']?.correct ?? 0) >= 100) earned.push('leitor');
  if (sum('braco-') >= 100) earned.push('braco');
  if (s.history.filter(h => h.id === 'backing').reduce((a, h) => a + h.seconds, 0) >= 1800) earned.push('improviso');
  const fresh = earned.filter(b => !s.badges[b]);
  if (fresh.length) {
    state = { ...s, badges: { ...s.badges, ...Object.fromEntries(fresh.map(b => [b, Date.now()])) } };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignora */ }
    listeners.forEach(l => l());
  }
}
