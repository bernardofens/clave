// Ilustrações do kit: traço de nanquim sobre papel, com borda de adesivo.
// Cada asset é { vb, body } — body usa {id} para ids únicos (filtro, clipPaths).

export const INK = '#171513';
export const PAPER = '#f7f3ea';
const SW = 3.5;

// ---------- primitivas ----------
const P = (d, a = '') => `<path d="${d}" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}" ${a}/>`;
const K = (d, a = '') => `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="${SW}" ${a}/>`;
const KW = (d, a = '') => `<path d="${d}" fill="${INK}" stroke="${PAPER}" stroke-width="2.5" ${a}/>`;
const L = (d, w = 3, a = '') => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" ${a}/>`;
const W = (d, w = 2.5, a = '') => `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${w}" ${a}/>`;
const tube = (d, w) => L(d, w + 7) + `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${w}"/>`;
const tubeInk = (d, w) => `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${w + 5}"/>` + L(d, w);
const circ = (cx, cy, r, fill = PAPER, a = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="${SW}" ${a}/>`;
const ell = (cx, cy, rx, ry, fill = PAPER, a = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${INK}" stroke-width="${SW}" ${a}/>`;
const hand = (x, y, r = 10) => circ(x, y, r) + L(`M${x - r * 0.55},${y - r * 0.15} q${r * 0.55},${r * 0.45} ${r * 1.1},0`, 2.2);
const g = (t, s) => `<g transform="${t}">${s}</g>`;

const note8 = (x, y, s = 1, fill = INK) => g(`translate(${x},${y}) scale(${s})`,
  `<ellipse cx="0" cy="0" rx="9" ry="6.5" transform="rotate(-20)" fill="${fill}" stroke="${INK}" stroke-width="3"/>` +
  L('M8,-3 L8,-48', 3.5) + L('M8,-48 C11,-34 26,-32 22,-14', 3.5));
const note4 = (x, y, s = 1) => g(`translate(${x},${y}) scale(${s})`,
  `<ellipse cx="0" cy="0" rx="9" ry="6.5" transform="rotate(-20)" fill="${INK}" stroke="${INK}" stroke-width="3"/>` + L('M8,-3 L8,-46', 3.5));
const star = (x, y, r) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1);
  }
  return K(d + 'Z', 'stroke-width="1"');
};

// ---------- rosto padrão (3/4 olhando para a direita) ----------
function face(cx, cy, o = {}) {
  const e1 = cx - 7, e2 = cx + 15;
  let s = ell(cx - 31, cy + 6, 7, 10) + L(`M${cx - 33},${cy + 1} q4,4 0,10`, 2);
  s += P(`M${cx - 32},${cy - 8} C${cx - 32},${cy - 40} ${cx + 32},${cy - 40} ${cx + 32},${cy - 8} L${cx + 32},${cy + 8} C${cx + 32},${cy + 34} ${cx + 16},${cy + 44} ${cx},${cy + 44} C${cx - 16},${cy + 44} ${cx - 32},${cy + 34} ${cx - 32},${cy + 8} Z`);
  if (o.eyes === 'closed') {
    s += L(`M${e1 - 6},${cy + 2} Q${e1},${cy - 4} ${e1 + 6},${cy + 2}`, 3) + L(`M${e2 - 6},${cy + 2} Q${e2},${cy - 4} ${e2 + 6},${cy + 2}`, 3);
  } else {
    s += ell(e1, cy, 3, 4.5, INK, 'stroke-width="1"') + ell(e2, cy, 3, 4.5, INK, 'stroke-width="1"');
  }
  if (!o.noBrows) s += L(`M${e1 - 6},${cy - 11} L${e1 + 4},${cy - 13}`, 3) + L(`M${e2 - 4},${cy - 13} L${e2 + 6},${cy - 11}`, 3);
  s += L(`M${cx + 5},${cy + 3} Q${cx + 13},${cy + 15} ${cx + 4},${cy + 18}`, 3);
  const m = o.mouth || 'smile';
  if (m === 'smile') s += L(`M${cx - 6},${cy + 26} Q${cx + 5},${cy + 35} ${cx + 17},${cy + 25}`, 3);
  if (m === 'open') s += K(`M${cx - 5},${cy + 25} Q${cx + 5},${cy + 40} ${cx + 16},${cy + 24} Q${cx + 5},${cy + 28} ${cx - 5},${cy + 25} Z`);
  if (m === 'o') s += ell(cx + 6, cy + 28, 4.5, 4, INK, 'stroke-width="1"');
  if (m === 'grin') s += K(`M${cx - 8},${cy + 24} Q${cx + 5},${cy + 42} ${cx + 19},${cy + 22} Q${cx + 5},${cy + 28} ${cx - 8},${cy + 24} Z`) + W(`M${cx - 4},${cy + 27} L${cx + 15},${cy + 26}`, 2);
  return s;
}
const neck = (cx, cy) => P(`M${cx - 11},${cy + 28} L${cx - 11},${cy + 64} L${cx + 12},${cy + 64} L${cx + 12},${cy + 28} Z`);
const TORSO = 'M62,300 L64,214 C66,182 98,162 140,160 C182,162 214,182 216,214 L218,300 Z';

