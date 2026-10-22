// Catálogo de exercícios. Cada um sorteia uma pergunta a partir das configurações escolhidas.
import {
  buildChord, buildScale, CHORDS, chordSymbol, clefBottom, fromStep, harmonicField, intervalName,
  majorTonic, midi, mod, note, noteName, optionsWith, pcName, pick, randInt, relativeMinor, SCALES, semisFor, shuffle, transpose,
  type ChordId, type Clef, type Note, type Quality, type ScaleId,
} from '../theory/core';
import { CELLS, RHYTHM_PRESETS, randomBars, type CellId } from '../theory/rhythm';
import { TUNINGS } from '../components/music/Fretboard';
import type { ChoiceOption, Ctx, ExerciseDef, Question, Setting, SettingValue } from './types';

type S = Record<string, SettingValue>;
const arr = (v: SettingValue | undefined, fallback: string[]) => (Array.isArray(v) && v.length ? v : fallback);

// ---------------- configurações reaproveitadas ----------------
const CLEFS: Setting = { id: 'claves', label: 'Claves', type: 'multi', options: [{ id: 'sol', label: 'Sol' }, { id: 'fa', label: 'Fá' }] };
const EXT: Setting = { id: 'extensao', label: 'Extensão', type: 'single', options: [{ id: 'pauta', label: 'Só na pauta' }, { id: 'suplementares', label: 'Com linhas suplementares' }] };
const ACC: Setting = { id: 'acidentes', label: 'Sustenidos e bemóis', type: 'toggle' };
const INST: Setting = { id: 'instrumento', label: 'Instrumento', type: 'single', options: [{ id: 'violao', label: 'Violão' }, { id: 'baixo', label: 'Baixo' }] };
const FRETS: Setting = { id: 'casas', label: 'Região do braço', type: 'single', options: [{ id: '0-5', label: 'Casas 0 a 5' }, { id: '5-9', label: 'Casas 5 a 9' }, { id: '0-12', label: 'Braço todo (0 a 12)' }] };

const INTERVALS: { id: string; num: number; q: Quality }[] = [
  { id: 'm2', num: 2, q: 'm' }, { id: 'M2', num: 2, q: 'M' }, { id: 'm3', num: 3, q: 'm' }, { id: 'M3', num: 3, q: 'M' },
  { id: 'J4', num: 4, q: 'J' }, { id: 'A4', num: 4, q: 'A' }, { id: 'd5', num: 5, q: 'd' }, { id: 'J5', num: 5, q: 'J' },
  { id: 'm6', num: 6, q: 'm' }, { id: 'M6', num: 6, q: 'M' }, { id: 'm7', num: 7, q: 'm' }, { id: 'M7', num: 7, q: 'M' }, { id: 'J8', num: 8, q: 'J' },
];
const ivLabel = (id: string) => { const iv = INTERVALS.find(i => i.id === id)!; return intervalName({ num: iv.num, semis: semisFor(iv.num, iv.q) }); };
const SEMI_NAMES = ['uníssono', '2ª menor', '2ª maior', '3ª menor', '3ª maior', '4ª justa', 'trítono', '5ª justa', '6ª menor', '6ª maior', '7ª menor', '7ª maior', 'oitava'];
const SEMI_OPTIONS: ChoiceOption[] = SEMI_NAMES.slice(1).map((l, i) => ({ id: String(i + 1), label: l }));
const ROOTS: Note[] = [note(0), note(1, -1), note(1), note(2, -1), note(2), note(3), note(3, 1), note(4), note(5, -1), note(5), note(6, -1), note(6)];
const spellPc = (p: number, oct = 4): Note => ({ ...ROOTS[mod(p, 12)], oct });
const MODES: { id: ScaleId; name: string }[] = [
  { id: 'maior', name: 'jônio' }, { id: 'dorico', name: 'dórico' }, { id: 'frigio', name: 'frígio' }, { id: 'lidio', name: 'lídio' },
  { id: 'mixolidio', name: 'mixolídio' }, { id: 'menor', name: 'eólio' }, { id: 'locrio', name: 'lócrio' },
];

function pickClef(s: S): Clef {
  return pick(arr(s.claves, ['sol'])) as Clef;
}
function stepRange(clef: Clef, ext: SettingValue | undefined): [number, number] {
  const b = clefBottom(clef);
  return ext === 'suplementares' ? [b - 6, b + 14] : [b - 1, b + 9];
}
function randAcc(on: SettingValue | undefined) {
  if (!on) return 0;
  const r = Math.random();
  return r < 0.5 ? 0 : r < 0.75 ? 1 : -1;
}
function fretRange(s: S): [number, number] {
  const [a, b] = String(s.casas ?? '0-5').split('-').map(Number);
  return [a, b];
}
function tuningOf(s: S, ctx: Ctx) {
  const inst = s.instrumento === 'auto' || !s.instrumento ? (ctx.instrument === 'baixo' ? 'baixo' : 'violao') : (s.instrumento as 'violao' | 'baixo');
  return TUNINGS[inst];
}
const pcOptions = (naming: Ctx['naming']): ChoiceOption[] => Array.from({ length: 12 }, (_, p) => ({ id: String(p), label: pcName(p, naming) }));

