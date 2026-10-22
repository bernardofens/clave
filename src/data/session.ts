// Sugere uma sessão de estudo para o tempo que a pessoa tem agora.
// Pesa as áreas pelos objetivos e pelo nível declarado, e alivia o que já foi muito treinado nos últimos dias.
import { EXERCISES } from '../exercises/catalog';
import { TOOLS } from '../exercises/tools';
import { AREAS, GOALS, type AreaId } from './areas';
import type { Activity, Profile } from '../state/store';

export interface Block {
  kind: 'exercise' | 'tool';
  id: string;
  title: string;
  area: AreaId;
  minutes: number;
  target?: number; // perguntas, para exercícios
}

export function areaWeights(profile: Profile, history: Activity[]): Record<AreaId, number> {
  const w = Object.fromEntries(AREAS.map(a => [a.id, 1])) as Record<AreaId, number>;
  profile.goals.forEach(g => GOALS.find(x => x.id === g)?.areas.forEach(a => (w[a] += 1.2)));
  AREAS.forEach(a => (w[a.id] += (3 - (profile.levels[a.id] ?? 1)) * 0.4));
  const since = Date.now() - 3 * 864e5;
  history.filter(h => h.at > since).forEach(h => (w[h.area] = Math.max(0.3, w[h.area] - h.seconds / 1200)));
  return w;
}

function weightedPick<T>(items: T[], weight: (t: T) => number): T {
  const total = items.reduce((a, t) => a + weight(t), 0);
  let r = Math.random() * total;
  for (const t of items) {
    r -= weight(t);
    if (r <= 0) return t;
  }
  return items[items.length - 1];
}

export function suggestSession(minutes: number, withInstrument: boolean, profile: Profile, history: Activity[]): Block[] {
  const w = areaWeights(profile, history);
  const blocks: Block[] = [];
  let left = minutes;
  const tools = TOOLS.filter(t => t.session && (withInstrument || t.mobile));

  // com instrumento e tempo: aquecimento técnico no começo
  if (withInstrument && minutes >= 15) {
    const warm = profile.instrument === 'piano' ? TOOLS.find(t => t.id === 'metronomo')! : TOOLS.find(t => t.id === 'tecnica')!;
    blocks.push({ kind: 'tool', id: warm.id, title: warm.id === 'tecnica' ? 'Aquecimento técnico' : 'Aquecimento com metrônomo', area: 'tecnica', minutes: 5 });
    left -= 5;
  }
  const finale = withInstrument && minutes >= 20 ? TOOLS.find(t => t.id === 'backing')! : null;
  if (finale) left -= 8;

  const used = new Set<string>();
  while (left >= 3) {
    const pool = EXERCISES.filter(e => !used.has(e.id));
    const useTool = withInstrument && left >= 6 && Math.random() < 0.25;
    if (useTool) {
      const t = weightedPick(tools.filter(x => !used.has(x.id) && x.id !== 'backing' && x.id !== 'tecnica'), x => w[x.area]);
      if (t) { used.add(t.id); blocks.push({ kind: 'tool', id: t.id, title: t.title, area: t.area, minutes: 6 }); left -= 6; continue; }
    }
    if (!pool.length) break;
    const e = weightedPick(pool, x => w[x.area]);
    used.add(e.id);
    const m = left >= 8 ? 4 : 3;
    blocks.push({ kind: 'exercise', id: e.id, title: e.title, area: e.area, minutes: m, target: m * 3 });
    left -= m;
  }
  if (finale) blocks.push({ kind: 'tool', id: 'backing', title: 'Improviso sobre backing track', area: 'harmonia', minutes: 8 });
  return blocks;
}

/** XP por área: acertos nos exercícios e minutos nas ferramentas. */
export function areaXP(stats: Record<string, { correct: number }>, history: Activity[]): Record<AreaId, number> {
  const xp = Object.fromEntries(AREAS.map(a => [a.id, 0])) as Record<AreaId, number>;
  EXERCISES.forEach(e => (xp[e.area] += stats[e.id]?.correct ?? 0));
  history.filter(h => !h.total).forEach(h => (xp[h.area] += Math.round(h.seconds / 30)));
  return xp;
}
/** Nível a partir do XP: cada nível pede um pouco mais que o anterior. */
export function levelOf(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 15));
  const cur = 15 * level * level;
  const nxt = 15 * (level + 1) * (level + 1);
  return { level, progress: (xp - cur) / (nxt - cur), toNext: nxt - xp };
}
