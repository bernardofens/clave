// Painel de conta no Perfil: sem conta (padrão) → pede data de nascimento uma vez → link
// mágico/Google/Apple → logado → apagar conta. Tudo opcional: sem Supabase configurado, o
// painel nem aparece, e o app segue 100% local.
import { useState } from 'react';
import { checkBirthdate, deleteAccount, isSupabaseConfigured, rememberBirthdateForSignIn, signInWithEmail, signInWithProvider, signOut } from '../state/account';
import { useStore } from '../state/store';
import { Btn, SecTitle } from './ui';

type Step = 'idade' | 'bloqueado' | 'entrar' | 'enviado';

export default function AccountPanel() {
  const account = useStore(s => s.account);
  const ageGroup = useStore(s => s.ageGroup);
  const [step, setStep] = useState<Step>(ageGroup ? 'entrar' : 'idade');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isSupabaseConfigured) return null;

  if (account) {
    return (
      <section>
        <SecTitle>Conta</SecTitle>
        <div className="panel" style={{ display: 'grid', gap: 12 }}>
          <span>Conectado como <strong>{account.email ?? account.userId}</strong>. O progresso deste navegador continua aqui; a sincronização chega numa próxima etapa.</span>
          <div className="row">
            <Btn small tone="ghost" onClick={() => signOut()}>Sair</Btn>
            {!confirmDelete ? (
              <Btn small tone="ghost" onClick={() => setConfirmDelete(true)}>Apagar minha conta</Btn>
            ) : (
              <div className="row panel" style={{ padding: 12, background: 'var(--ve)' }}>
                <span>Isso apaga a conta e todos os seus dados no servidor. Não dá para desfazer.</span>
                <Btn small tone="ghost" onClick={() => deleteAccount().catch(e => setError(String(e.message ?? e)))}>Apagar tudo</Btn>
                <Btn small tone="mu" onClick={() => setConfirmDelete(false)}>Cancelar</Btn>
              </div>
            )}
          </div>
          {error && <span style={{ color: 'var(--ve)' }}>{error}</span>}
        </div>
      </section>
    );
  }

  const checkAge = () => {
    setError(null);
    if (!birthdate) return;
    const group = checkBirthdate(birthdate);
    if (group === 'under13') { setStep('bloqueado'); return; }
    rememberBirthdateForSignIn(birthdate);
    setStep('entrar');
  };

  const sendMagicLink = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInWithEmail(email);
      setStep('enviado');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const withProvider = async (provider: 'google' | 'apple') => {
    setError(null);
    setBusy(true);
    try {
      await signInWithProvider(provider);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return (
    <section>
      <SecTitle>Conta</SecTitle>
      <div className="panel" style={{ display: 'grid', gap: 14, maxWidth: 420 }}>
        <span>Com conta, seu progresso fica salvo além deste navegador. Continua funcionando sem conta também.</span>

        {step === 'idade' && (
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Data de nascimento</span>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ background: 'var(--bk-3)', border: 0, color: 'var(--cream)', padding: '10px 12px', font: 'inherit', fontSize: 17 }} />
            <Btn small onClick={checkAge} disabled={!birthdate}>Continuar</Btn>
          </label>
        )}

        {step === 'bloqueado' && (
          <span>Contas são só para 13 anos ou mais. Seu progresso continua salvo neste navegador normalmente.</span>
        )}

        {step === 'entrar' && (
          <>
            <div className="row">
              <Btn small onClick={() => withProvider('google')} disabled={busy}>Entrar com Google</Btn>
              <Btn small onClick={() => withProvider('apple')} disabled={busy}>Entrar com Apple</Btn>
            </div>
            <label style={{ display: 'grid', gap: 6 }}>
              <span className="eyebrow">Ou por e-mail (link mágico)</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com"
                style={{ background: 'var(--bk-3)', border: 0, color: 'var(--cream)', padding: '10px 12px', font: 'inherit', fontSize: 17 }} />
              <Btn small onClick={sendMagicLink} disabled={busy || !email}>Enviar link</Btn>
            </label>
          </>
        )}

        {step === 'enviado' && <span>Link enviado para {email}. Abra o e-mail e clique para entrar.</span>}

        {error && <span style={{ color: 'var(--ve)' }}>{error}</span>}
      </div>
    </section>
  );
}