// ---------- partes reaproveitadas ----------
const GUITAR_BODY = 'M0,-62 C18,-62 28,-52 28,-38 C28,-26 20,-22 20,-12 C20,-2 36,6 36,30 C36,54 18,66 0,66 C-18,66 -36,54 -36,30 C-36,6 -20,-2 -20,-12 C-20,-22 -28,-26 -28,-38 C-28,-52 -18,-62 0,-62 Z';
function violin() {
  return L('M-4,-70 L-4,-96', 1) +
    P('M0,-48 C14,-48 24,-42 24,-28 C24,-18 16,-14 16,-6 C16,2 26,6 26,22 C26,40 14,48 0,48 C-14,48 -26,40 -26,22 C-26,6 -16,2 -16,-6 C-16,-14 -24,-18 -24,-28 C-24,-42 -14,-48 0,-48 Z') +
    L('M-10,-6 c-4,6 4,10 0,16', 2.2) + L('M10,-6 c4,6 -4,10 0,16', 2.2) +
    K('M-4,-84 L4,-84 L5,8 L-5,8 Z', 'stroke-width="1.5"') +
    P('M-4,-84 L4,-84 L5,-94 C11,-98 9,-110 0,-108 C-7,-106 -7,-98 -5,-94 Z', 'stroke-width="3"') +
    L('M-9,16 L9,16', 3) + K('M-5,24 L5,24 L3,40 L-3,40 Z', 'stroke-width="1.5"') +
    W('M-1.5,-80 L-2,22 M1.5,-80 L2,22', 0.8);
}
function catHead(x, y, eyes = 'open', id = '{id}') {
  // cabeça de gato preto centrada em (x,y); devolve [svg, d da cabeça]
  const d = `M${x - 52},${y + 4} C${x - 54},${y - 24} ${x - 42},${y - 40} ${x - 34},${y - 46} L${x - 38},${y - 80} L${x - 10},${y - 56} C${x - 4},${y - 57} ${x + 4},${y - 57} ${x + 10},${y - 56} L${x + 38},${y - 80} L${x + 34},${y - 44} C${x + 44},${y - 36} ${x + 52},${y - 22} ${x + 50},${y + 4} C${x + 48},${y + 34} ${x + 26},${y + 50} ${x},${y + 50} C${x - 26},${y + 50} ${x - 50},${y + 34} ${x - 52},${y + 4} Z`;
  let s = K(d);
  s += W(`M${x - 32},${y - 50} L${x - 34},${y - 68} L${x - 18},${y - 56}`, 2.5) + W(`M${x + 32},${y - 50} L${x + 34},${y - 68} L${x + 18},${y - 56}`, 2.5);
  if (eyes === 'open') {
    s += `<ellipse cx="${x - 18}" cy="${y - 2}" rx="13" ry="15" fill="${PAPER}"/><ellipse cx="${x + 18}" cy="${y - 2}" rx="13" ry="15" fill="${PAPER}"/>`;
    s += `<ellipse cx="${x - 15}" cy="${y}" rx="5" ry="10" fill="${INK}"/><ellipse cx="${x + 21}" cy="${y}" rx="5" ry="10" fill="${INK}"/>`;
    s += `<circle cx="${x - 12}" cy="${y - 6}" r="2.6" fill="${PAPER}"/><circle cx="${x + 24}" cy="${y - 6}" r="2.6" fill="${PAPER}"/>`;
  } else if (eyes === 'happy') {
    s += W(`M${x - 30},${y + 2} Q${x - 18},${y - 12} ${x - 6},${y + 2}`, 4) + W(`M${x + 6},${y + 2} Q${x + 18},${y - 12} ${x + 30},${y + 2}`, 4);
  } else if (eyes === 'sleep') {
    s += W(`M${x - 28},${y} Q${x - 18},${y + 8} ${x - 8},${y}`, 3.5) + W(`M${x + 8},${y} Q${x + 18},${y + 8} ${x + 28},${y}`, 3.5);
  }
  s += `<path d="M${x - 5},${y + 16} L${x + 5},${y + 16} L${x},${y + 22} Z" fill="${PAPER}"/>`;
  s += W(`M${x - 8},${y + 26} Q${x - 4},${y + 32} ${x},${y + 26} Q${x + 4},${y + 32} ${x + 8},${y + 26}`, 2.5);
  const wh = `M${x - 20},${y + 20} L${x - 57},${y + 14} M${x - 20},${y + 26} L${x - 58},${y + 30} M${x + 20},${y + 20} L${x + 57},${y + 14} M${x + 20},${y + 26} L${x + 58},${y + 30}`;
  s += `<clipPath id="${id}-hc${x}"><path d="${d}"/></clipPath>`;
  s += L(wh, 2.2) + `<g clip-path="url(#${id}-hc${x})">${W(wh, 2.2)}</g>`;
  return s;
}
const bowTie = (x, y, s = 1) => g(`translate(${x},${y}) scale(${s})`, P('M0,0 L-20,-10 L-20,12 Z M0,0 L20,-10 L20,12 Z', 'stroke-width="3"') + circ(0, 1, 5, INK, 'stroke-width="2"'));
const catBody = 'M96,140 C76,166 66,206 68,246 C70,276 90,292 130,292 C170,292 190,276 192,246 C194,206 184,166 164,140 Z';
const catPaws = () => `<ellipse cx="110" cy="290" rx="17" ry="10" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/><ellipse cx="150" cy="290" rx="17" ry="10" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/>` + W('M106,284 l0,8 M114,284 l0,8 M146,284 l0,8 M154,284 l0,8', 2);

