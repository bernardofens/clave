import { describe, expect, it } from 'vitest';
import { EXERCISES } from './catalog';

describe('catálogo de exercícios', () => {
  for (const ex of EXERCISES) {
    it(`${ex.id} gera perguntas válidas`, () => {
      for (const naming of ['pt', 'en'] as const) {
        for (let i = 0; i < 300; i++) {
          const q = ex.make(ex.defaults, { naming, instrument: 'violao' });
          expect(q.prompt).toBeTruthy();
          expect(q.reveal).toBeTruthy();
          if (q.answer.kind === 'choice') {
            const ids = q.answer.options.map(o => o.id);
            expect(ids).toContain(q.answer.correct);
            expect(new Set(ids).size).toBe(ids.length);
            expect(ids.length).toBeGreaterThan(1);
          }
          if (q.answer.kind === 'spelled') expect(Math.abs(q.answer.correct.acc)).toBeLessThanOrEqual(1);
        }
      }
    });
  }
});
