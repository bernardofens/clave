// A tela de um objetivo (decisão 7): junta, num lugar só, as aulas, os exercícios e as ferramentas que
// levam a ele, sejam de que módulo forem, e já na versão do instrumento da pessoa.
import { Link, useParams } from 'react-router-dom';
import { ExerciseCard, LessonCard, ToolCard } from '../components/cards';
import { Chip, PageHead, SecTitle } from '../components/ui';
import { goalById, goalItems, type GoalId } from '../data/goals';
import { useContent } from '../data/localized';
import { exerciseById } from '../exercises/catalog';
import { toolById } from '../exercises/tools';
import { useT } from '../i18n';
import { updateProfile, useStore } from '../state/store';
import NotFound from './NotFound';

export default function Objetivo() {
  const { id = '' } = useParams();
  const t = useT();
  const { GOALS, goalLabel, INSTRUMENTS, lessonById, moduleById } = useContent();
  const instrument = useStore(s => s.profile.instrument);
  const goal = goalById[id as GoalId];
  if (!goal) return <NotFound />;
  const { exercises, tools, lessons } = goalItems(goal, instrument);
  const text = GOALS.find(g => g.id === goal.id)!;
  // o instrumento só aparece quando ele muda o que o objetivo mostra
  const dependsOnInstrument = !!goal.byInstrument;
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Link to="/treinar" className="eyebrow" style={{ textDecoration: 'none' }}>{t('train.back')}</Link>
      <PageHead tag={t('goal.tag')} title={goalLabel(goal.id, instrument)} sub={text.hint} />
      {dependsOnInstrument && (
        <div className="row" role="group" aria-label={t('goal.instrument')}>
          <span className="eyebrow">{t('goal.instrument')}</span>
          {INSTRUMENTS.map(i => <Chip key={i.id} on={instrument === i.id} onClick={() => updateProfile({ instrument: i.id })}>{i.name}</Chip>)}
        </div>
      )}
      {lessons.length > 0 && (
        <section>
          <SecTitle>{t('train.lessons')}</SecTitle>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {lessons.map(lid => <LessonCard key={lid} id={lid} color={moduleById[lessonById[lid].primaryModule].color} />)}
          </div>
        </section>
      )}
      {exercises.length > 0 && (
        <section>
          <SecTitle>{t('goal.exercises')}</SecTitle>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {exercises.map(eid => <ExerciseCard key={eid} id={eid} color={moduleById[exerciseById[eid].primaryModule].color} />)}
          </div>
        </section>
      )}
      {tools.length > 0 && (
        <section>
          <SecTitle>{t('goal.tools')}</SecTitle>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {tools.map(tid => <ToolCard key={tid} id={tid} color={moduleById[toolById[tid].primaryModule].color} />)}
          </div>
        </section>
      )}
    </div>
  );
}