// =====================================================================
export const assets = {};

// ---------- MASCOTE: Clave, o gato preto ----------
assets['clave-sentado'] = {
  vb: '0 0 270 320', group: 'mascote',
  body: L('M176,282 C222,284 238,246 216,222 C198,204 206,178 232,182', 18) + K(catBody) + catPaws() + catHead(130, 100) + bowTie(130, 158),
};
assets['clave-regente'] = {
  vb: '0 0 290 320', group: 'mascote',
  body: note8(42, 120, 1.1) + note4(64, 64, 0.85) + note8(22, 200, 0.8) +
    L('M176,282 C222,284 238,246 216,222 C198,204 206,178 232,182', 18) + K(catBody) + catPaws() +
    tubeInk('M168,176 C186,160 200,140 206,118', 18) + `<circle cx="208" cy="114" r="12" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/>` +
    L('M214,104 L258,40', 4.5) + circ(259, 38, 3.5, PAPER, 'stroke-width="2"') +
    catHead(130, 100, 'happy') + bowTie(130, 158),
};
assets['clave-dormindo'] = {
  vb: '0 0 330 230', group: 'mascote',
  body: P('M18,128 L298,110 L306,206 L26,218 Z') +
    [0, 1, 2, 3, 4].map(i => L(`M34,${140 + i * 11} L292,${123 + i * 11}`, 1.6)).join('') +
    note4(262, 170, 0.6) + note4(280, 158, 0.6) +
    L('M268,182 C292,196 236,200 170,196', 14) +
    K('M64,186 C54,132 112,104 176,108 C240,112 270,140 262,184 Z') +
    `<ellipse cx="78" cy="186" rx="15" ry="8" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/><ellipse cx="108" cy="188" rx="15" ry="8" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/>` +
    g('translate(0,0)', catHead(92, 142, 'sleep')) +
    L('M196,60 l16,0 l-16,18 l16,0', 3.5) + L('M226,26 l22,0 l-22,24 l22,0', 4) + L('M178,88 l10,0 l-10,11 l10,0', 3),
};
assets['clave-fones'] = {
  vb: '0 0 270 320', group: 'mascote',
  body: note8(236, 70, 0.9) + note4(30, 110, 0.8) +
    L('M176,282 C222,284 238,246 216,222 C198,204 206,178 232,182', 18) + K(catBody) + catPaws() + catHead(130, 100, 'happy') +
    tube('M80,110 C70,30 190,30 180,110', 10) +
    P('M64,86 C64,78 70,74 78,74 L86,74 L86,124 L78,124 C70,124 64,120 64,112 Z') + P('M196,86 C196,78 190,74 182,74 L174,74 L174,124 L182,124 C190,124 196,120 196,112 Z') +
    bowTie(130, 158),
};
assets['clave-espiando'] = {
  vb: '0 0 260 150', group: 'mascote',
  body: `<clipPath id="{id}-cut"><rect x="0" y="0" width="260" height="128"/></clipPath><g clip-path="url(#{id}-cut)">${catHead(130, 100)}</g>` +
    `<ellipse cx="94" cy="128" rx="18" ry="10" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/><ellipse cx="166" cy="128" rx="18" ry="10" fill="${INK}" stroke="${PAPER}" stroke-width="2.5"/>` +
    W('M88,122 l0,9 M97,122 l0,9 M160,122 l0,9 M169,122 l0,9', 2),
};

