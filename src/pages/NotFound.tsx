import { Art, Btn } from '../components/ui';

export default function NotFound() {
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <Art name="clave-dormindo" style={{ width: 200 }} />
      <div style={{ display: 'grid', gap: 12 }}>
        <h1 style={{ fontSize: 56 }}>Página não encontrada</h1>
        <p className="muted">O Clave procurou e não achou nada nesse endereço.</p>
        <div><Btn to="/">Voltar ao início</Btn></div>
      </div>
    </div>
  );
}
