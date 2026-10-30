// Sugere uma sessão de estudo para o tempo que a pessoa tem agora.
// Pesa os módulos pelos objetivos e alivia o que já foi muito treinado nos últimos dias.
import { EXERCISES, exerciseById } from '../exercises/catalog';
import { TOOLS, toolById } from '../exercises/tools';
import { GOALS, MODULE_LIST } from './modules';
import type { ModuleId } from '../exercises/taxonomy';
import type { Activity, Profile } from '../state/store';
import type { MessageKey } from '../i18n';

export interface Block {
  kind: 'exercise' | 'tool';
  id: string;
  /** Rótulo próprio do bloco (ex.: aquecimento); sem ele, vale o título do exercício ou da ferramenta. */
  label?: MessageKey;
  minutes: number;
  target?: number; // perguntas, para exercícios
}

export function moduleWeights(profile: Profile, history: Activity[]): Record<ModuleId, number> {
  const w = Object.fromEntries(MODULE_LIST.map(m => [m.id, 1])) as Record<ModuleId, number>;
  profile.goals.forEach(g => GOALS.find(x => x.id === g)?.modules.forEach(m => (w[m] += 1.2)));
  const since = Date.now() - 3 * 864e5;
  history.filter(h => h.at > since).forEach(h => (w[h.module] = Math.max(0.3, w[h.module] - h.seconds / 1200)));
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
  const w = moduleWeights(profile, history);
  const blocks: Block[] = [];
  let left = minutes;
  const tools = TOOLS.filter(t => withInstrument || t.mobile);

  // com instrumento e tempo: aquecimento técnico no começo
  if (withInstrument && minutes >= 15) {
    const warm = profile.instrument === 'piano' ? TOOLS.find(t => t.id === 'metronomo')! : TOOLS.find(t => t.id === 'tecnica')!;
    blocks.push({ kind: 'tool', id: warm.id, label: warm.id === 'tecnica' ? 'tools.warmupTechnique' : 'tools.warmupMetronome', minutes: 5 });
    left -= 5;
  }
  const finale = withInstrument && minutes >= 20 ? TOOLS.find(t => t.id === 'backing')! : null;
  if (finale) left -= 8;

  const used = new Set<string>();
  while (left >= 3) {
    const pool = EXERCISES.filter(e => !used.has(e.id));
    const useTool = withInstrument && left >= 6 && Math.random() < 0.25;
    if (useTool) {
      const t = weightedPick(tools.filter(x => !used.has(x.id) && x.id !== 'backing' && x.id !== 'tecnica'), x => w[x.primaryModule]);
      if (t) { used.add(t.id); blocks.push({ kind: 'tool', id: t.id, minutes: 6 }); left -= 6; continue; }
    }
    if (!pool.length) break;
    const e = weightedPick(pool, x => w[x.primaryModule]);
    used.add(e.id);
    const m = left >= 8 ? 4 : 3;
    blocks.push({ kind: 'exercise', id: e.id, minutes: m, target: m * 3 });
    left -= m;
  }
  if (finale) blocks.push({ kind: 'tool', id: 'backing', label: 'tools.improvise', minutes: 8 });
  return blocks;
}

/** Módulo de um exercício ou ferramenta, pelo id. */
export function moduleOf(id: string): ModuleId {
  return (exerciseById[id] ?? toolById[id]).primaryModule;
}
