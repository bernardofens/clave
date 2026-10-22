import type { AreaId, Instrument } from '../data/areas';
import type { Clef, Naming, Note } from '../theory/core';
import type { CellId } from '../theory/rhythm';
import type { FretMark } from '../components/music/Fretboard';

export type Visual =
  | { kind: 'staff'; clef: Clef; fifths?: number; columns: Note[][] }
  | { kind: 'keyboard'; lo: number; hi: number; marks: number[] }
  | { kind: 'fretboard'; tuning: readonly number[]; from: number; to: number; marks: FretMark[]; muted?: number[] }
  | { kind: 'ear'; hint?: string }
  | { kind: 'text'; text: string };

export interface ChoiceOption {
  id: string;
  label: string;
  rhythm?: CellId[][];
}
export type Answer =
  | { kind: 'choice'; options: ChoiceOption[]; correct: string; wide?: boolean }
  | { kind: 'spelled'; correct: { letter: number; acc: number }; accidentals: boolean }
  | { kind: 'key'; lo: number; hi: number; correctPc: number }
  | { kind: 'fret'; tuning: readonly number[]; from: number; to: number; correctPc: number; onlyString?: number }
  | { kind: 'staff'; clef: Clef; correct: Note; accidentals: boolean };

export interface Sound {
  groups: number[][]; // grupos de alturas MIDI, tocados em sequência
  gap?: number;
  arp?: number;
  voice?: 'piano' | 'violao' | 'baixo';
  drums?: number[]; // ataques em tempos (para ritmo)
  bpm?: number;
}

export interface Question {
  prompt: string;
  visual: Visual;
  answer: Answer;
  sound?: Sound; // tocado ao mostrar (ouvido) ou ao responder (visual)
  autoplay?: boolean;
  reveal: string; // a resposta certa, por extenso
}

export type SettingValue = string | string[] | boolean;
export interface Setting {
  id: string;
  label: string;
  type: 'single' | 'multi' | 'toggle';
  options?: { id: string; label: string }[];
}
export interface Ctx {
  naming: Naming;
  instrument: Instrument;
}

export type GroupId = 'pauta' | 'teclado' | 'braco' | 'ouvido' | 'teoria' | 'ritmo';
export const GROUPS: Record<GroupId, string> = {
  pauta: 'Pauta', teclado: 'Teclado', braco: 'Braço', ouvido: 'Ouvido', teoria: 'Teoria', ritmo: 'Ritmo',
};

export interface ExerciseDef {
  id: string;
  title: string;
  desc: string;
  area: AreaId;
  group: GroupId;
  /** Dá para fazer sem o instrumento (no ônibus, por exemplo). */
  mobile: boolean;
  settings: Setting[];
  defaults: Record<string, SettingValue>;
  make: (s: Record<string, SettingValue>, ctx: Ctx) => Question;
}

export interface ToolDef {
  id: string;
  title: string;
  desc: string;
  area: AreaId;
  mobile: boolean;
  path: string;
  art: string;
}
