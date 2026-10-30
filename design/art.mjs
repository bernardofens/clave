// Estilo "Noturno": cor chapada, formas angulares, mãos grandes, linhas brancas finas e granulação.
// Cada asset é { vb, body, par? } — body usa {id} para ids únicos.

export const BK = '#100e0d', MU = '#f0bf5e', CO = '#3a5bd8', VE = '#e2522a', CR = '#f4e8d0', WH = '#fbf6ea';
export const SK1 = '#6b412f', SK2 = '#a8673f', SK3 = '#dca27a', DK = '#2b1b15', WOOD = '#b4512a';

const F = (d, fill, a = '') => `<path d="${d}" fill="${fill}" ${a}/>`;
const S = (d, stroke, w = 2, a = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" ${a}/>`;
const bar = (d, stroke, w) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="butt"/>`;
const C = (cx, cy, r, fill, a = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${a}/>`;
const E = (cx, cy, rx, ry, fill, a = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${a}/>`;
const g = (t, s) => `<g transform="${t}">${s}</g>`;
const rect = (x, y, w, h, fill, a = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${a}/>`;
const bg = (vb, fill) => { const [, , w, h] = vb.split(' '); return rect(0, 0, w, h, fill); };

// xadrez mostarda com linhas brancas, como o paletó da referência
const plaid = (id, base = MU, line = WH, step = 13) => `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">${rect(0, 0, step, step, base)}${S(`M0,0.6 H${step} M0.6,0 V${step}`, line, 1.1)}</pattern>`;
const stripes = (id, a, b, step = 12) => `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">${rect(0, 0, step, step, a)}${rect(0, 0, step, step / 2, b)}</pattern>`;

// mão grande e chapada; dedos apontam para +x
function hand(x, y, rot = 0, s = 1, skin = SK1) {
  let f = '';
  for (let i = 0; i < 4; i++) {
    const y0 = -18 + i * 9.5, len = [30, 34, 32, 26][i];
    f += F(`M4,${y0} L${len},${y0 + 1.5} L${len - 1},${y0 + 8.5} L4,${y0 + 8} Z`, skin);
    f += S(`M${len - 11},${y0 + 2} L${len - 11},${y0 + 7} M${len - 20},${y0 + 2} L${len - 20},${y0 + 7}`, DK, 1.3);
  }
  return g(`translate(${x},${y}) rotate(${rot}) scale(${s})`,
    F('M-26,-16 L8,-20 L10,20 L-24,20 Z', skin) + f +
    F('M-4,-18 L12,-31 L24,-29 L4,-11 Z', skin) + S('M-18,-6 L2,-10 M-16,4 L2,2', DK, 1.3));
}
const note8 = (x, y, s = 1, fill = CR) => g(`translate(${x},${y}) scale(${s})`,
  E(0, 0, 10, 7, fill, 'transform="rotate(-25)"') + rect(7, -50, 3.2, 50, fill) + F('M7,-50 L24,-30 L22,-22 L10,-36 Z', fill));
const note4 = (x, y, s = 1, fill = CR) => g(`translate(${x},${y}) scale(${s})`, E(0, 0, 10, 7, fill, 'transform="rotate(-25)"') + rect(7, -48, 3.2, 48, fill));

// gato preto com contorno cobalto e olhos mostarda
const edge = `stroke="${CO}" stroke-width="2.4" stroke-linejoin="round"`;
function catHead(x, y, eyes = 'open') {
  let s = F(`M${x - 54},${y + 10} L${x - 50},${y - 70} L${x - 16},${y - 38} L${x + 16},${y - 38} L${x + 50},${y - 70} L${x + 54},${y + 10} Q${x + 48},${y + 44} ${x},${y + 46} Q${x - 48},${y + 44} ${x - 54},${y + 10} Z`, BK, edge);
  s += S(`M${x - 44},${y - 52} L${x - 42},${y - 30} M${x + 44},${y - 52} L${x + 42},${y - 30}`, CO, 1.6);
  if (eyes === 'open') {
    s += F(`M${x - 36},${y} Q${x - 22},${y - 16} ${x - 8},${y} Q${x - 22},${y + 12} ${x - 36},${y} Z`, MU) + F(`M${x + 8},${y} Q${x + 22},${y - 16} ${x + 36},${y} Q${x + 22},${y + 12} ${x + 8},${y} Z`, MU);
    s += E(x - 21, y - 1, 2.6, 8, BK) + E(x + 23, y - 1, 2.6, 8, BK);
  } else if (eyes === 'happy') {
    s += S(`M${x - 34},${y + 2} L${x - 22},${y - 8} L${x - 10},${y + 2} M${x + 10},${y + 2} L${x + 22},${y - 8} L${x + 34},${y + 2}`, MU, 4, 'stroke-linejoin="miter"');
  } else {
    s += S(`M${x - 34},${y} L${x - 10},${y + 4} M${x + 10},${y + 4} L${x + 34},${y}`, MU, 3.5);
  }
  s += F(`M${x - 5},${y + 18} L${x + 5},${y + 18} L${x},${y + 24} Z`, VE);
  s += S(`M${x - 18},${y + 24} L${x - 70},${y + 16} M${x - 18},${y + 30} L${x - 68},${y + 38} M${x + 18},${y + 24} L${x + 70},${y + 16} M${x + 18},${y + 30} L${x + 68},${y + 38}`, WH, 1.2);
  return s;
}
const bowTie = (x, y, s = 1) => g(`translate(${x},${y}) scale(${s})`, F('M0,0 L-22,-12 L-22,13 Z M0,0 L22,-12 L22,13 Z', VE) + rect(-4, -5, 8, 10, MU));
const catTail = S('M168,272 C222,272 230,220 202,198 C182,182 192,156 218,160', CO, 21, 'stroke-linecap="round"') + S('M168,272 C222,272 230,220 202,198 C182,182 192,156 218,160', BK, 16, 'stroke-linecap="round"');
const catBody = F('M84,140 L62,282 Q120,294 178,282 L156,140 Z', BK, edge) + S('M92,206 L104,238 M136,198 L146,232 M114,250 L120,270', CO, 1.4);
const catPaws = E(100, 284, 18, 8, BK, edge) + E(140, 284, 18, 8, BK, edge) + S('M94,280 l0,8 M104,280 l0,8 M134,280 l0,8 M144,280 l0,8', WH, 1.1);

export const assets = {};

// ---------------- MASCOTE ----------------
assets['clave-sentado'] = { vb: '0 0 260 310', body: catTail + catBody + catPaws + catHead(120, 102) + bowTie(120, 160) };
assets['clave-regente'] = {
  vb: '0 0 280 310',
  body: note8(36, 120, 1.1, MU) + note4(60, 66, 0.9, CR) + note8(26, 200, 0.8, VE) + catTail + catBody + catPaws +
    bar('M150,190 L184,150 L200,112', CO, 21) + bar('M150,190 L184,150 L200,112', BK, 16) + E(202, 108, 12, 11, BK, edge) +
    S('M206,100 L250,30', CR, 3.5) + catHead(120, 102, 'happy') + bowTie(120, 160),
};
assets['clave-dormindo'] = {
  vb: '0 0 330 220',
  body: `<defs>${plaid('{id}-pl')}</defs>` + F('M14,150 L310,128 L318,206 L22,214 Z', 'url(#{id}-pl)') +
    S('M268,176 C300,190 250,198 178,194', CO, 17, 'stroke-linecap="round"') + S('M268,176 C300,190 250,198 178,194', BK, 12, 'stroke-linecap="round"') +
    F('M64,186 L76,128 L170,108 L252,128 L262,180 Z', BK, edge) + S('M150,130 L156,160 M190,126 L198,158 M226,134 L232,164', CO, 1.4) +
    E(84, 188, 16, 7, BK, edge) + E(114, 190, 16, 7, BK, edge) +
    g('translate(-28,40) scale(0.8)', catHead(150, 136, 'sleep')) +
    F('M190,52 L214,52 L196,72 L216,72 L214,78 L188,78 L206,58 L190,58 Z', CR) + F('M222,20 L254,20 L230,46 L256,46 L254,54 L218,54 L242,28 L222,28 Z', MU),
};
assets['clave-fones'] = {
  vb: '0 0 260 310',
  body: note8(226, 70, 0.9, MU) + note4(28, 116, 0.8, VE) + catTail + catBody + catPaws + catHead(120, 102, 'happy') +
    S('M70,112 L70,60 L100,30 L140,30 L170,60 L170,112', CO, 11, 'stroke-linejoin="miter"') +
    F('M52,84 L76,80 L78,130 L54,126 Z', VE) + F('M188,84 L164,80 L162,130 L186,126 Z', VE) + bowTie(120, 160),
};
assets['clave-espiando'] = {
  vb: '0 0 260 150',
  body: `<clipPath id="{id}-cut"><rect x="0" y="0" width="260" height="128"/></clipPath><g clip-path="url(#{id}-cut)">${catHead(130, 96)}</g>` +
    E(94, 130, 20, 9, BK, edge) + E(166, 130, 20, 9, BK, edge) + S('M86,126 l0,8 M98,126 l0,8 M158,126 l0,8 M170,126 l0,8', WH, 1.1),
};

// ---------------- HERÓI: correria ----------------
{
  const vb = '0 0 400 480';
  let speed = '';
  [[40, 92], [0, 140], [120, 205], [0, 318], [60, 340], [200, 44]].forEach(([x, y]) => speed += `M${x},${y} L${x + 260},${y - 26} `);
  let wins = '';
  for (let i = 0; i < 6; i++) { const x = 8 + i * 66, t = 120 - 0.125 * x; wins += F(`M${x},${t + 22} L${x + 46},${t + 16} L${x + 46},${t + 78} L${x},${t + 84} Z`, BK); }
  assets['correria'] = {
    vb,
    body: `<defs>${plaid('{id}-pl')}</defs>` + bg(vb, BK) +
      F('M0,120 L400,70 L400,252 L0,302 Z', MU) + wins + E(130, 150, 9, 22, CO) + E(282, 132, 10, 24, VE) + E(350, 124, 8, 20, CR) +
      F('M0,302 L400,252 L400,266 L0,316 Z', VE) + S(speed, WH, 1.2, 'opacity=".85"') + rect(0, 452, 400, 10, MU) +
      // capa do violão nas costas
      F('M62,22 L88,16 L156,224 L130,232 Z', BK) + S('M88,16 L156,224', CR, 1.3) +
      F('M104,222 C70,240 80,306 126,318 C170,330 200,296 190,254 C182,224 146,206 104,222 Z', BK) + S('M104,222 C70,240 80,306 126,318', CO, 2) +
      // perna de trás e de frente (calça xadrez)
      bar('M178,300 L150,372 L112,424', 'url(#{id}-pl)', 36) + F('M96,410 L126,420 L116,446 L80,436 Z', VE) +
      bar('M236,300 L272,372 L300,428', 'url(#{id}-pl)', 36) + F('M288,420 L344,424 L344,446 L284,446 Z', VE) +
      S('M150,372 L162,330 M272,372 L254,336', DK, 1.4) +
      // braço de trás
      bar('M160,160 L130,220 L118,250', CO, 30) + hand(112, 262, 100, 1.05, SK1) +
      // casaco
      F('M146,150 L234,136 L270,304 L208,322 L168,316 L116,302 Z', CO) +
      F('M182,146 L210,142 L198,186 Z', CR) + F('M193,150 L201,149 L200,196 L194,196 Z', VE) +
      S('M182,146 L168,196 L190,186 M210,142 L224,190 L204,184 M196,200 L206,316 M226,240 L250,236', BK, 1.6) +
      S('M150,230 L170,262 M240,210 L258,250', '#2c46a8', 2) +
      // cabeça
      F('M180,146 L176,104 L190,84 L216,86 L226,104 L234,118 L226,122 L224,136 L206,148 Z', SK1) +
      F('M186,104 L192,116 L184,120 Z', DK) + S('M208,104 L218,103', BK, 2.6) + S('M212,128 L222,124', DK, 2) +
      F('M174,110 L172,86 L186,70 L216,70 L232,86 L216,92 L198,88 L188,98 L184,114 Z', BK, `stroke="${CO}" stroke-width="2"`) +
      // braço da frente, café e fumaça
      bar('M228,152 L276,206 L300,172', CO, 28) +
      F('M298,112 L338,112 L334,166 L302,166 Z', WH) + F('M294,102 L342,102 L342,114 L294,114 Z', VE) + rect(299, 128, 38, 12, MU) +
      hand(298, 150, -8, 1.05, SK1) +
      F('M320,98 C302,82 334,66 314,46 C302,32 318,16 334,8 C322,26 344,38 334,54 C324,70 340,84 320,98 Z', WH, 'opacity=".95"') +
      // Clave acompanhando
      S('M182,436 C164,430 160,404 176,398', CO, 11, 'stroke-linecap="round"') + S('M182,436 C164,430 160,404 176,398', BK, 7, 'stroke-linecap="round"') +
      S('M196,442 L192,462 M210,444 L212,462 M236,444 L232,462 M248,440 L254,460', CO, 9) + S('M196,442 L192,462 M210,444 L212,462 M236,444 L232,462 M248,440 L254,460', BK, 5) +
      F('M180,440 L188,416 L246,412 L256,438 Z', BK, edge) +
      F('M240,424 L242,394 L254,406 L266,406 L276,392 L278,422 L264,436 L248,436 Z', BK, edge) + F('M260,416 L270,414 L266,421 Z', MU),
  };
}

// ---------------- GÊNEROS: capas de disco 300x300 ----------------
assets['genero-jazz'] = {
  vb: '0 0 300 300',
  body: bg('0 0 300 300', BK) + note8(240, 70, 1, MU) + note4(272, 120, 0.8, CR) +
    F('M10,300 L22,186 L90,148 L150,158 L196,222 L206,300 Z', CO) + F('M88,150 L118,154 L100,196 Z', CR) +
    S('M44,210 L70,262 M150,220 L170,276 M30,250 L50,232', BK, 1.6) +
    F('M74,140 L66,92 L82,66 L114,62 L128,86 L136,104 L128,108 L126,122 L106,138 Z', SK1) +
    S('M100,96 L112,98', BK, 2.6) + F('M102,130 L114,128 L108,142 Z', BK) + F('M82,98 L90,112 L80,116 Z', DK) +
    F('M60,80 L70,52 L124,44 L146,58 L124,70 L76,76 Z', BK, `stroke="${CO}" stroke-width="2"`) +
    bar('M40,300 L120,240 L176,206', CO, 34) + bar('M196,300 L220,264 L222,236', CO, 30) +
    F('M122,112 L136,104 L250,240 L230,256 Z', MU) + S('M134,108 L246,242', WH, 1.4) +
    F('M230,256 L250,240 C276,246 296,272 300,300 L240,300 C238,284 234,270 230,256 Z', MU) + S('M236,262 C260,262 280,282 286,300', '#c9922f', 3) +
    [0, 1, 2, 3].map(i => C(170 + i * 18, 166 + i * 21.5, 4.5, CR)).join('') +
    hand(178, 190, 38, 1.15) + hand(214, 232, 50, 1.1),
};
{
  let strings = '';
  for (let i = 0; i < 4; i++) strings += `M${92 + i * 3},${232 + i * 2} L${306 + i * 3},${-14 + i * 2} `;
  assets['genero-rock'] = {
    vb: '0 0 300 300',
    body: bg('0 0 300 300', VE) +
      F('M0,300 L8,168 L70,138 L130,140 L184,170 L196,300 Z', BK) + F('M70,140 L110,140 L104,300 L64,300 Z', CR) +
      S('M70,140 L56,200 L74,214 L60,300 M130,140 L142,196 L124,210 L132,300', CR, 1.4) +
      F('M76,132 L70,88 L84,62 L114,60 L126,80 L132,98 L124,102 L122,116 L104,130 Z', SK3) +
      F('M90,90 L128,88 L126,100 L92,102 Z', BK) + S('M104,118 L118,116', DK, 2.4) +
      F('M66,92 L56,54 L76,64 L78,34 L94,56 L104,24 L114,52 L132,34 L130,62 L146,58 L130,82 L96,72 L74,96 Z', BK, `stroke="${CO}" stroke-width="2"`) +
      F('M40,226 C26,200 54,182 74,196 C88,178 120,184 126,206 C156,206 162,240 142,256 C144,290 100,302 78,284 C46,292 24,262 40,240 Z', MU) +
      F('M58,236 C54,220 72,214 86,226 L104,252 C94,268 70,272 60,256 Z', CR) + rect(84, 222, 26, 6, BK, 'transform="rotate(-45 97 225)"') + rect(98, 240, 26, 6, BK, 'transform="rotate(-45 111 243)"') +
      F('M96,230 L104,240 L310,0 L296,-6 Z', BK) + S(strings, WH, 0.9) +
      [0.3, 0.42, 0.54, 0.66, 0.78].map(t => S(`M${96 + 210 * t - 5},${236 - 240 * t - 4} L${96 + 210 * t + 5},${236 - 240 * t + 4}`, CR, 1.2)).join('') +
      bar('M200,300 L240,170 L232,120', BK, 30) + hand(232, 104, -112, 1.05, SK3) +
      bar('M10,300 L60,264 L98,240', BK, 30) + hand(110, 236, -30, 1.15, SK3),
  };
}
assets['genero-samba'] = {
  vb: '0 0 300 300',
  body: `<defs>${stripes('{id}-st', CR, CO)}</defs>` + bg('0 0 300 300', MU) +
    F('M0,300 L10,176 L76,146 L136,150 L178,186 L188,300 Z', 'url(#{id}-st)') + F('M80,148 L120,150 L100,186 Z', SK1) +
    F('M82,140 L76,98 L90,74 L120,72 L132,92 L138,108 L130,112 L128,126 L110,140 Z', SK1) +
    S('M104,104 L116,104', BK, 2.6) + F('M100,118 L130,116 L126,122 L112,121 L102,124 Z', BK) + F('M88,104 L96,118 L86,120 Z', DK) +
    F('M48,84 L160,72 L162,80 L50,94 Z', CR) + F('M74,82 L80,48 L132,44 L140,76 Z', CR) + F('M76,72 L138,66 L139,76 L75,82 Z', BK) +
    C(214, 132, 74, VE) + C(214, 132, 62, CR) + S('M170,112 L196,92', '#d9c9a8', 3) +
    [0, 60, 120, 180, 240, 300].map(a => g(`rotate(${a} 214 132)`, rect(204, 54, 20, 10, BK) + E(214, 59, 8, 3.2, MU))).join('') +
    note8(196, 150, 0.9, BK) +
    bar('M150,300 L206,250 L236,226', 'url(#{id}-st)', 30) + hand(250, 214, -40, 1.25) +
    bar('M180,190 L150,150', 'url(#{id}-st)', 28) + hand(142, 132, -120, 1.05),
};
assets['genero-classico'] = {
  vb: '0 0 300 300',
  body: bg('0 0 300 300', CO) +
    S('M-10,262 L320,92', WH, 2.5) + S('M-10,270 L320,100', CR, 1) +
    F('M0,300 L12,170 L82,140 L140,144 L186,176 L196,300 Z', BK) + F('M84,142 L126,144 L114,300 L92,300 Z', CR) +
    F('M104,152 L86,142 L86,162 Z M104,152 L122,142 L122,162 Z', BK) + S('M84,142 L70,210 L94,300 M126,144 L142,210 L118,300', CR, 1.4) +
    F('M88,136 L82,94 L96,70 L126,68 L138,88 L144,104 L136,108 L134,122 L116,136 Z', SK2) +
    S('M108,100 L120,104', BK, 2.4) + S('M114,124 L124,120', DK, 2) +
    F('M80,98 L78,72 L96,54 L130,54 L146,72 L122,68 L98,74 L88,96 Z', BK, `stroke="${CR}" stroke-width="1.5"`) +
    g('translate(172,180) rotate(55)',
      F('M0,-56 L22,-50 L26,-24 L16,-6 L30,10 L28,44 L0,58 L-28,44 L-30,10 L-16,-6 L-26,-24 L-22,-50 Z', WOOD) +
      S('M-10,-8 l-3,16 M10,-8 l3,16', BK, 2.4) + rect(-5, -130, 10, 140, BK) + rect(-10, 18, 20, 4, CR) +
      F('M-6,-130 L6,-130 L10,-148 L0,-156 L-8,-148 Z', WOOD) + S('M-2,-128 L-2,30 M2,-128 L2,30', WH, 0.7)) +
    bar('M196,300 L240,220 L254,150', BK, 30) + hand(256, 120, -100, 1.05, SK2) +
    bar('M0,268 L40,250', BK, 28) + hand(52, 248, -18, 1.1, SK2),
};
assets['genero-hiphop'] = {
  vb: '0 0 300 300',
  body: bg('0 0 300 300', CR) + F('M0,0 L300,0 L300,90 L0,150 Z', VE) +
    F('M30,182 C30,140 168,140 168,182 Z', '#2c46a8') +
    F('M0,300 L10,172 L76,146 L140,146 L190,172 L200,300 Z', CO) + S('M86,160 L82,214 M126,160 L130,214', CR, 2.5) +
    S('M70,158 Q100,212 140,158', MU, 4, 'stroke-dasharray="3 3"') + F('M98,204 L110,204 L104,216 Z', MU) +
    F('M84,140 L78,98 L92,74 L122,72 L134,92 L140,108 L132,112 L130,126 L112,140 Z', SK1) +
    S('M106,104 L118,104', BK, 2.6) + F('M110,118 L124,116 L122,124 L112,124 Z', BK) +
    F('M72,94 L78,58 L132,54 L140,86 Z', MU) + F('M132,80 L178,82 L176,92 L132,92 Z', MU) + S('M84,62 L132,58', DK, 1.4) +
    F('M150,206 L174,196 L258,300 L222,300 Z', BK) + C(158, 130, 24, BK) + S('M138,122 L178,122 M136,132 L180,132 M140,142 L176,142 M150,108 L150,152 M162,108 L162,152', CR, 1.5) +
    rect(140, 150, 36, 10, MU, 'transform="rotate(22 158 155)"') +
    bar('M200,300 L230,240 L214,204', CO, 30) + hand(188, 186, -150, 1.2) +
    note8(250, 160, 1, BK) + note4(270, 222, 0.8, VE),
};
assets['genero-forro'] = {
  vb: '0 0 300 300',
  body: bg('0 0 300 300', BK) + F('M0,0 L300,0 L300,120 L0,220 Z', VE) +
    F('M0,300 L12,176 L80,148 L140,148 L190,178 L198,300 Z', CO) + F('M88,150 L132,150 L110,182 Z', MU) +
    F('M86,142 L80,100 L94,76 L124,74 L136,94 L142,110 L134,114 L132,128 L114,142 Z', SK2) +
    S('M100,104 L110,107 M118,107 L128,104', BK, 2.4) + F('M108,122 L126,120 L120,132 L110,130 Z', BK) +
    F('M44,96 C56,30 172,26 184,96 C150,80 80,80 44,96 Z', MU) + S('M54,84 C90,66 140,66 174,84', DK, 1.6) +
    [[84, 64], [114, 54], [146, 64]].map(([x, y]) => g(`translate(${x},${y})`, F('M0,-7 L2,-2 L7,-2 L3,1 L5,6 L0,3 L-5,6 L-3,1 L-7,-2 L-2,-2 Z', BK))).join('') +
    F('M118,196 L232,190 L238,300 L112,300 Z', CR) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => rect(124 + i * 11, 192, 4, 108, BK)).join('') +
    F('M60,190 L120,194 L114,300 L52,300 Z', VE) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => rect(64, 202 + i * 12, 24, 6, CR)).join('') + [0, 1, 3, 4, 5, 7].map(i => rect(64, 206 + i * 12, 14, 4, BK)).join('') +
    F('M232,186 L282,194 L280,300 L238,300 Z', VE) + [0, 1, 2, 3, 4].map(r => [0, 1, 2].map(c => C(248 + c * 11, 214 + r * 18, 3.5, CR)).join('')).join('') +
    hand(46, 230, -10, 1.15, SK2) + hand(292, 236, 190, 1.1, SK2) +
    note8(236, 120, 1, CR) + note8(266, 70, 0.8, MU),
};

