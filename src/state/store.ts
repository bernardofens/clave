// Estado do usuário, salvo no navegador (localStorage). Sem login por enquanto:
// a forma dos dados já pensa em subir isso para um servidor depois.
import { useSyncExternalStore } from 'react';
import type { GoalId, Instrument } from '../data/modules';
import type { ModuleId } from '../exercises/taxonomy';
import type { Naming } from '../theory/core';
import type { SettingValue } from '../exercises/types';
import type { StoredParams } from '../exercises/params';
import type { AgeGroup } from './age';
import { migrateSaved } from './migrate';
import type { Locale } from '../i18n';

export interface Profile {
  name: string;
  instrument: Instrument;
  goals: GoalId[];
  onboarded: boolean;
}
export interface Stat {
  attempts: number;
  correct: number;
  last: number;
}
export interface Activity {
  at: number;
  id: string; // exercício ou ferramenta
  title: string;
  module: ModuleId;
  seconds: number;
  correct?: number;
  total?: number;
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
  settings: Record<string, Record<string, SettingValue>>;
  /** Parâmetros globais escolhidos pela pessoa (ver src/exercises/params.ts). */
  params: StoredParams;
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
    instrument: 'violao',
    goals: [],
    onboarded: false,
  },
  locale: null,
  naming: null,
  sound: true,
  stats: {},
  history: [],
  arsenal: ['pauta-nota', 'ouvido-intervalo', 'braco-nota', 'quiz-teoria'],
  settings: {},
  params: {},
  account: null,
  ageGroup: null,
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = migrateSaved(JSON.parse(raw)) as Partial<State>;
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
export function recordAnswer(id: string, correct: boolean) {
  setState(s => {
    const prev = s.stats[id] ?? { attempts: 0, correct: 0, last: 0 };
    return {
      ...s,
      stats: {
        ...s.stats,
        [id]: { attempts: prev.attempts + 1, correct: prev.correct + (correct ? 1 : 0), last: Date.now() },
      },
    };
  });
}
export function logActivity(a: Omit<Activity, 'at'>) {
  if (a.seconds < 5 && !a.total) return;
  setState(s => ({ ...s, history: [{ ...a, at: Date.now() }, ...s.history].slice(0, 500) }));
}
export function toggleArsenal(id: string) {
  setState(s => ({ ...s, arsenal: s.arsenal.includes(id) ? s.arsenal.filter(x => x !== id) : [...s.arsenal, id] }));
}
export function saveSettings(id: string, values: Record<string, SettingValue>) {
  setState(s => ({ ...s, settings: { ...s.settings, [id]: values } }));
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
export function minutesByModule(history: Activity[], sinceDays = 30) {
  const since = Date.now() - sinceDays * 864e5;
  const out: Partial<Record<ModuleId, number>> = {};
  history.filter(h => h.at >= since).forEach(h => (out[h.module] = (out[h.module] ?? 0) + h.seconds / 60));
  return out;
}