// =====================================================================
export const EXERCISES: ExerciseDef[] = [
  // ---------------- LEITURA ----------------
  {
    id: 'pauta-nota', title: 'Qual nota é essa?', desc: 'Identifique a nota escrita na pauta.', area: 'leitura', group: 'pauta', mobile: true,
    settings: [CLEFS, EXT, ACC], defaults: { claves: ['sol'], extensao: 'pauta', acidentes: false },
    make(s, ctx): Question {
      const clef = pickClef(s);
      const [lo, hi] = stepRange(clef, s.extensao);
      const n = fromStep(randInt(lo, hi), randAcc(s.acidentes));
      return {
        prompt: 'Que nota é essa?', visual: { kind: 'staff', clef, columns: [[n]] },
        answer: { kind: 'spelled', correct: n, accidentals: !!s.acidentes }, sound: { groups: [[midi(n)]] },
        reveal: noteName(n, ctx.naming) + n.oct,
      };
    },
  },
  {
    id: 'pauta-construir', title: 'Escreva a nota', desc: 'Toque na pauta para escrever a nota pedida.', area: 'leitura', group: 'pauta', mobile: true,
    settings: [CLEFS, EXT, ACC], defaults: { claves: ['sol'], extensao: 'pauta', acidentes: false },
    make(s, ctx) {
      const clef = pickClef(s);
      const [lo, hi] = stepRange(clef, s.extensao);
      const n = fromStep(randInt(lo, hi), randAcc(s.acidentes));
      return {
        prompt: `Escreva ${noteName(n, ctx.naming)}${n.oct}`, visual: { kind: 'text', text: '' },
        answer: { kind: 'staff', clef, correct: n, accidentals: !!s.acidentes }, sound: { groups: [[midi(n)]] },
        reveal: `${noteName(n, ctx.naming)}${n.oct}`,
      };
    },
  },
  {
    id: 'pauta-armadura', title: 'Armadura de clave', desc: 'Diga a tonalidade pela armadura.', area: 'leitura', group: 'pauta', mobile: true,
    settings: [CLEFS, { id: 'modo', label: 'Tonalidade', type: 'single', options: [{ id: 'maior', label: 'Maior' }, { id: 'menor', label: 'Menor' }, { id: 'ambos', label: 'Ambas' }] },
      { id: 'max', label: 'Até quantos acidentes', type: 'single', options: [{ id: '2', label: '2' }, { id: '4', label: '4' }, { id: '7', label: '7' }] }],
    defaults: { claves: ['sol'], modo: 'maior', max: '4' },
    make(s, ctx) {
      const max = Number(s.max ?? 4);
      const minor = s.modo === 'menor' || (s.modo === 'ambos' && Math.random() < 0.5);
      const label = (f: number) => (minor ? noteName(relativeMinor(f), ctx.naming) + ' menor' : noteName(majorTonic(f), ctx.naming) + ' maior');
      const f = randInt(-max, max);
      const pool = Array.from({ length: 2 * max + 1 }, (_, i) => i - max);
      const opts = optionsWith(f, pool, Math.min(6, pool.length));
      return {
        prompt: `Qual a tonalidade ${minor ? 'menor' : 'maior'}?`, visual: { kind: 'staff', clef: pickClef(s), fifths: f, columns: [] },
        answer: { kind: 'choice', options: opts.map(o => ({ id: String(o), label: label(o) })), correct: String(f) },
        reveal: label(f),
      };
    },
  },
  // ---------------- HARMONIA ----------------
  {
    id: 'pauta-intervalo', title: 'Intervalo na pauta', desc: 'Identifique o intervalo entre as duas notas.', area: 'harmonia', group: 'pauta', mobile: true,
    settings: [CLEFS, { id: 'intervalos', label: 'Intervalos', type: 'multi', options: INTERVALS.map(i => ({ id: i.id, label: i.id })) },
      { id: 'forma', label: 'Forma', type: 'single', options: [{ id: 'melodico', label: 'Melódico (uma depois da outra)' }, { id: 'harmonico', label: 'Harmônico (juntas)' }] }],
    defaults: { claves: ['sol'], intervalos: ['m2', 'M2', 'm3', 'M3', 'J4', 'J5', 'm6', 'M6', 'J8'], forma: 'melodico' },
    make(s) {
      const clef = pickClef(s);
      const ids = arr(s.intervalos, ['M3']);
      const id = pick(ids);
      const iv = INTERVALS.find(i => i.id === id)!;
      const b = clefBottom(clef);
      let lower: Note, upper: Note;
      do {
        lower = fromStep(randInt(b - 1, b + 9 - (iv.num - 1)), Math.random() < 0.25 ? pick([1, -1]) : 0);
        upper = transpose(lower, { num: iv.num, semis: semisFor(iv.num, iv.q) });
      } while (Math.abs(upper.acc) > 1);
      const columns = s.forma === 'harmonico' ? [[lower, upper]] : [[lower], [upper]];
      return {
        prompt: 'Qual é o intervalo?', visual: { kind: 'staff', clef, columns },
        answer: { kind: 'choice', options: ids.map(i => ({ id: i, label: ivLabel(i) })), correct: id },
        sound: { groups: s.forma === 'harmonico' ? [[midi(lower), midi(upper)]] : [[midi(lower)], [midi(upper)]] },
        reveal: ivLabel(id),
      };
    },
  },
  {
    id: 'pauta-acorde', title: 'Acorde na pauta', desc: 'Dê a cifra do acorde escrito.', area: 'harmonia', group: 'pauta', mobile: true,
    settings: [CLEFS, { id: 'tipos', label: 'Tipos', type: 'multi', options: (Object.keys(CHORDS) as ChordId[]).map(c => ({ id: c, label: CHORDS[c].name })) },
      { id: 'inversoes', label: 'Com inversões', type: 'toggle' }],
    defaults: { claves: ['sol'], tipos: ['maior', 'menor', 'dim', 'aum'], inversoes: false },
    make(s) {
      const clef = pickClef(s);
      const types = arr(s.tipos, ['maior']) as ChordId[];
      const type = pick(types);
      const root = { ...pick(ROOTS), oct: clef === 'sol' ? 4 : 2 };
      const inv = s.inversoes ? randInt(0, CHORDS[type].degs.length - 1) : 0;
      const notes = buildChord(root, type, inv);
      const sym = chordSymbol(root, type);
      const pool = [...types.map(t => chordSymbol(root, t)), ...shuffle(ROOTS).slice(0, 6).map(r => chordSymbol(r, type))];
      const opts = optionsWith(sym, [...new Set(pool)], 6);
      return {
        prompt: 'Que acorde é esse?', visual: { kind: 'staff', clef, columns: [notes] },
        answer: { kind: 'choice', options: opts.map(o => ({ id: o, label: o })), correct: sym },
        sound: { groups: [notes.map(midi)], arp: 0.08 }, reveal: `${sym} (${CHORDS[type].name.toLowerCase()})`,
      };
    },
  },
  {
    id: 'pauta-escala', title: 'Escala na pauta', desc: 'Identifique a escala escrita.', area: 'harmonia', group: 'pauta', mobile: true,
    settings: [CLEFS, { id: 'tipos', label: 'Escalas', type: 'multi', options: (Object.keys(SCALES) as ScaleId[]).map(k => ({ id: k, label: SCALES[k].name })) }],
    defaults: { claves: ['sol'], tipos: ['maior', 'menor', 'menor-harmonica', 'menor-melodica'] },
    make(s, ctx) {
      const clef = pickClef(s);
      const types = arr(s.tipos, ['maior']) as ScaleId[];
      const type = pick(types);
      const tonic = { ...pick(ROOTS.filter(r => r.letter <= 4 || r.acc === 0)), oct: clef === 'sol' ? 4 : 2 };
      const notes = [...buildScale(tonic, type), { ...tonic, oct: tonic.oct + 1 }];
      const name = (t: Note, id: ScaleId) => `${noteName(t, ctx.naming)} ${SCALES[id].name.toLowerCase()}`;
      const pool = [...types.map(t => name(tonic, t)), ...shuffle(ROOTS).slice(0, 4).map(r => name(r, type))];
      const correct = name(tonic, type);
      return {
        prompt: 'Que escala é essa?', visual: { kind: 'staff', clef, columns: notes.map(n => [n]) },
        answer: { kind: 'choice', options: optionsWith(correct, [...new Set(pool)], 6).map(o => ({ id: o, label: o })), correct, wide: true },
        sound: { groups: notes.map(n => [midi(n)]), gap: 0.32 }, reveal: correct,
      };
    },
  },
  {
    id: 'quiz-teoria', title: 'Quiz de teoria', desc: 'Graus, modos, campo harmônico e rearmonização.', area: 'harmonia', group: 'teoria', mobile: true,
    settings: [{ id: 'temas', label: 'Temas', type: 'multi', options: [
      { id: 'graus', label: 'Graus e escalas' }, { id: 'modos', label: 'Modos gregos' }, { id: 'acordes', label: 'Notas dos acordes' },
      { id: 'campo', label: 'Campo harmônico' }, { id: 'tonalidades', label: 'Tonalidades' }, { id: 'sub5', label: 'Rearmonização (sub5)' }] }],
    defaults: { temas: ['graus', 'modos', 'acordes', 'campo', 'tonalidades'] },
    make(s, ctx) {
      return theoryQuestion(pick(arr(s.temas, ['graus'])), ctx);
    },
  },
  // ---------------- MAPEAMENTO: teclado ----------------
  {
    id: 'teclado-nota', title: 'Nota no teclado', desc: 'Qual é a tecla marcada?', area: 'mapeamento', group: 'teclado', mobile: true,
    settings: [{ id: 'pretas', label: 'Incluir teclas pretas', type: 'toggle' }, { id: 'oitavas', label: 'Oitavas', type: 'single', options: [{ id: '1', label: '1' }, { id: '2', label: '2' }] }],
    defaults: { pretas: true, oitavas: '2' },
    make(s, ctx) {
      const lo = 48, hi = s.oitavas === '1' ? 59 : 71;
      let m: number;
      do m = randInt(lo, hi); while (!s.pretas && [1, 3, 6, 8, 10].includes(m % 12));
      return {
        prompt: 'Que tecla é essa?', visual: { kind: 'keyboard', lo, hi, marks: [m] },
        answer: { kind: 'choice', options: pcOptions(ctx.naming).filter(o => s.pretas || ![1, 3, 6, 8, 10].includes(Number(o.id))), correct: String(m % 12) },
        sound: { groups: [[m]] }, reveal: pcName(m, ctx.naming),
      };
    },
  },
  {
    id: 'teclado-tecla', title: 'Ache a tecla', desc: 'Toque a tecla da nota pedida.', area: 'mapeamento', group: 'teclado', mobile: true,
    settings: [{ id: 'pretas', label: 'Incluir teclas pretas', type: 'toggle' }], defaults: { pretas: true },
    make(s, ctx) {
      let p: number;
      do p = randInt(0, 11); while (!s.pretas && [1, 3, 6, 8, 10].includes(p));
      const n = spellPc(p);
      return {
        prompt: `Toque ${noteName(n, ctx.naming)}`, visual: { kind: 'text', text: '' },
        answer: { kind: 'key', lo: 48, hi: 71, correctPc: p }, sound: { groups: [[60 + p]] }, reveal: noteName(n, ctx.naming),
      };
    },
  },
  {
    id: 'teclado-acorde', title: 'Acorde no teclado', desc: 'Reconheça o acorde pelas teclas.', area: 'harmonia', group: 'teclado', mobile: true,
    settings: [{ id: 'tipos', label: 'Tipos', type: 'multi', options: (['maior', 'menor', 'dim', 'aum', '7M', '7', 'm7', 'm7b5'] as ChordId[]).map(c => ({ id: c, label: CHORDS[c].name })) }],
    defaults: { tipos: ['maior', 'menor', '7', 'm7'] },
    make(s) {
      const types = arr(s.tipos, ['maior']) as ChordId[];
      const type = pick(types);
      const root = { ...pick(ROOTS), oct: 4 };
      const notes = buildChord(root, type).map(midi).map(m => (m > 76 ? m - 12 : m));
      const sym = chordSymbol(root, type);
      const pool = [...types.map(t => chordSymbol(root, t)), ...shuffle(ROOTS).slice(0, 6).map(r => chordSymbol(r, type))];
      return {
        prompt: 'Que acorde é esse?', visual: { kind: 'keyboard', lo: 48, hi: 83, marks: notes },
        answer: { kind: 'choice', options: optionsWith(sym, [...new Set(pool)], 6).map(o => ({ id: o, label: o })), correct: sym },
        sound: { groups: [notes] }, reveal: sym,
      };
    },
  },
  // ---------------- MAPEAMENTO: braço ----------------
  {
    id: 'braco-nota', title: 'Nota no braço', desc: 'Qual é a nota da casa marcada?', area: 'mapeamento', group: 'braco', mobile: true,
    settings: [{ ...INST, options: [{ id: 'auto', label: 'O do meu perfil' }, ...INST.options!] }, FRETS], defaults: { instrumento: 'auto', casas: '0-5' },
    make(s, ctx) {
      const tuning = tuningOf(s, ctx);
      const [from, to] = fretRange(s);
      const str = randInt(0, tuning.length - 1);
      const f = randInt(from === 0 ? 0 : from + 1, to);
      const m = tuning[str] + f;
      return {
        prompt: 'Que nota é essa?', visual: { kind: 'fretboard', tuning, from, to, marks: [{ s: str, f }] },
        answer: { kind: 'choice', options: pcOptions(ctx.naming), correct: String(m % 12) },
        sound: { groups: [[m]], voice: tuning.length === 4 ? 'baixo' : 'violao' }, reveal: pcName(m, ctx.naming),
      };
    },
  },
  {
    id: 'braco-ache', title: 'Ache no braço', desc: 'Toque a nota pedida na corda indicada.', area: 'mapeamento', group: 'braco', mobile: true,
    settings: [{ ...INST, options: [{ id: 'auto', label: 'O do meu perfil' }, ...INST.options!] }, FRETS], defaults: { instrumento: 'auto', casas: '0-12' },
    make(s, ctx) {
      const tuning = tuningOf(s, ctx);
      const [from, to] = fretRange(s);
      const str = randInt(0, tuning.length - 1);
      const f = randInt(from === 0 ? 0 : from + 1, to);
      const m = tuning[str] + f;
      const names = tuning.length === 4 ? ['Mi', 'Lá', 'Ré', 'Sol'] : ['Mi grave', 'Lá', 'Ré', 'Sol', 'Si', 'Mi aguda'];
      return {
        prompt: `Toque ${pcName(m, ctx.naming, false)} na corda ${names[str]}`, visual: { kind: 'text', text: '' },
        answer: { kind: 'fret', tuning, from, to, correctPc: m % 12, onlyString: str },
        sound: { groups: [[m]], voice: tuning.length === 4 ? 'baixo' : 'violao' }, reveal: `${pcName(m, ctx.naming)} na casa ${f}`,
      };
    },
  },
  {
    id: 'braco-intervalo', title: 'Geometria dos intervalos', desc: 'Que intervalo formam as duas casas?', area: 'mapeamento', group: 'braco', mobile: true,
    settings: [{ ...INST, options: [{ id: 'auto', label: 'O do meu perfil' }, ...INST.options!] }], defaults: { instrumento: 'auto' },
    make(s, ctx) {
      const tuning = tuningOf(s, ctx);
      const s1 = randInt(0, tuning.length - 2);
      const f1 = randInt(1, 6);
      let s2: number, f2: number, d: number;
      do {
        s2 = Math.min(tuning.length - 1, s1 + randInt(0, 2));
        f2 = Math.max(0, f1 + randInt(-2, 4));
        d = tuning[s2] + f2 - (tuning[s1] + f1);
      } while (d < 1 || d > 12);
      const lo = tuning[s1] + f1;
      return {
        prompt: 'Que intervalo é esse?', visual: { kind: 'fretboard', tuning, from: 0, to: 9, marks: [{ s: s1, f: f1, label: '1' }, { s: s2, f: f2, color: 'var(--ve)' }] },
        answer: { kind: 'choice', options: SEMI_OPTIONS, correct: String(d) },
        sound: { groups: [[lo], [lo + d]], voice: tuning.length === 4 ? 'baixo' : 'violao' }, reveal: SEMI_NAMES[d],
      };
    },
  },
  {
    id: 'acorde-visual', title: 'Reconheça o acorde', desc: 'Leia o desenho do acorde no violão ou no piano.', area: 'mapeamento', group: 'braco', mobile: true,
    settings: [{ id: 'onde', label: 'Instrumento', type: 'single', options: [{ id: 'violao', label: 'Violão' }, { id: 'piano', label: 'Piano' }] },
      { id: 'formas', label: 'Formas', type: 'single', options: [{ id: 'abertos', label: 'Acordes abertos' }, { id: 'pestana', label: 'Pestanas' }, { id: 'todos', label: 'Todos' }] }],
    defaults: { onde: 'violao', formas: 'abertos' },
    make(s) {
      return s.onde === 'piano' ? pianoChordQuestion() : guitarChordQuestion(String(s.formas ?? 'abertos'));
    },
  },
  // ---------------- OUVIDO ----------------
  {
    id: 'ouvido-tecla', title: 'Que nota tocou?', desc: 'Ouça e toque a tecla certa.', area: 'ouvido', group: 'ouvido', mobile: true,
    settings: [{ id: 'referencia', label: 'Tocar Dó de referência antes', type: 'toggle' }, { id: 'pretas', label: 'Incluir teclas pretas', type: 'toggle' }],
    defaults: { referencia: true, pretas: false },
    make(s, ctx) {
      let p: number;
      do p = randInt(0, 11); while (!s.pretas && [1, 3, 6, 8, 10].includes(p));
      const m = 60 + p;
      return {
        prompt: s.referencia ? 'Primeiro um Dó, depois a nota. Qual é ela?' : 'Qual nota tocou?', visual: { kind: 'ear' },
        answer: { kind: 'key', lo: 60, hi: 71, correctPc: p }, sound: { groups: s.referencia ? [[60], [m]] : [[m]], gap: 0.9 }, autoplay: true,
        reveal: pcName(m, ctx.naming),
      };
    },
  },
  {
    id: 'ouvido-intervalo', title: 'Intervalos de ouvido', desc: 'Ouça e reconheça o intervalo.', area: 'ouvido', group: 'ouvido', mobile: true,
    settings: [{ id: 'intervalos', label: 'Intervalos', type: 'multi', options: SEMI_NAMES.slice(1).map((l, i) => ({ id: String(i + 1), label: l })) },
      { id: 'direcao', label: 'Direção', type: 'single', options: [{ id: 'sobe', label: 'Subindo' }, { id: 'desce', label: 'Descendo' }, { id: 'juntas', label: 'Juntas' }, { id: 'misto', label: 'Misturado' }] }],
    defaults: { intervalos: ['3', '4', '5', '7', '12'], direcao: 'sobe' },
    make(s) {
      const ids = arr(s.intervalos, ['4', '7']);
      const d = Number(pick(ids));
      const base = randInt(52, 67);
      const dir = s.direcao === 'misto' ? pick(['sobe', 'desce', 'juntas']) : s.direcao;
      const groups = dir === 'juntas' ? [[base, base + d]] : dir === 'desce' ? [[base + d], [base]] : [[base], [base + d]];
      return {
        prompt: 'Que intervalo você ouviu?', visual: { kind: 'ear', hint: dir === 'juntas' ? 'notas juntas' : dir === 'desce' ? 'descendo' : 'subindo' },
        answer: { kind: 'choice', options: ids.map(i => ({ id: i, label: SEMI_NAMES[Number(i)] })), correct: String(d) },
        sound: { groups }, autoplay: true, reveal: SEMI_NAMES[d],
      };
    },
  },
  {
    id: 'ouvido-acorde', title: 'Acordes de ouvido', desc: 'Maior, menor, diminuto... de ouvido.', area: 'ouvido', group: 'ouvido', mobile: true,
    settings: [{ id: 'tipos', label: 'Tipos', type: 'multi', options: (Object.keys(CHORDS) as ChordId[]).map(c => ({ id: c, label: CHORDS[c].name })) },
      { id: 'arpejo', label: 'Arpejar antes', type: 'toggle' }],
    defaults: { tipos: ['maior', 'menor'], arpejo: true },
    make(s) {
      const types = arr(s.tipos, ['maior', 'menor']) as ChordId[];
      const type = pick(types);
      const root = randInt(53, 64);
      const ms = CHORDS[type].degs.map(([, semi]) => root + semi);
      return {
        prompt: 'Que tipo de acorde?', visual: { kind: 'ear' },
        answer: { kind: 'choice', options: types.map(t => ({ id: t, label: CHORDS[t].name })), correct: type },
        sound: { groups: s.arpejo ? [...ms.map(m => [m]), ms] : [ms], gap: 0.45 }, autoplay: true, reveal: CHORDS[type].name,
      };
    },
  },
  {
    id: 'ouvido-escala', title: 'Escalas de ouvido', desc: 'Reconheça a escala ou o modo.', area: 'ouvido', group: 'ouvido', mobile: true,
    settings: [{ id: 'tipos', label: 'Escalas', type: 'multi', options: (Object.keys(SCALES) as ScaleId[]).map(k => ({ id: k, label: SCALES[k].name })) }],
    defaults: { tipos: ['maior', 'menor', 'menor-harmonica'] },
    make(s) {
      const types = arr(s.tipos, ['maior', 'menor']) as ScaleId[];
      const type = pick(types);
      const tonic = randInt(55, 62);
      const ms = [...SCALES[type].degs.map(([, semi]) => tonic + semi), tonic + 12];
      return {
        prompt: 'Que escala é essa?', visual: { kind: 'ear' },
        answer: { kind: 'choice', options: types.map(t => ({ id: t, label: SCALES[t].name })), correct: type, wide: true },
        sound: { groups: ms.map(m => [m]), gap: 0.3 }, autoplay: true, reveal: SCALES[type].name,
      };
    },
  },
  {
    id: 'ouvido-celulas', title: 'Células pentatônicas', desc: 'Ouça a tônica e depois três notas da pentatônica. Quais graus?', area: 'ouvido', group: 'ouvido', mobile: true,
    settings: [{ id: 'escala', label: 'Pentatônica', type: 'single', options: [{ id: 'maior', label: 'Maior (1 2 3 5 6)' }, { id: 'menor', label: 'Menor (1 ♭3 4 5 ♭7)' }] },
      { id: 'tamanho', label: 'Notas por célula', type: 'single', options: [{ id: '3', label: '3' }, { id: '4', label: '4' }] }],
    defaults: { escala: 'maior', tamanho: '3' },
    make(s) {
      const minor = s.escala === 'menor';
      const degs = minor ? ['1', '♭3', '4', '5', '♭7', "1'"] : ['1', '2', '3', '5', '6', "1'"];
      const semis = minor ? [0, 3, 5, 7, 10, 12] : [0, 2, 4, 7, 9, 12];
      const size = Number(s.tamanho ?? 3);
      const cell = () => {
        const out: number[] = [randInt(0, 5)];
        while (out.length < size) out.push(Math.max(0, Math.min(5, out[out.length - 1] + pick([-2, -1, 1, 2]))));
        return out;
      };
      const c = cell();
      const key = (x: number[]) => x.map(i => degs[i]).join(' ');
      const others = new Set<string>();
      while (others.size < 3) { const o = key(cell()); if (o !== key(c)) others.add(o); }
      const tonic = randInt(57, 64);
      const triad = minor ? [tonic, tonic + 3, tonic + 7] : [tonic, tonic + 4, tonic + 7];
      return {
        prompt: 'Que graus você ouviu depois da tônica?', visual: { kind: 'ear', hint: 'primeiro o acorde da tônica' },
        answer: { kind: 'choice', options: shuffle([key(c), ...others]).map(o => ({ id: o, label: o })), correct: key(c) },
        sound: { groups: [triad, ...c.map(i => [tonic + semis[i]])], gap: 0.55 }, autoplay: true, reveal: key(c),
      };
    },
  },
  // ---------------- RITMO ----------------
  {
    id: 'ritmo-ouvido', title: 'Que ritmo é esse?', desc: 'Ouça um compasso e escolha a escrita certa. Dá para batucar junto.', area: 'ritmo', group: 'ritmo', mobile: true,
    settings: [{ id: 'nivel', label: 'Figuras', type: 'single', options: RHYTHM_PRESETS.map(p => ({ id: p.id, label: p.name })) }],
    defaults: { nivel: 'duas' },
    make(s) {
      const cells = (RHYTHM_PRESETS.find(p => p.id === s.nivel) ?? RHYTHM_PRESETS[0]).cells;
      const bar = randomBars(cells, 1);
      const key = (b: CellId[][]) => b[0].join('|');
      const others = new Map<string, CellId[][]>();
      for (let tries = 0; others.size < 3 && tries < 60; tries++) { const o = randomBars(cells, 1); if (key(o) !== key(bar)) others.set(key(o), o); }
      const opts = shuffle([{ id: key(bar), label: '', rhythm: bar }, ...[...others].map(([k, b]) => ({ id: k, label: '', rhythm: b }))]);
      const onsets: number[] = [];
      let t = 0;
      bar[0].forEach(c => CELLS[c].events.forEach(ev => { if (!ev.rest) onsets.push(t); t += ev.d; }));
      return {
        prompt: 'Qual destes ritmos tocou?', visual: { kind: 'ear', hint: 'quatro cliques de contagem antes' },
        answer: { kind: 'choice', options: opts, correct: key(bar), wide: true },
        sound: { groups: [], drums: onsets, bpm: 84 }, autoplay: true, reveal: 'a opção destacada',
      };
    },
  },
];

