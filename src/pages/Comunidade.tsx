// Prévia da comunidade: ainda não há servidor, então feed e ranking usam dados de exemplo.
// Os links de treino compartilhado já funcionam de verdade (configurações vão no próprio link).
import { Link } from 'react-router-dom';
import { areaXP } from '../data/session';
import { encodeSettings } from '../exercises/Player';
import type { SettingValue } from '../exercises/types';
import { useStore } from '../state/store';
import { Art, PageHead, SecTitle, Tag } from '../components/ui';

const SAMPLE_POSTS: { who: string; kind: string; text: string; ex?: string; s?: Record<string, SettingValue>; likes: number }[] = [
  { who: 'Marina (exemplo)', kind: 'Baixo · músico', text: 'Montei um treino só com 4ª e 5ª justas, subindo e descendo. Ótimo para quem está começando a tirar linhas de baixo.', ex: 'ouvido-intervalo', s: { intervalos: ['5', '7'], direcao: 'misto' }, likes: 42 },
  { who: 'Caio (exemplo)', kind: 'Violão · hobby', text: 'Semana de Sol maior: terminei o plano de tonalidade. A parte dos arpejos até a casa 5 foi a que mais mudou meu jeito de tocar.', likes: 31 },
  { who: 'Duda (exemplo)', kind: 'Piano · iniciante', text: 'Meu treino de leitura para clave de fá, só com as notas da pauta. Quem estiver aprendendo a mão esquerda, bora.', ex: 'pauta-nota', s: { claves: ['fa'], extensao: 'pauta', acidentes: false }, likes: 18 },
];
const SAMPLE_RANK = [{ who: 'Marina (exemplo)', xp: 1840 }, { who: 'Theo (exemplo)', xp: 1495 }, { who: 'Caio (exemplo)', xp: 1210 }, { who: 'Duda (exemplo)', xp: 640 }];

export default function Comunidade() {
  const stats = useStore(s => s.stats);
  const history = useStore(s => s.history);
  const name = useStore(s => s.profile.name);
  const mine = Object.values(areaXP(stats, history)).reduce((a, b) => a + b, 0);
  const rank = [...SAMPLE_RANK, { who: `${name || 'Você'} (você)`, xp: mine }].sort((a, b) => b.xp - a.xp);

  return (
    <div>
      <PageHead tag="Comunidade · prévia" title="Banda" sub="Um lugar para trocar treinos, mostrar progresso e se ajudar. Esta é uma prévia: as pessoas e posts abaixo são exemplos, mas os links de treino compartilhado já funcionam." aside={<Art name="genero-forro" style={{ width: 150 }} />} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start', gap: 28 }}>
        <section>
          <SecTitle>Feed</SecTitle>
          <div style={{ display: 'grid', gap: 12 }}>
            {SAMPLE_POSTS.map((p, i) => (
              <article key={i} className="panel" style={{ display: 'grid', gap: 10 }}>
                <div className="row"><b>{p.who}</b><span className="muted" style={{ fontSize: 13 }}>{p.kind}</span></div>
                <p>{p.text}</p>
                {p.ex && <Link to={`/treinar/${p.ex}?c=${encodeSettings(p.s!)}`} className="btn small co" style={{ justifySelf: 'start' }}><span>Abrir o treino</span></Link>}
                <span className="muted" style={{ fontSize: 13 }}>♥ {p.likes}</span>
              </article>
            ))}
          </div>
        </section>
        <section>
          <SecTitle>Ranking da semana</SecTitle>
          <ol className="panel" style={{ listStyle: 'none', margin: 0, display: 'grid', gap: 8 }}>
            {rank.map((r, i) => (
              <li key={r.who} style={{ display: 'flex', gap: 12, alignItems: 'baseline', color: r.who.includes('(você)') ? 'var(--mu)' : undefined }}>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 26, width: 24 }}>{i + 1}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{r.who}</span>
                <span className="num">{r.xp} XP</span>
              </li>
            ))}
          </ol>
          <SecTitle>Compartilhe um treino</SecTitle>
          <div className="panel" style={{ display: 'grid', gap: 8 }}>
            <p>Em qualquer exercício, abra "Personalizar", ajuste do seu jeito e toque em "Copiar link". Quem abrir o link treina com as mesmas configurações.</p>
          </div>
          <SecTitle>Regras da banda</SecTitle>
          <div className="panel">
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
              <li>Respeito acima de tudo: crítica é sobre a música, nunca sobre a pessoa.</li>
              <li>Só publique áudio e vídeo que você tem direito de compartilhar.</li>
              <li>Nada de spam, venda ou conteúdo ofensivo. Denúncias são revisadas por pessoas.</li>
            </ul>
            <div style={{ marginTop: 12 }}><Tag tone="dark">Em construção</Tag></div>
          </div>
        </section>
      </div>
    </div>
  );
}
