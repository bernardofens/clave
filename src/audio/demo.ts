// Som de demonstração para o Perfil: quem escolhe um timbre ou o volume ouve na hora como fica.
import type { Voice } from './engine';
import { DEFAULT_PRESENTATION, playContent, resolvePresentation } from './presentation';

/** Toca um acorde de dó maior, arpejado e depois junto, no timbre dado e no volume dos exercícios
 *  (1 = 100%, o padrão). Devolve a duração. */
export function playDemo(voice: Voice, volume: number): number {
  // o baixo e o violão soam numa região mais grave; o resto, perto do dó central
  const base = voice === 'baixo' ? 36 : voice === 'violao' ? 52 : 60;
  return playContent(
    { groups: [[base, base + 4, base + 7]] },
    resolvePresentation([{ voice, volume: volume * DEFAULT_PRESENTATION.volume, chord: 'arpeggio-block', gap: 0.2, dur: 0.9 }]),
  );
}