export const exerciseById = Object.fromEntries(EXERCISES.map(e => [e.id, e])) as Record<string, ExerciseDef>;

// =====================================================================
// Quiz de teoria: perguntas geradas
// =====================================================================
function theoryQuestion(topic: string, ctx: Ctx): Question {
  const nm = (n: Pick<Note, 'letter' | 'acc'>) => noteName(n, ctx.naming);
  const keyPool = Array.from({ length: 13 }, (_, i) => i - 6);
  const text = (q: string, opts: string[], correct: string, reveal = correct, wide = false): Question => ({
    prompt: q, visual: { kind: 'text', text: q }, answer: { kind: 'choice', options: opts.map(o => ({ id: o, label: o })), correct, wide }, reveal,
  });
  const notePool = (exclude: string) => ROOTS.map(r => nm(r)).filter(x => x !== exclude);

  if (topic === 'graus') {
    const f = pick(keyPool);
    const tonic = majorTonic(f);
    const scale = buildScale(tonic, 'maior');
    if (Math.random() < 0.5) {
      const d = randInt(2, 7);
      const ans = nm(scale[d - 1]);
      return text(`Qual é o ${d}º grau de ${nm(tonic)} maior?`, optionsWith(ans, notePool(ans), 6), ans);
    }
    const d = randInt(2, 7);
    return text(`A nota ${nm(scale[d - 1])} é qual grau de ${nm(tonic)} maior?`, ['1º', '2º', '3º', '4º', '5º', '6º', '7º'], `${d}º`);
  }
  if (topic === 'modos') {
    if (Math.random() < 0.5) {
      const mode = pick(MODES);
      const tonic = pick(ROOTS);
      const d = pick([2, 3, 6, 7]);
      const ans = nm(buildScale(tonic, mode.id)[d - 1]);
      // as distratoras mais traiçoeiras: a versão maior e a menor do mesmo grau
      const maj = nm(transpose(tonic, { num: d, semis: semisFor(d, 'M') }));
      const min = nm(transpose(tonic, { num: d, semis: semisFor(d, 'm') }));
      const pool = [...new Set([maj, min, ...shuffle(notePool(ans))])].filter(x => x !== ans).slice(0, 5);
      return text(`Qual é a ${d}ª de ${nm(tonic)} no modo ${mode.name}?`, shuffle([ans, ...pool]), ans);
    }
    const label = (id: ScaleId, i: number) => {
      const [num, semi] = SCALES[id].degs[i];
      const diff = semi - SCALES.maior.degs[i][1];
      return (diff < 0 ? '♭' : diff > 0 ? '♯' : '') + num;
    };
    const pairs: [ScaleId, ScaleId][] = [];
    MODES.forEach(a => MODES.forEach(b => {
      if (a.id === b.id) return;
      const diffs = SCALES[a.id].degs.filter((d, i) => d[1] !== SCALES[b.id].degs[i][1]);
      if (diffs.length === 1) pairs.push([a.id, b.id]);
    }));
    const [a, b] = pick(pairs);
    const i = SCALES[a].degs.findIndex((d, k) => d[1] !== SCALES[b].degs[k][1]);
    const ans = label(a, i);
    const name = (id: ScaleId) => MODES.find(m => m.id === id)!.name;
    const pool = ['♭2', '2', '♭3', '3', '4', '♯4', '♭5', '5', '♭6', '6', '♭7', '7'];
    return text(`Que grau o modo ${name(a)} tem e o ${name(b)} não tem?`, optionsWith(ans, pool, 5), ans);
  }
  if (topic === 'acordes') {
    const root = pick(ROOTS);
    const type = pick(['maior', 'menor', '7', 'm7', '7M', 'm7b5', 'dim'] as ChordId[]);
    const notes = buildChord(root, type);
    if (Math.random() < 0.4) {
      const third = nm(notes[1]);
      const sym = chordSymbol(root, type);
      return text(`Qual é a terça de ${sym}?`, optionsWith(third, notePool(third), 6), third);
    }
    const fmt = (ns: Note[]) => ns.map(nm).join(' – ');
    const ans = fmt(notes);
    // Para cada nota (menos a fundamental), tenta as duas direções de acidente; em acordes com
    // acidentes extremos (ex.: b5 soletrado como dobrado-bemol) só uma direção é válida, então
    // sortear a direção ao acaso às vezes não achava nenhuma em 20 tentativas (teste instável).
    const wrongs = new Set<string>();
    for (const i of shuffle([...notes.keys()].slice(1))) {
      if (wrongs.size >= 3) break;
      for (const d of shuffle([1, -1])) {
        const alt = notes.map((n, j) => (j === i ? { ...n, acc: n.acc + d } : n));
        if (alt.every(n => Math.abs(n.acc) <= 1)) { wrongs.add(fmt(alt)); break; }
      }
    }
    return text(`Quais notas formam ${chordSymbol(root, type)}?`, shuffle([ans, ...wrongs]), ans, ans, true);
  }
  if (topic === 'campo') {
    const f = pick(keyPool);
    const tonic = majorTonic(f);
    const field = harmonicField(tonic, 'maior', Math.random() < 0.5);
    const d = pick(field);
    const pool = [...field.map(x => x.symbol), ...field.map(x => chordSymbol(x.root, x.chord === 'maior' ? 'menor' : x.chord === 'menor' ? 'maior' : '7'))];
    return text(`Em ${nm(tonic)} maior, qual é o acorde do grau ${d.roman}?`, optionsWith(d.symbol, [...new Set(pool)], 6), d.symbol);
  }
  if (topic === 'sub5') {
    const f = pick(keyPool);
    const tonic = majorTonic(f);
    const v = transpose(tonic, { num: 5, semis: 7 });
    const sub = transpose(tonic, { num: 2, semis: 1 });
    const ans = chordSymbol(sub, '7');
    const pool = [chordSymbol(v, '7'), chordSymbol(transpose(tonic, { num: 4, semis: 5 }), '7'), chordSymbol(transpose(tonic, { num: 7, semis: 10 }), '7'), chordSymbol(transpose(tonic, { num: 6, semis: 8 }), '7'), chordSymbol(transpose(tonic, { num: 3, semis: 3 }), '7')];
    return text(`Na preparação para ${chordSymbol(tonic, 'maior')}, qual é o substituto trítono (sub5) do dominante?`, optionsWith(ans, pool, 5), ans, `${ans} (no lugar de ${chordSymbol(v, '7')})`);
  }
  // tonalidades
  const f = pick(keyPool.filter(x => x !== 0));
  const tonic = majorTonic(f);
  if (Math.random() < 0.5) {
    const ans = nm(relativeMinor(f));
    return text(`Qual é o relativo menor de ${nm(tonic)} maior?`, optionsWith(ans, keyPool.map(k => nm(relativeMinor(k))), 6), ans, `${ans} menor`);
  }
  const accLabel = (k: number) => (k === 0 ? 'nenhum' : `${Math.abs(k)} ${k > 0 ? (Math.abs(k) > 1 ? 'sustenidos' : 'sustenido') : Math.abs(k) > 1 ? 'bemóis' : 'bemol'}`);
  return text(`Quantos acidentes tem ${nm(tonic)} maior?`, optionsWith(accLabel(f), keyPool.map(accLabel), 6), accLabel(f));
}

