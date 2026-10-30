import { Art, Btn } from '../components/ui';
import { useT } from '../i18n';

export default function NotFound() {
  const t = useT();
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <Art name="clave-dormindo" style={{ width: 200 }} />
      <div style={{ display: 'grid', gap: 12 }}>
        <h1 style={{ fontSize: 56 }}>{t('notFound.title')}</h1>
        <p className="muted">{t('notFound.text')}</p>
        <div><Btn to="/">{t('common.backHome')}</Btn></div>
      </div>
    </div>
  );
}
