// Ações de conta: entrar (link mágico, Google, Apple), sair e apagar a conta.
// A sincronização do progresso (migrar o localStorage para a conta, resolver conflitos) é a
// B2, ainda não existe aqui — login só cria/atualiza a linha de perfil (nome, instrumento,
// data de nascimento e faixa etária).
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { ageFromBirthdate, ageGroupFor, type AgeGroup } from './age';
import { getState, setAccount, setAgeGroup } from './store';

export { isSupabaseConfigured };

/** Calcula a faixa etária a partir da data de nascimento. 'under13' nunca deve virar conta. */
export function checkBirthdate(birthdate: string): AgeGroup | 'under13' {
  return ageGroupFor(ageFromBirthdate(birthdate));
}

// Link mágico e OAuth recarregam a página (ou voltam de outro site) antes da sessão chegar, o
// que apaga qualquer estado em memória do React. Por isso a data de nascimento, já confirmada
// como 13+ na hora do clique, fica guardada aqui só até o primeiro login completar.
const PENDING_KEY = 'clave:pending-birthdate';
export function rememberBirthdateForSignIn(birthdate: string) {
  try { sessionStorage.setItem(PENDING_KEY, birthdate); } catch { /* sem sessionStorage: segue sem lembrar */ }
}

/** Liga o listener de sessão. Chamar uma vez, no início do app (ver src/main.tsx). */
export function initAccount() {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    setAccount(user ? { userId: user.id, email: user.email ?? null } : null);
    if (event === 'SIGNED_IN' && user) {
      let pending: string | null = null;
      try { pending = sessionStorage.getItem(PENDING_KEY); } catch { /* ignora */ }
      upsertProfileAfterSignIn(pending ?? undefined)
        .then(() => { try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignora */ } })
        .catch(() => { /* perfil se atualiza de novo no próximo login; não trava a UI */ });
    }
  });
  supabase.auth.getSession().then(({ data }) => {
    const user = data.session?.user;
    setAccount(user ? { userId: user.id, email: user.email ?? null } : null);
  });
}

function assertConfigured() {
  if (!supabase) throw new Error('Conta ainda não está configurada neste build (faltam as chaves do Supabase).');
  return supabase;
}

/** Envia o link mágico por e-mail. `ageGroup` só é passado em contas novas (ver AccountPanel). */
export async function signInWithEmail(email: string) {
  const client = assertConfigured();
  const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  if (error) throw error;
}

export async function signInWithProvider(provider: 'google' | 'apple') {
  const client = assertConfigured();
  const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  setAccount(null);
}

/**
 * Depois que a sessão chega (link mágico clicado, ou volta do Google/Apple), grava o perfil
 * mínimo. Chamado automaticamente pelo listener do initAccount a cada novo login; `birthdate`
 * só vem preenchida no primeiro login (ver rememberBirthdateForSignIn) — nos logins seguintes,
 * atualiza só nome/instrumento e não mexe na data de nascimento já salva no servidor.
 */
export async function upsertProfileAfterSignIn(birthdate?: string) {
  const client = assertConfigured();
  const { data } = await client.auth.getUser();
  const user = data.user;
  if (!user) throw new Error('Sem sessão: entre antes de salvar o perfil.');
  const { profile } = getState();
  const group = birthdate ? checkBirthdate(birthdate) : null;
  if (group === 'under13') throw new Error('Menores de 13 anos não criam conta.');
  const row: Record<string, unknown> = {
    user_id: user.id,
    name: profile.name,
    instrument: profile.instrument,
    goals: profile.goals,
  };
  // As colunas kind e levels do servidor ficaram sem uso (têm valor padrão); não são mais enviadas.
  if (birthdate) { row.birthdate = birthdate; row.age_group = group; }
  const { error } = await client.from('profiles').upsert(row);
  if (error) throw error;
  if (group) setAgeGroup(group);
}

/** Apaga a conta e todos os dados do servidor (exigência da Apple: de dentro do app). */
export async function deleteAccount() {
  const client = assertConfigured();
  const { error } = await client.rpc('delete_my_account');
  if (error) throw error;
  await client.auth.signOut();
  setAccount(null);
}