// ---------------- INSTRUMENTOS ----------------
const GUITAR = 'M0,-62 L22,-58 L28,-36 L20,-14 L36,8 L38,40 L18,64 L-18,64 L-38,40 L-36,8 L-20,-14 L-28,-36 L-22,-58 Z';
assets['violao'] = {
  vb: '0 0 210 250',
  body: g('translate(110,168) rotate(-22)',
    rect(-8, -132, 16, 76, BK) + [-120, -108, -96, -84, -72].map(y => rect(-8, y, 16, 1.6, CR)).join('') +
    F('M-10,-130 L10,-130 L13,-160 L-13,-160 Z', MU) + F(GUITAR, VE) + C(0, -6, 17, MU) + C(0, -6, 13, BK) +
    rect(-16, 32, 32, 7, BK) + S('M-4,36 L-4,-132 M0,36 L0,-132 M4,36 L4,-132', WH, 0.8) + S('M-30,20 L-18,50 M24,10 L30,36', '#a3401f', 1.6)),
};
{
  let w = '', b = '';
  for (let i = 0; i < 14; i++) w += rect(24 + i * 15.2, 58, 14, 58, CR);
  [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].forEach(i => b += rect(24 + (i + 1) * 15.2 - 5, 58, 9, 34, BK));
  assets['teclado'] = { vb: '0 0 270 150', body: g('rotate(-4 135 75)', F('M8,30 L254,26 L258,126 L4,130 Z', CO) + w + b + rect(104, 38, 60, 12, BK) + C(36, 44, 6, MU) + C(54, 44, 6, VE) + C(222, 42, 6, MU) + S('M110,44 L156,44', MU, 1.4)) };
}
assets['caixa'] = {
  vb: '0 0 220 210',
  body: F('M36,104 L184,104 L184,164 C184,192 36,192 36,164 Z', VE) + [56, 84, 110, 136, 164].map(x => rect(x - 3, 120, 6, 44, MU)).join('') +
    S('M36,160 C36,186 184,186 184,160', MU, 3) + E(110, 104, 74, 22, MU) + E(110, 104, 66, 17, CR) +
    bar('M50,22 L144,96', BK, 8) + S('M50,22 L144,96', CR, 1.2) + bar('M174,18 L82,94', BK, 8) + S('M174,18 L82,94', CR, 1.2),
};
assets['saxofone'] = {
  vb: '0 0 180 280',
  body: F('M60,18 L82,16 L84,30 L62,32 Z', BK) + F('M72,30 L92,24 L104,56 L86,62 Z', MU) +
    F('M86,56 L106,54 L118,214 L96,220 Z', MU) + F('M96,220 L118,214 C120,244 96,256 74,240 L84,226 C92,232 98,228 96,220 Z', MU) +
    F('M30,190 L92,180 C84,200 80,218 84,240 L58,246 C54,226 46,206 30,190 Z', MU) + E(61, 186, 32, 9, '#c9922f', 'transform="rotate(-9 61 186)"') +
    S('M100,62 L112,212', WH, 1.4) + [92, 116, 140, 164].map((y, i) => C(103 + i * 1.6, y, 6, CR) + C(103 + i * 1.6, y, 2.4, BK)).join(''),
};
assets['trompete'] = {
  vb: '0 0 260 160',
  body: bar('M64,74 L36,74 L36,114 L178,114 L190,94 L178,74', MU, 10) + bar('M20,74 L200,74', MU, 10) +
    F('M196,62 L240,26 L240,122 L196,86 Z', MU) + E(240, 74, 8, 48, '#c9922f') + F('M8,68 L22,70 L22,78 L8,80 Z', BK) +
    [104, 124, 144].map(x => rect(x - 6, 58, 12, 68, CR) + rect(x - 8, 52, 16, 6, BK) + rect(x - 2, 40, 4, 12, BK) + E(x, 38, 7, 3, VE)).join('') + S('M24,71 L196,71', WH, 1.1),
};
assets['microfone'] = {
  vb: '0 0 160 260',
  body: `<clipPath id="{id}-c"><rect x="50" y="20" width="60" height="90" rx="30"/></clipPath>` + `<rect x="50" y="20" width="60" height="90" rx="30" fill="${CR}"/>` +
    `<g clip-path="url(#{id}-c)">${S([28, 36, 44, 52, 80, 88, 96, 104].map(y => `M50,${y} L110,${y}`).join(' '), BK, 2.2)}</g>` +
    rect(48, 60, 64, 14, CO) + S('M40,66 L40,100 L80,124 L120,100 L120,66', MU, 4, 'stroke-linejoin="miter"') + rect(73, 110, 14, 22, BK) +
    rect(76, 132, 8, 96, BK) + S('M84,132 L84,228', CO, 1.4) + F('M36,228 L124,228 L130,244 L30,244 Z', VE),
};
assets['pandeiro'] = {
  vb: '0 0 200 200',
  body: C(100, 100, 74, MU) + C(100, 100, 62, CR) + S('M58,74 L82,52', '#d8c7a5', 3) +
    [0, 60, 120, 180, 240, 300].map(a => g(`rotate(${a} 100 100)`, rect(88, 26, 24, 12, BK) + E(100, 32, 9, 3.5, WH))).join('') + note8(96, 116, 0.8, VE),
};
assets['violino'] = {
  vb: '0 0 170 300',
  body: g('translate(84,178) rotate(12) scale(1.25)',
    F('M0,-56 L22,-50 L26,-24 L16,-6 L30,10 L28,44 L0,58 L-28,44 L-30,10 L-16,-6 L-26,-24 L-22,-50 Z', WOOD) +
    S('M-10,-8 l-3,16 M10,-8 l3,16', BK, 2.4) + rect(-5, -96, 10, 106, BK) + rect(-10, 18, 20, 4, CR) +
    F('M-6,-96 L6,-96 L10,-112 L0,-120 L-8,-112 Z', WOOD) + S('M-2,-94 L-2,30 M2,-94 L2,30', WH, 0.7) + S('M-24,20 L-14,40', '#8a3a1c', 1.6)) +
    S('M22,276 L150,36', CR, 3.5) + S('M30,278 L154,44', WH, 1),
};
assets['fones'] = {
  vb: '0 0 220 210',
  body: S('M40,120 L40,70 L80,30 L140,30 L180,70 L180,120', CO, 13, 'stroke-linejoin="miter"') +
    F('M22,98 L52,92 L56,158 L26,152 Z', VE) + F('M52,96 L62,98 L62,152 L56,154 Z', BK) +
    F('M198,98 L168,92 L164,158 L194,152 Z', VE) + F('M168,96 L158,98 L158,152 L164,154 Z', BK) +
    S('M40,156 L52,190 L112,184', MU, 3, 'stroke-linejoin="miter"') + rect(112, 180, 16, 8, BK),
};
assets['metronomo'] = {
  vb: '0 0 180 250',
  body: F('M46,222 L134,222 L110,30 L70,30 Z', VE) + F('M66,200 L114,200 L100,56 L80,56 Z', CR) +
    S('M84,80 l8,0 M83,100 l10,0 M82,120 l12,0 M80,140 l14,0 M78,160 l16,0 M76,180 l18,0', BK, 1.6) +
    S('M90,196 L120,62', BK, 4) + F('M104,108 L120,111 L117,126 L101,123 Z', MU) + rect(36, 218, 108, 18, BK) + S('M36,218 L144,218', MU, 2),
};

