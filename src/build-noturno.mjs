// Gera assets-noturno/*.svg e kit-noturno.html (estilo cor chapada + granulação).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assets } from './assets-noturno.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));

// Granulação de impressão (pontinhos claros e escuros) + borda levemente irregular.
const grain = (id) => `<filter id="${id}-gr" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9" result="lo"/>
<feDisplacementMap in="SourceGraphic" in2="lo" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/>
<feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.86" result="dk"/>
<feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1.3 0 0 0 0.52" result="lt"/>
<feComposite in="dk" in2="d" operator="in" result="dk2"/><feComposite in="lt" in2="d" operator="in" result="lt2"/>
<feMerge><feMergeNode in="d"/><feMergeNode in="dk2"/><feMergeNode in="lt2"/></feMerge>
</filter>`;

export function svg(name, id = name, attrs = '') {
  const a = assets[name];
  if (!a) throw new Error('asset desconhecido: ' + name);
  const par = a.par ? ` preserveAspectRatio="${a.par}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.vb}"${par} ${attrs}><defs>${grain(id)}</defs><g filter="url(#${id}-gr)">${a.body.replaceAll('{id}', id)}</g></svg>`;
}

mkdirSync(root + 'assets-noturno', { recursive: true });
for (const name of Object.keys(assets)) writeFileSync(`${root}assets-noturno/${name}.svg`, svg(name));

let n = 0;
const tpl = readFileSync(root + 'src/template-noturno.html', 'utf8');
writeFileSync(root + 'kit-noturno.html', tpl.replace(/<!--asset:([\w-]+)(?: ([^>]*?))?-->/g, (_, name, cls = '') =>
  svg(name, `n${++n}`, `class="art ${cls}" role="img" aria-label="${name.replaceAll('-', ' ')}"`)));

writeFileSync(root + 'src/one-noturno.html', `<body style="background:#100e0d;margin:0;padding:10px"><div id="o" style="display:flex;flex-wrap:wrap;gap:10px"></div><script>const A=${JSON.stringify(Object.fromEntries(Object.keys(assets).map(k => [k, svg(k, 'q' + k)])))};const q=location.search.slice(1).split(',');o.innerHTML=q.map(k=>'<div style="width:'+(q.length>1?270:540)+'px">'+A[k]+'</div>').join('')</script></body>`);
console.log(Object.keys(assets).length, 'assets');