// ---------- HERÓI: o músico na correria ----------
assets['correria'] = {
  vb: '0 0 300 412', group: 'heroi',
  body:
    // capa do violão nas costas
    g('translate(132,150) rotate(-35)',
      P('M-9,-60 L9,-60 L9,-132 L-9,-132 Z') + P('M-11,-130 L11,-130 L13,-158 L-13,-158 Z') + P(GUITAR_BODY.replace(/(-?\d+)/g, n => String(Math.round(+n * 1.08)))) +
      L('M-26,-30 C-40,10 -40,50 -10,64', 2, 'stroke-dasharray="4 5"') + P('M-14,6 L14,6 L14,40 L-14,40 Z', 'stroke-width="2.5"')) +
    // braço de trás e perna de trás
    tube('M162,128 C142,150 130,174 124,194', 15) + hand(123, 198, 9) +
    tube('M162,206 L130,262 L98,294', 22) + K('M86,286 L108,294 L102,312 C92,318 76,304 86,286 Z') +
    // pescoço, corpo
    P('M166,92 L184,92 L184,120 L166,120 Z') +
    P('M150,112 C176,106 202,116 206,136 L214,214 C190,222 156,222 138,214 L136,142 C136,124 140,114 150,112 Z') +
    L('M182,114 L172,152 L192,140', 2.5) + L('M172,152 L176,212', 2) + P('M190,180 L206,178 L207,186 L191,188 Z', 'stroke-width="2"') +
    L('M198,116 L148,212', 7) +
    // perna da frente
    tube('M192,206 L226,262 L252,314', 22) + K('M238,306 L272,302 C286,302 286,322 272,322 L238,326 Z') +
    // cabeça de perfil
    ell(168, 70, 6, 9) +
    P('M154,70 C152,42 172,30 192,34 C206,38 212,52 212,62 L221,75 L212,78 C212,90 206,98 196,100 L178,104 C164,104 156,92 154,70 Z') +
    K('M150,76 C140,44 160,18 190,20 C212,22 224,34 218,46 C208,40 194,40 188,50 C182,58 170,58 166,70 C162,76 156,80 150,76 Z') +
    ell(200, 63, 3, 4.5, INK, 'stroke-width="1"') + L('M195,52 L206,51', 3) + L('M195,86 Q203,92 209,84', 3) +
    circ(167, 72, 3.5, INK, 'stroke-width="1"') + L('M167,76 C164,100 172,124 186,150', 1.8) +
    // braço da frente com café
    tube('M194,124 L226,156 L246,138', 16) +
    P('M236,108 L258,108 L255,134 L239,134 Z') + K('M233,101 L261,101 L261,109 L233,109 Z') + K('M237,117 L257,117 L256,125 L238,125 Z') + hand(246, 138, 9) +
    L('M242,92 c-4,-6 4,-10 0,-16 M252,92 c-4,-6 4,-10 0,-16', 2.2) +
    // Clave acompanhando, logo atrás
    L('M30,366 C12,360 8,334 22,326 C32,320 38,330 30,334', 8) +
    L('M42,378 L38,398 M52,380 L56,398 M76,380 L72,398 M86,376 L92,396', 7) +
    K('M30,370 C30,352 54,352 72,352 C88,352 94,362 92,374 C88,386 36,386 30,370 Z') +
    K('M88,360 C84,346 90,340 88,330 L100,342 C104,341 108,341 112,342 L122,330 C122,342 128,350 122,364 C118,376 94,378 88,360 Z') +
    `<ellipse cx="111" cy="356" rx="4" ry="4.5" fill="${PAPER}"/><ellipse cx="112" cy="356" rx="1.6" ry="3.5" fill="${INK}"/>` +
    bowTie(103, 374, 0.45),
};

