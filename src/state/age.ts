// Idade e faixa etária, a partir da data de nascimento informada no cadastro.
// Menores de 13 anos nunca chegam a criar conta (ver docs/decisoes.md); o app nunca guarda a
// data de nascimento de quem está nessa faixa — só calcula a idade na hora, para decidir.
export type AgeGroup = '13to17' | '18plus';

export function ageFromBirthdate(birthdate: string, now = new Date()): number {
  const b = new Date(birthdate + 'T00:00:00');
  let age = now.getFullYear() - b.getFullYear();
  const beforeBirthdayThisYear = now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
  if (beforeBirthdayThisYear) age--;
  return age;
}

export function ageGroupFor(age: number): AgeGroup | 'under13' {
  if (age < 13) return 'under13';
  if (age < 18) return '13to17';
  return '18plus';
}
