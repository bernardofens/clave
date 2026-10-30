import { describe, expect, it } from 'vitest';
import { itemText, translate, type Locale, type MessageKey, type Vars } from '../i18n';
import { EXERCISES } from './catalog';
import { prepare } from './legacy';
import { globalPresentation, resolveParams } from './params';
import { resolvePresentation } from '../audio/presentation';
import { optionResponse, validate } from './validate';
import { TOOLS } from './tools';
import type { Ctx } from './types';

const ctxFor = (locale: Locale): Ctx => ({
  naming: locale, conv: locale, t: (key: MessageKey, vars?: Vars) => translate(locale, key, vars), params: resolveParams('violao'),
});
// Letras acentuadas do português que não aparecem num texto em inglês.
const PT_CHARS = /[ãõçáéíóúâêô]/i;

describe('catálogo de exercícios', () => {
  for (const ex of EXERCISES) {
    it(`${ex.id} gera perguntas válidas`, () => {
      for (const locale of ['pt', 'en'] as const) {
        const ctx = ctxFor(locale);
        for (let i = 0; i < 300; i++) {
          const { question: q } = prepare(ex.make(ex.defaults, ctx));
          expect(q.prompt).toBeTruthy();
          expect(q.reveal).toBeTruthy();
          const sf = q.surface, e = q.expected;
          if (sf.kind === 'choices') {
            const ids = sf.options.map(o => o.id);
            expect(new Set(ids).size).toBe(ids.length);
            expect(ids.length).toBeGreaterThan(1);
            // pela conferência musical, exatamente uma opção está certa (nenhuma equivalente a outra)
            expect(sf.options.filter(o => validate(e, optionResponse(o))).length).toBe(1);
          }
          // a superfície consegue produzir uma resposta que a conferência entende
          if (sf.kind === 'keyboard' || sf.kind === 'fretboard') expect(['pitch', 'pitchClass']).toContain(e.kind);
          if (sf.kind === 'letters' || sf.kind === 'staff') expect(['spelled', 'pitchClass']).toContain(e.kind);
          if (e.kind === 'spelled') expect(Math.abs(e.acc)).toBeLessThanOrEqual(1);
        }
      }
    });

    it(`${ex.id} não deixa português escapar no inglês`, () => {
      const ctx = ctxFor('en');
      const texts = [itemText(ctx.t, ex.id, 'title'), itemText(ctx.t, ex.id, 'desc')];
      ex.settings(ctx).forEach(s => texts.push(s.label, ...(s.options ?? []).map(o => o.label)));
      for (let i = 0; i < 100; i++) {
        const { question: q } = prepare(ex.make(ex.defaults, ctx));
        texts.push(q.prompt, q.reveal, ...(q.surface.kind === 'choices' ? q.surface.options.map(o => o.label) : []));
        if (q.visual.kind === 'ear' && q.visual.hint) texts.push(q.visual.hint);
      }
      expect(texts.filter(x => PT_CHARS.test(x))).toEqual([]);
    });
  }

  it('um parâmetro global de som chega a todo exercício com áudio, sem editar o catálogo', () => {
    // nenhum exercício (nem o som no formato antigo) pode sobrescrever o volume global
    const params = { ...resolveParams('baixo'), volume: 0.33 };
    const ctx = { ...ctxFor('pt'), params };
    for (const ex of EXERCISES) {
      for (let i = 0; i < 20; i++) {
        const p = prepare(ex.make(ex.defaults, ctx));
        if (!p.question.sound) continue;
        const settingsLayer = ex.settings(ctx).reduce((acc, st) => (st.present ? { ...acc, ...st.present(ex.defaults[st.id]) } : acc), {});
        const pres = resolvePresentation([globalPresentation(params, p.question.sound.instrument), ex.presentation, p.legacyPresentation, settingsLayer]);
        expect(pres.volume, ex.id).toBe(0.33);
      }
    }
  });

  it('todo exercício e toda ferramenta têm título e descrição nos textos', () => {
    const t = ctxFor('pt').t;
    for (const { id } of [...EXERCISES, ...TOOLS]) {
      expect(itemText(t, id, 'title')).not.toMatch(/^(exercises|tools)\./);
      expect(itemText(t, id, 'desc')).not.toMatch(/^(exercises|tools)\./);
    }
  });
});