// ---------------- PARTITURA ----------------
const CLEF = 'M58,190 C48,206 66,214 76,204 C86,194 80,170 76,140 L62,34 C60,16 78,10 80,28 C84,52 52,70 42,92 C30,118 34,150 62,154 C88,156 98,130 84,116 C70,102 48,110 52,130 C54,140 64,144 70,138';
assets['clave-de-sol'] = { vb: '0 0 130 230', body: S(CLEF, CR, 8, 'stroke-linecap="round"') + C(54, 192, 9, MU) };
assets['colcheia'] = { vb: '0 0 110 170', body: note8(38, 136, 2.1, MU) };
assets['semicolcheias'] = {
  vb: '0 0 170 170',
  body: E(40, 136, 19, 13, VE, 'transform="rotate(-25 40 136)"') + E(124, 120, 19, 13, VE, 'transform="rotate(-25 124 120)"') +
    rect(52, 30, 7, 104, VE) + rect(136, 16, 7, 102, VE) + F('M52,26 L143,12 L143,28 L52,42 Z', VE) + F('M52,52 L143,38 L143,52 L52,66 Z', VE),
};
assets['pausa'] = { vb: '0 0 90 180', body: F('M30,16 L64,54 L46,84 L66,110 C46,104 34,116 52,150 C24,132 30,98 48,104 L26,74 L44,50 Z', CR) };
assets['sustenido'] = { vb: '0 0 120 150', body: bar('M44,16 L40,136 M80,12 L76,132', CO, 7) + bar('M18,66 L104,46 M18,108 L104,88', CO, 13) };
{
  const base = 140, sp = 11, steps = { D: 1, E: 0, F: -1, G: -2 }, notes = ['E', 'E', 'F', 'G', 'G', 'F', 'E', 'D'];
  let staff = '';
  for (let i = 0; i < 5; i++) staff += `M20,${base - i * sp} L344,${base - i * sp} `;
  let heads = '';
  notes.forEach((n, i) => {
    const x = 110 + i * 28, y = base + steps[n] * (sp / 2);
    heads += E(x, y, 7.4, 5.2, i < 4 ? MU : CR, `transform="rotate(-25 ${x} ${y})"`) + rect(x + 5, y - 36, 2.4, 36, i < 4 ? MU : CR);
  });
  assets['pauta-ode'] = {
    vb: '0 0 360 220',
    body: F('M0,14 L360,0 L360,206 L0,220 Z', CO) +
      `<text x="22" y="56" font-family="'Big Shoulders Display', 'League Gothic', Impact, sans-serif" font-weight="900" font-size="30" letter-spacing="1" fill="${CR}">ODE À ALEGRIA</text>` +
      `<text x="340" y="56" text-anchor="end" font-family="Jost, 'Futura', sans-serif" font-size="14" fill="${MU}">L. v. Beethoven · 1824</text>` +
      S(staff, WH, 1.1) + g(`translate(24,${base - 62}) scale(0.36)`, S(CLEF, CR, 8, 'stroke-linecap="round"')) +
      `<text x="76" y="${base - 19}" font-family="'Big Shoulders Display', Impact, sans-serif" font-weight="900" font-size="24" fill="${CR}">4</text><text x="76" y="${base + 3}" font-family="'Big Shoulders Display', Impact, sans-serif" font-weight="900" font-size="24" fill="${CR}">4</text>` +
      heads + S(`M216,${base} L216,${base - 44}`, WH, 1.4) + S(`M20,${base + 34} L344,${base + 34}`, VE, 3),
  };
}

