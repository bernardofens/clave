import { beforeEach, describe, expect, it, vi } from 'vitest';

// O motor de áudio real precisa do navegador; aqui ele é trocado por um gravador de chamadas.
const calls = vi.hoisted(() => ({ tone: [] as unknown[][], drum: [] as unknown[][] }));
vi.mock('./engine', () => ({
  now: () => 0,
  tone: (...a: unknown[]) => calls.tone.push(a),
  drum: (...a: unknown[]) => calls.drum.push(a),
}));

import { DEFAULT_PRESENTATION, DRUM_GAIN, VOICE_LEVEL, playContent, resolvePresentation } from './presentation';

beforeEach(() => { calls.tone.length = 0; calls.drum.length = 0; });

describe('playContent', () => {
  it('toca cada nota no timbre pedido, com o volume ajustado ao nível do timbre', () => {
    for (const voice of ['piano', 'violao', 'baixo', 'pad', 'orgao'] as const) {
      calls.tone.length = 0;
      playContent({ groups: [[60]] }, resolvePresentation([{ voice, volume: 1.5 }]));
      const [midi, , , v, vel] = calls.tone[0];
      expect([midi, v]).toEqual([60, voice]);
      expect(vel).toBeCloseTo(1.5 * VOICE_LEVEL[voice]);
    }
  });
  it('todo timbre tem ajuste de nível, e o piano é a referência', () => {
    expect(Object.keys(VOICE_LEVEL).sort()).toEqual(['baixo', 'orgao', 'pad', 'piano', 'violao']);
    expect(VOICE_LEVEL.piano).toBe(1);
    Object.values(VOICE_LEVEL).forEach(v => expect(v).toBeGreaterThan(0));
  });
  it('no volume padrão, as notas do piano saem na intensidade padrão', () => {
    playContent({ groups: [[60, 64, 67]] }, resolvePresentation([]));
    expect(calls.tone).toHaveLength(3);
    calls.tone.forEach(c => expect(c[4]).toBe(DEFAULT_PRESENTATION.volume));
  });
  it('o ritmo toca contagem e aro com o reforço dos tambores, na proporção do volume', () => {
    const len = playContent({ groups: [], drums: [0, 1] }, resolvePresentation([{ volume: 1, bpm: 60 }]));
    expect(len).toBe(8);
    const rim = calls.drum.filter(c => c[0] === 'aro');
    expect(rim).toHaveLength(2);
    rim.forEach(c => expect(c[2]).toBe(DRUM_GAIN.accent));
    const clicks = calls.drum.filter(c => c[0] === 'clique-forte' || c[0] === 'clique');
    expect(clicks).toHaveLength(8);
    expect(clicks[0][2]).toBe(DRUM_GAIN.click); // primeiro tempo da contagem
    expect(clicks[7][2]).toBeCloseTo(0.35 * DRUM_GAIN.click); // cliques de fechamento, mais baixos
  });
});
