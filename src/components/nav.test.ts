import { describe, expect, it } from 'vitest';
import { allNav, mainNav, ROUTINES_READY } from './nav';

describe('navegação principal', () => {
  it('Rotinas fica escondida até a D3 ligar a flag', () => {
    expect(ROUTINES_READY).toBe(false);
    expect(allNav().map(i => i.to)).toEqual(['/', '/treinar', '/progresso', '/perfil']);
  });
  it('com Rotinas pronta, são as cinco abas da decisão 6, nessa ordem', () => {
    expect(allNav(true).map(i => i.to)).toEqual(['/', '/treinar', '/rotinas', '/progresso', '/perfil']);
  });
  it('o menu do topo não leva o Perfil (ele fica à direita)', () => {
    expect(mainNav(true).map(i => i.to)).not.toContain('/perfil');
  });
  it('Comunidade, Mentor e Estudar não aparecem no menu', () => {
    const all = allNav(true).map(i => i.to);
    ['/comunidade', '/mentor', '/estudar'].forEach(p => expect(all).not.toContain(p));
  });
});
