// Adaptador temporário (C1): converte perguntas no formato antigo — superfície e regra de validação
// fundidas em `answer`, apresentação embutida no `sound` — para o modelo novo. Assim o player só
// conhece o modelo novo e o catálogo migra exercício por exercício. Sai quando o último migrar.
import type { Presentation } from '../audio/presentation';
import type { LegacyQuestion, Question } from './types';

export interface Prepared {
  question: Question;
  /** Apresentação que vinha dentro do som antigo (intervalo, arpejo, timbre, andamento). */
  legacyPresentation?: Partial<Presentation>;
}

const isLegacy = (q: Question | LegacyQuestion): q is LegacyQuestion => 'answer' in q;

export function prepare(q: Question | LegacyQuestion): Prepared {
  if (!isLegacy(q)) return { question: q };
  const { answer: a, sound, ...rest } = q;
  const question: Question = {
    ...rest,
    ...(a.kind === 'choice' ? { surface: { kind: 'choices', options: a.options, wide: a.wide }, expected: { kind: 'option', id: a.correct } }
      : a.kind === 'spelled' ? { surface: { kind: 'letters', accidentals: a.accidentals }, expected: { kind: 'spelled', letter: a.correct.letter, acc: a.correct.acc } }
      : a.kind === 'key' ? { surface: { kind: 'keyboard', lo: a.lo, hi: a.hi }, expected: { kind: 'pitchClass', pc: a.correctPc } }
      : a.kind === 'fret' ? { surface: { kind: 'fretboard', tuning: a.tuning, from: a.from, to: a.to, onlyString: a.onlyString }, expected: { kind: 'pitchClass', pc: a.correctPc } }
      : { surface: { kind: 'staff', clef: a.clef, accidentals: a.accidentals }, expected: { kind: 'spelled', letter: a.correct.letter, acc: a.correct.acc, oct: a.correct.oct } }),
    sound: sound && { groups: sound.groups, drums: sound.drums },
  };
  if (!sound) return { question };
  const legacyPresentation: Partial<Presentation> = {};
  if (sound.gap !== undefined) legacyPresentation.gap = sound.gap;
  if (sound.arp !== undefined) legacyPresentation.arp = sound.arp;
  if (sound.voice !== undefined) legacyPresentation.voice = sound.voice;
  if (sound.bpm !== undefined) legacyPresentation.bpm = sound.bpm;
  return { question, legacyPresentation };
}