// ---------- PERSONAGENS DE GÊNERO ----------
assets['genero-jazz'] = {
  vb: '0 0 280 320', group: 'genero',
  body: note8(52, 118, 1) + note4(34, 70, 0.8) + note8(76, 40, 0.7) +
    neck(140, 100) + K(TORSO) +
    KW('M116,156 L164,156 L168,182 C150,190 130,190 112,182 Z') + W('M116,168 C132,174 150,174 166,168', 2) +
    face(140, 100, { eyes: 'closed', mouth: 'o' }) +
    K('M104,82 C96,54 130,40 168,50 C192,56 196,74 180,82 C160,88 122,88 104,82 Z') + L('M150,46 L152,36', 5) +
    tubeInk('M82,222 C86,268 150,264 190,238', 20) + tubeInk('M206,214 C214,196 204,186 190,190', 20) +
    tube('M150,130 C166,126 182,134 188,152 L198,248 C200,272 172,280 160,262', 15) +
    P('M148,268 C144,256 138,248 128,240 C142,230 162,228 178,234 C172,246 170,256 172,268 Z') +
    ell(153, 236, 26, 8, PAPER, 'transform="rotate(-10 153 236)"') + ell(153, 236, 19, 4.5, INK, 'transform="rotate(-10 153 236)" stroke-width="1"') +
    K('M144,124 L154,122 L156,134 L146,135 Z', 'stroke-width="1.5"') +
    circ(191, 176, 4.5) + circ(193, 200, 4.5) + circ(195, 222, 4.5) +
    hand(192, 238, 11) + hand(190, 190, 11),
};
{
  // trastes do braço da guitarra
  let frets = '';
  for (let t = 0.18; t < 0.95; t += 0.12) {
    const x = 128 + 102 * t, y = 240 - 98 * t;
    frets += `M${(x - 4.5).toFixed(1)},${(y - 4.7).toFixed(1)} L${(x + 4.5).toFixed(1)},${(y + 4.7).toFixed(1)} `;
  }
  assets['genero-rock'] = {
    vb: '0 0 280 320', group: 'genero',
    body: neck(140, 100) + K(TORSO) + P('M118,163 L162,163 L156,300 L124,300 Z') + L('M122,166 Q140,182 158,166', 2.5) +
      W('M118,164 L100,212 L120,226 L112,300', 2.5) + W('M162,164 L180,212 L160,226 L168,300', 2.5) +
      `<circle cx="86" cy="190" r="2.5" fill="${PAPER}"/><circle cx="96" cy="184" r="2.5" fill="${PAPER}"/><circle cx="194" cy="190" r="2.5" fill="${PAPER}"/><circle cx="184" cy="184" r="2.5" fill="${PAPER}"/>` +
      face(140, 100, { mouth: 'grin', noBrows: true }) +
      K('M122,94 L144,94 L142,104 C140,111 126,111 124,104 Z') + K('M148,94 L170,94 L168,104 C166,111 152,111 150,104 Z') + L('M144,97 L148,97 M122,96 L110,98', 3) +
      K('M106,90 L98,58 L116,68 L118,38 L136,60 L148,30 L158,58 L178,40 L174,68 L190,62 L176,92 C168,74 118,72 106,90 Z') +
      P('M66,236 C58,214 84,204 98,218 C112,206 134,212 140,228 C164,228 170,256 154,268 C156,296 116,306 96,290 C70,296 52,270 66,252 C60,248 60,240 66,236 Z') +
      P('M84,248 C80,234 96,228 108,238 L124,262 C116,276 96,280 86,268 Z', 'stroke-width="2.5"') +
      K('M98,234 L114,250 L110,254 L94,238 Z', 'stroke-width="1.5"') + K('M110,250 L126,266 L122,270 L106,254 Z', 'stroke-width="1.5"') +
      tube('M126,242 L230,142', 12) + L(frets, 2) +
      P('M226,146 L240,118 C246,108 260,114 256,124 L238,156 Z') + `<circle cx="244" cy="122" r="2.5" fill="${INK}"/><circle cx="240" cy="132" r="2.5" fill="${INK}"/><circle cx="249" cy="128" r="2.5" fill="${INK}"/>` +
      L('M112,262 L232,144 M116,266 L234,148', 1) +
      tubeInk('M70,222 C62,262 100,268 122,248', 20) + tubeInk('M214,216 C236,240 228,190 206,168', 20) +
      hand(124, 246) + hand(204, 166),
  };
}
assets['genero-samba'] = {
  vb: '0 0 280 320', group: 'genero',
  body: note8(46, 96, 1) + note8(30, 150, 0.75) +
    neck(140, 100) + P(TORSO) +
    `<clipPath id="{id}-t"><path d="${TORSO}"/></clipPath><g clip-path="url(#{id}-t)">` +
    [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="50" y="${176 + i * 18}" width="180" height="8" fill="${INK}"/>`).join('') + '</g>' + L(TORSO, SW) +
    P('M120,160 L140,192 L160,160 Z') +
    face(140, 100) +
    K('M130,121 C136,115 144,116 147,120 C150,116 158,115 164,121 C156,125 150,124 147,122 C144,124 138,125 130,121 Z', 'stroke-width="1.5"') +
    ell(140, 76, 54, 9, PAPER, 'transform="rotate(-6 140 76)"') +
    P('M108,76 C104,40 172,36 172,72 Z') + L('M124,48 Q140,58 158,46', 2.5) +
    K('M107,62 C130,58 152,58 172,60 L172,71 C150,71 130,72 108,74 Z', 'stroke-width="2"') +
    circ(222, 118, 38) + `<circle cx="222" cy="118" r="30" fill="none" stroke="${INK}" stroke-width="2"/>` +
    [0, 60, 120, 180, 240, 300].map(a => g(`rotate(${a} 222 118)`, P('M215,77 L229,77 L229,83 L215,83 Z', 'stroke-width="2"') + ell(222, 80, 6, 2.5, INK, 'stroke-width="1"'))).join('') +
    L('M202,104 q8,-10 18,-6 M232,140 q8,-2 10,-10', 2) +
    tube('M212,214 C228,198 224,176 214,160', 18) + hand(213, 158, 11),
};
assets['genero-classico'] = {
  vb: '0 0 280 320', group: 'genero',
  body: neck(140, 100) + K(TORSO) + P('M120,162 L160,162 L150,300 L130,300 Z') +
    W('M120,164 L104,220 L126,300', 2.5) + W('M160,164 L176,220 L154,300', 2.5) +
    circ(140, 222, 2.5, INK, 'stroke-width="1"') + circ(140, 248, 2.5, INK, 'stroke-width="1"') +
    face(140, 100, { eyes: 'closed' }) +
    K('M106,92 C100,56 130,48 160,52 C182,56 182,76 174,92 C168,74 150,66 120,74 C112,78 108,84 106,92 Z') +
    W('M128,62 C140,58 156,58 166,64', 1.8) +
    K('M140,170 L124,162 L124,178 Z M140,170 L156,162 L156,178 Z') + circ(140, 170, 4, INK, 'stroke-width="1"') +
    g('translate(172,202) rotate(60)', violin()) +
    L('M70,250 L234,170', 3.5) + L('M76,257 L234,178', 1.5) + K('M70,246 L80,242 L84,252 L74,256 Z', 'stroke-width="1.5"') +
    tubeInk('M66,226 C62,252 76,258 88,246', 20) + hand(88, 244) +
    tubeInk('M214,214 C238,212 242,186 233,168', 20) + hand(232, 165),
};
assets['genero-hiphop'] = {
  vb: '0 0 280 320', group: 'genero',
  body: P('M92,196 C84,150 196,150 188,196 Z') + neck(140, 100) + P(TORSO) +
    P('M118,160 C124,180 156,180 162,160 Z', 'stroke-width="2.5"') +
    L('M96,300 L104,258 L176,258 L184,300', 2.5) +
    L('M128,172 L124,216 M152,172 L156,216', 2.5) + K('M121,214 L127,214 L127,222 L121,222 Z M153,214 L159,214 L159,222 L153,222 Z', 'stroke-width="1"') +
    L('M112,168 C118,210 162,210 168,168', 4.5, 'stroke-dasharray="0.1 7"') + note8(138, 216, 0.45) +
    face(140, 100, { mouth: 'open' }) +
    K('M106,82 C104,44 176,44 174,80 Z') + K('M166,76 C188,70 212,76 210,86 C192,92 176,88 162,84 Z') + circ(140, 50, 3, INK, 'stroke-width="1"') +
    `<ellipse cx="136" cy="70" rx="4.5" ry="3.3" transform="rotate(-20 136 70)" fill="${PAPER}"/>` + W('M140,69 L140,56 C142,62 148,62 147,68', 2) +
    L('M178,150 L202,194', 11) +
    `<clipPath id="{id}-m"><circle cx="170" cy="138" r="13"/></clipPath>` + circ(170, 138, 13) +
    `<g clip-path="url(#{id}-m)">${L('M156,132 L184,132 M156,140 L184,140 M156,148 L184,148 M164,124 L164,152 M172,124 L172,152 M180,124 L180,152', 1.6)}</g>` +
    tube('M214,220 C230,196 210,172 190,168', 18) + hand(188, 168, 11),
};
assets['genero-forro'] = {
  vb: '0 0 280 320', group: 'genero',
  body: note8(250, 76, 0.9) + note8(30, 120, 0.8) +
    neck(140, 100) + P(TORSO) + K('M120,160 L160,160 L140,194 Z') + K('M134,162 L146,162 L146,172 L134,172 Z', 'stroke-width="1"') +
    face(140, 100, { eyes: 'closed', mouth: 'open' }) +
    L('M110,96 C112,142 168,152 172,98', 2) +
    P('M78,86 C86,24 194,24 202,86 C182,70 98,70 78,86 Z') + L('M90,74 C118,58 162,58 190,74', 2) +
    star(108, 62, 6) + star(140, 50, 7) + star(172, 62, 6) + L('M94,70 l-4,6 M186,70 l4,6', 2) +
    P('M104,196 L176,196 L176,296 L104,296 Z') +
    [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${110 + i * 8.2}" y="198" width="3.4" height="96" fill="${INK}"/>`).join('') +
    P('M62,192 L104,190 L104,298 L62,300 Z') +
    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => L(`M68,${202 + i * 10.4} L98,${202 + i * 10.4}`, 1.6)).join('') +
    [0, 1, 3, 4, 5, 7].map(i => K(`M68,${205 + i * 10.4} L84,${205 + i * 10.4} L84,${210 + i * 10.4} L68,${210 + i * 10.4} Z`, 'stroke-width="1"')).join('') +
    P('M176,190 L218,194 L218,300 L176,298 Z') +
    [0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => `<circle cx="${186 + c * 11}" cy="${212 + r * 18}" r="3.2" fill="${INK}"/>`).join('')).join('') +
    hand(60, 236, 11) + hand(222, 222, 11),
};

