// Notação rítmica numa linha só (sem alturas), para leitura rítmica e treino de ouvido rítmico.
import { CELLS, type CellId } from '../../theory/rhythm';

const BEAT = 64;
const LINE = 56;
const STEM = 30;
const C = 'var(--staff-ink, #f4e8d0)';

function QuarterRest({ x }: { x: number }) {
  return <path d={`M${x - 3},${LINE - 16} L${x + 4},${LINE - 7} L${x - 2},${LINE} L${x + 4},${LINE + 8} C${x - 2},${LINE + 5} ${x - 5},${LINE + 10} ${x},${LINE + 15}`} fill="none" stroke={C} strokeWidth="2.8" strokeLinejoin="round" />;
}
function EighthRest({ x }: { x: number }) {
  return <g><circle cx={x - 2} cy={LINE - 6} r="2.8" fill={C} /><path d={`M${x - 2},${LINE - 4} C${x + 2},${LINE - 3} ${x + 4},${LINE - 6} ${x + 5},${LINE - 8} L${x - 1},${LINE + 10}`} fill="none" stroke={C} strokeWidth="2" /></g>;
}

interface Props {
  bars: CellId[][];
  cursor?: number | null; // tempo atual (em tempos desde o início)
  compact?: boolean;
  label?: string;
}

export default function RhythmLine({ bars, cursor = null, label }: Props) {
  const beatsPerBar = 4;
  const lead = 18;
  const barW = BEAT * beatsPerBar + 12;
  const width = lead + bars.length * barW + 4;
  const xOf = (beatIdx: number, within: number, barIdx: number) => lead + barIdx * barW + 8 + (beatIdx + within) * BEAT + 10;
  const nodes: React.ReactNode[] = [];

  bars.forEach((bar, bi) => {
    let beat = 0;
    bar.forEach((cid, ci) => {
      const cell = CELLS[cid];
      let t = 0;
      const pts: { x: number; ev: (typeof cell.events)[number] }[] = [];
      cell.events.forEach(ev => {
        pts.push({ x: xOf(beat, t * (cell.beats > 1 ? 1 : 0.86), bi), ev });
        t += ev.d;
      });
      const key = `${bi}-${ci}`;
      const notes = pts.filter(p => !p.ev.rest);
      pts.forEach((p, i) => {
        const { x, ev } = p;
        if (ev.rest) {
          nodes.push(ev.d >= 1 ? <QuarterRest key={key + 'r' + i} x={x} /> : <EighthRest key={key + 'r' + i} x={x} />);
          return;
        }
        const hollow = ev.d >= 2;
        nodes.push(<ellipse key={key + 'h' + i} cx={x} cy={LINE} rx="6.6" ry="4.6" transform={`rotate(-22 ${x} ${LINE})`} fill={hollow ? 'none' : C} stroke={C} strokeWidth={hollow ? 2.4 : 0} />);
        if (ev.d < 4) nodes.push(<path key={key + 's' + i} d={`M${x + 6},${LINE - 1} V${LINE - STEM}`} stroke={C} strokeWidth="1.6" />);
        if (ev.dot) nodes.push(<circle key={key + 'd' + i} cx={x + 12} cy={LINE - 2} r="2" fill={C} />);
      });
      // bandeirola (colcheia sozinha) ou barras de ligação
      if (notes.length === 1 && notes[0].ev.d < 1) {
        const x = notes[0].x + 6;
        nodes.push(<path key={key + 'f'} d={`M${x},${LINE - STEM} C${x + 3},${LINE - STEM + 9} ${x + 12},${LINE - STEM + 11} ${x + 9},${LINE - 10}`} fill="none" stroke={C} strokeWidth="2" />);
      } else if (notes.length > 1) {
        const x0 = notes[0].x + 6;
        const x1 = notes[notes.length - 1].x + 6;
        nodes.push(<rect key={key + 'b1'} x={x0 - 0.8} y={LINE - STEM} width={x1 - x0 + 1.6} height="4" fill={C} />);
        notes.forEach((p, i) => {
          if (p.ev.d !== 0.25) return;
          const prev = notes[i - 1];
          const next = notes[i + 1];
          const y2 = LINE - STEM + 7;
          if (next && next.ev.d === 0.25) nodes.push(<rect key={key + 'b2' + i} x={p.x + 5.2} y={y2} width={next.x - p.x + 1.6} height="4" fill={C} />);
          else if (!(prev && prev.ev.d === 0.25)) {
            const dir = next ? 1 : -1;
            nodes.push(<rect key={key + 'b2s' + i} x={dir > 0 ? p.x + 5.2 : p.x - 3.8} y={y2} width="10" height="4" fill={C} />);
          }
        });
        if (cell.triplet) nodes.push(<text key={key + 't'} x={(x0 + x1) / 2} y={LINE - STEM - 6} textAnchor="middle" fontSize="12" fontStyle="italic" fontWeight="700" fill={C} fontFamily="var(--body)">3</text>);
      }
      beat += cell.beats;
    });
    nodes.push(<path key={'bar' + bi} d={`M${lead + (bi + 1) * barW},${LINE - 16} V${LINE + 16}`} stroke={C} strokeWidth="1.4" />);
  });

  const cursorX = cursor === null ? null : (() => {
    const bi = Math.floor(cursor / beatsPerBar);
    return xOf(cursor - bi * beatsPerBar, 0, bi) - 10;
  })();

  return (
    <svg className="rhythm-svg" viewBox={`0 0 ${width} 92`} role="img" aria-label={label ?? 'Ritmo'}>
      <path d={`M0,${LINE} H${width}`} stroke={C} strokeWidth="1.2" />
      <path d={`M6,${LINE - 10} V${LINE + 10} M11,${LINE - 10} V${LINE + 10}`} stroke={C} strokeWidth="3" />
      {cursorX !== null && <rect x={cursorX} y="8" width="3" height="78" fill="var(--mu)" />}
      {nodes}
    </svg>
  );
}
