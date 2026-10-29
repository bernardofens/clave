import { describe, expect, it } from 'vitest';
import { ageFromBirthdate, ageGroupFor } from './age';

describe('idade a partir da data de nascimento', () => {
  it('não conta o aniversário deste ano se ele ainda não chegou', () => {
    expect(ageFromBirthdate('2010-06-15', new Date('2026-06-14T12:00:00'))).toBe(15);
  });
  it('conta o aniversário no próprio dia', () => {
    expect(ageFromBirthdate('2010-06-15', new Date('2026-06-15T12:00:00'))).toBe(16);
  });
  it('conta o aniversário depois que ele passou', () => {
    expect(ageFromBirthdate('2010-06-15', new Date('2026-06-16T12:00:00'))).toBe(16);
  });
});

describe('faixa etária', () => {
  it('classifica menor de 13 como under13', () => {
    expect(ageGroupFor(12)).toBe('under13');
  });
  it('classifica de 13 a 17 como 13to17', () => {
    expect(ageGroupFor(13)).toBe('13to17');
    expect(ageGroupFor(17)).toBe('13to17');
  });
  it('classifica 18 ou mais como 18plus', () => {
    expect(ageGroupFor(18)).toBe('18plus');
    expect(ageGroupFor(40)).toBe('18plus');
  });
});