// ---------------- LUGARES: cartazes chapados 300x375 ----------------
const SC = '0 0 300 375';
const rain = (n, color = WH, op = 0.5) => { let d = ''; for (let i = 0; i < n; i++) { const x = (i * 53) % 320 - 10, y = (i * 97) % 380; d += `M${x},${y} l-10,26 `; } return S(d, color, 1.1, `opacity="${op}"`); };
{
  let wins = '';
  for (let i = 0; i < 5; i++) { const x = 14 + i * 60, t = 110 - 0.1 * x; wins += F(`M${x},${t + 26} L${x + 42},${t + 22} L${x + 42},${t + 84} L${x},${t + 88} Z`, BK); }
  let speed = '';
  [[0, 96], [60, 152], [0, 214], [120, 236], [0, 300]].forEach(([x, y]) => speed += `M${x},${y} L${x + 200},${y - 20} `);
  assets['cena-metro'] = { vb: SC, par: 'xMidYMid slice', body: bg(SC, BK) + F('M0,110 L300,80 L300,250 L0,280 Z', MU) + wins + E(96, 150, 8, 20, VE) + E(216, 140, 8, 20, CO) + F('M0,280 L300,250 L300,262 L0,292 Z', VE) + S(speed, WH, 1.1, 'opacity=".8"') + rect(0, 330, 300, 14, MU) + S('M0,337 L300,337', BK, 2, 'stroke-dasharray="4 6"') };
}
assets['cena-onibus'] = {
  vb: SC, par: 'xMidYMid slice',
  body: bg(SC, CO) + C(60, 120, 26, MU) + C(150, 200, 18, VE) + C(230, 96, 30, '#f3d48c') + C(250, 230, 16, VE) + C(100, 270, 22, MU, 'opacity=".85"') + C(30, 220, 12, CR) +
    rain(40) + rect(0, 0, 300, 24, BK) + rect(0, 0, 18, 375, BK) + rect(282, 0, 18, 375, BK) + rect(0, 300, 300, 75, BK) +
    F('M30,375 L44,316 L120,312 L130,375 Z', VE) + S('M40,40 L260,40', CR, 3),
};
assets['cena-cafe'] = {
  vb: SC, par: 'xMidYMid slice',
  body: bg(SC, MU) + rect(150, 30, 130, 170, CR) + S('M215,30 L215,200 M150,115 L280,115', BK, 6) + C(250, 70, 18, VE) +
    F('M20,120 L40,60 L60,120 Z M40,140 L64,84 L84,140 Z', CO) + rect(36, 140, 40, 60, VE) +
    F('M0,250 L300,226 L300,375 L0,375 Z', BK) + F('M110,214 L170,214 L164,262 L116,262 Z', WH) + E(140, 214, 30, 7, DK) + S('M170,226 C186,226 186,246 168,248', WH, 5) +
    F('M146,204 C134,192 154,182 142,168 C136,160 146,150 154,146 C148,160 162,166 154,178 C148,188 158,196 146,204 Z', WH, 'opacity=".9"'),
};
assets['cena-escritorio'] = {
  vb: SC, par: 'xMidYMid slice',
  body: bg(SC, VE) + C(210, 150, 50, MU) + S([30, 50, 70, 90, 110, 130, 150, 170, 190, 210].map(y => `M0,${y} L300,${y}`).join(' '), BK, 3) +
    F('M0,240 L0,190 L40,190 L40,160 L80,160 L80,200 L120,200 L120,140 L150,140 L150,210 L200,210 L200,176 L240,176 L240,220 L300,220 L300,240 Z', BK) +
    rect(0, 240, 300, 135, BK) + F('M100,250 L210,246 L212,316 L102,320 Z', CO) + rect(150, 318, 10, 20, CR) + S('M114,270 L190,266 M114,284 L170,282', CR, 2) +
    F('M240,330 L258,250 L270,252 L254,330 Z', MU) + F('M244,250 L290,232 L292,262 Z', MU),
};
assets['cena-rua'] = {
  vb: SC, par: 'xMidYMid slice',
  body: bg(SC, BK) + rect(30, 50, 110, 40, CO) + S('M44,70 L126,70', CR, 4, 'stroke-dasharray="14 6"') + rect(180, 30, 80, 90, VE) + S('M196,60 L244,60 M196,80 L232,80', CR, 3) +
    C(250, 160, 10, MU) + rect(248, 160, 4, 120, CR, 'opacity=".5"') +
    rect(30, 230, 110, 145, CO, 'opacity=".35"') + rect(180, 230, 80, 145, VE, 'opacity=".35"') + rect(240, 280, 20, 95, MU, 'opacity=".3"') +
    S('M0,226 L300,226', CR, 1.5) + rain(46, WH, 0.55),
};
assets['cena-quarto'] = {
  vb: SC, par: 'xMidYMid slice',
  body: bg(SC, CO) + rect(30, 40, 120, 130, BK) + C(110, 90, 22, CR) + C(122, 82, 20, BK) + C(56, 70, 2.2, MU) + C(76, 130, 1.8, MU) + C(130, 146, 2, MU) +
    F('M240,40 L276,40 L268,64 L248,64 Z', MU) + F('M248,64 L268,64 L310,300 L170,300 Z', MU, 'opacity=".35"') + rect(256, 64, 4, 100, BK) +
    F('M0,270 L300,250 L300,375 L0,375 Z', VE) + F('M0,300 L300,280 L300,375 L0,375 Z', BK, 'opacity=".25"') + S('M20,300 L280,282', CR, 1.2) +
    g('translate(196,210) rotate(8)', F(GUITAR, BK) + rect(-7, -130, 14, 72, BK) + S('M-3,36 L-3,-128 M3,36 L3,-128', CR, 0.8) + C(0, -6, 12, CO)),
};

