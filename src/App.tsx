import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Comunidade from './pages/Comunidade';
import Estudar, { GenrePage, LessonPage } from './pages/Estudar';
import Hoje from './pages/Hoje';
import Mentor from './pages/Mentor';
import Onboarding from './pages/Onboarding';
import Perfil from './pages/Perfil';
import Progresso from './pages/Progresso';
import Rotinas from './pages/Rotinas';
import { ROUTINES_READY } from './components/nav';
import Sessao from './pages/Sessao';
import Treinar, { ExercisePage, ToolPage } from './pages/Treinar';
import NotFound from './pages/NotFound';
import Objetivo from './pages/Objetivo';
import { localeTag, useLocale } from './i18n';

export default function App() {
  const locale = useLocale();
  useEffect(() => { document.documentElement.lang = localeTag(locale); }, [locale]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/comecar" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route index element={<Hoje />} />
          <Route path="sessao" element={<Sessao />} />
          <Route path="treinar" element={<Treinar />} />
          <Route path="treinar/objetivo/:id" element={<Objetivo />} />
          <Route path="treinar/:id" element={<ExercisePage />} />
          <Route path="ferramentas/:id" element={<ToolPage />} />
          <Route path="estudar" element={<Estudar />} />
          <Route path="estudar/genero/:id" element={<GenrePage />} />
          <Route path="estudar/:id" element={<LessonPage />} />
          <Route path="progresso" element={<Progresso />} />
          {ROUTINES_READY && <Route path="rotinas" element={<Rotinas />} />}
          <Route path="perfil" element={<Perfil />} />
          <Route path="comunidade" element={<Comunidade />} />
          <Route path="mentor" element={<Mentor />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
