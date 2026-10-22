// Mentor: prévia do recurso pago. Nesta versão as respostas são geradas por regras
// a partir do progresso salvo; a versão com IA entra no plano Clave+.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AREAS, areaById, type AreaId } from '../data/areas';
import { MODULES } from '../data/content';
import { areaXP, levelOf } from '../data/session';
import { EXERCISES, exerciseById } from '../exercises/catalog';
import { getState, streakDays, useStore } from '../state/store';
import { Art, Chip, PageHead, Tag } from '../components/ui';

interface Msg { from: 'eu' | 'clave'; text: string; links?: { to: string; label: string }[] }

function weakest(): { area: AreaId; ex?: string; acc?: number } {
  const { stats, history } = getState();
  const tried = EXERCISES.filter(e => (stats[e.id]?.attempts ?? 0) >= 8).map(e => ({ e, acc: stats[e.id].correct / stats[e.id].attempts }));
  if (tried.length) {
    const w = tried.sort((a, b) => a.acc - b.acc)[0];
    return { area: w.e.area, ex: w.e.id, acc: w.acc };
  }
  const xp = areaXP(stats, history);
  return { area: (Object.keys(xp) as AreaId[]).sort((a, b) => xp[a] - xp[b])[0] };
}

function answer(q: string): Msg {
  const s = getState();
  const t = q.toLowerCase();
  if (t.includes('fraco') || t.includes('melhorar') || t.includes('dificuldade')) {
    const w = weakest();
    if (w.ex) {
      return { from: 'clave', text: `Seu ponto mais frágil agora é "${exerciseById[w.ex].title}", com ${Math.round((w.acc ?? 0) * 100)}% de acerto. Faça 10 minutos por dia, com menos opções nas configurações, e só aumente quando passar de 85%.`, links: [{ to: `/treinar/${w.ex}`, label: `Treinar ${exerciseById[w.ex].title}` }] };
    }
    return { from: 'clave', text: `Ainda tenho poucos dados. A área que você menos treinou é ${areaById[w.area].name}. Comece por ela.`, links: [{ to: '/treinar', label: 'Abrir Treinar' }] };
  }
  if (t.includes('hoje') || t.includes('treino') || t.includes('fazer')) {
    const w = weakest();
    const mod = MODULES.find(m => m.area === w.area && !m.premium);
    return { from: 'clave', text: `Sugiro uma sessão de 10 minutos puxada para ${areaById[w.area].name}. ${mod ? `Se ainda não leu, a aula "${mod.title}" explica o porquê em 2 minutos.` : ''}`, links: [{ to: '/', label: 'Montar a sessão' }, ...(mod ? [{ to: `/estudar/${mod.id}`, label: mod.title }] : [])] };
  }
  if (t.includes('modo')) {
    return { from: 'clave', text: 'Modos são a escala maior começando de outro grau. Dórico é o menor com 6ª maior; mixolídio é o maior com 7ª menor. Toque cada um sobre um drone e escute a nota que muda.', links: [{ to: '/estudar/modos-gregos', label: 'Aula de modos' }, { to: '/ferramentas/ambiente', label: 'Drone' }] };
  }
  if (t.includes('semana') || t.includes('plano')) {
    const goals = s.profile.goals.length ? s.profile.goals : ['improvisar'];
    return { from: 'clave', text: `Para a semana: segunda e quarta, ouvido (10 min sem instrumento); terça e quinta, mapeamento e técnica com o instrumento; sexta, backing track para juntar tudo; no fim de semana, o plano de tonalidade. Ajustei para ${goals.length} objetivo(s) seu(s).`, links: [{ to: '/progresso#tonalidade', label: 'Plano de tonalidade' }] };
  }
  if (t.includes('progresso') || t.includes('nível') || t.includes('nivel')) {
    const xp = areaXP(s.stats, s.history);
    const best = AREAS.map(a => ({ a, lv: levelOf(xp[a.id]).level })).sort((x, y) => y.lv - x.lv)[0];
    return { from: 'clave', text: `Você está há ${streakDays(s.history)} dia(s) seguidos estudando. Sua área mais forte é ${best.a.name} (nível ${best.lv}).`, links: [{ to: '/progresso', label: 'Ver progresso' }] };
  }
  return { from: 'clave', text: 'Ainda estou aprendendo a conversar. Pergunte sobre o que treinar hoje, onde você está mais fraco, modos gregos ou um plano para a semana.' };
}

const PROMPTS = ['O que treino hoje?', 'Onde estou mais fraco?', 'Me explica os modos gregos', 'Monte um plano para a semana', 'Como está meu progresso?'];

export default function Mentor() {
  const name = useStore(s => s.profile.name);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'clave', text: `Oi${name ? `, ${name}` : ''}! Sou o Clave. Olho o seu progresso e sugiro o próximo passo.` }]);
  const [text, setText] = useState('');
  const ask = (q: string) => { if (!q.trim()) return; setMsgs(m => [...m, { from: 'eu', text: q }, answer(q)]); setText(''); };

  return (
    <div>
      <PageHead tag="Mentor · prévia" title="Clave mentor" sub="Nesta prévia, o Clave responde com regras simples a partir do seu progresso salvo. O mentor com IA, que conversa de verdade, faz parte do plano Clave+." aside={<Art name="clave-mentor" style={{ width: 150 }} />} />
      <div className="panel" style={{ display: 'grid', gap: 14, maxWidth: 820 }}>
        <div style={{ display: 'grid', gap: 10 }} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} style={{ justifySelf: m.from === 'eu' ? 'end' : 'start', maxWidth: '85%', background: m.from === 'eu' ? 'var(--co)' : 'var(--cream)', color: m.from === 'eu' ? 'var(--cream)' : 'var(--bk)', padding: '10px 14px' }}>
              <p>{m.text}</p>
              {m.links && <div className="row" style={{ marginTop: 8 }}>{m.links.map(l => <Link key={l.to} to={l.to} style={{ fontWeight: 600 }}>{l.label} →</Link>)}</div>}
            </div>
          ))}
        </div>
        <div className="row">{PROMPTS.map(p => <Chip key={p} onClick={() => ask(p)}>{p}</Chip>)}</div>
        <form className="row" onSubmit={e => { e.preventDefault(); ask(text); }}>
          <input id="mentor-q" value={text} onChange={e => setText(e.target.value)} placeholder="Pergunte ao Clave" aria-label="Pergunta"
            style={{ flex: 1, minWidth: 200, background: 'var(--bk-3)', border: 0, color: 'var(--cream)', padding: '10px 12px', font: 'inherit' }} />
          <button className="btn small" type="submit"><span>Enviar</span></button>
        </form>
        <Tag tone="ve">Clave+ em breve</Tag>
      </div>
    </div>
  );
}