// =====================================================================
// Artes do app (rodada 3)
// =====================================================================

// logo: cabeça do Clave dentro de um disco
assets['logo'] = {
  vb: '0 0 200 200',
  body: C(100, 100, 92, BK) + `<circle cx="100" cy="100" r="80" fill="none" stroke="#2a2522" stroke-width="2"/><circle cx="100" cy="100" r="68" fill="none" stroke="#2a2522" stroke-width="2"/>` +
    C(100, 100, 56, VE) + g('translate(0,6) scale(1) ', g('translate(100,108) scale(0.72) translate(-100,-100)', catHead(100, 100))) + C(100, 100, 4, BK),
};

// baixo elétrico
assets['baixo'] = {
  vb: '0 0 200 280',
  body: g('translate(104,196) rotate(-24)',
    rect(-7, -178, 14, 128, BK) + [-166, -150, -134, -118, -102, -86, -70].map(y => rect(-7, y, 14, 1.6, CR)).join('') +
    F('M-9,-178 L9,-178 L12,-212 L-10,-206 Z', MU) + [-186, -194, -202].map((y, i) => C(-13, y + i, 3, CR) + C(14, y + i - 2, 3, CR)).join('') +
    F('M-6,-60 L22,-66 L34,-48 L26,-20 L40,0 L40,34 L18,60 L-22,60 L-40,34 L-36,0 L-30,-26 L-40,-56 L-24,-62 Z', CO) +
    F('M-14,-30 L14,-34 L18,10 L-16,14 Z', CR) + rect(-12, -18, 24, 8, BK) + rect(-12, 24, 24, 7, BK) + rect(-14, 40, 28, 6, MU) +
    S('M-4.5,44 L-4.5,-178 M-1.5,44 L-1.5,-178 M1.5,44 L1.5,-178 M4.5,44 L4.5,-178', WH, 0.8)),
};

