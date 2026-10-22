import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Comunidade from './pages/Comunidade';
import Estudar, { GenrePage, ModulePage } from './pages/Estudar';
import Hoje from './pages/Hoje';
import Mentor from './pages/Mentor';
import Onboarding from './pages/Onboarding';
import Perfil from './pages/Perfil';
import Progresso from './pages/Progresso';
import Sessao from './pages/Sessao';
import Treinar, { ExercisePage, ToolPage } from './pages/Treinar';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/comecar" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route index element={<Hoje />} />
          <Route path="sessao" element={<Sessao />} />
          <Route path="treinar" element={<Treinar />} />
          <Route path="treinar/:id" element={<ExercisePage />} />
          <Route path="ferramentas/:id" element={<ToolPage />} />
          <Route path="estudar" element={<Estudar />} />
          <Route path="estudar/genero/:id" element={<GenrePage />} />
          <Route path="estudar/:id" element={<ModulePage />} />
          <Route path="progresso" element={<Progresso />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="comunidade" element={<Comunidade />} />
          <Route path="mentor" element={<Mentor />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
