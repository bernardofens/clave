import { describe, expect, it } from 'vitest';
import { itemText, translate, type Locale, type MessageKey, type Vars } from '../i18n';
import { EXERCISES } from './catalog';
import { TOOLS } from './tools';
import type { Ctx } from './types';

const ctxFor = (locale: Locale): Ctx => ({
  naming: locale, instrument: 'violao', conv: locale, t: (key: MessageKey, vars?: Vars) => translate(locale, key, vars),
});
// Letras acentuadas do português que não aparecem num texto em inglês.
const PT_CHARS = /[ãõçáéíóúâêô]/i;

describe('catálogo de exercícios', () => {
  for (const ex of EXERCISES) {
    it(`${ex.id} gera perguntas válidas`, () => {
      for (const locale of ['pt', 'en'] as const) {
        const ctx = ctxFor(locale);
        for (let i = 0; i < 300; i++) {
          const q = ex.make(ex.defaults, ctx);
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

    it(`${ex.id} não deixa português escapar no inglês`, () => {
      const ctx = ctxFor('en');
      const texts = [itemText(ctx.t, ex.id, 'title'), itemText(ctx.t, ex.id, 'desc')];
      ex.settings(ctx).forEach(s => texts.push(s.label, ...(s.options ?? []).map(o => o.label)));
      for (let i = 0; i < 100; i++) {
        const q = ex.make(ex.defaults, ctx);
        texts.push(q.prompt, q.reveal, ...(q.answer.kind === 'choice' ? q.answer.options.map(o => o.label) : []));
        if (q.visual.kind === 'ear' && q.visual.hint) texts.push(q.visual.hint);
      }
      expect(texts.filter(x => PT_CHARS.test(x))).toEqual([]);
    });
  }

  it('todo exercício e toda ferramenta têm título e descrição nos textos', () => {
    const t = ctxFor('pt').t;
    for (const { id } of [...EXERCISES, ...TOOLS]) {
      expect(itemText(t, id, 'title')).not.toMatch(/^(exercises|tools)\./);
      expect(itemText(t, id, 'desc')).not.toMatch(/^(exercises|tools)\./);
    }
  });
});
