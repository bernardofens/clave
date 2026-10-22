# Decisões do Clave

Registro das decisões de produto e plataforma, tomadas numa sessão de perguntas e respostas em 22/10/2026.
Quando uma decisão mudar, edite aqui e anote a data e o motivo.

## Produto

1. **Primeiro público:** o intermediário autodidata de cordas (violão, guitarra, baixo). Já toca, mas estuda
   sem estrutura e se distrai. O piano vem em segundo plano; iniciantes absolutos ficam para quando houver
   conteúdo de curso.
2. **Quem decide o treino:** híbrido. A pessoa monta o seu arsenal e o Clave monta a sessão a partir dele,
   puxando o que está mais atrasado e encaixando no tempo disponível. De vez em quando sugere um exercício
   fora do arsenal. O onboarding cria um arsenal inicial a partir dos objetivos.
3. **Como medir evolução no instrumento:**
   - "Carga", como na academia: a pessoa registra o recorde limpo em bpm e dificuldade de cada rotina,
     e o Clave propõe o próximo degrau.
   - Microfone desde a Fase 1, só no que é confiável: uma nota por vez (leitura tocada, "ache no braço"
     tocando, solfejar e tocar) e tempo dos ataques. Acordes ficam de fora por enquanto.
   - O ranking (Fase 2 em diante) só conta o que é verificável: exercícios e o que passou pelo microfone.
     A carga autodeclarada vale só para a própria pessoa.
4. **Preço:** tudo grátis por enquanto. Monetização se decide depois, com dados de uso.
5. **Afinador** entra na Fase 1: cromático, com predefinições para violão, guitarra, baixo de 4 e 5 cordas,
   e afinações alternativas comuns (Drop D, meio tom abaixo).
6. **Idiomas:** português e inglês desde o lançamento. As cifras seguem a convenção de cada idioma
   (C7M e Cm7(♭5) em português; Cmaj7 e Cm7♭5 em inglês). O quiz de teoria monta as frases com
   gramática própria de cada idioma, sem tradução literal.
7. **Aulas:** texto e interatividade na Fase 1 (por que importa, como encaixar, passo a passo, pratique).
   Cada aula pode ter de 1 a 3 vídeos do YouTube escolhidos pelo time, separados por idioma,
   tocando dentro do Clave (modo de privacidade reforçada) com botão "Abrir no YouTube".
   Crédito do canal sempre visível; nada é baixado nem reenviado. Vídeos próprios ficam para depois.
8. **Mentor com IA:** modelo pequeno rodando no aparelho, opcional e marcado como experimental.
   - A pessoa ativa e baixa o modelo; se o aparelho não aguentar, fica o mentor por regras.
   - A IA só conversa. Fatos de teoria vêm do motor do Clave e o progresso vem dos dados reais.
   - Escopo fechado em estudo de música e no próprio Clave.
9. **Nome:** "Clave" fica, com nome composto nas lojas ("Clave: academia musical" / "Clave: music gym").
   A busca rápida não achou conflito direto, mas há marcas parecidas nos EUA (ver pendências).

## Plataforma

10. **Um código só:** o mesmo React vira site, PWA (site instalável e offline) e apps de iOS e Android
    via Capacitor. Se a latência de áudio virar problema, escreve-se só o módulo de áudio como plugin nativo.
11. **Contas:** opcionais, com Supabase. Login por e-mail (link mágico), Google e Apple.
    O progresso local migra para a conta no primeiro login. A conta pode ser apagada de dentro do app.
12. **Análise de uso:** PostHog, com hospedagem dos dados na Europa.
    - Só eventos definidos pelo time (sessão, exercício, ferramenta, afinador, carga).
    - Sem gravação de sessão, sem captura automática de cliques, sem cookie de rastreamento.
    - Usuários com conta são identificados pelo ID interno, nunca pelo e-mail.
    - Opção "Não enviar estatísticas de uso" no perfil; política de privacidade explica a coleta.
    - Pessoas de 13 a 17 anos só entram no agregado, sem identificação individual.
13. **Código e hospedagem:** repositório privado no GitHub, com testes automáticos no GitHub Actions
    e mudanças por pull request. Site e PWA no Cloudflare Pages, com link de prévia por pull request.
    Supabase no plano gratuito. Build de iOS no Mac com Xcode e de Android no Android Studio.

## Comunidade e segurança

14. **Comunidade completa** (feed, comentários, fórum, áudio e vídeo), mas só na Fase 3.
15. **Faixas de idade** (data de nascimento no cadastro):
    - Sem conta: qualquer idade, uso local, sem comunidade.
    - 13 a 17 anos: treinos e pacotes da comunidade, curtidas e ranking. Perfil privado por padrão,
      sem mensagens diretas, sem publicar áudio ou vídeo.
    - 18 anos ou mais: comunidade completa.
16. **Moderação automática gratuita**, em camadas, numa função no servidor:
    - Texto: lista de palavras proibidas normalizada + API de moderação da OpenAI.
    - Imagem: API de moderação da OpenAI.
    - Vídeo (até 60 s): quadros extraídos no aparelho e checados na mesma API. Só contas com alguns dias
      e e-mail confirmado podem postar vídeo; vídeo de conta nova entra oculto até a primeira revisão.
      Áudio falado não é transcrito na primeira versão.
    - Abuso infantil: ferramenta de detecção por hash da Cloudflare e pedido de acesso ao PhotoDNA.
    - Gatilho: se os vídeos passarem de algumas centenas por dia, ou houver um caso grave,
      a parte de vídeo migra para um serviço pago.
17. **Painel de administração:** papéis de admin e moderador, fila única de denúncias e alertas,
    ações (aprovar, ocultar, apagar, advertir, suspender, banir), registro de auditoria,
    recurso para quem teve conteúdo removido e formulário de remoção por direitos autorais.
18. **Rotina de moderação** do time de três pessoas:
    - Revisão semanal da fila normal.
    - Ocultação automática de: tudo que o filtro marca como grave, denúncias de nudez ou envolvendo menor,
      e conteúdo com 3 denúncias de pessoas diferentes.
    - Plantão rotativo semanal que recebe alerta no celular só para abuso infantil ou nudez confirmada.
19. **Jurídico:** termos de uso, diretrizes da comunidade e regras de idade (ECA Digital, LGPD) revisados
    por advogado antes de abrir a Fase 3.

## Fases

20. **Fase 1, a academia:** sessão a partir do arsenal, carga, microfone, afinador, contas e sincronização,
    português e inglês, PWA, apps nas lojas, PostHog, vídeos do YouTube nas aulas, mentor local.
    Sem comunidade.
    **Sucesso:** 25% de quem cria conta ainda estuda na 4ª semana, com 3 ou mais sessões por semana.
21. **Fase 2, a comunidade de treinos:** perfis, publicar e copiar treinos e pacotes, curtidas,
    ranking verificável, moderação de texto, painel de admin e faixas de idade valendo.
22. **Fase 3, a comunidade completa:** áudio, vídeo, comentários e fórum, moderação de mídia,
    checagem de abuso infantil e plantão de alertas.

## Pendências fora do código

- Busca oficial da marca "Clave" no INPI e conferir no USPTO o status de "Clave Al Ingles, LLC"
  (software educacional), antes de pagar as contas de desenvolvedor.
- Contas de desenvolvedor: Apple (US$ 99/ano) e Google Play (US$ 25, uma vez).
- Política de privacidade da Fase 1 (microfone, contas, PostHog) e, antes da Fase 3,
  termos de uso revisados por advogado.
- Curadoria dos vídeos do YouTube por aula, em português e em inglês.
