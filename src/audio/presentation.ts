// Perfil de apresentação: COMO o conteúdo de uma pergunta soa (C1). A pergunta só diz quais notas
// tocar; timbre, volume, intervalo entre notas, arpejo e andamento são resolvidos aqui, na hora de
// tocar, a partir de camadas (padrão < global < exercício < configuração da pessoa). Um parâmetro de
// som novo entra só neste arquivo e passa a valer para todo exercício com áudio.
import type { SoundContent } from '../exercises/types';
import { drum, now, tone, type Voice } from './engine';

export interface Presentation {
  voice: Voice;
  /** Intensidade das notas, de 0 a 1. */
  volume: number;
  /** Segundos entre um grupo de notas e o seguinte. */
  gap: number;
  /** Segundos entre as notas de um mesmo grupo (0 = juntas). */
  arp: number;
  /** Duração de cada nota, em segundos. */
  dur: number;
  /** Como tocar um grupo de várias notas: junto, arpejado ou arpejado e depois junto. */
  chord: 'block' | 'arpeggio' | 'arpeggio-block';
  /** Andamento dos ritmos (contagem e ataques). */
  bpm: number;
}

export const DEFAULT_PRESENTATION: Presentation = {
  voice: 'piano', volume: 0.7, gap: 0.75, arp: 0, dur: 0.9, chord: 'block', bpm: 84,
};

/** Junta as camadas; as últimas valem mais. Campos ausentes ficam com o valor de baixo. */
export function resolvePresentation(layers: (Partial<Presentation> | undefined)[]): Presentation {
  const out = { ...DEFAULT_PRESENTATION };
  for (const layer of layers) {
    if (!layer) continue;
    for (const [k, v] of Object.entries(layer)) if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

/** Linha do tempo das notas, em segundos a partir do começo: [midi, início][]. */
export function schedule(content: SoundContent, p: Presentation): { notes: [number, number][]; length: number } {
  const notes: [number, number][] = [];
  let t = 0;
  for (const group of content.groups) {
    if (group.length > 1 && p.chord !== 'block') {
      group.forEach((m, i) => notes.push([m, t + i * p.gap]));
      t += group.length * p.gap;
      if (p.chord === 'arpeggio') continue;
    }
    group.forEach((m, i) => notes.push([m, t + i * p.arp]));
    t += p.gap;
  }
  return { notes, length: t };
}

/** Toca o conteúdo com a apresentação dada. Devolve a duração, em segundos. */
export function playContent(content: SoundContent, p: Presentation): number {
  if (content.drums) {
    const beat = 60 / p.bpm;
    const t0 = now() + 0.1;
    for (let i = 0; i < 4; i++) drum(i === 0 ? 'clique-forte' : 'clique', t0 + i * beat, p.volume / 0.7);
    content.drums.forEach(o => drum('aro', t0 + (4 + o) * beat, p.volume / 0.7));
    for (let i = 0; i < 4; i++) drum('clique', t0 + (4 + i) * beat, 0.35 * p.volume / 0.7);
    return 8 * beat;
  }
  const t0 = now() + 0.05;
  const { notes, length } = schedule(content, p);
  notes.forEach(([m, t]) => tone(m, t0 + t, p.dur, p.voice, p.volume));
  return length;
}
