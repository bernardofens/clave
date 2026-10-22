// Gera assets/*.svg (arquivos soltos) e kit.html (página com tudo embutido).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assets } from './assets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

// Borda de adesivo: contorno preto fino + borda branca + sombra suave.
const stickerFilter = (id) => `<filter id="${id}-stk" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
<feMorphology in="SourceAlpha" operator="dilate" radius="9" result="o"/>
<feMorphology in="SourceAlpha" operator="dilate" radius="7.5" result="w"/>
<feFlood flood-color="#1a1714"/><feComposite in2="o" operator="in" result="oi"/>
<feFlood flood-color="#fdfbf5"/><feComposite in2="w" operator="in" result="wi"/>
<feGaussianBlur in="o" stdDeviation="5"/><feOffset dx="2" dy="7" result="bo"/>
<feFlood flood-color="#000" flood-opacity=".38"/><feComposite in2="bo" operator="in" result="sh"/>
<feMerge><feMergeNode in="sh"/><feMergeNode in="oi"/><feMergeNode in="wi"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>`;

export function svg(name, id = name, attrs = '') {
  const a = assets[name];
  if (!a) throw new Error('asset desconhecido: ' + name);
  const body = a.body.replaceAll('{id}', id);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.vb}" ${attrs}><defs>${stickerFilter(id)}</defs><g filter="url(#${id}-stk)" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

mkdirSync(root + 'assets', { recursive: true });
for (const name of Object.keys(assets)) writeFileSync(`${root}assets/${name}.svg`, svg(name));

// Página: <!--asset:nome classe-->
let n = 0;
const tpl = readFileSync(root + 'src/template.html', 'utf8');
const html = tpl.replace(/<!--asset:([\w-]+)(?: ([^>]*?))?-->/g, (_, name, cls = '') =>
  svg(name, `a${++n}`, `class="stk ${cls}" role="img" aria-label="${name.replaceAll('-', ' ')}"`));
writeFileSync(root + 'kit.html', html);

// Folha de prévia para conferir os desenhos
writeFileSync(root + 'src/preview.html', `<body style="background:#6b5a3a;display:flex;flex-wrap:wrap;gap:20px;padding:20px">${Object.keys(assets).map(k => `<div style="width:300px;color:#fff;font:12px sans-serif">${svg(k, 'p' + k)}<br>${k}</div>`).join('')}</body>`);
console.log(Object.keys(assets).length, 'assets');
writeFileSync(root + 'src/one.html', `<body style="background:#6b5a3a;margin:0;padding:10px"><div id="o" style="width:560px"></div><script>const A=${JSON.stringify(Object.fromEntries(Object.keys(assets).map(k=>[k,svg(k,'q'+k)])))};const q=location.search.slice(1).split(',');o.innerHTML=q.map(k=>'<div style="width:'+(q.length>1?280:560)+'px">'+A[k]+'</div>').join('');o.style.width=(q.length>1?280*Math.min(q.length,2):560)+'px';o.style.display='flex';o.style.flexWrap='wrap'</script></body>`);