// ---------- INSTRUMENTOS ----------
assets['violao'] = {
  vb: '0 0 210 250', group: 'instrumento',
  body: g('translate(108,172) rotate(-20)',
    P('M-8,-60 L8,-60 L7,-128 L-7,-128 Z') + L('M-7,-74 L7,-74 M-7,-86 L7,-86 M-7,-98 L7,-98 M-7,-110 L7,-110 M-7,-120 L7,-120', 1.6) +
    P('M-9,-128 L9,-128 L12,-158 L-12,-158 Z') + [-138, -146, -154].map(y => circ(-15, y, 2.6, INK, 'stroke-width="1"') + circ(15, y, 2.6, INK, 'stroke-width="1"')).join('') +
    P(GUITAR_BODY) + `<circle cx="0" cy="-6" r="17" fill="none" stroke="${INK}" stroke-width="1.6"/>` + circ(0, -6, 12.5, INK, 'stroke-width="1"') +
    K('M-15,32 L15,32 L15,39 L-15,39 Z', 'stroke-width="1"') + L('M-3,35 L-3,-128 M3,35 L3,-128', 0.9)),
};
{
  let keys = '';
  for (let i = 1; i < 14; i++) keys += `M${24 + i * 15.2},58 L${24 + i * 15.2},116 `;
  let blacks = '';
  [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].forEach(i => { const x = 24 + (i + 1) * 15.2 - 4.5; blacks += K(`M${x},58 L${x + 9},58 L${x + 9},92 L${x},92 Z`, 'stroke-width="1"'); });
  assets['teclado'] = {
    vb: '0 0 270 150', group: 'instrumento',
    body: g('rotate(-4 135 75)', P('M14,30 L246,30 C252,30 254,34 254,38 L254,118 C254,122 252,126 246,126 L14,126 C10,126 8,122 8,118 L8,38 C8,34 10,30 14,30 Z') +
      P('M24,58 L236,58 L236,116 L24,116 Z', 'stroke-width="2.5"') + L(keys, 1.8) + blacks +
      K('M108,38 L162,38 L162,51 L108,51 Z', 'stroke-width="1"') + note4(126, 49, 0.25).replace(new RegExp(INK, 'g'), PAPER) +
      circ(34, 44, 5) + circ(52, 44, 5) + circ(214, 44, 5) + circ(232, 44, 5) + L('M34,44 l3,-3 M52,44 l-3,-3', 1.5)),
  };
}
assets['caixa'] = {
  vb: '0 0 220 210', group: 'instrumento',
  body: P('M38,104 L38,164 C38,190 182,190 182,164 L182,104 Z') + L('M38,154 C38,180 182,180 182,154', 2.5) +
    [58, 84, 110, 136, 162].map(x => K(`M${x - 3},${x === 110 ? 128 : 124} L${x + 3},${x === 110 ? 128 : 124} L${x + 3},${x === 110 ? 160 : 156} L${x - 3},${x === 110 ? 160 : 156} Z`, 'stroke-width="1"')).join('') +
    ell(110, 104, 72, 21) + ell(110, 104, 64, 16, PAPER, 'stroke-width="1.6"') +
    tube('M54,26 L142,94', 7) + ell(52, 24, 6, 5, PAPER, 'stroke-width="2.5"') +
    tube('M170,22 L86,92', 7) + ell(172, 20, 6, 5, PAPER, 'stroke-width="2.5"'),
};
assets['saxofone'] = {
  vb: '0 0 180 280', group: 'instrumento',
  body: tube('M74,26 C88,22 98,34 100,54 L112,214 C114,248 74,254 66,226', 18) +
    P('M52,240 C50,224 44,210 32,194 C50,182 76,180 92,186 C84,202 80,216 80,234 Z') +
    ell(62, 188, 31, 9, PAPER, 'transform="rotate(-10 62 188)"') + ell(62, 188, 24, 5, INK, 'transform="rotate(-10 62 188)" stroke-width="1"') +
    K('M60,20 L76,18 L78,32 L62,33 Z', 'stroke-width="1.5"') +
    [90, 114, 138, 162].map((y, i) => circ(104 + i * 1.6, y, 6) + `<circle cx="${104 + i * 1.6}" cy="${y}" r="2.5" fill="${INK}"/>`).join('') +
    L('M90,70 L118,74', 2.5),
};
assets['trompete'] = {
  vb: '0 0 260 160', group: 'instrumento',
  body: tube('M64,74 C34,74 34,114 64,114 L174,114 C196,114 196,74 174,74', 9) +
    tube('M22,74 L200,74', 9) +
    P('M196,62 C214,60 224,44 236,28 L236,120 C224,104 214,88 196,86 Z') + ell(236, 74, 9, 46) + ell(236, 74, 4, 36, INK, 'stroke-width="1"') +
    K('M10,68 L22,70 L22,78 L10,80 Z', 'stroke-width="1.5"') +
    [104, 124, 144].map(x => P(`M${x - 6},58 L${x + 6},58 L${x + 6},126 L${x - 6},126 Z`, 'stroke-width="3"') + ell(x, 56, 8, 3, PAPER, 'stroke-width="2.5"') + L(`M${x},53 L${x},44`, 3) + ell(x, 42, 7, 3, INK, 'stroke-width="1"')).join(''),
};
assets['microfone'] = {
  vb: '0 0 160 260', group: 'instrumento',
  body: `<clipPath id="{id}-c"><rect x="50" y="20" width="60" height="90" rx="30"/></clipPath>` +
    `<rect x="50" y="20" width="60" height="90" rx="30" fill="${PAPER}" stroke="${INK}" stroke-width="${SW}"/>` +
    `<g clip-path="url(#{id}-c)">${L([28, 36, 44, 52, 78, 86, 94, 102].map(y => `M50,${y} L110,${y}`).join(' '), 2)}</g>` +
    K('M50,60 L110,60 L110,72 L50,72 Z') +
    L('M40,64 C40,124 120,124 120,64', 4) + K('M73,108 L87,108 L87,132 L73,132 Z') +
    L('M80,132 L80,230', 8) + ell(80, 236, 42, 9, INK) + W('M52,234 Q80,240 108,234', 1.5),
};
assets['pandeiro'] = {
  vb: '0 0 200 200', group: 'instrumento',
  body: circ(100, 100, 72) + `<circle cx="100" cy="100" r="62" fill="none" stroke="${INK}" stroke-width="2"/>` +
    [0, 60, 120, 180, 240, 300].map(a => g(`rotate(${a} 100 100)`, K('M90,30 L110,30 L110,36 L90,36 Z', 'stroke-width="1"') + ell(94, 33, 7, 3, PAPER, 'stroke-width="2"') + ell(106, 33, 7, 3, PAPER, 'stroke-width="2"'))).join('') +
    note8(96, 112, 0.7),
};
assets['violino'] = {
  vb: '0 0 170 300', group: 'instrumento',
  body: g('translate(84,178) rotate(12) scale(1.25)', violin()) + L('M24,276 L150,36', 3.5) + L('M31,278 L154,44', 1.5) + K('M22,268 L32,272 L28,282 L18,278 Z', 'stroke-width="1.5"'),
};
assets['fones'] = {
  vb: '0 0 220 210', group: 'instrumento',
  body: tube('M42,118 C38,26 182,26 178,118', 11) +
    P('M24,104 C24,96 30,92 38,92 L50,92 L50,152 L38,152 C30,152 24,148 24,140 Z') + K('M50,96 L58,98 L58,146 L50,148 Z', 'stroke-width="2"') +
    P('M196,104 C196,96 190,92 182,92 L170,92 L170,152 L182,152 C190,152 196,148 196,140 Z') + K('M170,96 L162,98 L162,146 L170,148 Z', 'stroke-width="2"') +
    L('M36,152 C36,190 90,194 112,184', 3) + K('M112,180 L126,180 L126,188 L112,188 Z', 'stroke-width="1.5"'),
};
assets['metronomo'] = {
  vb: '0 0 180 250', group: 'instrumento',
  body: P('M48,222 L132,222 L110,34 C108,26 72,26 70,34 Z') + P('M66,200 L114,200 L100,56 L80,56 Z', 'stroke-width="2.5"') +
    L('M84,80 l8,0 M83,100 l10,0 M82,120 l12,0 M80,140 l14,0 M78,160 l16,0 M76,180 l18,0', 1.5) +
    L('M90,196 L120,62', 4) + K('M106,108 L120,111 L117,124 L103,121 Z', 'stroke-width="1.5"') + circ(90, 196, 5, INK) +
    P('M38,218 L142,218 L142,236 L38,236 Z') + L('M128,40 C140,46 146,58 146,70 M140,30 C156,40 162,58 160,76', 2.5),
};

