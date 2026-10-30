import { describe, expect, it } from 'vitest';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';
import { LESSONS } from './content';
import { GOAL_MIGRATION, GOALS, goalById, goalItems } from './goals';
import { contentFor } from './localized';
import { goalModules } from './session';

const INSTRUMENTS = ['piano', 'violao', 'baixo'] as const;

describe('objetivos', () => {
  it('são os 8 combinados, com "conhecer as notas" em primeiro', () => {
    expect(GOALS.map(g => g.id)).toEqual(['notas-instrumento', 'tirar-de-ouvido', 'acordes', 'improvisar', 'ler-partitura', 'ritmo', 'harmonia', 'agilidade']);
  });
  it('tudo o que um objetivo cita existe, para qualquer instrumento', () => {
    for (const g of GOALS) for (const i of INSTRUMENTS) {
      const { exercises, tools, lessons } = goalItems(g, i);
      exercises.forEach(id => expect(exerciseById[id], `${g.id}/${i}: ${id}`).toBeTruthy());
      tools.forEach(id => expect(toolById[id], `${g.id}/${i}: ${id}`).toBeTruthy());
      lessons.forEach(id => expect(LESSONS.some(l => l.id === id), `${g.id}/${i}: ${id}`).toBe(true));
    }
  });
  it('nenhum objetivo fica vazio, para nenhum instrumento', () => {
    for (const g of GOALS) for (const i of INSTRUMENTS) {
      const { exercises, tools, lessons } = goalItems(g, i);
      expect(exercises.length + tools.length + lessons.length, `${g.id}/${i}`).toBeGreaterThan(0);
    }
  });
  it('"conhecer as notas" leva ao braço de quem toca baixo ou violão e ao teclado de quem toca piano', () => {
    const baixo = goalItems(goalById['notas-instrumento'], 'baixo');
    expect(baixo.exercises).toEqual(['braco-nota', 'braco-ache', 'braco-intervalo']);
    expect(baixo.exercises.every(id => exerciseById[id].group === 'braco')).toBe(true);
    expect(goalItems(goalById['notas-instrumento'], 'violao').exercises).toContain('acorde-visual');
    expect(goalItems(goalById['notas-instrumento'], 'baixo').exercises).not.toContain('acorde-visual'); // acorde de violão
    const piano = goalItems(goalById['notas-instrumento'], 'piano');
    expect(piano.exercises.every(id => exerciseById[id].group === 'teclado')).toBe(true);
    expect(piano.lessons).toEqual([]); // a aula é do braço
  });
  it('quem toca piano não recebe exercício de braço em nenhum objetivo', () => {
    for (const g of GOALS) goalItems(g, 'piano').exercises.forEach(id => expect(exerciseById[id].group, `${g.id}: ${id}`).not.toBe('braco'));
  });
  it('o acorde desenhado do violão só aparece para quem toca violão', () => {
    for (const g of GOALS) for (const i of ['piano', 'baixo'] as const) expect(goalItems(g, i).exercises, `${g.id}/${i}`).not.toContain('acorde-visual');
    expect(goalItems(goalById.acordes, 'violao').exercises).toContain('acorde-visual');
  });
  it('os módulos de cada objetivo vêm do que ele mostra', () => {
    expect(goalModules(goalById.agilidade)).toEqual(['technique']);
    // ritmo: exercício e ferramenta rítmicos, o metrônomo (técnica) e o gerador de leitura (melódico)
    expect(goalModules(goalById.ritmo)).toEqual(['perception.rhythmic', 'technique', 'perception.melodic']);
    expect(goalModules(goalById['notas-instrumento'])).toEqual(['theory']);
  });
  it('a migração só leva a objetivos que existem', () => {
    Object.values(GOAL_MIGRATION).flat().forEach(id => expect(goalById[id]).toBeTruthy());
  });
});

describe('textos dos objetivos', () => {
  it.each(['pt', 'en'] as const)('%s: todo objetivo tem nome e descrição, e o nome segue o instrumento', locale => {
    const c = contentFor(locale);
    for (const g of GOALS) {
      expect(c.GOALS.find(x => x.id === g.id)).toMatchObject({ name: expect.any(String), hint: expect.any(String) });
    }
    const names = INSTRUMENTS.map(i => c.goalLabel('notas-instrumento', i));
    expect(new Set(names).size).toBe(3); // braço do violão, braço do baixo, teclado
    expect(c.goalLabel('ritmo', 'baixo')).toBe(c.goalLabel('ritmo', 'piano')); // sem variante, o nome comum
  });
  it('o objetivo do baixo diz "braço do baixo", como a pessoa procura', () => {
    expect(contentFor('pt').goalLabel('notas-instrumento', 'baixo')).toBe('Conhecer as notas no braço do baixo');
  });
});