// haltere de discos: a metáfora da academia
assets['haltere'] = {
  vb: '0 0 300 160',
  body: bar('M40,80 L260,80', CR, 10) + rect(120, 72, 60, 16, MU) +
    [[34, VE], [266, VE]].map(([x, c]) => C(x, 80, 54, BK) + `<circle cx="${x}" cy="80" r="44" fill="none" stroke="#2c2826" stroke-width="2"/><circle cx="${x}" cy="80" r="34" fill="none" stroke="#2c2826" stroke-width="2"/>` + C(x, 80, 20, c) + C(x, 80, 3, BK)).join('') +
    C(80, 80, 38, BK) + C(80, 80, 14, MU) + C(220, 80, 38, BK) + C(220, 80, 14, CO) + C(80, 80, 2.5, BK) + C(220, 80, 2.5, BK),
};

// Clave mentor (de óculos, apontando a batuta)
assets['clave-mentor'] = {
  vb: '0 0 280 310',
  body: catTail + catBody + catPaws +
    bar('M150,190 L190,176 L226,150', CO, 21) + bar('M150,190 L190,176 L226,150', BK, 16) + E(230, 146, 12, 11, BK, edge) + S('M236,140 L270,96', CR, 3.5) +
    catHead(120, 102) +
    `<circle cx="99" cy="101" r="17" fill="none" stroke="${CR}" stroke-width="3.5"/><circle cx="143" cy="101" r="17" fill="none" stroke="${CR}" stroke-width="3.5"/>` + S('M116,99 L126,99', CR, 3.5) +
    F('M80,44 L160,44 L170,58 L70,58 Z', BK, `stroke="${MU}" stroke-width="2"`) + F('M74,58 L166,58 L160,66 L80,66 Z', MU) + bowTie(120, 160),
};

