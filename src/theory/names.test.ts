import { describe, expect, it } from 'vitest';
import { intervalBetween, note } from './core';
import { accidentalCount, intervalName, ordinal, semitoneName } from './names';

describe('ordinais', () => {
  it('concordam em gênero em português', () => {
    expect(ordinal(3, 'pt')).toBe('3º');
    expect(ordinal(3, 'pt', 'f')).toBe('3ª');
  });
  it('usam o sufixo certo em inglês', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(n => ordinal(n, 'en'))).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd']);
  });
});

describe('nomes de intervalo', () => {
  it('põem o ordinal antes da qualidade em português', () => {
    expect(intervalName(intervalBetween(note(6), note(3, 0, 5)), 'pt')).toBe('5ª diminuta'); // Si-Fá
    expect(intervalName(intervalBetween(note(0), note(0)), 'pt')).toBe('uníssono justo');
    expect(intervalName(intervalBetween(note(0), note(0, 0, 5)), 'pt')).toBe('oitava justa');
  });
  it('põem a qualidade antes em inglês', () => {
    expect(intervalName(intervalBetween(note(6), note(3, 0, 5)), 'en')).toBe('diminished 5th');
    expect(intervalName(intervalBetween(note(0), note(2)), 'en')).toBe('major 3rd');
    expect(intervalName(intervalBetween(note(0), note(0, 0, 5)), 'en')).toBe('perfect octave');
  });
  it('nomeiam pela distância em semitons', () => {
    expect(semitoneName(6, 'pt')).toBe('trítono');
    expect(semitoneName(7, 'en')).toBe('perfect 5th');
  });
});

describe('contagem de acidentes', () => {
  it('flexiona o plural', () => {
    expect(accidentalCount(0, 'pt')).toBe('nenhum');
    expect(accidentalCount(1, 'pt')).toBe('1 sustenido');
    expect(accidentalCount(-3, 'pt')).toBe('3 bemóis');
    expect(accidentalCount(-1, 'en')).toBe('1 flat');
    expect(accidentalCount(2, 'en')).toBe('2 sharps');
  });
});