// ---------------- acordes desenhados ----------------
type Shape = (number | null)[];
const OPEN: { root: Note; type: ChordId; frets: Shape }[] = [
  { root: note(0), type: 'maior', frets: [null, 3, 2, 0, 1, 0] }, { root: note(4), type: 'maior', frets: [3, 2, 0, 0, 0, 3] },
  { root: note(1), type: 'maior', frets: [null, null, 0, 2, 3, 2] }, { root: note(5), type: 'maior', frets: [null, 0, 2, 2, 2, 0] },
  { root: note(2), type: 'maior', frets: [0, 2, 2, 1, 0, 0] }, { root: note(5), type: 'menor', frets: [null, 0, 2, 2, 1, 0] },
  { root: note(2), type: 'menor', frets: [0, 2, 2, 0, 0, 0] }, { root: note(1), type: 'menor', frets: [null, null, 0, 2, 3, 1] },
  { root: note(2), type: '7', frets: [0, 2, 0, 1, 0, 0] }, { root: note(5), type: '7', frets: [null, 0, 2, 0, 2, 0] },
  { root: note(1), type: '7', frets: [null, null, 0, 2, 1, 2] }, { root: note(5), type: 'm7', frets: [null, 0, 2, 0, 1, 0] },
  { root: note(2), type: 'm7', frets: [0, 2, 0, 0, 0, 0] }, { root: note(0), type: '7M', frets: [null, 3, 2, 0, 0, 0] },
  { root: note(0), type: '7', frets: [null, 3, 2, 3, 1, 0] }, { root: note(1), type: '7M', frets: [null, null, 0, 2, 2, 2] },
];
const E_FORM: Partial<Record<ChordId, (r: number) => Shape>> = {
  maior: r => [r, r + 2, r + 2, r + 1, r, r], menor: r => [r, r + 2, r + 2, r, r, r], '7': r => [r, r + 2, r, r + 1, r, r],
  m7: r => [r, r + 2, r, r, r, r], '7M': r => [r, null, r + 1, r + 1, r, null],
};
const A_FORM: Partial<Record<ChordId, (r: number) => Shape>> = {
  maior: r => [null, r, r + 2, r + 2, r + 2, r], menor: r => [null, r, r + 2, r + 2, r + 1, r], '7': r => [null, r, r + 2, r, r + 2, r],
  m7: r => [null, r, r + 2, r, r + 1, r], '7M': r => [null, r, r + 2, r + 1, r + 2, r],
};
function chordOptions(root: Note, type: ChordId) {
  const sym = chordSymbol(root, type);
  const types: ChordId[] = ['maior', 'menor', '7', 'm7', '7M'];
  const pool = [...types.map(t => chordSymbol(root, t)), ...shuffle(ROOTS).slice(0, 5).map(r => chordSymbol(r, type))];
  return { sym, options: optionsWith(sym, [...new Set(pool)], 6).map(o => ({ id: o, label: o })) };
}
function guitarChordQuestion(forms: string): Question {
  const tuning = TUNINGS.violao;
  let root: Note, type: ChordId, frets: Shape;
  if (forms === 'abertos' || (forms === 'todos' && Math.random() < 0.4)) {
    ({ root, type, frets } = pick(OPEN));
  } else {
    type = pick(['maior', 'menor', '7', 'm7', '7M'] as ChordId[]);
    const useE = Math.random() < 0.5;
    const r = randInt(1, 8);
    frets = (useE ? E_FORM : A_FORM)[type]!(r);
    root = spellPc(tuning[useE ? 0 : 1] + r);
  }
  const played = frets.map((f, s) => (f === null ? null : tuning[s] + f)).filter((m): m is number => m !== null);
  const used = frets.filter((f): f is number => f !== null && f > 0);
  const from = used.length && Math.min(...used) > 3 ? Math.min(...used) - 1 : 0;
  const { sym, options } = chordOptions(root, type);
  return {
    prompt: 'Que acorde é esse?',
    visual: { kind: 'fretboard', tuning, from, to: from + 5, marks: frets.flatMap((f, s) => (f === null ? [] : [{ s, f, color: f === 0 ? 'var(--cream)' : undefined }])), muted: frets.flatMap((f, s) => (f === null ? [s] : [])) },
    answer: { kind: 'choice', options, correct: sym }, sound: { groups: [played], arp: 0.04, voice: 'violao' }, reveal: sym,
  };
}
function pianoChordQuestion(): Question {
  const type = pick(['maior', 'menor', '7', 'm7', '7M'] as ChordId[]);
  const root = { ...pick(ROOTS), oct: 4 };
  const ms = buildChord(root, type).map(midi);
  const { sym, options } = chordOptions(root, type);
  return { prompt: 'Que acorde é esse?', visual: { kind: 'keyboard', lo: 48, hi: 83, marks: ms }, answer: { kind: 'choice', options, correct: sym }, sound: { groups: [ms] }, reveal: sym };
}