// emblemas: azulejo colorido com um ícone recortado
const tile = (bgc, inner) => F('M8,14 L150,6 L152,146 L6,152 Z', bgc) + inner;

// emblemas dos 5 módulos (F1-01b), cada um com a ideia central do módulo
// teoria: a escrita (pauta e clave) e a harmonia (acorde empilhado) na mesma imagem
assets['modulo-teoria'] = {
  vb: '0 0 160 160',
  body: tile(MU, S('M18,56 L142,56 M18,70 L142,70 M18,84 L142,84 M18,98 L142,98 M18,112 L142,112', BK, 1.6) +
    g('translate(26,32) scale(0.46)', S(CLEF, BK, 9, 'stroke-linecap="round"')) +
    E(104, 98, 8.4, 5.6, VE, 'transform="rotate(-25 104 98)"') + E(104, 84, 8.4, 5.6, CR, 'transform="rotate(-25 104 84)"') + E(104, 70, 8.4, 5.6, CO, 'transform="rotate(-25 104 70)"') +
    rect(110.4, 30, 3.2, 67, BK) + F('M110.4,30 L127,48 L125,56 L113.6,44 Z', BK)),
};
// técnica: a mão grande do estilo pisando as cordas
assets['modulo-tecnica'] = {
  vb: '0 0 160 160',
  body: tile(VE, rect(16, 76, 128, 52, BK) + S('M16,86 L144,86 M16,98 L144,98 M16,110 L144,110 M16,120 L144,120', CR, 1.3) +
    S('M46,76 L46,128 M78,76 L78,128 M110,76 L110,128', WH, 2.4) +
    hand(74, 50, 84, 1.3, SK1) + S('M34,40 L24,30 M36,54 L22,52 M40,26 L36,14', CR, 3)),
};
// percepção melódica: a orelha e as alturas subindo uma depois da outra
assets['modulo-percepcao-melodica'] = {
  vb: '0 0 160 160',
  body: tile(CO, S('M30,66 C30,38 70,30 76,60 C80,80 60,84 60,102 C60,118 46,124 38,114', CR, 10, 'stroke-linecap="round"') +
    S('M44,66 C46,52 62,52 62,66', CR, 5, 'stroke-linecap="round"') +
    S('M86,126 L110,104 L134,82', CR, 2.4, 'stroke-dasharray="4 4"') +
    note4(86, 126, 1, MU) + note4(110, 104, 1, CR) + note4(134, 82, 1, VE)),
};
// percepção harmônica: três notas soando juntas e o som se espalhando
assets['modulo-percepcao-harmonica'] = {
  vb: '0 0 160 160',
  // o azulejo preto ganha borda creme para não sumir nas telas escuras do app
  body: F('M8,14 L150,6 L152,146 L6,152 Z', BK, `stroke="${CR}" stroke-width="3"`) + (C(56, 64, 26, CO, 'opacity=".9"') + C(78, 64, 26, VE, 'opacity=".9"') + C(67, 86, 26, MU, 'opacity=".9"') +
    S('M108,54 Q118,75 108,96 M118,44 Q133,75 118,106 M128,36 Q146,75 128,114', CR, 2.6, 'stroke-linecap="round"')),
};
// percepção rítmica: figuras (colcheias com colchete e semínima) sobre a linha do pulso
assets['modulo-percepcao-ritmica'] = {
  vb: '0 0 160 160',
  body: tile(CR, E(42, 92, 10, 7, BK, 'transform="rotate(-25 42 92)"') + E(74, 92, 10, 7, BK, 'transform="rotate(-25 74 92)"') +
    rect(49, 38, 3.4, 54, BK) + rect(81, 38, 3.4, 54, BK) + F('M49,38 L84.4,38 L84.4,48 L49,48 Z', BK) +
    E(118, 92, 10, 7, VE, 'transform="rotate(-25 118 92)"') + rect(125, 38, 3.4, 54, VE) +
    rect(22, 122, 116, 3, BK) + C(30, 123.5, 9, VE) + C(66, 123.5, 6, BK) + C(98, 123.5, 6, BK) + C(130, 123.5, 6, BK)),
};

