import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { initAccount } from './state/account';
import { rebuildStats } from './state/store';

initAccount();
// os totais das telas são refeitos a partir do registro de tentativas
void rebuildStats();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
