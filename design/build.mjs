// Gera public/art/*.svg a partir de design/art.mjs (estilo Noturno: cor chapada + granulação).
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assets } from './art.mjs';

const out = fileURLToPath(new URL('../public/art/', import.meta.url));
const grain = (id) => `<filter id="${id}-gr" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9" result="lo"/>
<feDisplacementMap in="SourceGraphic" in2="lo" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/>
<feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 0 0 0 -0.86" result="dk"/>
<feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1.3 0 0 0 0.52" result="lt"/>
<feComposite in="dk" in2="d" operator="in" result="dk2"/><feComposite in="lt" in2="d" operator="in" result="lt2"/>
<feMerge><feMergeNode in="d"/><feMergeNode in="dk2"/><feMergeNode in="lt2"/></feMerge>
</filter>`;

mkdirSync(out, { recursive: true });
for (const [name, a] of Object.entries(assets)) {
  const par = a.par ? ` preserveAspectRatio="${a.par}"` : '';
  writeFileSync(out + name + '.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.vb}"${par}><defs>${grain(name)}</defs><g filter="url(#${name}-gr)">${a.body.replaceAll('{id}', name)}</g></svg>`);
}
console.log(Object.keys(assets).length, 'artes em public/art');
