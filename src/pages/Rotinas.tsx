// Rotinas: lista de exercícios em sequência (decisão 8). A D3 constrói o executor e os presets; por
// enquanto a página só existe quando ROUTINES_READY (src/components/nav.ts) estiver ligado.
import { PageHead } from '../components/ui';
import { useT } from '../i18n';

export default function Rotinas() {
  const t = useT();
  return <PageHead tag={t('routines.tag')} title={t('routines.title')} sub={t('routines.sub')} />;
}
