import { describe, expect, it } from 'vitest';
import { DEFAULT_PRESENTATION, resolvePresentation, schedule } from './presentation';

describe('perfil de apresentação', () => {
  it('as camadas de cima valem mais e as ausentes não apagam as de baixo', () => {
    const p = resolvePresentation([{ voice: 'baixo', volume: 0.9 }, { gap: 0.45 }, undefined, { volume: 0.5, dur: undefined }]);
    expect(p).toEqual({ ...DEFAULT_PRESENTATION, voice: 'baixo', volume: 0.5, gap: 0.45 });
  });

  const chord = { groups: [[60, 64, 67]] };
  it('acorde em bloco: as notas juntas (ou espaçadas pelo arp)', () => {
    const p = resolvePresentation([{ gap: 0.5 }]);
    expect(schedule(chord, p)).toEqual({ notes: [[60, 0], [64, 0], [67, 0]], length: 0.5 });
    expect(schedule(chord, { ...p, arp: 0.1 }).notes.map(([, t]) => +t.toFixed(2))).toEqual([0, 0.1, 0.2]);
  });
  it('arpejo e depois o acorde: o mesmo conteúdo, só muda como soa', () => {
    const p = resolvePresentation([{ gap: 0.5, chord: 'arpeggio-block' }]);
    expect(schedule(chord, p)).toEqual({ notes: [[60, 0], [64, 0.5], [67, 1], [60, 1.5], [64, 1.5], [67, 1.5]], length: 2 });
  });
  it('só o arpejo', () => {
    const p = resolvePresentation([{ gap: 0.5, chord: 'arpeggio' }]);
    expect(schedule(chord, p)).toEqual({ notes: [[60, 0], [64, 0.5], [67, 1]], length: 1.5 });
  });
  it('notas soltas em sequência não mudam com o modo de acorde', () => {
    const seq = { groups: [[60], [62], [64]] };
    const block = schedule(seq, resolvePresentation([{ gap: 0.3 }]));
    const arp = schedule(seq, resolvePresentation([{ gap: 0.3, chord: 'arpeggio-block' }]));
    expect(arp).toEqual(block);
    expect(block.length).toBeCloseTo(0.9);
  });
});