// medalhas
const medal = (c1, c2, inner) => {
  let d = '';
  for (let i = 0; i < 24; i++) { const a = (i * Math.PI) / 12, r = i % 2 ? 62 : 72; d += (i ? 'L' : 'M') + (80 + r * Math.cos(a)).toFixed(1) + ',' + (80 + r * Math.sin(a)).toFixed(1); }
  return F(d + 'Z', c1) + C(80, 80, 50, c2) + `<circle cx="80" cy="80" r="44" fill="none" stroke="${CR}" stroke-width="1.5" stroke-dasharray="3 4"/>` + inner;
};
assets['medalha-primeira-sessao'] = { vb: '0 0 160 160', body: medal(MU, BK, F('M68,58 L102,80 L68,102 Z', CR)) };
assets['medalha-sequencia'] = { vb: '0 0 160 160', body: medal(VE, BK, `<text x="80" y="98" text-anchor="middle" font-family="'Big Shoulders Display', Impact, sans-serif" font-weight="900" font-size="54" fill="${MU}">7</text>`) };
assets['medalha-ouvido'] = { vb: '0 0 160 160', body: medal(CO, BK, S('M60,96 L60,70 L72,58 L88,58 L100,70 L100,96', CR, 6, 'stroke-linejoin="miter"') + rect(52, 84, 12, 22, VE) + rect(96, 84, 12, 22, VE)) };
assets['medalha-leitor'] = { vb: '0 0 160 160', body: medal(CR, BK, g('translate(58,34) scale(0.4)', S(CLEF, MU, 9, 'stroke-linecap="round"'))) };
assets['medalha-braco'] = { vb: '0 0 160 160', body: medal(MU, BK, rect(54, 62, 52, 36, CO) + S('M54,74 L106,74 M54,86 L106,86 M72,62 L72,98 M90,62 L90,98', CR, 1.5) + C(81, 80, 5, VE)) };
assets['medalha-improviso'] = { vb: '0 0 160 160', body: medal(VE, BK, note8(70, 98, 0.9, MU) + note8(94, 90, 0.7, CR)) };
assets['medalha-bloqueada'] = { vb: '0 0 160 160', body: medal('#2c2826', '#1b1816', `<text x="80" y="96" text-anchor="middle" font-family="Jost, sans-serif" font-weight="600" font-size="44" fill="#4a443e">?</text>`) };