// ---------- PARTITURA ----------
assets['clave-de-sol'] = {
  vb: '0 0 130 230', group: 'partitura',
  body: L('M58,190 C48,206 66,214 76,204 C86,194 80,170 76,140 L62,34 C60,16 78,10 80,28 C84,52 52,70 42,92 C30,118 34,150 62,154 C88,156 98,130 84,116 C70,102 48,110 52,130 C54,140 64,144 70,138', 7) +
    circ(54, 192, 8, INK),
};
assets['colcheia'] = { vb: '0 0 110 170', group: 'partitura', body: note8(40, 134, 2.1) };
assets['semicolcheias'] = {
  vb: '0 0 170 170', group: 'partitura',
  body: `<ellipse cx="40" cy="136" rx="18" ry="13" transform="rotate(-20 40 136)" fill="${INK}"/><ellipse cx="124" cy="120" rx="18" ry="13" transform="rotate(-20 124 120)" fill="${INK}"/>` +
    L('M56,130 L56,34 M140,114 L140,24', 7) + K('M54,30 L142,16 L142,30 L54,44 Z', 'stroke-width="2"') + K('M54,54 L142,40 L142,52 L54,66 Z', 'stroke-width="2"'),
};
assets['pausa'] = {
  vb: '0 0 90 180', group: 'partitura',
  body: L('M32,18 L60,52 C44,66 38,82 58,104 C40,98 26,112 46,148', 8),
};
assets['sustenido'] = {
  vb: '0 0 120 150', group: 'partitura',
  body: L('M44,16 L40,136 M80,12 L76,132', 6) + L('M22,62 L100,46 M22,104 L100,88', 11),
};
{
  // Ode à Alegria (Beethoven, domínio público): E E F G G F E D
  const base = 128, sp = 10; // linha inferior (Mi4)
  const steps = { D: 1, E: 0, F: -1, G: -2 };
  const notes = ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D'];
  let staff = '';
  for (let i = 0; i < 5; i++) staff += `M30,${base - i * sp} L330,${base - i * sp} `;
  let heads = '';
  notes.forEach((n, i) => {
    const x = 104 + i * 27, y = base + steps[n] * (sp / 2);
    heads += `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="4.6" transform="rotate(-20 ${x} ${y})" fill="${INK}"/>` + L(`M${x + 5.6},${y - 2} L${x + 5.6},${y - 32}`, 2);
  });
  assets['folha-partitura'] = {
    vb: '0 0 360 240', group: 'partitura',
    body: g('rotate(-3 180 120)',
      P('M20,30 L340,30 L340,214 L20,214 Z') +
      `<text x="34" y="62" font-family="Caveat, 'Segoe Print', cursive" font-size="22" font-weight="700" fill="${INK}">Ode à Alegria</text>` +
      `<text x="326" y="62" text-anchor="end" font-family="Caveat, 'Segoe Print', cursive" font-size="16" fill="${INK}">L. v. Beethoven</text>` +
      L(staff, 1.4) + L(`M30,${base} L30,${base - 40} M330,${base} L330,${base - 40} M211,${base} L211,${base - 40}`, 1.6) +
      g(`translate(36,${base - 54}) scale(0.32)`, L('M58,190 C48,206 66,214 76,204 C86,194 80,170 76,140 L62,34 C60,16 78,10 80,28 C84,52 52,70 42,92 C30,118 34,150 62,154 C88,156 98,130 84,116 C70,102 48,110 52,130 C54,140 64,144 70,138', 7)) +
      `<text x="74" y="${base - 18}" font-family="Georgia, serif" font-size="20" font-weight="700" fill="${INK}">4</text><text x="74" y="${base + 1}" font-family="Georgia, serif" font-size="20" font-weight="700" fill="${INK}">4</text>` +
      heads +
      [0, 1, 2, 3, 4].map(i => L(`M30,${base + 58 - i * sp} L330,${base + 58 - i * sp}`, 1.4)).join('') +
      L('M56,190 C90,182 120,196 150,188', 1.5, 'stroke-dasharray="3 4"') +
      `<rect x="138" y="16" width="84" height="24" fill="${PAPER}" fill-opacity="0.75" stroke="${INK}" stroke-width="1.5" transform="rotate(4 180 28)"/>`),
  };
}
