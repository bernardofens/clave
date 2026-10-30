// Junta a estrutura do conteúdo (src/data, src/state) com os textos do idioma (src/i18n/content.*.ts).
// As telas usam useContent() e recebem áreas, aulas, trilhas, gêneros e medalhas já traduzidos.
import { useLocale, type Locale } from '../i18n';
import enContent from '../i18n/content.en';
import ptContent from '../i18n/content.pt';
import { BADGES } from '../state/store';
import { AREAS, GOALS, INSTRUMENTS, PROFILE_KINDS, type Area, type AreaId } from './areas';
import { GENRES, MODULES, ROADMAPS, TONALITY_STEPS, type Genre, type Module, type Roadmap } from './content';

export const CONTENT_TEXT = { pt: ptContent, en: enContent };

function build(locale: Locale) {
  const tx = CONTENT_TEXT[locale];
  const areas: Area[] = AREAS.map(a => ({ ...a, ...tx.areas[a.id] }));
  const modules: Module[] = MODULES.map(m => ({ ...m, ...tx.modules[m.id as keyof typeof tx.modules] }));
  const roadmaps: Roadmap[] = ROADMAPS.map(({ modules: mods, ...r }) => {
    const rt = tx.roadmaps[r.id as keyof typeof tx.roadmaps];
    const notes = rt.notes as Record<string, string>;
    return { ...r, title: rt.title, sub: rt.sub, steps: mods.map(module => ({ module, note: notes[module] })) };
  });
  const genres: Genre[] = GENRES.map(g => {
    const gt = tx.genres[g.id as keyof typeof tx.genres];
    const sides = gt.sides as Record<string, string>;
    const tracks = gt.tracks as Record<string, string>;
    return {
      ...g, name: gt.name, sub: gt.sub, desc: gt.desc,
      sides: g.sides.map(side => ({ side: sides[side.side], tracks: side.tracks.map(tr => ({ ...tr, title: tracks[tr.id] })) })),
    };
  });
  return {
    AREAS: areas,
    areaById: Object.fromEntries(areas.map(a => [a.id, a])) as Record<AreaId, Area>,
    INSTRUMENTS: INSTRUMENTS.map(i => ({ ...i, name: tx.instruments[i.id] })),
    PROFILE_KINDS: PROFILE_KINDS.map(k => ({ ...k, ...tx.profileKinds[k.id] })),
    GOALS: GOALS.map(g => ({ ...g, name: tx.goals[g.id] })),
    MODULES: modules,
    moduleById: Object.fromEntries(modules.map(m => [m.id, m])) as Record<string, Module>,
    ROADMAPS: roadmaps,
    GENRES: genres,
    genreById: Object.fromEntries(genres.map(g => [g.id, g])) as Record<string, Genre>,
    TONALITY_STEPS: TONALITY_STEPS.map(s => ({
      ...s, group: tx.tonality.groups[s.group as keyof typeof tx.tonality.groups], text: tx.tonality.steps[s.id as keyof typeof tx.tonality.steps],
    })),
    BADGES: BADGES.map(b => ({ ...b, ...tx.badges[b.id] })),
  };
}
export type Content = ReturnType<typeof build>;

const cache: Partial<Record<Locale, Content>> = {};
/** Conteúdo no idioma pedido (montado uma vez por idioma). */
export function contentFor(locale: Locale): Content {
  return (cache[locale] ??= build(locale));
}
export function useContent(): Content {
  return contentFor(useLocale());
}
